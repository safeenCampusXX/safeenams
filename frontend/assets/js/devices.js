import { initTheme, toast, escapeHtml, showSpinner, clearChildren } from './common.js';
import { fetchDevices } from './api.js';

function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

function norm(s) { return String(s || '').toLowerCase(); }

function passes(n, q, type, condition) {
  const text = norm(n.title) + ' ' + norm(n.description) + ' ' + norm(n.device_type) + ' ' + norm(n.condition);
  if (q && !text.includes(norm(q))) return false;

  if (type) {
    const map = {
      laptop: ['laptop', 'notebook', 'macbook'],
      calculator: ['calculator'],
      headphones: ['headphones', 'earbuds'],
      tablet: ['tablet', 'ipad'],
      monitor: ['monitor', 'screen']
    };
    const keywords = map[type] || [type];
    if (!keywords.some(k => text.includes(norm(k)))) return false;
  }

  if (condition) {
    const target = condition === 'like_new' ? 'like new' : condition.replaceAll('_', ' ');
    if (!text.includes(norm(target))) return false;
  }

  return true;
}

window.__campusxx_contact = (contact) => {
  const c = String(contact || '').trim();
  if (!c) return toast('No contact info', 'This listing has no contact yet.');
  if (c.includes('@')) window.location.href = `mailto:${encodeURIComponent(c)}`;
  else window.location.href = `tel:${encodeURIComponent(c)}`;
};

function emptyCard() {
  return `
    <div class="empty">
      <div>
        <h3>No devices found</h3>
        <p>Try a different type or keyword.</p>
      </div>
    </div>`;
}

async function render() {
  initTheme();
  setupHamburger();

  const status = document.getElementById('status');
  const cards = document.getElementById('cards');
  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');
  const conditionFilter = document.getElementById('conditionFilter');

  clearChildren(cards);
  clearChildren(status);

  const spinner = showSpinner(status, 'Loading devices...');
  try {
    const data = await fetchDevices();
    const devices = data || [];

    const apply = () => {
      const q = searchInput.value.trim();
      const type = typeFilter.value;
      const condition = conditionFilter.value;
      const filtered = devices.filter(d => passes(d, q, type, condition));

      clearChildren(cards);
      if (!filtered.length) {
        cards.innerHTML = emptyCard();
        return;
      }

      for (const d of filtered) {
        const img = d.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=60';
        const price = typeof d.price === 'number' ? d.price : Number(d.price || 0);
        cards.insertAdjacentHTML('beforeend', `
          <article class="card fade-in">
            <div class="card-media">
              <img src="${escapeHtml(img)}" alt="${escapeHtml(d.title)}" />
            </div>
            <div class="card-body">
              <div class="row">
                <h3 class="card-title">${escapeHtml(d.title || '')}</h3>
                <div class="price">$${isNaN(price) ? '' : price}</div>
              </div>
              <div class="card-meta">
                <div><b>Type:</b> ${escapeHtml(d.device_type || '')}</div>
                <div><b>Condition:</b> ${escapeHtml(d.condition || '')}</div>
              </div>
              <div class="card-meta" style="margin-top:8px">${escapeHtml((d.description || '').slice(0, 90))}${(d.description||'').length>90?'…':''}</div>
            </div>
            <div class="card-actions">
              <button class="btn btn-primary" onclick="window.__campusxx_contact('${escapeHtml(d.contact || '')}')">Contact seller</button>
            </div>
          </article>
        `);
      }
    };

    apply();
    searchInput.addEventListener('input', apply);
    typeFilter.addEventListener('change', apply);
    conditionFilter.addEventListener('change', apply);

  } catch (e) {
    toast('Failed to load', e.message);
    cards.innerHTML = '';
  } finally {
    spinner.remove();
  }
}

render();

