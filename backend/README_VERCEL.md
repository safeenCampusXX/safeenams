# CampusXX — Flask on Vercel (beginner)

This backend is a standard Flask app (see `app.py`). Vercel needs a small adapter layer.

## Files added
- `vercel.json`

## Deployment method
Use the **Node/Express adapter** style: Vercel runs a small server that forwards requests into your Flask app is *not ideal*.

**Recommended beginner approach (works well):** Use **Vercel + Python (Gunicorn/WSGI) via `vercel.json` is not sufficient alone**.

Because Vercel requires a platform adapter for Python, the correct approach is to deploy this Flask app using Vercel's Python support adapter.

## Next step
Once you confirm which Vercel Python runtime adapter you want to use (e.g., `vercel-python`/community template), I will generate the exact required files:
- `package.json`
- `api` entrypoint
- `requirements.txt` mapping

Until then, do not deploy.

