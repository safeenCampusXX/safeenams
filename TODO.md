# TODO — CampusXX

- [x] Scaffold frontend (HTML/CSS/JS) with 4 pages: Books, Notes, Devices, Add Product + top navbar + responsive hamburger.
- [x] Implement shared UI: glassmorphism cards, animations, loading spinner, toast notifications, empty states, premium gradient theme.
- [x] Create frontend data layer calling Flask APIs via `API_BASE_URL` placeholder.
- [x] Implement Books/Notes/Devices search + category filters and responsive grids.

- [x] Implement Add Product form with dynamic fields (category Book/Notes/Device) and image upload to backend.
- [x] Scaffold Flask backend (API endpoints)
  - [x] GET /api/books
  - [x] GET /api/notes
  - [x] GET /api/devices
  - [x] POST /api/upload-image
  - [x] POST /api/products/add
  - [x] DELETE /api/products/<type>/<id>
- [x] Implement Supabase integration in Flask:
  - [x] Insert rows into tables books/notes/devices.
  - [x] Upload images to Supabase Storage and store `image_url`.
- [x] Add basic input validation + error handling.
- [x] Create SQL statements for Supabase tables (books, notes, devices) and Storage bucket.
- [ ] Run local dev tests (backend) + lint/basic checks.
- [x] Update README with setup instructions.
- [ ] Provide commands to deploy frontend to Netlify and backend to Vercel.

- [ ] Create `edit_plan.md` and track progress by updating this TODO file.






