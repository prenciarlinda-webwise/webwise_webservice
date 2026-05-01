"""Download SERP screenshots from DataForSEO's CDN and save them locally so
they don't 404 in 30-60 days when DataForSEO purges them.

Returns absolute URLs so the Next.js frontend can display them regardless of
whether it's running on a different origin from Django.
"""
import hashlib
import logging
import os
from urllib.parse import urlparse

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def persist_screenshot(remote_url: str, subdir: str = "serp") -> str:
    """Download `remote_url` and save under MEDIA_ROOT/screenshots/<subdir>/.
    Returns an absolute URL pointing at our copy. If the download fails,
    returns the original `remote_url` (so the popover can still try it).

    Idempotent: same source URL always maps to the same local file (sha256
    of the URL).
    """
    if not remote_url:
        return ""

    # Already-local URLs (e.g. when re-running on already-persisted data)
    if remote_url.startswith(_public_base()):
        return remote_url

    fingerprint = hashlib.sha256(remote_url.encode()).hexdigest()[:24]
    ext = _guess_ext(remote_url) or ".png"
    rel_path = os.path.join("screenshots", subdir, f"{fingerprint}{ext}")
    abs_path = os.path.join(settings.MEDIA_ROOT, rel_path)

    if os.path.exists(abs_path):
        return _public_url(rel_path)

    try:
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        resp = requests.get(remote_url, timeout=30, stream=True)
        if resp.status_code != 200:
            logger.warning("Screenshot download %s → %s", remote_url, resp.status_code)
            return remote_url
        with open(abs_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=16384):
                f.write(chunk)
        return _public_url(rel_path)
    except Exception as e:
        logger.warning("Screenshot persist failed for %s: %s", remote_url, e)
        return remote_url


def _public_base() -> str:
    return getattr(settings, "BACKEND_PUBLIC_URL", "http://localhost:8000").rstrip("/")


def _public_url(rel_path: str) -> str:
    media_url = settings.MEDIA_URL.lstrip("/").rstrip("/")
    return f"{_public_base()}/{media_url}/{rel_path.replace(os.sep, '/')}"


def _guess_ext(url: str) -> str | None:
    path = urlparse(url).path
    last = path.rstrip("/").rsplit("/", 1)[-1]
    if "." in last:
        ext = "." + last.rsplit(".", 1)[-1].lower()
        if ext in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
            return ext
    return None
