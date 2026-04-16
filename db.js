/**
 * HamroNews — Shared Data Layer (localStorage)
 * db.js — used by both public & admin pages
 */

const HamroDB = (function () {

  const KEYS = {
    NEWS:    'hamronews_articles',
    ADMIN:   'hamronews_admin',
    SESSION: 'hamronews_session',
  };

  // ── SEED DATA ──────────────────────────────────────
  const SEED_ARTICLES = [
    {
      id: 'art_1',
      title: 'नेपालमा नयाँ सरकार गठन: प्रमुख दलहरूबीच सहमति',
      excerpt: 'काठमाडौं — प्रमुख राजनीतिक दलहरूबीच दीर्घ वार्तापछि नयाँ गठबन्धन सरकार गठनमा सहमति जुटेको छ।',
      body: 'काठमाडौं — प्रमुख राजनीतिक दलहरूबीच दीर्घ वार्तापछि नयाँ गठबन्धन सरकार गठनमा सहमति जुटेको छ। यो सहमतिले देशको राजनीतिक स्थिरतामा महत्वपूर्ण भूमिका खेल्नेछ भनी विज्ञहरूले विश्लेषण गरेका छन्। सरकारको नेतृत्वको विषयमा अन्तिम निर्णय केही दिनमा हुने अपेक्षा गरिएको छ। संसदमा विश्वासको मत प्राप्त गर्ने प्रक्रिया शीघ्र सुरु हुनेछ।',
      category: 'राजनीति',
      author: 'Admin',
      date: new Date(Date.now() - 3600000).toISOString(),
      image: '',
      breaking: true,
      published: true,
    },
    {
      id: 'art_2',
      title: 'नेप्से सूचकांकमा उछाल: लगानीकर्ताहरू उत्साहित',
      excerpt: 'काठमाडौं — नेपाल स्टक एक्सचेन्ज (नेप्से) मा आजको कारोबारमा उल्लेखनीय वृद्धि भएको छ।',
      body: 'काठमाडौं — नेपाल स्टक एक्सचेन्ज (नेप्से) मा आजको कारोबारमा उल्लेखनीय वृद्धि भएको छ। सूचकांकले ५० अंकले उछाल लिएको छ र धेरै कम्पनीका सेयरको भाउमा सुधार आएको छ। बैंकिङ र जलविद्युत क्षेत्रका सेयरहरू विशेष गरी राम्रो प्रदर्शन गरिरहेका छन्। बजार विश्लेषकहरूका अनुसार यो प्रवृत्ति अझ केही समय जारी रहने अनुमान छ।',
      category: 'अर्थ',
      author: 'Admin',
      date: new Date(Date.now() - 7200000).toISOString(),
      image: '',
      breaking: false,
      published: true,
    },
    {
      id: 'art_3',
      title: 'क्रिकेट: नेपाल राष्ट्रिय टोलीले ऐतिहासिक जित हासिल गर्यो',
      excerpt: 'काठमाडौं — नेपाल राष्ट्रिय क्रिकेट टोलीले अन्तर्राष्ट्रिय प्रतियोगितामा शानदार जित हासिल गरेको छ।',
      body: 'काठमाडौं — नेपाल राष्ट्रिय क्रिकेट टोलीले अन्तर्राष्ट्रिय प्रतियोगितामा शानदार जित हासिल गरेको छ। यो नेपाली क्रिकेटको इतिहासमा एउटा मील-पत्थर हो। टोलीका कप्तानले यो जितलाई सम्पूर्ण नेपाली जनतालाई समर्पित गरेका छन्। युवा खेलाडीहरूको प्रदर्शन विशेष रूपले उत्कृष्ट रह्यो।',
      category: 'खेलकुद',
      author: 'Admin',
      date: new Date(Date.now() - 10800000).toISOString(),
      image: '',
      breaking: false,
      published: true,
    },
    {
      id: 'art_4',
      title: 'प्रविधि: नेपालमा ५G सेवा विस्तारको तयारी',
      excerpt: 'काठमाडौं — नेपाल दूरसञ्चार प्राधिकरणले देशभर ५G सेवा विस्तारको योजना तयार पारेको छ।',
      body: 'काठमाडौं — नेपाल दूरसञ्चार प्राधिकरणले देशभर ५G सेवा विस्तारको योजना तयार पारेको छ। आगामी दुई वर्षभित्र प्रमुख शहरहरूमा ५G सेवा उपलब्ध गराउने लक्ष्य राखिएको छ। यसले डिजिटल नेपालको सपना साकार पार्न महत्वपूर्ण भूमिका खेल्नेछ।',
      category: 'प्रविधि',
      author: 'Admin',
      date: new Date(Date.now() - 14400000).toISOString(),
      image: '',
      breaking: false,
      published: true,
    },
    {
      id: 'art_5',
      title: 'स्वास्थ्य: डेंगी रोगको प्रकोप नियन्त्रणमा सरकारको कदम',
      excerpt: 'काठमाडौं — देशमा डेंगी रोगको बढ्दो प्रकोपलाई नियन्त्रण गर्न स्वास्थ्य मन्त्रालयले विशेष अभियान सुरु गरेको छ।',
      body: 'काठमाडौं — देशमा डेंगी रोगको बढ्दो प्रकोपलाई नियन्त्रण गर्न स्वास्थ्य मन्त्रालयले विशेष अभियान सुरु गरेको छ। लामखुट्टेको प्रजनन स्थल नष्ट गर्ने र जनचेतना अभिवृद्धि गर्ने कार्यक्रम सुरु भएको छ। नागरिकहरूलाई घरवरपर पानी जम्न नदिन आग्रह गरिएको छ।',
      category: 'स्वास्थ्य',
      author: 'Admin',
      date: new Date(Date.now() - 18000000).toISOString(),
      image: '',
      breaking: false,
      published: true,
    },
    {
      id: 'art_6',
      title: 'मनोरञ्जन: नेपाली चलचित्र अन्तर्राष्ट्रिय महोत्सवमा पुरस्कृत',
      excerpt: 'काठमाडौं — एक नेपाली चलचित्रले अन्तर्राष्ट्रिय फिल्म महोत्सवमा उत्कृष्ट चलचित्रको पुरस्कार जितेको छ।',
      body: 'काठमाडौं — एक नेपाली चलचित्रले अन्तर्राष्ट्रिय फिल्म महोत्सवमा उत्कृष्ट चलचित्रको पुरस्कार जितेको छ। यो नेपाली चलचित्र उद्योगका लागि गर्वको क्षण हो। चलचित्रका निर्देशकले नेपाली समाजको यथार्थ चित्रण गर्ने प्रयास गरेको बताए। यस सफलताले नेपाली चलचित्रलाई विश्व मञ्चमा नयाँ पहिचान दिलाउनेछ।',
      category: 'मनोरञ्जन',
      author: 'Admin',
      date: new Date(Date.now() - 21600000).toISOString(),
      image: '',
      breaking: false,
      published: true,
    },
  ];

  const SEED_ADMIN = { username: 'admin', password: 'hamro@2025' };

  // ── INIT ────────────────────────────────────────────
  function init() {
    if (!localStorage.getItem(KEYS.NEWS)) {
      localStorage.setItem(KEYS.NEWS, JSON.stringify(SEED_ARTICLES));
    }
    if (!localStorage.getItem(KEYS.ADMIN)) {
      localStorage.setItem(KEYS.ADMIN, JSON.stringify(SEED_ADMIN));
    }
  }

  // ── ARTICLES ────────────────────────────────────────
  function getArticles(filter = {}) {
    const all = JSON.parse(localStorage.getItem(KEYS.NEWS) || '[]');
    let result = [...all].sort((a,b) => new Date(b.date) - new Date(a.date));
    if (filter.published !== undefined) result = result.filter(a => a.published === filter.published);
    if (filter.category) result = result.filter(a => a.category === filter.category);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    return result;
  }

  function getArticleById(id) {
    return getArticles().find(a => a.id === id) || null;
  }

  function saveArticle(data) {
    const all = JSON.parse(localStorage.getItem(KEYS.NEWS) || '[]');
    const idx = all.findIndex(a => a.id === data.id);
    if (idx > -1) { all[idx] = data; }
    else { all.push(data); }
    localStorage.setItem(KEYS.NEWS, JSON.stringify(all));
    return data;
  }

  function deleteArticle(id) {
    let all = JSON.parse(localStorage.getItem(KEYS.NEWS) || '[]');
    all = all.filter(a => a.id !== id);
    localStorage.setItem(KEYS.NEWS, JSON.stringify(all));
  }

  function generateId() {
    return 'art_' + Date.now() + '_' + Math.random().toString(36).substr(2,5);
  }

  // ── AUTH ────────────────────────────────────────────
  function getAdmin() {
    return JSON.parse(localStorage.getItem(KEYS.ADMIN) || '{}');
  }

  function login(username, password) {
    const admin = getAdmin();
    if (admin.username === username && admin.password === password) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify({ loggedIn: true, username, time: Date.now() }));
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(KEYS.SESSION);
  }

  function isLoggedIn() {
    const s = JSON.parse(localStorage.getItem(KEYS.SESSION) || '{}');
    if (!s.loggedIn) return false;
    // 8 hour session
    if (Date.now() - s.time > 8 * 60 * 60 * 1000) { logout(); return false; }
    return true;
  }

  function getSession() {
    return JSON.parse(localStorage.getItem(KEYS.SESSION) || '{}');
  }

  // ── STATS ────────────────────────────────────────────
  function getStats() {
    const all = getArticles();
    const published = all.filter(a => a.published).length;
    const drafts = all.filter(a => !a.published).length;
    const breaking = all.filter(a => a.breaking && a.published).length;
    const cats = {};
    all.forEach(a => { cats[a.category] = (cats[a.category] || 0) + 1; });
    return { total: all.length, published, drafts, breaking, categories: cats };
  }

  init();

  return { getArticles, getArticleById, saveArticle, deleteArticle, generateId, login, logout, isLoggedIn, getSession, getStats };

})();
