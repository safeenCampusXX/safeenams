import { initTheme, toast, escapeHtml, showSpinner, clearChildren } from './common.js';
import { fetchBooks } from './api.js';

function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

function norm(s) {
  return String(s || '').toLowerCase();
}

function passesFilters(book, q, dept, sem) {
  const text = norm(book.title) + ' ' + norm(book.description);
  if (q && !text.includes(norm(q))) return false;

  // Beginner-friendly filtering (schema currently does not include dept/semester for books)
  // We'll match keywords in description/title.
  if (dept) {
    const map = {
      cs: ['cs', 'computer science', 'programming', 'data structures'],
      math: ['math', 'calculus', 'linear algebra', 'probability'],
      physics: ['physics', 'mechanics', 'electromagnetism', 'quantum'],
      business: ['business', 'accounting', 'finance', 'management']
    };
    const keywords = map[dept] || [dept];
    if (!keywords.some(k => text.includes(norm(k)))) return false;
  }

  if (sem) {
    const semText = `semester ${sem}`;
    const alt = `sem ${sem}`;
    if (!text.includes(norm(semText)) && !text.includes(norm(alt))) return false;
  }

  return true;
}

function contactButton(book) {
  const contact = book.contact || '';
  return `<button class="btn btn-primary" onclick="window.__campusxx_contact('${escapeHtml(contact)}')">Contact</button>`;
}

window.__campusxx_contact = (contact) => {
  const c = String(contact || '').trim();
  if (!c) return toast('No contact info', 'This listing has no contact yet.');
  // Best effort
  if (c.includes('@')) {
    window.location.href = `mailto:${encodeURIComponent(c)}`;
  } else {
    window.location.href = `tel:${encodeURIComponent(c)}`;
  }
};

async function render() {
  initTheme();
  setupHamburger();

  const status = document.getElementById('status');
  const cards = document.getElementById('cards');
  const searchInput = document.getElementById('searchInput');
  const departmentFilter = document.getElementById('departmentFilter');
  const semesterFilter = document.getElementById('semesterFilter');

  clearChildren(cards);
  clearChildren(status);

  const spinner = showSpinner(status, 'Loading books...');
  try {
    const data = await fetchBooks();
    const books = data || [];

    const apply = () => {
      const q = searchInput.value.trim();
      const dept = departmentFilter.value;
      const sem = semesterFilter.value;

      const filtered = books.filter(b => passesFilters(b, q, dept, sem));
      clearChildren(cards);

      if (!filtered.length) {
        cards.innerHTML = `
          <div class="empty">
            <div>
              <h3>No books match your search</h3>
              <p>Try a different keyword or clear filters.</p>
            </div>
          </div>`;
        return;
      }

      for (const b of filtered) {
        const img = b.image_url || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=60';
        const price = typeof b.price === 'number' ? b.price : Number(b.price || 0);
        cards.insertAdjacentHTML('beforeend', `
          <article class="card fade-in">
            <div class="card-media">
              <img src="${escapeHtml(img)}" alt="${escapeHtml(b.title)}" />
            </div>
            <div class="card-body">
              <div class="row">
                <h3 class="card-title">${escapeHtml(b.title || '')}</h3>
                <div class="price">$${isNaN(price) ? '' : price}</div>
              </div>
              <div class="card-meta">
                <div><b>Seller:</b> ${escapeHtml(b.seller_name || '')}</div>
              </div>
              <div class="card-meta" style="margin-top:8px">${escapeHtml((b.description || '').slice(0, 90))}${(b.description||'').length>90?'…':''}</div>
            </div>
            <div class="card-actions">
              ${contactButton(b)}
            </div>
          </article>
        `);
      }
    };

    apply();

    searchInput.addEventListener('input', apply);
    departmentFilter.addEventListener('change', apply);
    semesterFilter.addEventListener('change', apply);

  } catch (e) {
    toast('Failed to load', e.message);
    cards.innerHTML = '';
  } finally {
    spinner.remove();
  }
}

render();

