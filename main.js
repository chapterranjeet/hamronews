/**
 * HamroNews — Public Frontend JS
 */

(function () {

  const CATEGORIES = ['all','राजनीति','अर्थ','खेलकुद','प्रविधि','मनोरञ्जन','स्वास्थ्य'];
  let currentCat = 'all';

  // ── LIVE DATE ──────────────────────────────────────
  function updateDate() {
    const el = document.getElementById('live-date');
    if (!el) return;
    const now = new Date();
    const opts = { year:'numeric', month:'long', day:'numeric', weekday:'long' };
    el.textContent = now.toLocaleDateString('ne-NP', opts);
  }
  updateDate();
  setInterval(updateDate, 60000);

  // ── TICKER ────────────────────────────────────────
  function buildTicker() {
    const el = document.getElementById('ticker');
    if (!el) return;
    const arts = HamroDB.getArticles({ published: true });
    if (!arts.length) return;
    el.textContent = arts.slice(0, 5).map(a => a.title).join('  •  ');
  }
  buildTicker();

  // ── BREAKING STRIP ────────────────────────────────
  function buildBreaking() {
    const arts = HamroDB.getArticles({ published: true }).filter(a => a.breaking);
    const strip = document.getElementById('breaking-strip');
    const txt = document.getElementById('breaking-text');
    if (!strip || !txt) return;
    if (arts.length) {
      strip.style.display = 'flex';
      txt.textContent = arts.map(a => a.title).join('  •  ');
    }
  }
  buildBreaking();

  // ── HERO ──────────────────────────────────────────
  function buildHero() {
    const area = document.getElementById('hero-area');
    if (!area) return;
    const arts = HamroDB.getArticles({ published: true });
    if (!arts.length) {
      area.innerHTML = '<div class="hero-loading">कुनै समाचार उपलब्ध छैन।</div>';
      return;
    }

    const main = arts[0];
    const sides = arts.slice(1, 4);

    area.innerHTML = `
      <div class="hero-main" data-id="${main.id}">
        ${main.image
          ? `<img src="${escapeHtml(main.image)}" alt="${escapeHtml(main.title)}" />`
          : `<div style="width:100%;height:380px;background:linear-gradient(135deg,#222,#444);display:flex;align-items:center;justify-content:center;font-size:60px;">📰</div>`
        }
        <div class="hero-main-overlay">
          <span class="badge">${escapeHtml(main.category)}</span>
          <h2>${escapeHtml(main.title)}</h2>
          <div class="hero-meta">${formatDate(main.date)} • ${escapeHtml(main.author)}</div>
        </div>
      </div>
      <div class="hero-side">
        ${sides.map(a => `
          <div class="hero-side-card" data-id="${a.id}">
            ${a.image
              ? `<img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" />`
              : `<div style="width:90px;height:70px;background:#333;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">📰</div>`
            }
            <div class="hero-side-info">
              <span class="badge">${escapeHtml(a.category)}</span>
              <h3>${escapeHtml(a.title)}</h3>
              <div class="meta">${formatDate(a.date)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    area.querySelectorAll('[data-id]').forEach(el => {
      el.addEventListener('click', () => openModal(el.dataset.id));
    });
  }
  buildHero();

  // ── NEWS GRID ─────────────────────────────────────
  function buildGrid(cat) {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    const filter = { published: true };
    if (cat && cat !== 'all') filter.category = cat;
    const arts = HamroDB.getArticles(filter);

    if (!arts.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>यस श्रेणीमा समाचार उपलब्ध छैन।</p>
        </div>`;
      return;
    }

    grid.innerHTML = arts.map(a => `
      <article class="news-card" data-id="${a.id}">
        <div class="news-card-img-wrap">
          ${a.image
            ? `<img class="news-card-img" src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" />`
            : `<div class="no-img-placeholder">📰</div>`
          }
          <span class="card-badge">${escapeHtml(a.category)}</span>
        </div>
        <div class="news-card-body">
          <h2 class="news-card-title">${escapeHtml(a.title)}</h2>
          <p class="news-card-excerpt">${escapeHtml(a.excerpt)}</p>
          <div class="news-card-footer">
            <span>${formatDate(a.date)}</span>
            <span class="read-more">पढ्नुहोस् →</span>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.news-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.id));
    });
  }
  buildGrid('all');

  // ── NAV FILTER ────────────────────────────────────
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentCat = link.dataset.cat;
      buildGrid(currentCat);
    });
  });

  // ── MODAL ─────────────────────────────────────────
  function openModal(id) {
    const art = HamroDB.getArticleById(id);
    if (!art) return;

    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <span class="modal-badge">${escapeHtml(art.category)}</span>
      <h1>${escapeHtml(art.title)}</h1>
      <div class="modal-meta">
        <span>📅 ${formatDate(art.date)}</span>
        <span>✍️ ${escapeHtml(art.author)}</span>
        ${art.breaking ? '<span>🔴 Breaking</span>' : ''}
      </div>
      ${art.image ? `<img class="modal-img" src="${escapeHtml(art.image)}" alt="${escapeHtml(art.title)}" />` : ''}
      <div class="modal-body">${escapeHtml(art.body)}</div>
    `;

    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    document.getElementById('modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── HELPERS ───────────────────────────────────────
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('ne-NP', { year:'numeric', month:'short', day:'numeric' });
  }

})();
