"""Ensure the Celery app loads when Django starts so @shared_task decorators
work and `celery -A config worker` finds the app.
"""
from .celery import app as celery_app

__all__ = ("celery_app",)
