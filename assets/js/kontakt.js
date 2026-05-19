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
  if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
  } else {
    fileName.textContent = '';
  }
});

// ── Form validation
const form = document.getElementById('contact-form');

function setError(fieldId, errorId, show) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (show) {
    field.classList.add('error');
    error.classList.add('visible');
  } else {
    field.classList.remove('error');
    error.classList.remove('visible');
  }
}

function setCheckboxError(show) {
  const row = document.getElementById('privacy-row');
  const error = document.getElementById('privacy-error');
  if (show) {
    row.classList.add('error');
    error.classList.add('visible');
  } else {
    row.classList.remove('error');
    error.classList.remove('visible');
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();
  const privacy = document.getElementById('privacy').checked;

  // Name
  if (!name) { setError('name', 'name-error', true); valid = false; }
  else { setError('name', 'name-error', false); }

  // Email
  if (!email || !isValidEmail(email)) { setError('email', 'email-error', true); valid = false; }
  else { setError('email', 'email-error', false); }

  // Service
  if (!service) { setError('service', 'service-error', true); valid = false; }
  else { setError('service', 'service-error', false); }

  // Message
  if (!message) { setError('message', 'message-error', true); valid = false; }
  else { setError('message', 'message-error', false); }

  // Privacy
  if (!privacy) { setCheckboxError(true); valid = false; }
  else { setCheckboxError(false); }

  if (valid) {
    document.getElementById('form-wrapper').style.display = 'none';
    document.getElementById('success-msg').classList.add('visible');
  }
});

// ── Clear errors on input
['name', 'email', 'service', 'message'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    el.classList.remove('error');
    document.getElementById(id + '-error').classList.remove('visible');
  });
});

document.getElementById('privacy').addEventListener('change', () => {
  setCheckboxError(false);
});
