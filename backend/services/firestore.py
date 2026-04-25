"""
TrustMark – Firestore data-access layer.

Collection layout
-----------------
  assets/
    {asset_id}  ← ProvenanceRecord (immutable after creation)
      verification_count: int  (only this field is ever incremented)

Security model
--------------
The Firestore security rules (documented in README.md) enforce:
  • Only authenticated users can create documents.
  • No field except `verification_count` and `updated_at` may be changed
    after creation (enforced at the rules level, not here).
  • GET /certificate/{id} reads via the Admin SDK (bypasses rules) and is
    public – the endpoint itself does the access control.

All functions are async using `asyncio.to_thread` since the Firestore
Admin SDK does not have a native async interface.
"""

from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timezone
from typing import Any, Optional

import firebase_admin
from firebase_admin import credentials, firestore as fs

logger = logging.getLogger(__name__)

COLLECTION = "assets"

# ---------------------------------------------------------------------------
# SDK initialisation (idempotent – safe to call multiple times)
# ---------------------------------------------------------------------------

_db: Any = None  # google.cloud.firestore.Client


def _get_db():
    """Return a Firestore client, initialising Firebase Admin SDK if needed."""
    global _db
    if _db is None:
        # In Cloud Run the SDK authenticates via the service account attached
        # to the revision.  Locally, set GOOGLE_APPLICATION_CREDENTIALS.
        if not firebase_admin._apps:
            # Use the project-default credentials
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(
                cred,
                {"projectId": os.environ["GCP_PROJECT_ID"]},
            )
        _db = fs.client()
    return _db


# ---------------------------------------------------------------------------
# Public async API
# ---------------------------------------------------------------------------

async def create_record(record: dict) -> str:
    """
    Write an immutable provenance record to Firestore.

    Parameters
    ----------
    record : dict
        Must contain all fields defined in ProvenanceRecord schema.
        `asset_id` is used as the Firestore document ID.

    Returns
    -------
    str
        The Firestore document ID (same as record["asset_id"]).
    """
    return await asyncio.to_thread(_create_record_sync, record)


async def get_record(asset_id: str) -> Optional[dict]:
    """
    Fetch a provenance record by its document ID.

    Returns None if the document does not exist.
    """
    return await asyncio.to_thread(_get_record_sync, asset_id)


async def search_by_fingerprint(fingerprint: str) -> Optional[dict]:
    """
    Exact-match lookup by SHA-256 fingerprint.

    Returns the first matching record dict or None.
    """
    return await asyncio.to_thread(_search_by_fingerprint_sync, fingerprint)


async def list_by_owner(owner_uid: str) -> list[dict]:
    """
    Return all assets belonging to *owner_uid*, newest first.
    """
    return await asyncio.to_thread(_list_by_owner_sync, owner_uid)


async def increment_verification_count(asset_id: str) -> None:
    """
    Atomically increment the verification_count field.
    This is the only mutation allowed on a provenance record after creation.
    """
    await asyncio.to_thread(_increment_sync, asset_id)


async def get_all_descriptions() -> list[dict]:
    """
    Return all records with their description_b64 field for fuzzy matching.
    Used by /verify when no exact fingerprint match is found.

    NOTE: For large collections this should be replaced with a proper
    vector search (e.g., Vertex AI Matching Engine).  At scale the full
    table scan here is not acceptable.
    """
    return await asyncio.to_thread(_get_all_descriptions_sync)


# ---------------------------------------------------------------------------
# Synchronous worker functions
# ---------------------------------------------------------------------------

def _create_record_sync(record: dict) -> str:
    db = _get_db()
    asset_id: str = record["asset_id"]
    doc_ref = db.collection(COLLECTION).document(asset_id)
    doc_ref.set(record)
    logger.info("Firestore record created: %s", asset_id)
    return asset_id


def _get_record_sync(asset_id: str) -> Optional[dict]:
    db = _get_db()
    doc = db.collection(COLLECTION).document(asset_id).get()
    if not doc.exists:
        return None
    data = doc.to_dict()
    # Firestore returns datetime objects for timestamp fields – keep as-is
    return data


def _search_by_fingerprint_sync(fingerprint: str) -> Optional[dict]:
    db = _get_db()
    query = (
        db.collection(COLLECTION)
        .where("fingerprint", "==", fingerprint)
        .limit(1)
    )
    docs = list(query.stream())
    if not docs:
        return None
    return docs[0].to_dict()


def _list_by_owner_sync(owner_uid: str) -> list[dict]:
    db = _get_db()
    query = (
        db.collection(COLLECTION)
        .where("owner_uid", "==", owner_uid)
        .order_by("created_at", direction=fs.Query.DESCENDING)
        .limit(100)
    )
    return [doc.to_dict() for doc in query.stream()]


def _increment_sync(asset_id: str) -> None:
    db = _get_db()
    doc_ref = db.collection(COLLECTION).document(asset_id)
    doc_ref.update(
        {
            "verification_count": fs.Increment(1),
            "updated_at": datetime.now(tz=timezone.utc),
        }
    )


def _get_all_descriptions_sync() -> list[dict]:
    db = _get_db()
    # Only fetch fields needed for fuzzy matching to minimise data transfer
    query = db.collection(COLLECTION).select(
        ["asset_id", "owner_uid", "owner_email", "fingerprint",
         "description_b64", "license_type", "title", "created_at",
         "certificate_url", "watermarked_image_url"]
    )
    return [doc.to_dict() for doc in query.stream()]
