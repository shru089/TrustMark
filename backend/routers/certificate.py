"""
TrustMark – GET /certificate/{id} router.

This endpoint is intentionally PUBLIC (no Firebase JWT required) so that
anyone who receives a certificate URL can verify the asset's provenance
without needing a TrustMark account.

The endpoint is read-only and returns a serialised ProvenanceRecord.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status

from backend.models.schemas import ProvenanceRecord
from backend.services import firestore

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/certificate/{asset_id}",
    response_model=ProvenanceRecord,
    summary="Fetch a provenance certificate (public)",
    description=(
        "Returns the immutable provenance record for the given asset_id. "
        "This endpoint is publicly accessible – no authentication required."
    ),
)
async def get_certificate(asset_id: str) -> ProvenanceRecord:
    try:
        record = await firestore.get_record(asset_id)
    except Exception as exc:
        logger.exception("Firestore error fetching certificate %s: %s", asset_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve certificate data.",
        ) from exc

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate not found for asset_id: {asset_id}",
        )

    # Strip internal-only field before returning
    record.pop("description_b64", None)

    return ProvenanceRecord(**record)
