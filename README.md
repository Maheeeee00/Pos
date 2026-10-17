# PizzaBank Hotel · POS

A modern point-of-sale and restaurant management system built with plain HTML, CSS and JavaScript.
No build step and no backend, so it deploys to Vercel in one click.

## Features

- **POS / New Order**: category chips, search, bestseller badges, size variants (Small / Medium / Large), stock-aware ordering
- **Order types**: Dine-in (table picker with occupied tables), Takeaway, Delivery (phone and address)
- **Billing**: discount (% or fixed), tax, service charge, delivery fee, order notes
- **Payments**: Cash (with change calculator), Card, Easypaisa, JazzCash, or pay later
- **Receipts**: 80mm thermal-style receipt with print support
- **Kitchen Display**: live ticket board (New, Preparing, Ready) with timers and late alerts
- **Orders**: filters, search, status flow, collect payment, cancel (stock restored)
- **Dashboard**: today's sales, order count, average order value, 7-day chart, top items, order-type and payment split, stock alerts
- **Menu Management**: add, edit and delete items and categories, sizes, availability toggle
- **Inventory**: stock adjustments, low-stock and out-of-stock alerts, one-click restock
- **Settings**: business name, address, currency, tax %, service %, delivery fee, tables, backup export and import
- Responsive: works on desktop, tablet and phone

Data is stored in the browser (`localStorage`). Demo sales history is generated on first load so the dashboard looks alive.
Use **Settings → Clear all orders** before going live.

## Run locally

Just open `index.html` in a browser, or:

```bash
npx serve .
```

## Deploy to GitHub and Vercel

1. Create a new repository on GitHub and upload all files from this folder (or run `git init`, `git add .`, `git commit -m "PizzaBank POS"`, `git remote add origin <url>`, `git push -u origin main`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Other**. Leave the build command and output directory empty. Click **Deploy**.
4. Share the generated `*.vercel.app` link with your client.

## Customise

- Menu, prices and categories: edit in the app (**Menu Management**) or change defaults in `js/data.js`
- Colours: CSS variables at the top of `css/styles.css` (`--brand`, `--side`, …)
- Business details, taxes and tables: **Settings** page

## Project structure

```
index.html
css/styles.css
js/data.js      default menu, categories and settings
js/app.js       application logic
vercel.json
```

## Production note

This version keeps data per browser, which is ideal for a client demo. For multi-device use (several cashiers plus a kitchen screen), connect it to a backend such as Supabase or Firebase.
