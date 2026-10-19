# 🍕 Pizza Bank POS System

A professional, fully-featured Point of Sale system for **Pizza Bank Hotel** — built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, deploys instantly to Vercel.

---

## 📁 Project Structure

```
pizzabank/
├── index.html              ← Main POS / New Order page
├── css/
│   └── style.css           ← Global stylesheet (all pages share this)
├── js/
│   ├── data.js             ← Shared data: menu, inventory, customers, helpers
│   └── sidebar.js          ← Shared sidebar + topbar renderer
├── pages/
│   ├── orders.html         ← Orders list & management
│   ├── kitchen.html        ← Kitchen Display System (KDS) with live timers
│   ├── delivery.html       ← Delivery tracking & riders
│   ├── menu.html           ← Menu CRUD (add/edit/remove items)
│   ├── inventory.html      ← Stock management & restock
│   ├── customers.html      ← Customer profiles & history
│   ├── reports.html        ← Sales analytics & charts
│   └── settings.html       ← System configuration & staff
├── vercel.json             ← Vercel deployment config
└── README.md               ← This file
```

---

## 🚀 Deploy to Vercel (Free)

### Option 1 — Drag & Drop (Easiest)
1. Go to [vercel.com](https://vercel.com) and sign up / log in
2. Click **"Add New → Project"**
3. Drag the entire `pizzabank` folder onto the upload area
4. Click **Deploy** — your POS will be live in ~30 seconds!

### Option 2 — GitHub + Vercel (Best for updates)
1. Create a new GitHub repository
2. Upload all project files to it
3. Go to [vercel.com](https://vercel.com) → **"Add New → Project"**
4. Import your GitHub repository
5. Click **Deploy** — done!

Every time you push changes to GitHub, Vercel auto-deploys.

---

## 💻 Run Locally

Just open `index.html` in any modern browser. No server needed!

```bash
# Or serve with Python (optional)
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🧾 **New Order (POS)** | Menu grid, cart, table selection, KOT, payments |
| 📋 **Orders** | Full order list with status filters & detail view |
| 👨‍🍳 **Kitchen (KDS)** | Live timers, item tick-off, Mark Ready / Bump |
| 🛵 **Delivery** | Active deliveries, rider management, ETA tracking |
| 🍕 **Menu** | Add/edit/remove items, bestseller toggle |
| 📦 **Inventory** | Stock levels, low-stock alerts, restock |
| 👥 **Customers** | Profiles, VIP badges, purchase history |
| 📊 **Reports** | Sales charts, top items, payment breakdown |
| ⚙️ **Settings** | Restaurant info, tax, staff, printer, notifications |

---

## 🎨 Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Grid, Flexbox, dark theme
- **Vanilla JS** — No dependencies, no build step
- **Google Fonts** — Inter + Poppins
- **Vercel** — One-click static deployment

---

Built for **Pizza Bank Hotel** 🍕
