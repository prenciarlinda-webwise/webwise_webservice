"""Celery app for the merged backend.

Configured from Django settings (CELERY_* keys). Task autodiscovery picks up
any tasks.py file inside an installed app. Beat schedule is populated by the
SEO apps once they're ported (Phase 4).
"""
import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("webwise")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    # Populated in Phase 4 with SEO ranking / discovery schedules.
}
