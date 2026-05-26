const API_BASE_URL = window.API_BASE_URL || 'API_BASE_URL';

async function handle(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText;
    throw new Error(msg);
  }
  return data;
}

export async function fetchBooks() {
  const res = await fetch(`${API_BASE_URL}/api/books`);
  const data = await handle(res);
  return data;
}

export async function fetchNotes() {
  const res = await fetch(`${API_BASE_URL}/api/notes`);
  const data = await handle(res);
  return data;
}

export async function fetchDevices() {
  const res = await fetch(`${API_BASE_URL}/api/devices`);
  const data = await handle(res);
  return data;
}

export async function addProduct(formData) {
  // formData is FormData (supports image)
  const res = await fetch(`${API_BASE_URL}/api/products/add`, {
    method: 'POST',
    body: formData
  });
  const data = await handle(res);
  return data;
}

export async function contactAction(contact) {
  // Simple mailto/tel fallback
  const c = String(contact || '').trim();
  return c;
}

