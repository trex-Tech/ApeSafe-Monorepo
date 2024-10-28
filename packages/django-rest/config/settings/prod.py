from .base import *
import ast
import dj_database_url

# SECURITY WARNING: don't run with debug turned on in production!
# CORS = os.getenv('CORS_PROD_HEADERS')
# CORS_ALLOWED_ORIGINS = ast.literal_eval(CORS)
#CORS_ALLOWED_ORIGINS = [""]
CORS_ALLOW_ALL_ORIGINS = True

DATABASE_URL = os.getenv('DATABASE_URL')



DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USERNAME"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles/")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# FILE UPLOAD
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
FILE_UPLOAD_PERMISSION = 0o64

CSRF_TRUSTED_ORIGINS = ['https://omni.solgram.app']
DEBUG = True