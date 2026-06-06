// ── Nav scroll shadow
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-overlay').classList.toggle('open');
});

// ── File upload zone
const fileZone = document.getElementById('file-zone');
const fileInput = document.getElementById('file-input');
const fileName = document.getElementById('file-name');

fileZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  fileName.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : '';
});

// ── Char counter
const messageEl = document.getElementById('message');
const charCount = document.getElementById('char-count');
const charCounter = charCount.closest('.char-counter');
const MAX_CHARS = 1000;

messageEl.addEventListener('input', () => {
  const len = messageEl.value.length;
  charCount.textContent = len;
  charCounter.classList.toggle('limit', len >= MAX_CHARS);
});

// ── Validation helpers
function setError(fieldId, errorId, show) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.toggle('error', show);
  error.classList.toggle('visible', show);
}

function setCheckboxError(show) {
  document.getElementById('privacy-row').classList.toggle('error', show);
  document.getElementById('privacy-error').classList.toggle('visible', show);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Form submit → Formspree
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();
  const privacy = document.getElementById('privacy').checked;

  let valid = true;

  setError('name', 'name-error', !name) || (valid = valid && !!name);
  if (!name) valid = false;

  const emailOk = email && isValidEmail(email);
  setError('email', 'email-error', !emailOk);
  if (!emailOk) valid = false;

  setError('service', 'service-error', !service);
  if (!service) valid = false;

  setError('message', 'message-error', !message);
  if (!message) valid = false;

  setCheckboxError(!privacy);
  if (!privacy) valid = false;

  if (!valid) return;

  // Send to Formspree
  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.textContent = 'Wysyłanie...';
  submitBtn.disabled = true;

  try {
    const formData = new FormData(form);
    const res = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      document.getElementById('form-wrapper').style.display = 'none';
      document.getElementById('success-msg').classList.add('visible');
    } else {
      submitBtn.textContent = 'Błąd — spróbuj ponownie';
      submitBtn.disabled = false;
    }
  } catch {
    submitBtn.textContent = 'Błąd — spróbuj ponownie';
    submitBtn.disabled = false;
  }
});

// ── Clear errors on input
['name', 'email', 'service', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(id + '-error').classList.remove('visible');
  });
});

document.getElementById('privacy').addEventListener('change', () => {
  setCheckboxError(false);
});