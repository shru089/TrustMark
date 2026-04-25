"""
TrustMark – Google Cloud Storage upload helper.

All GCS operations run via google-cloud-storage which uses the same
Application Default Credentials as Firestore.
"""

from __future__ import annotations

import asyncio
import logging
import os
from concurrent.futures import ThreadPoolExecutor

from google.cloud import storage

logger = logging.getLogger(__name__)

_executor = ThreadPoolExecutor(max_workers=4)
_client: storage.Client | None = None


def _get_client() -> storage.Client:
    global _client
    if _client is None:
        _client = storage.Client(project=os.environ["GCP_PROJECT_ID"])
    return _client


async def upload_bytes(
    data: bytes,
    destination_blob: str,
    content_type: str = "image/png",
    make_public: bool = True,
) -> str:
    """
    Upload *data* to GCS bucket and return the public URL.

    Parameters
    ----------
    destination_blob : str
        Path inside the bucket, e.g. "originals/{asset_id}.png"
    make_public : bool
        If True the object is made publicly readable (allUsers → objectViewer).
        Required so the certificate page can show image thumbnails without auth.
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        _executor, _upload_sync, data, destination_blob, content_type, make_public
    )


def _upload_sync(
    data: bytes, destination_blob: str, content_type: str, make_public: bool
) -> str:
    bucket_name = os.environ["GCS_BUCKET_NAME"]
    client = _get_client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob)
    blob.upload_from_string(data, content_type=content_type)
    if make_public:
        blob.make_public()
    public_url = blob.public_url
    logger.info("Uploaded to GCS: %s → %s", destination_blob, public_url)
    return public_url
