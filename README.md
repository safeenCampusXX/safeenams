# CampusXX

Student marketplace platform (Books, Notes, Devices) built with:
- Frontend: HTML / CSS / JavaScript
- Backend: Python / Flask
- Database & Storage: Supabase
- Frontend hosting: Netlify
- Backend hosting: Vercel

## Repo layout
- `frontend/` — Netlify-ready static site
- `backend/` — Vercel-ready Flask API

## Environment variables (backend)
Create `.env` in `backend/`:

```env
SUPABASE_URL=https://izaxsekhxhqsuxlhahss.supabase.co
SUPABASE_ANON_KEY=...your anon key...
SUPABASE_SERVICE_ROLE_KEY=...create in Supabase settings...
SUPABASE_BUCKET=campusxx

# Frontend/other
PORT=5000
```

> Note: Never expose `SUPABASE_SERVICE_ROLE_KEY` in the frontend.

## Setup (local)

### Backend
```bash
cd backend
python -m venv .venv
. .venv\Scripts\activate
pip install -r requirements.txt
flask run
```

### Frontend
Serve with any static server (or Netlify):
- Open `frontend/index.html` or use VSCode Live Server.

## Deploy
- Frontend: Netlify (publishes `frontend/`)
- Backend: Vercel (configure to run Flask using the provided entry)


