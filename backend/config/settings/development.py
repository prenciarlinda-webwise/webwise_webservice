"""
Development settings for the Web Wise Dashboard API.
"""

from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Database - SQLite for development (can switch to PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# For PostgreSQL in development, uncomment below:
# import dj_database_url
# DATABASES = {
#     'default': dj_database_url.config(
#         default=os.getenv('DATABASE_URL', 'postgresql://localhost/Web Wise_dev')
#     )
# }

# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins in development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Shorter token lifetime for development testing
SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(minutes=60)
