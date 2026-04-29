"""Development overrides."""
from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "testserver"]

# In dev, eagerly run Celery tasks inline if a worker isn't running.
# Set to False (default) to require an actual worker.
CELERY_TASK_ALWAYS_EAGER = False
