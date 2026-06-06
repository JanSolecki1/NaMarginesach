// ── Nav scroll shadow
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-overlay').classList.toggle('open');
});

// ── Config — update repo details
const GITHUB_USER = 'JanSolecki1';      
const GITHUB_REPO = 'NaMarginesach'; 
const BRANCH = 'main';
const FOLDER = '_portfolio';

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
      card.classList.toggle('hidden', filter !== 'wszystkie' && card.dataset.category !== filter);
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
          ? `<a href="${data.pdf}" class="card-pdf" target="_blank">Pobierz PDF →</a>`
          : `<span></span>`}
        <span class="card-year">${data.year || ''}</span>
      </div>
    </div>
  `;
  return card;
}

// ── Fetch all portfolio JSON files from GitHub
async function loadPortfolio() {
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FOLDER}?ref=${BRANCH}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('GitHub API error');
    const files = await res.json();

    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    if (jsonFiles.length === 0) {
      document.getElementById('loading-msg').textContent = 'Brak projektów do wyświetlenia.';
      return;
    }

    const projects = await Promise.all(
      jsonFiles.map(f => fetch(f.download_url).then(r => r.json()))
    );

    // Remove loading message
    document.getElementById('loading-msg').remove();

    // Filter published only, render cards
    projects
      .filter(p => p.published !== false)
      .forEach(p => {
        const card = buildCard(p);
        grid.appendChild(card);
        allCards.push(card);
      });

  } catch (err) {
    document.getElementById('loading-msg').textContent =
      'Nie udało się załadować projektów.';
    console.error(err);
  }
}

loadPortfolio();