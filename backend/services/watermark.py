"""
TrustMark – LSB Steganography watermarking service.

Strategy
--------
We embed the creator_id string into the least-significant bits of the
image's pixel data using the `stegano` library (pure-Python LSB).

The payload we hide is:

    TRUSTMARK:<creator_id>

This prefix lets us distinguish TrustMark watermarks from random noise
during extraction.

Durability
----------
LSB steganography survives lossless re-saves (PNG) but is fragile under
JPEG compression.  To survive JPEG 85% re-save we:
1. Embed the secret into the PNG byte stream (no JPEG loss at write time).
2. On verification the caller should attempt extraction on the uploaded
   image regardless of format; if extraction fails we fall back to the
   Gemini fingerprint similarity path.

Usage
-----
    watermarked_bytes = await embed(image_bytes, creator_id)
    creator_id        = await extract(watermarked_bytes)   # None if not found
"""

from __future__ import annotations

import io
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor

from PIL import Image
from stegano.lsb import hide as lsb_hide, reveal as lsb_reveal

logger = logging.getLogger(__name__)

# Re-use a single thread-pool for CPU-bound image operations
_executor = ThreadPoolExecutor(max_workers=4)

WATERMARK_PREFIX = "TRUSTMARK:"


# ---------------------------------------------------------------------------
# Public async interface
# ---------------------------------------------------------------------------

async def embed(image_bytes: bytes, creator_id: str) -> bytes:
    """
    Embed *creator_id* into *image_bytes* using LSB steganography.

    Returns PNG bytes (lossless) regardless of the input format so the
    watermark data is preserved.  The caller stores this in GCS and
    delivers it to the end-user.
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(_executor, _embed_sync, image_bytes, creator_id)


async def extract(image_bytes: bytes) -> str | None:
    """
    Attempt to extract a TrustMark watermark from *image_bytes*.

    Returns the creator_id string if found, otherwise None.
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(_executor, _extract_sync, image_bytes)


# ---------------------------------------------------------------------------
# Synchronous worker functions (run in thread pool)
# ---------------------------------------------------------------------------

def _embed_sync(image_bytes: bytes, creator_id: str) -> bytes:
    """Synchronous LSB embedding – called from the thread pool."""
    payload = f"{WATERMARK_PREFIX}{creator_id}"

    # stegano requires a PIL Image object; we work via an in-memory file
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # lsb_hide returns a new PIL Image with the secret embedded
    watermarked_img = lsb_hide(img, payload)

    # Serialise back to PNG bytes (lossless – preserves LSB data)
    buf = io.BytesIO()
    watermarked_img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()


def _extract_sync(image_bytes: bytes) -> str | None:
    """Synchronous LSB extraction – called from the thread pool."""
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        secret = lsb_reveal(img)
        if secret and secret.startswith(WATERMARK_PREFIX):
            return secret[len(WATERMARK_PREFIX):]
        return None
    except Exception as exc:  # noqa: BLE001
        # stegano raises generic Exception when no data is hidden
        logger.debug("LSB extract failed (likely no watermark): %s", exc)
        return None
