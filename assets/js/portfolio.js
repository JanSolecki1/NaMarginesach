// ── Nav scroll shadow
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-overlay').classList.toggle('open');
});

// ── Config
const GITHUB_USER = 'JanSolecki1';
const GITHUB_REPO = 'NaMarginesach';
const BRANCH = 'main';
const FOLDER = '_portfolio';

// ── Parse frontmatter from .md files
// Format:
// ---
// title: "Tytuł"
// category: korekta
// ---
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const raw = match[1];
  const result = {};
  raw.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    // Remove surrounding quotes if present
    value = value.replace(/^["']|["']$/g, '');
    // Convert boolean strings
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    result[key] = value;
  });
  return result;
}

// ── Filter logic
const grid = document.getElementById('portfolio-grid');
let allCards = [];

const pills = document.querySelectorAll('.filter-pill');
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    allCards.forEach(card => {
      card.classList.toggle(
        'hidden',
        filter !== 'wszystkie' && card.dataset.category !== filter
      );
    });
  });
});

// ── Build a single card element
function buildCard(data) {
  const card = document.createElement('div');
  card.className = 'portfolio-card';
  card.dataset.category = data.category || 'korekta';

  const categoryLabel = {
    'korekta': 'Korekta',
    'redakcja': 'Redakcja',
    'prace-akademickie': 'Prace akademickie',
    'teksty-biznesowe': 'Teksty biznesowe'
  }[data.category] || data.category;

  const imgSrc = data.image || '';
  const imgHtml = imgSrc
    ? `<img src="${imgSrc}" alt="${data.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
    : '';

  card.innerHTML = `
    <div class="card-image">
      <div class="card-doc">
        <span class="card-doc-tag">${categoryLabel}</span>
        <div class="doc-line"></div>
        <div class="doc-line short"></div>
        <div class="doc-line medium"></div>
        <div class="doc-line highlight"></div>
        <div class="doc-line"></div>
        <div class="doc-line short"></div>
        <div class="doc-line medium"></div>
        <div class="doc-line highlight"></div>
      </div>
      <div class="card-img-placeholder">${imgHtml}</div>
    </div>
    <div class="card-body">
      <span class="card-category">${categoryLabel}</span>
      <h3>${data.title || 'Projekt'}</h3>
      <p>${data.description || ''}</p>
      <div class="card-footer">
        ${data.pdf
          ? `<a href="${data.pdf}" class="card-pdf" target="_blank">Zobacz PDF →</a>`
          : `<span></span>`}
        <span class="card-year">${data.year || ''}</span>
      </div>
    </div>
  `;
  return card;
}

// ── Fetch all .md files from GitHub and parse them
async function loadPortfolio() {
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FOLDER}?ref=${BRANCH}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('GitHub API error');
    const files = await res.json();

    const mdFiles = files.filter(f => f.name.endsWith('.md') && f.name !== '.gitkeep');

    if (mdFiles.length === 0) {
      document.getElementById('loading-msg').textContent = 'Brak projektów do wyświetlenia.';
      return;
    }

    const projects = await Promise.all(
      mdFiles.map(f =>
        fetch(f.download_url)
          .then(r => r.text())
          .then(text => parseFrontmatter(text))
      )
    );

    // Remove loading message
    const loadingMsg = document.getElementById('loading-msg');
    if (loadingMsg) loadingMsg.remove();

    // Render cards (skip unpublished)
    projects
      .filter(p => p.published !== false)
      .forEach(p => {
        const card = buildCard(p);
        grid.appendChild(card);
        allCards.push(card);
      });

  } catch (err) {
    const loadingMsg = document.getElementById('loading-msg');
    if (loadingMsg) loadingMsg.textContent = 'Nie udało się załadować projektów.';
    console.error(err);
  }
}

loadPortfolio();