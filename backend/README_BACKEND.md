## Backend (Flask + Supabase)

### Endpoints
- `GET /api/books`
- `GET /api/notes`
- `GET /api/devices`
- `POST /api/upload-image` (multipart/form-data, field name: `image`)
- `POST /api/products/add`

  - Accepts form fields + optional `image` file
  - Required: category, title, description, price, seller_name, contact
  - Notes extra: subject_name, notes_type, semester
  - Devices extra: device_type, condition
- `DELETE /api/products/<books|notes|devices>/<id>`
- `GET /api/health`

### Supabase
- Tables: books, notes, devices
- Storage bucket: campusxx (public)

### Deploy notes for Vercel
Vercel + Flask typically uses a WSGI adapter or a small Node wrapper.
If you prefer, we can switch to a Python-native Vercel approach (e.g., using `vercel-python`), but this scaffold focuses on correctness and local dev.

