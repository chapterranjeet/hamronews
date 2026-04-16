# HamroNews — हाम्रो न्यूज

Nepal's daily news website with a full Admin Panel for content management.

---

## 📁 FILE STRUCTURE

```
hamronews/
│
├── index.html                  ← Public homepage (user-facing)
│
├── css/
│   ├── style.css               ← Public site styles (Nepali newspaper aesthetic)
│   └── admin.css               ← Admin panel styles
│
├── js/
│   ├── db.js                   ← Shared data layer (localStorage CRUD + Auth)
│   ├── main.js                 ← Public site logic (hero, grid, modal, ticker)
│   └── admin.js                ← Admin panel logic (CRUD, dashboard, settings)
│
├── admin/
│   ├── login.html              ← Admin login page
│   └── dashboard.html          ← Admin panel (all panels in one page)
│
└── README.md                   ← This file
```

---

## 🚀 HOW TO USE

### For Users (Public)
1. Open `index.html` in a browser
2. Browse news by category using the top navigation
3. Click any article card to read the full story

### For Admin
1. Open `admin/login.html` (or click "Admin ▸" in the top bar)
2. Login with: **admin** / **hamro@2025**
3. Use the dashboard to:
   - **New Post** — Write and publish news articles
   - **All News** — View, edit, delete, publish/unpublish
   - **Settings** — Change admin password

---

## 🔑 DEFAULT CREDENTIALS
| Username | Password    |
|----------|-------------|
| admin    | hamro@2025  |

> Change the password from Admin Panel → Settings after first login.

---

## ⚙️ TECH STACK

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript   |
| Storage    | localStorage (browser-based)      |
| Fonts      | Tiro Devanagari Nepali, Playfair Display, Source Serif 4 |
| Backend    | None required (runs fully in-browser) |

---

## 📦 FEATURES

### Public Site
- Nepali newspaper aesthetic with crimson & gold theme
- Live date in Nepali (ne-NP locale)
- Breaking news ticker & strip
- Hero section (main story + 3 side cards)
- News grid with category filter
- Full article modal (click to read)
- Mobile responsive

### Admin Panel
- Secure login with session (8-hour timeout)
- Dashboard with stats (total, published, drafts, breaking)
- Write articles with: title, excerpt, body, category, author, image URL
- Mark as Breaking News 🔴
- Publish / Unpublish / Draft toggle
- Search and filter articles
- Pagination
- Change admin password

---

## 🌐 UPGRADING TO A REAL BACKEND

To upgrade from localStorage to a real server:
1. Replace `js/db.js` with API calls (Node.js/Express + MongoDB recommended)
2. Move admin auth to server-side sessions/JWT
3. Add image upload support (Multer + Cloudinary)
4. Host on Vercel, Render, or a Nepal-based server

---

*Built for Nepal 🇳🇵 | नेपालको आफ्नै समाचार*
