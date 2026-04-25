"""
TrustMark – Firebase JWT authentication dependency.

FastAPI dependency that validates the Firebase ID token sent in the
Authorization: Bearer <token> header for every protected endpoint.

The Firebase Admin SDK verifies:
  • Token signature (using Google's public keys)
  • Token expiry
  • Token audience (must match our Firebase project)

On success it returns the decoded token claims dict which contains at
minimum: uid, email (if available), email_verified, iat, exp.

Usage in a router
-----------------
    from backend.dependencies import get_current_user

    @router.post("/protect")
    async def protect(current_user: dict = Depends(get_current_user)):
        uid = current_user["uid"]
"""

from __future__ import annotations

import logging
import os

import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

logger = logging.getLogger(__name__)

# HTTPBearer extracts the token from "Authorization: Bearer <token>"
_bearer = HTTPBearer(auto_error=True)


def _ensure_firebase_init() -> None:
    """Idempotent Firebase Admin SDK initialisation."""
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(
            cred,
            {"projectId": os.environ["GCP_PROJECT_ID"]},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """
    FastAPI dependency: validates the Firebase ID token and returns its claims.

    Raises HTTP 401 if the token is missing, expired, or invalid.
    """
    _ensure_firebase_init()

    token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token, check_revoked=True)
        return decoded
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID token has been revoked. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID token has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except firebase_auth.InvalidIdTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase ID token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as exc:
        logger.exception("Unexpected error verifying Firebase token: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service error.",
        ) from exc
