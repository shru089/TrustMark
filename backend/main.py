"""
TrustMark – FastAPI application entry point.

Responsibilities
----------------
• Create the FastAPI app with metadata for OpenAPI docs.
• Configure CORS so the Next.js frontend (Firebase Hosting) can call the API.
• Mount all routers under their respective path prefixes.
• Add a health-check endpoint used by Cloud Run startup probes.
• Initialise Firebase Admin SDK once at startup via lifespan context manager.

Environment variables required
-------------------------------
See .env.example for the full list.  At minimum:
  GCP_PROJECT_ID        – Google Cloud project ID
  ALLOWED_ORIGINS       – Comma-separated list of allowed CORS origins
  FRONTEND_BASE_URL     – Public URL of the hosted frontend
"""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

import firebase_admin
from firebase_admin import credentials
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import certificate, dashboard, protect, verify
from dotenv import load_dotenv

# Load environment variables from backend/.env relative to this file
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan: initialise + teardown Firebase Admin SDK
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs once at startup and once at shutdown.
    Use this instead of deprecated @app.on_event("startup") hooks.
    """
    logger.info("TrustMark API starting up…")

    # Initialise Firebase Admin SDK with Application Default Credentials.
    # On Cloud Run this is the service account attached to the revision.
    # Locally set GOOGLE_APPLICATION_CREDENTIALS to a service account key file.
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(
            cred,
            {"projectId": os.environ["GCP_PROJECT_ID"]},
        )
        logger.info("Firebase Admin SDK initialised (project=%s)", os.environ["GCP_PROJECT_ID"])

    yield  # Hand control to the running application

    logger.info("TrustMark API shutting down…")


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------

def create_app() -> FastAPI:
    app = FastAPI(
        title="TrustMark API",
        description=(
            "AI-powered digital asset protection – watermarking, "
            "provenance, and ownership verification."
        ),
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    # ALLOWED_ORIGINS should be a comma-separated list of origins, e.g.:
    #   https://trustmark.web.app,http://localhost:3000
    raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000")
    allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,       # Required for Authorization headers
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ------------------------------------------------------------------
    # Routers
    # ------------------------------------------------------------------
    # All routes are prefixed with /api/v1 for versioning.
    # The certificate endpoint is intentionally public (no auth dependency
    # on the router itself; the router function has no Depends(get_current_user)).
    app.include_router(protect.router, prefix="/api/v1", tags=["protect"])
    app.include_router(verify.router, prefix="/api/v1", tags=["verify"])
    app.include_router(certificate.router, prefix="/api/v1", tags=["certificate"])
    app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])

    # ------------------------------------------------------------------
    # Health check – used by Cloud Run startup / liveness probes
    # ------------------------------------------------------------------
    @app.get("/healthz", tags=["health"], include_in_schema=False)
    async def health() -> dict:
        return {"status": "ok"}

    return app


# Module-level app instance used by uvicorn
app = create_app()
