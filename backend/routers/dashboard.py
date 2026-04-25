"""
TrustMark – GET /dashboard router.

Returns the list of assets owned by the authenticated user.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status

from backend.dependencies import get_current_user
from backend.models.schemas import DashboardResponse, DashboardAsset
from backend.services import firestore

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    summary="List authenticated user's protected assets",
)
async def get_dashboard(
    current_user: dict = Depends(get_current_user),
) -> DashboardResponse:
    owner_uid: str = current_user["uid"]

    try:
        records = await firestore.list_by_owner(owner_uid)
    except Exception as exc:
        logger.exception("Error fetching dashboard for %s: %s", owner_uid, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch dashboard data.",
        ) from exc

    assets = [
        DashboardAsset(
            asset_id=r["asset_id"],
            title=r.get("title"),
            license_type=r["license_type"],
            watermarked_image_url=r["watermarked_image_url"],
            certificate_url=r["certificate_url"],
            verification_count=r.get("verification_count", 0),
            created_at=r["created_at"],
        )
        for r in records
    ]

    return DashboardResponse(assets=assets, total=len(assets))
