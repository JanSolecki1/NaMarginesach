// ── Nav scroll shadow
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-overlay').classList.toggle('open');
});

// ── Portfolio filter
const pills = document.querySelectorAll('.filter-pill');
const cards = document.querySelectorAll('.portfolio-card');

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    // Update active pill
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;

    cards.forEach(card => {
      if (filter === 'wszystkie' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
