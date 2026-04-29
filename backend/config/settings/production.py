"""Production overrides."""
import os

from .base import *  # noqa: F401,F403

DEBUG = False

# Hard fail if SECRET_KEY wasn't set in env.
if os.environ.get("DJANGO_SECRET_KEY") is None:
    raise RuntimeError("DJANGO_SECRET_KEY must be set in production.")

# Security hardening
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31_536_000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"
