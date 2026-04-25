"""
TrustMark – POST /verify router.

Verification strategy (multi-layer)
------------------------------------
Layer 1 – LSB watermark extraction
    Try to extract the creator uid from the image's least-significant bits.
    If found, cross-reference with Firestore by owner_uid.

Layer 2 – Exact fingerprint match
    Generate a Gemini fingerprint of the uploaded image and query Firestore
    for an exact SHA-256 match.  Confidence: 1.0.

Layer 3 – Fuzzy Jaccard similarity
    If no exact match, compare the new Gemini description against all stored
    descriptions (full-table scan – acceptable at demo scale).
    Return the best match if its Jaccard score exceeds FUZZY_THRESHOLD.

Layer 4 – No match
    Return match_found=False with confidence_score=0.0.
"""

from __future__ import annotations

import base64
import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from backend.dependencies import get_current_user
from backend.models.schemas import VerifyResponse
from backend.services import firestore, watermark
from backend.services.gemini import generate_fingerprint, jaccard_similarity

logger = logging.getLogger(__name__)

router = APIRouter()

# Images whose descriptions have Jaccard similarity ≥ this threshold are
# considered a "match" in fuzzy mode.
FUZZY_THRESHOLD = 0.45

MAX_BYTES = 20 * 1024 * 1024
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.post(
    "/verify",
    response_model=VerifyResponse,
    summary="Verify asset ownership",
    description=(
        "Upload a potentially-copied image and check whether it matches a "
        "TrustMark-protected asset.  Returns owner info and a confidence score."
    ),
)
async def verify_asset(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
) -> VerifyResponse:
    # ------------------------------------------------------------------
    # Validate upload
    # ------------------------------------------------------------------
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported media type: {file.content_type}",
        )
    image_bytes = await file.read()
    if len(image_bytes) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large.")

    try:
        # ------------------------------------------------------------------
        # Layer 1 – LSB watermark extraction
        # ------------------------------------------------------------------
        extracted_uid = await watermark.extract(image_bytes)
        if extracted_uid:
            logger.info("LSB watermark found, owner_uid=%s", extracted_uid)
            records = await firestore.list_by_owner(extracted_uid)
            if records:
                # Multiple assets may belong to the same owner; return newest
                record = records[0]
                await firestore.increment_verification_count(record["asset_id"])
                return _build_response(record, confidence=1.0, message="Watermark extracted")

        # ------------------------------------------------------------------
        # Layer 2 – Exact Gemini fingerprint match
        # ------------------------------------------------------------------
        logger.info("Generating Gemini fingerprint for verification")
        fp_data = await generate_fingerprint(image_bytes)
        query_fingerprint: str = fp_data["fingerprint"]
        query_description: str = fp_data["description"]

        exact_record = await firestore.search_by_fingerprint(query_fingerprint)
        if exact_record:
            logger.info("Exact fingerprint match: %s", exact_record["asset_id"])
            await firestore.increment_verification_count(exact_record["asset_id"])
            return _build_response(exact_record, confidence=1.0, message="Exact fingerprint match")

        # ------------------------------------------------------------------
        # Layer 3 – Fuzzy Jaccard similarity over all stored descriptions
        # ------------------------------------------------------------------
        logger.info("No exact match; running fuzzy similarity scan")
        all_records = await firestore.get_all_descriptions()

        best_score = 0.0
        best_record = None
        for r in all_records:
            stored_desc_b64 = r.get("description_b64", "")
            if not stored_desc_b64:
                continue
            stored_desc = base64.b64decode(stored_desc_b64.encode()).decode()
            score = jaccard_similarity(query_description, stored_desc)
            if score > best_score:
                best_score = score
                best_record = r

        if best_record and best_score >= FUZZY_THRESHOLD:
            logger.info(
                "Fuzzy match: asset_id=%s score=%.3f", best_record["asset_id"], best_score
            )
            await firestore.increment_verification_count(best_record["asset_id"])
            return _build_response(
                best_record, confidence=best_score, message="Fuzzy similarity match"
            )

        # ------------------------------------------------------------------
        # Layer 4 – No match
        # ------------------------------------------------------------------
        return VerifyResponse(
            match_found=False,
            confidence_score=max(best_score, 0.0),
            message="No matching protected asset found in TrustMark registry.",
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error during verification: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during verification.",
        ) from exc


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _build_response(record: dict, confidence: float, message: str) -> VerifyResponse:
    """Convert a Firestore record dict into a VerifyResponse."""
    return VerifyResponse(
        match_found=True,
        asset_id=record.get("asset_id"),
        owner_uid=record.get("owner_uid"),
        owner_email=record.get("owner_email"),
        confidence_score=round(confidence, 4),
        certificate_url=record.get("certificate_url"),
        license_type=record.get("license_type"),
        title=record.get("title"),
        created_at=record.get("created_at"),
        message=message,
    )
