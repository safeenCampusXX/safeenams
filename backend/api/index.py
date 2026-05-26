import os

# Vercel Python runtime adapter expects `app` to be the WSGI application.
# We expose our existing Flask app defined in `backend/app.py`.

from app import app  # noqa: F401

# Vercel uses the exported `app`.
__all__ = ["app"]

