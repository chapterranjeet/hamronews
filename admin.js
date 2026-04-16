/**
 * HamroNews — Admin Dashboard JS
 */

(function () {

  // ── AUTH GUARD ────────────────────────────────────
  if (!HamroDB.isLoggedIn()) {
    window.location.href = 'login.html';
  }

  const session = HamroDB.getSession();
  document.getElementById('admin-name').textContent = session.username || 'Admin';
  document.getElementById('admin-avatar').textContent = (session.username || 'A')[0].toUpperCase();

  // ── PANEL SWITCHING ───────────────────────────────
  const PANEL_TITLES = {
    dashboard: 'Dashboard',
    'all-news': 'All Articles',
    'new-post': 'New Post',
    settings: 'Settings',
  };

  window.switchPanel = function (name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));

    const panel = document.getElementById('panel-' + name);
    if (panel) panel.classList.add('active');

    const navItem = document.querySelector(`.sidebar-nav-item[data-panel="${name}"]`);
    if (navItem) navItem.classList.add('active');

    document.getElementById('topbar-title').textContent = PANEL_TITLES[name] || name;

    if (name === 'dashboard') renderDashboard();
    if (name === 'all-news') renderAllNews();
    if (name === 'new-post') {
      const editId = document.getElementById('edit-id').value;
      if (!editId) resetForm();
      document.getElementById('topbar-title').textContent = editId ? 'Edit Post' : 'New Post';
    }
  };

  document.querySelectorAll('.sidebar-nav-item[data-panel]').forEach(item => {
    item.addEventListener('click', () => switchPanel(item.dataset.panel));
  });

  // ── LOGOUT ────────────────────────────────────────
  document.getElementById('btn-logout').addEventListener('click', () => {
    HamroDB.logout();
    window.location.href = 'login.html';
  });

  // ── DASHBOARD ─────────────────────────────────────
  function renderDashboard() {
    const stats = HamroDB.getStats();
    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-card red">
        <div class="stat-label">Total Articles</div>
        <div class="stat-val">${stats.total}</div>
        <div class="stat-sub">All time</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Published</div>
        <div class="stat-val">${stats.published}</div>
        <div class="stat-sub">Live on site</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-label">Drafts</div>
        <div class="stat-val">${stats.drafts}</div>
        <div class="stat-sub">Not published</div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">Breaking News</div>
        <div class="stat-val">${stats.breaking}</div>
        <div class="stat-sub">Currently active</div>
      </div>
    `;

    const arts = HamroDB.getArticles().slice(0, 8);
    document.getElementById('recent-tbody').innerHTML = arts.length
      ? arts.map(a => tableRow(a)).join('')
      : '<tr><td colspan="5" style="text-align:center;padding:32px;color:#aaa;">No articles yet</td></tr>';
  }

  // ── ALL NEWS ──────────────────────────────────────
  let allPage = 1;
  const PAGE_SIZE = 10;

  function renderAllNews() {
    const q = document.getElementById('search-input').value;
    const cat = document.getElementById('filter-cat').value;
    const status = document.getElementById('filter-status').value;

    const filter = {};
    if (q) filter.search = q;
    if (cat) filter.category = cat;
    if (status === 'published') filter.published = true;
    if (status === 'draft') filter.published = false;

    const all = HamroDB.getArticles(filter);
    const total = all.length;
    const pages = Math.ceil(total / PAGE_SIZE);
    if (allPage > pages && pages > 0) allPage = pages;

    const slice = all.slice((allPage - 1) * PAGE_SIZE, allPage * PAGE_SIZE);

    document.getElementById('news-count').textContent = `${total} article${total !== 1 ? 's' : ''}`;
    document.getElementById('all-news-tbody').innerHTML = slice.length
      ? slice.map(a => tableRow(a, true)).join('')
      : `<tr><td colspan="6"><div class="empty-state-admin"><div class="es-icon">📭</div><p>No articles found</p></div></td></tr>`;

    // Pagination
    const pg = document.getElementById('pagination');
    if (pages <= 1) { pg.innerHTML = ''; return; }
    let html = `<button class="page-btn" ${allPage===1?'disabled':''} onclick="changePage(${allPage-1})">‹</button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button class="page-btn ${i===allPage?'active':''}" onclick="changePage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" ${allPage===pages?'disabled':''} onclick="changePage(${allPage+1})">›</button>`;
    pg.innerHTML = html;
  }

  window.changePage = function(p) { allPage = p; renderAllNews(); };

  ['search-input','filter-cat','filter-status'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => { allPage = 1; renderAllNews(); });
    document.getElementById(id)?.addEventListener('change', () => { allPage = 1; renderAllNews(); });
  });

  // ── TABLE ROW ─────────────────────────────────────
  function tableRow(a, full = false) {
    const catClass = 'cat-' + a.category;
    const dateStr = new Date(a.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
    const publishToggleLabel = a.published ? 'Unpublish' : 'Publish';

    return `<tr>
      <td class="td-title"><span class="np-title">${esc(a.title)}</span></td>
      <td><span class="category-badge ${catClass}">${esc(a.category)}</span></td>
      ${full ? `<td>${esc(a.author || 'Admin')}</td>` : ''}
      <td>
        <span class="published-dot ${a.published ? 'yes' : 'no'}"></span>
        ${a.published ? 'Published' : 'Draft'}
        ${a.breaking ? ' 🔴' : ''}
      </td>
      <td>${dateStr}</td>
      <td class="td-actions">
        <button class="btn btn-secondary btn-sm" onclick="editArticle('${a.id}')">Edit</button>
        <button class="btn btn-success btn-sm" onclick="togglePublish('${a.id}')">${publishToggleLabel}</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('${a.id}')">Delete</button>
      </td>
    </tr>`;
  }

  // ── IMAGE PREVIEW ─────────────────────────────────
  document.getElementById('f-image')?.addEventListener('input', function() {
    const img = document.getElementById('img-preview');
    const ph = document.getElementById('img-placeholder');
    if (this.value) {
      img.src = this.value;
      img.style.display = 'block';
      ph.style.display = 'none';
      img.onerror = () => { img.style.display = 'none'; ph.style.display = 'block'; ph.textContent = '⚠️ Could not load image'; };
    } else {
      img.style.display = 'none';
      ph.style.display = 'block';
      ph.textContent = '📷 Image preview will appear here';
    }
  });

  // ── SAVE POST ─────────────────────────────────────
  window.savePost = function(publish) {
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('f-title').value.trim();
    const excerpt = document.getElementById('f-excerpt').value.trim();
    const body = document.getElementById('f-body').value.trim();
    const category = document.getElementById('f-category').value;
    const author = document.getElementById('f-author').value.trim() || 'Admin';
    const image = document.getElementById('f-image').value.trim();
    const breaking = document.getElementById('f-breaking').checked;
    const publishedCheck = document.getElementById('f-published').checked;

    if (!title) { showToast('Please enter a title', 'error'); document.getElementById('f-title').focus(); return; }
    if (!excerpt) { showToast('Please enter an excerpt', 'error'); document.getElementById('f-excerpt').focus(); return; }
    if (!body) { showToast('Please enter article body', 'error'); document.getElementById('f-body').focus(); return; }
    if (!category) { showToast('Please select a category', 'error'); document.getElementById('f-category').focus(); return; }

    const isPublished = publish !== undefined ? publish : publishedCheck;

    const article = {
      id: id || HamroDB.generateId(),
      title, excerpt, body, category, author, image, breaking,
      published: isPublished,
      date: id ? (HamroDB.getArticleById(id)?.date || new Date().toISOString()) : new Date().toISOString(),
    };

    HamroDB.saveArticle(article);
    showToast(id ? 'Article updated!' : (isPublished ? 'Article published!' : 'Draft saved!'), 'success');
    resetForm();
    switchPanel('all-news');
  };

  window.editArticle = function(id) {
    const a = HamroDB.getArticleById(id);
    if (!a) return;
    document.getElementById('edit-id').value = a.id;
    document.getElementById('f-title').value = a.title;
    document.getElementById('f-excerpt').value = a.excerpt;
    document.getElementById('f-body').value = a.body;
    document.getElementById('f-category').value = a.category;
    document.getElementById('f-author').value = a.author || '';
    document.getElementById('f-image').value = a.image || '';
    document.getElementById('f-breaking').checked = !!a.breaking;
    document.getElementById('f-published').checked = !!a.published;

    // Trigger image preview
    const imgInput = document.getElementById('f-image');
    imgInput.dispatchEvent(new Event('input'));

    switchPanel('new-post');
    document.getElementById('topbar-title').textContent = 'Edit Post';
  };

  window.resetForm = function() {
    document.getElementById('edit-id').value = '';
    document.getElementById('post-form').reset();
    document.getElementById('img-preview').style.display = 'none';
    document.getElementById('img-placeholder').style.display = 'block';
    document.getElementById('img-placeholder').textContent = '📷 Image preview will appear here';
    document.getElementById('f-published').checked = true;
    document.getElementById('topbar-title').textContent = 'New Post';
  };

  window.togglePublish = function(id) {
    const a = HamroDB.getArticleById(id);
    if (!a) return;
    a.published = !a.published;
    HamroDB.saveArticle(a);
    showToast(a.published ? 'Article published!' : 'Article unpublished', 'success');
    const activePanel = document.querySelector('.panel.active')?.id;
    if (activePanel === 'panel-all-news') renderAllNews();
    if (activePanel === 'panel-dashboard') renderDashboard();
  };

  // ── DELETE ────────────────────────────────────────
  let pendingDeleteId = null;

  window.confirmDelete = function(id) {
    pendingDeleteId = id;
    document.getElementById('confirm-overlay').classList.add('open');
  };
  window.closeConfirm = function() {
    pendingDeleteId = null;
    document.getElementById('confirm-overlay').classList.remove('open');
  };
  document.getElementById('confirm-ok').addEventListener('click', () => {
    if (pendingDeleteId) {
      HamroDB.deleteArticle(pendingDeleteId);
      showToast('Article deleted', 'success');
      closeConfirm();
      const active = document.querySelector('.panel.active')?.id;
      if (active === 'panel-all-news') renderAllNews();
      if (active === 'panel-dashboard') renderDashboard();
    }
  });

  // ── SETTINGS ──────────────────────────────────────
  window.changePassword = function() {
    const cur = document.getElementById('s-cur-pass').value;
    const nw  = document.getElementById('s-new-pass').value;
    const cf  = document.getElementById('s-conf-pass').value;
    const admin = JSON.parse(localStorage.getItem('hamronews_admin') || '{}');
    if (cur !== admin.password) { showToast('Current password is incorrect', 'error'); return; }
    if (!nw || nw.length < 6) { showToast('New password must be at least 6 characters', 'error'); return; }
    if (nw !== cf) { showToast('Passwords do not match', 'error'); return; }
    admin.password = nw;
    localStorage.setItem('hamronews_admin', JSON.stringify(admin));
    showToast('Password updated successfully!', 'success');
    document.getElementById('s-cur-pass').value = '';
    document.getElementById('s-new-pass').value = '';
    document.getElementById('s-conf-pass').value = '';
  };

  // ── TOAST ─────────────────────────────────────────
  window.showToast = function(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    setTimeout(() => t.classList.remove('show'), 3000);
  };

  // ── HELPERS ───────────────────────────────────────
  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── INIT ──────────────────────────────────────────
  renderDashboard();

})();
