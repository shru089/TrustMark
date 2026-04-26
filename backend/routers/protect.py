"""
TrustMark – POST /protect router.

Flow
----
1. Validate Firebase JWT from Authorization header → extract uid + email.
2. Read the uploaded image bytes from the multipart form.
3. Generate a Gemini fingerprint (description + SHA-256).
4. Embed the LSB watermark (asset_id) into the image.
5. Upload both the original and watermarked images to GCS.
6. Write an immutable ProvenanceRecord to Firestore.
7. Return the asset_id and public certificate URL.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from backend.dependencies import get_current_user
from backend.models.schemas import ProtectResponse
from backend.services import firestore, gcs, watermark
from backend.services.gemini import generate_fingerprint

logger = logging.getLogger(__name__)

router = APIRouter()

# Max upload size: 20 MB
MAX_BYTES = 20 * 1024 * 1024

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.post(
    "/protect",
    response_model=ProtectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Protect a digital asset",
    description=(
        "Upload an image, embed an LSB watermark, generate a Gemini fingerprint, "
        "write an immutable provenance record to Firestore, and return a certificate URL."
    ),
)
async def protect_asset(
    file: UploadFile = File(..., description="Image file to protect"),
    license_type: str = Form(..., description="SPDX license identifier"),
    title: str | None = Form(None),
    description: str | None = Form(None),
    current_user: dict = Depends(get_current_user),
) -> ProtectResponse:
    # ------------------------------------------------------------------
    # 1. Validate file
    # ------------------------------------------------------------------
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported media type: {file.content_type}. Allowed: {ALLOWED_MIME}",
        )

    image_bytes = await file.read()
    if len(image_bytes) > MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum allowed size is {MAX_BYTES // 1024 // 1024} MB.",
        )

    owner_uid: str = current_user["uid"]
    owner_email: str = current_user.get("email", "")
    asset_id = str(uuid.uuid4())
    now = datetime.now(tz=timezone.utc)

    try:
        # ------------------------------------------------------------------
        # 2. Generate Gemini fingerprint (async – calls Vertex AI)
        # ------------------------------------------------------------------
        logger.info("Generating Gemini fingerprint for asset %s", asset_id)
        fingerprint_data = await generate_fingerprint(image_bytes)
        fingerprint: str = fingerprint_data["fingerprint"]
        description_b64: str = fingerprint_data["description_b64"]

        # ------------------------------------------------------------------
        # 3. Embed LSB watermark
        # ------------------------------------------------------------------
        logger.info("Embedding LSB watermark for asset %s", asset_id)
        watermarked_bytes = await watermark.embed(image_bytes, asset_id)

        # ------------------------------------------------------------------
        # 4. Upload to GCS (original + watermarked)
        # ------------------------------------------------------------------
        original_blob = f"originals/{asset_id}.png"
        watermarked_blob = f"watermarked/{asset_id}.png"

        logger.info("Uploading images to GCS for asset %s", asset_id)
        original_url, watermarked_url = await _upload_pair(
            image_bytes,
            original_blob,
            file.content_type or "image/png",
            watermarked_bytes,
            watermarked_blob,
        )

        # Public certificate URL (served by the frontend)
        frontend_base = _get_frontend_base()
        certificate_url = f"{frontend_base}/cert/{asset_id}"

        # ------------------------------------------------------------------
        # 5. Write immutable Firestore record
        # ------------------------------------------------------------------
        record = {
            "asset_id": asset_id,
            "owner_uid": owner_uid,
            "owner_email": owner_email,
            "title": title,
            "description": description,
            "license_type": license_type,
            "fingerprint": fingerprint,
            "description_b64": description_b64,
            "gcs_original_path": original_blob,
            "gcs_watermarked_path": watermarked_blob,
            "watermarked_image_url": watermarked_url,
            "certificate_url": certificate_url,
            "verification_count": 0,
            "created_at": now,
            "updated_at": now,
        }
        await firestore.create_record(record)

        logger.info("Asset %s successfully protected", asset_id)
        return ProtectResponse(
            asset_id=asset_id,
            certificate_url=certificate_url,
            watermarked_image_url=watermarked_url,
            fingerprint=fingerprint,
            created_at=now,
        )

    except HTTPException:
        raise  # re-raise known HTTP errors unchanged

    except Exception as exc:
        logger.exception("Unexpected error protecting asset %s: %s", asset_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while protecting the asset.",
        ) from exc


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _upload_pair(
    original_bytes: bytes,
    original_blob: str,
    original_content_type: str,
    watermarked_bytes: bytes,
    watermarked_blob: str,
) -> tuple[str, str]:
    """Upload both images concurrently and return their public URLs."""
    import asyncio

    original_url, watermarked_url = await asyncio.gather(
        gcs.upload_bytes(original_bytes, original_blob, content_type=original_content_type),
        gcs.upload_bytes(watermarked_bytes, watermarked_blob, content_type="image/png"),
    )
    return original_url, watermarked_url


def _get_frontend_base() -> str:
    import os
    return os.environ.get("FRONTEND_BASE_URL", "https://trustmark.web.app")
