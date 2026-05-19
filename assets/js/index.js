// ── Nav scroll shadow
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-overlay').classList.toggle('open');
});

// ── FAQ Accordion (one open at a time globally)
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Stat counters (animate on scroll, fire once)
function animateCounter(el, target, suffix, duration) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsRow = document.getElementById('stats-row');
let statsAnimated = false;

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix, 1500);
    });
  }
}, { threshold: 0.3 });

if (statsRow) observer.observe(statsRow);
