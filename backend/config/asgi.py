"""ASGI config wired for HTTP + WebSockets via Channels.

WebSocket routes are added in Phase 6 (real-time updates).
"""
import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

# Build the Django ASGI app first so models are loaded before any Channels
# imports that touch them.
django_asgi_app = get_asgi_application()

# Phase 6 will add per-app routing modules here.
websocket_urlpatterns: list = []

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter(websocket_urlpatterns),
})
