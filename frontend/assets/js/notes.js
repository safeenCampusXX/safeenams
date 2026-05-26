import { initTheme, toast, escapeHtml, showSpinner, clearChildren } from './common.js';
import { fetchNotes } from './api.js';

function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

function norm(s) { return String(s || '').toLowerCase(); }

function passesFilters(n, q, subject, semester) {
  const text = norm(n.title) + ' ' + norm(n.description) + ' ' + norm(n.subject_name) + ' ' + norm(n.notes_type);
  if (q && !text.includes(norm(q))) return false;

  if (subject) {
    const map = {
      computer_science: ['computer science', 'cs', 'programming', 'software'],
      math: ['math', 'calculus', 'linear algebra', 'probability'],
      physics: ['physics', 'mechanics', 'quantum'],
      economics: ['economics', 'micro', 'macro', 'finance']
    };
    const keywords = map[subject] || [subject];
    if (!keywords.some(k => text.includes(norm(k)))) return false;
  }

  if (semester) {
    if (!text.includes(norm(`semester ${semester}`)) && !text.includes(norm(`sem ${semester}`))) return false;
  }

  return true;
}

function emptyCard() {
  return `
    <div class="empty">
      <div>
        <h3>No notes found</h3>
        <p>Try a different subject or keyword.</p>
      </div>
    </div>`;
}

function contactOrViewButton(n) {
  // Public images represent preview; download = open image in new tab
  const img = n.image_url;
  if (img) {
    return `<button class="btn btn-primary" onclick="window.open('${escapeHtml(img)}','_blank')">View</button>`;
  }
  return `<button class="btn btn-primary" onclick="alert('No preview available yet')">View</button>`;
}

window.__campusxx_contact = (contact) => {
  const c = String(contact || '').trim();
  if (!c) return toast('No contact info', 'This listing has no contact yet.');
  if (c.includes('@')) window.location.href = `mailto:${encodeURIComponent(c)}`;
  else window.location.href = `tel:${encodeURIComponent(c)}`;
};

async function render() {
  initTheme();
  setupHamburger();

  const status = document.getElementById('status');
  const cards = document.getElementById('cards');
  const searchInput = document.getElementById('searchInput');
  const subjectFilter = document.getElementById('subjectFilter');
  const semesterFilter = document.getElementById('semesterFilter');

  clearChildren(cards);
  clearChildren(status);

  const spinner = showSpinner(status, 'Loading notes...');
  try {
    const data = await fetchNotes();
    const notes = data || [];

    const apply = () => {
      const q = searchInput.value.trim();
      const subject = subjectFilter.value;
      const sem = semesterFilter.value;
      const filtered = notes.filter(n => passesFilters(n, q, subject, sem));

      clearChildren(cards);
      if (!filtered.length) {
        cards.innerHTML = emptyCard();
        return;
      }

      for (const n of filtered) {
        const img = n.image_url || 'https://images.unsplash.com/photo-1553777097-6f0f0c8f9e7a?auto=format&fit=crop&w=900&q=60';
        const price = typeof n.price === 'number' ? n.price : Number(n.price || 0);
        cards.insertAdjacentHTML('beforeend', `
          <article class="card fade-in">
            <div class="card-media">
              <img src="${escapeHtml(img)}" alt="${escapeHtml(n.title)}" />
            </div>
            <div class="card-body">
              <div class="row">
                <h3 class="card-title">${escapeHtml(n.title || '')}</h3>
                <div class="price">$${isNaN(price) ? '' : price}</div>
              </div>
              <div class="card-meta">
                <div><b>Subject:</b> ${escapeHtml(n.subject_name || '')}</div>
                <div><b>Type:</b> ${escapeHtml(n.notes_type || '')}</div>
                <div><b>Semester:</b> ${escapeHtml(n.semester || '')}</div>
              </div>
            </div>
            <div class="card-actions">
              ${contactOrViewButton(n)}
              <button class="btn btn-ghost" onclick="window.__campusxx_contact('${escapeHtml(n.contact || '')}')">Contact</button>
            </div>
          </article>
        `);
      }
    };

    apply();
    searchInput.addEventListener('input', apply);
    subjectFilter.addEventListener('change', apply);
    semesterFilter.addEventListener('change', apply);

  } catch (e) {
    toast('Failed to load', e.message);
    cards.innerHTML = '';
  } finally {
    spinner.remove();
  }
}

render();

