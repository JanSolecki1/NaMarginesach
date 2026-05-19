// ── Nav scroll shadow
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-overlay').classList.toggle('open');
});
