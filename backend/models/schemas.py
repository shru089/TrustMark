"""
TrustMark – Pydantic schemas for request / response validation.
All API boundaries are typed here; FastAPI uses these for automatic
OpenAPI docs and input validation.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Protect endpoint
# ---------------------------------------------------------------------------

class ProtectRequest(BaseModel):
    """Metadata that accompanies a /protect image upload (form fields)."""
    license_type: str = Field(
        ...,
        description="SPDX-style license identifier e.g. CC-BY-4.0, All Rights Reserved",
        examples=["CC-BY-4.0"],
    )
    title: Optional[str] = Field(None, description="Human-readable asset title")
    description: Optional[str] = Field(None, description="Short description of the asset")


class ProtectResponse(BaseModel):
    """Returned after a successful /protect call."""
    asset_id: str = Field(..., description="Unique Firestore document ID for this asset")
    certificate_url: str = Field(..., description="Public URL to the provenance certificate page")
    watermarked_image_url: str = Field(..., description="GCS URL of the watermarked image")
    fingerprint: str = Field(..., description="Hex digest used as the Gemini-generated fingerprint")
    created_at: datetime


# ---------------------------------------------------------------------------
# Verify endpoint
# ---------------------------------------------------------------------------

class VerifyResponse(BaseModel):
    """Returned after a successful /verify call."""
    match_found: bool
    asset_id: Optional[str] = None
    owner_uid: Optional[str] = None
    owner_email: Optional[str] = None
    confidence_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Jaccard-style similarity between query and stored fingerprint (0–1)",
    )
    certificate_url: Optional[str] = None
    license_type: Optional[str] = None
    title: Optional[str] = None
    created_at: Optional[datetime] = None
    message: str = ""


# ---------------------------------------------------------------------------
# Certificate / Provenance record
# ---------------------------------------------------------------------------

class ProvenanceRecord(BaseModel):
    """
    Immutable record stored in Firestore when an asset is protected.
    Returned verbatim by GET /certificate/{id}.
    """
    asset_id: str
    owner_uid: str
    owner_email: str
    title: Optional[str] = None
    description: Optional[str] = None
    license_type: str
    fingerprint: str  # hex-encoded SHA-256 of Gemini description
    gcs_original_path: str
    gcs_watermarked_path: str
    watermarked_image_url: str
    certificate_url: str
    verification_count: int = 0
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

class DashboardAsset(BaseModel):
    """Lightweight summary used on the dashboard asset list."""
    asset_id: str
    title: Optional[str] = None
    license_type: str
    watermarked_image_url: str
    certificate_url: str
    verification_count: int
    created_at: datetime


class DashboardResponse(BaseModel):
    assets: list[DashboardAsset]
    total: int


# ---------------------------------------------------------------------------
# Error envelope
# ---------------------------------------------------------------------------

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
