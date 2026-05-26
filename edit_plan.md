# CampusXX Edit Plan

## Information Gathered
- Repo contained no existing code (only `README.md` and `TODO.md`).
- Supabase project details provided:
  - URL: https://izaxsekhxhqsuxlhahss.supabase.co
  - Anon/public key: provided
  - Tables: `books`, `notes`, `devices`
- Storage bucket requirements:
  - Bucket name: `campusxx`
  - Public bucket so `image_url` can be used directly.
- Deployment structure chosen:
  - Frontend: Netlify static hosting using **separate HTML files**: `books.html`, `notes.html`, `devices.html`, `add.html`
  - Backend: Flask API deployed on Vercel.
  - Frontend uses placeholder `API_BASE_URL` to call backend.

## Plan (by file/folder)

### 1) Create scaffold
- Create `frontend/` directory with:
  - `index.html` (optional / simple landing + link to pages)
  - `books.html`, `notes.html`, `devices.html`, `add.html`
  - `assets/` (css, js, images placeholder)
  - `assets/css/styles.css` (theme + glassmorphism)
  - `assets/js/common.js` (nav rendering helpers, toast, spinner)
  - `assets/js/api.js` (API client using `API_BASE_URL`)
  - `assets/js/books.js`, `notes.js`, `devices.js`, `add.js`
  - `assets/js/toast.js` (if separated)
- Create `backend/` directory with:
  - `app.py`
  - `requirements.txt`
  - `.env.example`
  - `config.py` (supabase + bucket settings)

### 2) Supabase SQL (documented)
- Add `backend/supabase.sql` with:
  - Tables: `books`, `notes`, `devices`
  - Columns: `id`, `title`, `description`, `price`, `image_url`, `seller_name`, `contact`, `created_at`
  - Extra columns:
    - notes: `subject_name`, `notes_type`, `semester`
    - devices: `device_type`, `condition`
  - (Optional) basic indexes on category/filter columns.
  - Storage bucket `campusxx` instructions (public).

### 3) Flask API
Implement endpoints:
- `POST /api/products/add` (single endpoint handling category)
  - Accept JSON body (plus base64 or URL for image). Prefer: accept image URL from backend upload.
  - For beginner simplicity: implement `POST /api/upload-image` that accepts `multipart/form-data` image.
  - `add` calls `upload` then inserts into correct table.
- `GET /api/books`
- `GET /api/notes`
- `GET /api/devices`
- `DELETE /api/products/:table/:id` (or `/api/products/:id` with table inferred) to satisfy requirement “delete products”.
  - Since requirement says `Delete products` without clarifying table, implement `DELETE /api/products/:type/:id` where `type` in {books,notes,devices}.

### 4) Frontend UI/UX
- Shared navbar across all pages (copy paste small reusable snippet or generate via JS).
- Glassmorphism cards with hover effects.
- Search bar + filters:
  - Books: filter by department and/or semester (we will map department via `description`? Better: include optional `department` and `semester` columns—BUT requirement didn’t list them in schema. We'll implement filtering using `title/description` substring until user confirms schema extension.)
  - Notes: subject filtering, notes type, semester (from required schema columns)
  - Devices: filter by device_type and condition (from required schema columns)
- Add form:
  - Category dropdown: Book / Notes / Device
  - Dynamic fields: subject_name/notes_type/semester for Notes; device_type/condition for Devices.
  - Upload image.
  - Submit calls backend; on success show toast + redirect to relevant page.
- Loading spinner for fetch.
- Empty states with friendly illustration (simple SVG inline).

### 5) README update
- Add steps to:
  - Create storage bucket & tables in Supabase
  - Configure backend env vars
  - Run locally
  - Build/deploy instructions for Netlify (frontend) and Vercel (backend)

## Dependent Files to be edited
- Newly created only: `frontend/*`, `backend/*`, `backend/supabase.sql`, `README.md`, `TODO.md`

## Followup steps
- Run backend locally and verify CRUD with curl/Postman.
- Open frontend pages locally and test API calls.
- Deploy:
  - Frontend to Netlify (set `API_BASE_URL` as env var for static site)
  - Backend to Vercel (set Supabase env vars)

<ask_followup_question>
Confirm the plan to proceed with scaffolding and code generation. After confirmation, I will implement the repository structure and core endpoints + pages.
</ask_followup_question>

