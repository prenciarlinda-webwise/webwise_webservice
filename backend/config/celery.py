"""Celery app for the merged backend.

Configured from Django settings (CELERY_* keys). Task autodiscovery picks up
any tasks.py file inside an installed app.
"""
import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("webwise")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# Beat schedule — runs as long as `celery -A config beat` is alive.
# Each scan is per-project (cost-aware) but we run them on a recurring
# cadence so all clients stay fresh without manual intervention.
app.conf.beat_schedule = {
    # Weekly rank tracking for every active SEO-tracked project.
    # The task itself filters to status='active' projects with tracking flags.
    # Mondays at 03:00 UTC — outside business hours, before clients open the dashboard.
    "weekly-rank-tracking-all-projects": {
        "task": "apps.rankings.tasks.weekly_rank_tracking",
        "schedule": crontab(minute=0, hour=3, day_of_week=1),
        "kwargs": {},  # no project_id → runs for all
    },
    # Monthly keyword discovery — finds new ranking opportunities for each
    # project. First Monday of the month at 04:00 UTC.
    "monthly-keyword-discovery": {
        "task": "apps.discovery.tasks.monthly_keyword_discovery",
        "schedule": crontab(minute=0, hour=4, day_of_month=1),
    },
}
