const THEME_KEY = 'campusxx_theme';

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = saved ? saved === 'dark' : prefersDark;
  document.body.classList.toggle('dark', useDark);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = !document.body.classList.contains('dark');
      document.body.classList.toggle('dark', next);
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    });
  }
}

let toastTimer = null;
export function toast(title, message = '') {
  const wrap = document.getElementById('toastWrap') || createToastWrap();
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<strong>${escapeHtml(title)}</strong><small>${escapeHtml(message || '')}</small>`;
  wrap.appendChild(el);

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.transition = 'opacity .2s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 220);
  }, 3200);
}

function createToastWrap() {
  const wrap = document.createElement('div');
  wrap.id = 'toastWrap';
  wrap.className = 'toast-wrap';
  document.body.appendChild(wrap);
  return wrap;
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

export function showSpinner(parentEl, label = 'Loading...') {
  const wrap = document.createElement('div');
  wrap.className = 'row fade-in';
  wrap.style.gap = '10px';
  wrap.innerHTML = `<div class="spinner"></div><div>${escapeHtml(label)}</div>`;
  parentEl.appendChild(wrap);
  return wrap;
}

export function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

