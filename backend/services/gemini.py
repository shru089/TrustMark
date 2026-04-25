"""
TrustMark – Gemini 1.5 Pro Vision service.

Responsibilities
----------------
1. Call Gemini 1.5 Pro Vision with an uploaded image to obtain a rich
   text description of the image's visual content.
2. Derive a deterministic fingerprint (SHA-256 hex digest) from that
   description, which acts as a content-aware identifier.
3. Return both artefacts to the caller.

Why a text-based fingerprint instead of an embedding?
------------------------------------------------------
Firestore does not support native vector similarity search.  Storing the
raw description as the "fingerprint source" and using its SHA-256 as the
fast lookup key allows:
  • Exact match (hash equality) → 100 % confidence
  • Near-match (Jaccard on word sets) → fuzzy similarity score
This avoids the cost/complexity of a dedicated vector database while
still giving meaningful similarity scores for visually similar images.
"""

from __future__ import annotations

import asyncio
import base64
import hashlib
import logging
import os
from concurrent.futures import ThreadPoolExecutor

import vertexai
from vertexai.generative_models import GenerativeModel, Part, Image as VertexImage

logger = logging.getLogger(__name__)

_executor = ThreadPoolExecutor(max_workers=4)

# ---------------------------------------------------------------------------
# Vertex AI initialisation (done lazily on first call)
# ---------------------------------------------------------------------------

_vertex_initialised = False


def _ensure_vertex_init() -> None:
    global _vertex_initialised
    if not _vertex_initialised:
        project_id = os.environ["GCP_PROJECT_ID"]
        location = os.environ.get("VERTEX_LOCATION", "us-central1")
        vertexai.init(project=project_id, location=location)
        _vertex_initialised = True


# ---------------------------------------------------------------------------
# Public async interface
# ---------------------------------------------------------------------------

async def generate_fingerprint(image_bytes: bytes) -> dict:
    """
    Analyse *image_bytes* with Gemini Vision and return:

        {
          "description": "<rich text from Gemini>",
          "fingerprint":  "<sha256 hex of description>",
          "description_b64": "<base64 of description for compact storage>",
        }
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(_executor, _generate_sync, image_bytes)


# ---------------------------------------------------------------------------
# Similarity helper (pure Python, called synchronously)
# ---------------------------------------------------------------------------

def jaccard_similarity(desc_a: str, desc_b: str) -> float:
    """
    Compute the Jaccard coefficient on the token sets of two descriptions.

    Returns a float in [0, 1] where 1.0 means identical token sets.
    Used as the confidence score during verification.
    """
    set_a = set(desc_a.lower().split())
    set_b = set(desc_b.lower().split())
    if not set_a and not set_b:
        return 1.0
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union)


# ---------------------------------------------------------------------------
# Synchronous worker (runs in thread pool to avoid blocking the event loop)
# ---------------------------------------------------------------------------

PROMPT = (
    "You are a forensic digital-asset analyst. "
    "Provide a dense, highly specific description of this image. "
    "Include: dominant colours (hex if possible), composition, subject matter, "
    "textures, lighting style, any visible text or logos, artistic style, "
    "and any unique identifying visual features. "
    "Be deterministic: two identical images must produce identical descriptions. "
    "Output plain text only – no markdown, no bullet points."
)


def _generate_sync(image_bytes: bytes) -> dict:
    """Synchronous Gemini call – executed in thread pool."""
    _ensure_vertex_init()

    model = GenerativeModel("gemini-1.5-pro-vision")

    # Wrap raw bytes as a Vertex AI Part
    image_part = Part.from_data(data=image_bytes, mime_type="image/png")

    response = model.generate_content(
        [image_part, PROMPT],
        generation_config={
            "temperature": 0,        # Deterministic output for stable fingerprints
            "max_output_tokens": 512,
        },
    )

    description: str = response.text.strip()

    # SHA-256 of the UTF-8 description gives us a stable, compact fingerprint
    fingerprint = hashlib.sha256(description.encode()).hexdigest()

    # Also store base64 of description so we can recompute Jaccard similarity
    # during verification without keeping the full plaintext in a separate field
    description_b64 = base64.b64encode(description.encode()).decode()

    logger.info("Gemini fingerprint generated: %s…", fingerprint[:16])

    return {
        "description": description,
        "fingerprint": fingerprint,
        "description_b64": description_b64,
    }
