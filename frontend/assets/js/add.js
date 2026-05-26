import { initTheme, toast } from './common.js';
import { addProduct } from './api.js';

function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

function setCategoryFields() {
  const category = document.getElementById('category').value;
  const notesFields = document.getElementById('notesFields');
  const deviceFields = document.getElementById('deviceFields');

  notesFields.style.display = (category === 'note') ? 'block' : 'none';
  deviceFields.style.display = (category === 'device') ? 'block' : 'none';
}

function mapCategoryToRedirect(category) {
  if (category === 'book') return 'books.html';
  if (category === 'note') return 'notes.html';
  return 'devices.html';
}

async function handleSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value.trim();
    const descriptionBase = document.getElementById('description').value.trim();
    const deptHint = document.getElementById('deptHint').value.trim();
    const price = document.getElementById('price').value;
    const seller_name = document.getElementById('seller_name').value.trim();
    const contact = document.getElementById('contact').value.trim();

    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files && imageInput.files[0];
    if (!imageFile) throw new Error('Please upload an image');

    const fd = new FormData();
    fd.append('category', category);
    fd.append('title', title);
    fd.append('price', price);
    fd.append('seller_name', seller_name);
    fd.append('contact', contact);

    // For books, incorporate dept hint into description so filtering can work (until schema is extended)
    const finalDesc = category === 'book' && deptHint
      ? `${descriptionBase}\n\n(Department/Semester hint: ${deptHint})`
      : descriptionBase;
    fd.append('description', finalDesc);

    fd.append('image', imageFile);

    if (category === 'note') {
      const subject_name = document.getElementById('subject_name').value.trim();
      const notes_type = document.getElementById('notes_type').value.trim();
      const semester = document.getElementById('semester').value.trim();
      if (!subject_name || !notes_type || !semester) throw new Error('Notes: subject_name, notes_type, semester are required');
      fd.append('subject_name', subject_name);
      fd.append('notes_type', notes_type);
      fd.append('semester', semester);
    }

    if (category === 'device') {
      const device_type = document.getElementById('device_type').value.trim();
      const condition = document.getElementById('condition').value.trim();
      if (!device_type || !condition) throw new Error('Devices: device_type and condition are required');
      fd.append('device_type', device_type);
      fd.append('condition', condition);
    }

    await addProduct(fd);
    toast('Success!', 'Your product has been added.');

    const redirect = mapCategoryToRedirect(category);
    setTimeout(() => { window.location.href = redirect; }, 900);
  } catch (err) {
    toast('Upload failed', err.message || String(err));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit product';
  }
}

initTheme();
setupHamburger();
setCategoryFields();

document.getElementById('category').addEventListener('change', setCategoryFields);

document.getElementById('productForm').addEventListener('submit', handleSubmit);

