"""Development overrides."""
from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "testserver"]

# Close DB connections after each request in dev so multiple python shells +
# runserver + celery worker don't exhaust the Postgres connection pool.
# Production uses base.py's pooled connections (conn_max_age=600).
DATABASES["default"]["CONN_MAX_AGE"] = 0

# In dev, eagerly run Celery tasks inline if a worker isn't running.
# Set to False (default) to require an actual worker.
CELERY_TASK_ALWAYS_EAGER = False
