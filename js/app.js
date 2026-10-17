/* PizzaBank Hotel POS - application logic (vanilla JS, no build step) */
(function () {
  'use strict';

  var D = window.PB_DATA;
  var KEY = 'pizzabank_pos_v1';

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var sod = function (t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  var timeStr = function (t) { return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); };
  var dateStr = function (t) { return new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); };
  var dayShort = function (t) { return new Date(t).toLocaleDateString('en-US', { weekday: 'short' }); };
  var ago = function (t) {
    var m = Math.floor((Date.now() - t) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
  };
  var shortNum = function (n) {
    if (n >= 100000) return (n / 1000).toFixed(0) + 'k';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return String(Math.round(n));
  };

  var ICON = {
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    pos: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    orders: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    kitchen: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    menu: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    inventory: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    settings: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    trend: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    navigate: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>'
  };
  var ic = function (n, s) {
    s = s || 18;
    return '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICON[n] || '') + '</svg>';
  };

  /* ---------- state ---------- */
  var S = load();
  var ui = {
    cat: 'all', q: '', ostatus: 'active', oq: '', odate: 'today',
    inv: 'all', mcat: 'all', mq: '', cartOpen: false, brq: '', brsvc: 'all', br: ''
  };
  var cur = 'dashboard';
  var pay = null;

  function blankCart() {
    return { type: 'dine-in', table: '', cust: { name: '', phone: '', address: '' }, items: [], dt: 'percent', dv: 0, note: '' };
  }

  function load() {
    try {
      var r = JSON.parse(localStorage.getItem(KEY));
      if (r && r.v === 1 && r.menu && r.orders) {
        if (!r.cart) r.cart = blankCart();
        var oldDemo = r.branches && r.branches.length && r.branches.every(function (b) { return b.city === 'Your City' && /^\+92 300 000000\d$/.test(b.phone); });
        if (!r.branches || !r.branches.length || oldDemo) {
          r.branches = defaultBranches(); r.settings.currentBranch = r.branches[0].id;
          if (/Your City/.test(r.settings.address || '')) r.settings.address = D.settings.address;
          if (r.settings.phone === '+92 300 0000000') r.settings.phone = '';
        }
        if (!r.settings.currentBranch) r.settings.currentBranch = r.branches[0].id;
        return r;
      }
    } catch (e) { /* ignore */ }
    return seed();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ } }

  function rng(seedv) {
    var a = seedv;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function calc(items, type, dt, dv, st) {
    st = st || S.settings;
    var sub = items.reduce(function (a, i) { return a + i.price * i.qty; }, 0);
    var disc = dt === 'percent' ? sub * (Number(dv) || 0) / 100 : (Number(dv) || 0);
    disc = Math.min(Math.max(disc, 0), sub);
    var taxable = sub - disc;
    var tax = taxable * st.taxRate / 100;
    var service = type === 'dine-in' ? taxable * st.serviceRate / 100 : 0;
    var delivery = (type === 'delivery' && sub > 0) ? st.deliveryFee : 0;
    return { sub: sub, disc: disc, tax: tax, service: service, delivery: delivery, total: taxable + tax + service + delivery };
  }

  function seed() {
    var st = {
      v: 1, settings: clone(D.settings), categories: clone(D.categories), menu: clone(D.menu),
      orders: [], nextOrder: 1001, cart: blankCart(), branches: defaultBranches()
    };
    st.orders = history(st);
    st.settings.currentBranch = st.branches[0].id;
    st.nextOrder = st.orders.reduce(function (m, o) { return Math.max(m, o.no); }, 1000) + 1;
    return st;
  }

  function history(st) {
    var r = rng(2026), now = Date.now(), out = [];
    var pool = st.menu.filter(function (m) { return m.active && m.cat !== 'deals'; });
    var types = ['dine-in', 'dine-in', 'dine-in', 'dine-in', 'dine-in', 'takeaway', 'takeaway', 'delivery', 'delivery', 'delivery'];
    var methods = ['cash', 'cash', 'cash', 'cash', 'card', 'card', 'card', 'easypaisa', 'jazzcash'];
    var names = ['Ahmed Raza', 'Sara Khan', 'Bilal Hussain', 'Ayesha Malik', 'Usman Ali', 'Hina Tariq', 'Zeeshan Butt', 'Fatima Noor', 'Hamza Sheikh', 'Maryam Iqbal'];

    function mk(ts, status, paid) {
      var count = 1 + Math.floor(r() * 3.6), items = [], used = {};
      for (var k = 0; k < count; k++) {
        var m;
        do { m = pool[Math.floor(Math.pow(r(), 1.25) * pool.length)]; } while (used[m.id]);
        used[m.id] = 1;
        var v = m.variants ? m.variants[Math.floor(r() * m.variants.length)] : null;
        items.push({ id: m.id, name: m.name, variant: v ? v.n : '', price: v ? v.p : m.price, qty: r() < 0.78 ? 1 : 2, emoji: m.emoji });
      }
      var type = types[Math.floor(r() * types.length)];
      var dt = 'percent', dv = r() < 0.12 ? 10 : 0;
      var t = calc(items, type, dt, dv, st.settings);
      var nm = names[Math.floor(r() * names.length)];
      var o = {
        id: 'o' + ts, no: 0, type: type,
        table: type === 'dine-in' ? 'T' + (1 + Math.floor(r() * st.settings.tables)) : '',
        cust: type === 'dine-in' ? { name: '', phone: '', address: '' } : { name: nm, phone: '03' + (10 + Math.floor(r() * 40)) + String(1000000 + Math.floor(r() * 8999999)), address: type === 'delivery' ? 'House ' + (1 + Math.floor(r() * 90)) + ', Street ' + (1 + Math.floor(r() * 20)) : '' },
        items: items, dt: dt, dv: dv, sub: t.sub, disc: t.disc, tax: t.tax, service: t.service, delivery: t.delivery, total: t.total,
        note: '', status: status, paid: paid, payment: null, createdAt: ts, updatedAt: ts + 25 * 60000
      };
      if (paid) o.payment = { method: methods[Math.floor(r() * methods.length)], tendered: t.total, change: 0 };
      return o;
    }

    for (var d = 13; d >= 0; d--) {
      var day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - d);
      var dow = day.getDay();
      var n = Math.round(15 + r() * 10 + ((dow === 5 || dow === 6 || dow === 0) ? 10 : 0));
      for (var k2 = 0; k2 < n; k2++) {
        var t0 = new Date(day.getTime());
        t0.setMinutes(12 * 60 + Math.floor(r() * (11.5 * 60)));
        if (t0.getTime() > now - 30 * 60000) continue;
        out.push(mk(t0.getTime(), 'completed', true));
      }
    }
    // a few live orders for today
    var live = [['new', false, 4], ['new', false, 9], ['preparing', false, 14], ['ready', true, 21]];
    live.forEach(function (l) { out.push(mk(now - l[2] * 60000, l[0], l[1])); });
    out.sort(function (a, b) { return a.createdAt - b.createdAt; });
    out.forEach(function (o, i) { o.no = 1001 + i; });
    return out;
  }

  /* ---------- lookups ---------- */
  var menuItem = function (id) { return S.menu.filter(function (m) { return m.id === id; })[0]; };
  var catOf = function (id) { return S.categories.filter(function (c) { return c.id === id; })[0]; };
  var orderById = function (id) { return S.orders.filter(function (o) { return o.id === id; })[0]; };
  var fmt = function (n) { return S.settings.currency + ' ' + Math.round(n).toLocaleString('en-US'); };
  var isActive = function (o) { return o.status === 'new' || o.status === 'preparing' || o.status === 'ready'; };
  var STATUS_LABEL = { new: 'New', preparing: 'Preparing', ready: 'Ready', completed: 'Completed', cancelled: 'Cancelled' };
  var TYPE_LABEL = { 'dine-in': 'Dine-in', takeaway: 'Takeaway', delivery: 'Delivery' };
  var METHOD = { cash: ['Cash', '💵'], card: ['Card', '💳'], easypaisa: ['Easypaisa', '📱'], jazzcash: ['JazzCash', '📲'] };
  var tint = function (hex) { return hex + '22'; };

  function toast(msg, kind) {
    var el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.innerHTML = (kind === 'ok' ? ic('check', 16) : kind === 'warn' || kind === 'err' ? ic('alert', 16) : '') + '<span>' + esc(msg) + '</span>';
    $('#toast-root').appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transition = '.3s'; }, 2600);
    setTimeout(function () { el.remove(); }, 3000);
  }

  function openModal(html, cls) {
    $('#modal-root').innerHTML = '<div class="overlay" data-act="overlay"><div class="modal ' + (cls || '') + '">' + html + '</div></div>';
  }
  function closeModal() { $('#modal-root').innerHTML = ''; pay = null; }
  function modalHead(title) {
    return '<div class="modal-h"><h3>' + title + '</h3><button class="btn sm icon" data-act="modal-close" aria-label="Close">' + ic('x', 16) + '</button></div>';
  }

  /* ---------- chrome (sidebar + topbar) ---------- */
  var NAV = [
    ['OPERATIONS', [['dashboard', 'Overview', 'grid'], ['pos', 'POS / New Order', 'pos'], ['orders', 'Orders', 'orders'], ['kitchen', 'Kitchen Display', 'kitchen'], ['locator', 'Store Locator', 'pin']]],
    ['CATALOG & STOCK', [['menu', 'Menu Management', 'menu'], ['inventory', 'Inventory', 'inventory']]],
    ['SYSTEM', [['settings', 'Settings', 'settings']]]
  ];
  var TITLES = {
    dashboard: ['Overview', 'Live performance of your restaurant'],
    pos: ['Point of Sale', 'Dine-in, takeaway and delivery orders'],
    orders: ['Orders', 'Track, collect payment and print receipts'],
    kitchen: ['Kitchen Display', 'Live tickets for the kitchen team'],
    locator: ['Store Locator', 'Branches, opening hours, map and directions'],
    menu: ['Menu Management', 'Items, prices, sizes and categories'],
    inventory: ['Inventory', 'Stock levels and low-stock alerts'],
    settings: ['Settings', 'Business details, taxes and data']
  };

  function renderChrome() {
    var active = S.orders.filter(isActive).length;
    var newCount = S.orders.filter(function (o) { return o.status === 'new'; }).length;
    var h = '<div class="brand"><div class="logo">🍕</div><div><b>' + esc(S.settings.name) + '</b><small>POS &amp; Restaurant Management</small></div></div><nav class="nav">';
    NAV.forEach(function (g) {
      h += '<div class="nav-label">' + g[0] + '</div>';
      g[1].forEach(function (n) {
        var badge = '';
        if (n[0] === 'orders' && active) badge = '<span class="badge">' + active + '</span>';
        if (n[0] === 'kitchen' && newCount) badge = '<span class="badge g">' + newCount + '</span>';
        h += '<a href="#/' + n[0] + '" class="' + (cur === n[0] ? 'on' : '') + '">' + ic(n[2], 19) + '<span>' + n[1] + '</span>' + badge + '</a>';
      });
    });
    h += '</nav><div class="side-foot"><div class="avatar">AD</div><div><b>Admin</b><small><i class="dot"></i> Cashier counter 1</small></div></div>';
    $('#sidebar').innerHTML = h;

    var t = TITLES[cur];
    $('#topbar').innerHTML = '<div><h1>' + t[0] + '</h1><div class="sub">' + t[1] + '</div></div><div class="sp"></div>' +
      '<a href="#/locator" class="pill hide-s" title="Current counter branch">' + ic('pin', 15) + esc(curBranch().name) + '</a>' +
      '<span class="pill hide-s">' + ic('clock', 15) + '<span id="clock"></span></span>' +
      '<span class="pill ok"><i class="dot"></i> Saved locally</span>';
    tick();
  }
  function tick() {
    var c = $('#clock');
    if (c) c.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) + ' · ' + timeStr(Date.now());
  }

  /* ---------- routing ---------- */
  var VIEWS = {};
  function route() {
    var h = (location.hash || '').replace('#/', '');
    cur = VIEWS[h] ? h : 'dashboard';
    ui.cartOpen = false;
    var v = $('#view');
    v.className = 'view' + (cur === 'pos' ? ' pos-view' : '');
    renderChrome();
    VIEWS[cur]();
    v.scrollTop = 0;
  }
  function rerender() {
    renderChrome();
    VIEWS[cur]();
  }

  /* ======================================================================
     DASHBOARD
     ====================================================================== */
  VIEWS.dashboard = function () {
    var now = Date.now(), today = sod(now);
    var valid = S.orders.filter(function (o) { return o.status !== 'cancelled'; });
    var tOrders = valid.filter(function (o) { return sod(o.createdAt) === today; });
    var tSales = tOrders.filter(function (o) { return o.paid; }).reduce(function (a, o) { return a + o.total; }, 0);
    var pending = tOrders.filter(function (o) { return !o.paid; }).reduce(function (a, o) { return a + o.total; }, 0);
    var avg = tOrders.length ? tOrders.reduce(function (a, o) { return a + o.total; }, 0) / tOrders.length : 0;
    var activeN = S.orders.filter(isActive).length;

    // yesterday comparison
    var yest = today - 86400000;
    var ySales = valid.filter(function (o) { return sod(o.createdAt) === yest && o.paid; }).reduce(function (a, o) { return a + o.total; }, 0);
    var diff = ySales ? Math.round((tSales - ySales) / ySales * 100) : 0;
    var diffTxt = ySales ? ((diff >= 0 ? '▲ ' : '▼ ') + Math.abs(diff) + '% vs yesterday') : 'No data yesterday';

    // 7 days
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var ds = today - i * 86400000;
      var tot = valid.filter(function (o) { return sod(o.createdAt) === ds && o.paid; }).reduce(function (a, o) { return a + o.total; }, 0);
      days.push({ t: ds, v: tot });
    }
    var week = valid.filter(function (o) { return o.createdAt >= today - 6 * 86400000; });

    // top items
    var agg = {};
    week.forEach(function (o) { o.items.forEach(function (i) { agg[i.name] = agg[i.name] || { q: 0, r: 0, e: i.emoji }; agg[i.name].q += i.qty; agg[i.name].r += i.qty * i.price; }); });
    var top = Object.keys(agg).map(function (k) { return { n: k, q: agg[k].q, r: agg[k].r, e: agg[k].e }; }).sort(function (a, b) { return b.q - a.q; }).slice(0, 6);
    var topMax = top.length ? top[0].q : 1;

    // splits (7d)
    var typeSplit = { 'dine-in': 0, takeaway: 0, delivery: 0 }, paySplit = { cash: 0, card: 0, easypaisa: 0, jazzcash: 0 };
    week.forEach(function (o) { typeSplit[o.type] += o.total; if (o.paid && o.payment) paySplit[o.payment.method] = (paySplit[o.payment.method] || 0) + o.total; });

    var low = S.menu.filter(function (m) { return m.stock <= S.settings.lowStock; }).sort(function (a, b) { return a.stock - b.stock; });
    var recent = S.orders.slice().sort(function (a, b) { return b.createdAt - a.createdAt; }).slice(0, 7);

    var kpi = function (label, val, sub, icn, bg, fg) {
      return '<div class="card kpi"><div class="k-ic" style="background:' + bg + ';color:' + fg + '">' + ic(icn, 22) + '</div><div><small>' + label + '</small><b>' + val + '</b><i>' + sub + '</i></div></div>';
    };

    var h = '<div class="kpis">' +
      kpi("Today's Sales", fmt(tSales), diffTxt, 'dollar', '#ecfdf3', '#067647') +
      kpi('Orders Today', tOrders.length, fmt(pending) + ' awaiting payment', 'orders', '#eff8ff', '#175cd3') +
      kpi('Avg. Order Value', fmt(avg), 'Per order today', 'trend', '#f4f3ff', '#5925dc') +
      kpi('Active Orders', activeN, 'In kitchen right now', 'flame', '#fef3f2', '#b42318') + '</div>';

    h += '<div class="dash-grid"><div class="card"><div class="card-h"><h3>Sales – last 7 days</h3><span class="tag">' + fmt(days.reduce(function (a, d) { return a + d.v; }, 0)) + '</span></div><div class="card-b chart">' + barChart(days) + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>Top selling items</h3><span class="muted" style="font-size:12px">7 days</span></div><div class="card-b">' +
      (top.length ? top.map(function (t) {
        return '<div class="hbar"><div class="t"><b>' + t.e + ' ' + esc(t.n) + '</b><span>' + t.q + ' sold</span></div><div class="track"><i style="width:' + Math.round(t.q / topMax * 100) + '%"></i></div></div>';
      }).join('') : '<div class="empty">No sales yet</div>') + '</div></div></div>';

    var typeColors = { 'dine-in': '#d92d20', takeaway: '#f79009', delivery: '#2e90fa' };
    var payColors = { cash: '#12b76a', card: '#7a5af8', easypaisa: '#2e90fa', jazzcash: '#f79009' };
    h += '<div class="dash-grid b">' +
      '<div class="card"><div class="card-h"><h3>Order types</h3></div><div class="card-b">' + splitBlock(typeSplit, typeColors, TYPE_LABEL) + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>Payment methods</h3></div><div class="card-b">' + splitBlock(paySplit, payColors, { cash: 'Cash', card: 'Card', easypaisa: 'Easypaisa', jazzcash: 'JazzCash' }) + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>Stock alerts</h3><a href="#/inventory" class="tag low">' + low.length + ' items</a></div><div class="card-b">' +
      (low.length ? low.slice(0, 6).map(function (m) {
        return '<div class="alert-row"><span style="font-size:20px">' + m.emoji + '</span><b style="font-size:13px;flex:1">' + esc(m.name) + '</b><span class="tag ' + (m.stock === 0 ? 'out' : 'low') + '">' + (m.stock === 0 ? 'Out' : m.stock + ' left') + '</span></div>';
      }).join('') : '<div class="empty" style="padding:20px">All items well stocked ✅</div>') + '</div></div></div>';

    h += '<div class="card"><div class="card-h"><h3>Recent orders</h3><a class="btn sm" href="#/orders">View all</a></div><div class="table-wrap"><table><thead><tr><th>Order</th><th>Time</th><th>Type</th><th>Items</th><th class="num">Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>' +
      recent.map(function (o) {
        return '<tr><td><b>#' + o.no + '</b></td><td>' + timeStr(o.createdAt) + '</td><td>' + typeCell(o) + '</td><td>' + o.items.reduce(function (a, i) { return a + i.qty; }, 0) + '</td><td class="num"><b>' + fmt(o.total) + '</b></td><td>' + payTag(o) + '</td><td><span class="tag ' + o.status + '">' + STATUS_LABEL[o.status] + '</span></td></tr>';
      }).join('') + '</tbody></table></div></div>';

    $('#view').innerHTML = h;
  };

  function typeCell(o) {
    return TYPE_LABEL[o.type] + (o.type === 'dine-in' && o.table ? ' · ' + esc(o.table) : '') + (o.cust && o.cust.name ? '<div class="muted" style="font-size:12px">' + esc(o.cust.name) + '</div>' : '');
  }
  function payTag(o) {
    if (o.status === 'cancelled') return '<span class="muted">—</span>';
    return o.paid ? '<span class="tag paid">Paid · ' + (o.payment ? METHOD[o.payment.method][0] : '') + '</span>' : '<span class="tag unpaid">Unpaid</span>';
  }

  function splitBlock(data, colors, labels) {
    var keys = Object.keys(data), total = keys.reduce(function (a, k) { return a + data[k]; }, 0);
    if (!total) return '<div class="empty" style="padding:20px">No data yet</div>';
    return '<div class="stackbar">' + keys.map(function (k) { return '<i style="width:' + (data[k] / total * 100) + '%;background:' + colors[k] + '"></i>'; }).join('') + '</div>' +
      '<div class="legend">' + keys.map(function (k) {
        return '<div><i style="background:' + colors[k] + '"></i>' + labels[k] + '<b>' + Math.round(data[k] / total * 100) + '%</b></div>';
      }).join('') + '</div>';
  }

  function barChart(days) {
    var W = 560, H = 230, pl = 8, pb = 28, pt = 22, max = Math.max.apply(null, days.map(function (d) { return d.v; })) || 1;
    var bw = (W - pl * 2) / days.length, h = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Sales for the last 7 days">';
    h += '<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f79009"/></linearGradient></defs>';
    [0.25, 0.5, 0.75, 1].forEach(function (g) {
      var y = H - pb - (H - pb - pt) * g;
      h += '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#eef0f4"/>';
    });
    days.forEach(function (d, i) {
      var bh = (H - pb - pt) * d.v / max, x = pl + i * bw + bw * 0.2, w = bw * 0.6, y = H - pb - bh;
      h += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + Math.max(bh, 2) + '" rx="7" fill="' + (i === days.length - 1 ? 'url(#bg)' : '#fda29b') + '"/>';
      h += '<text x="' + (x + w / 2) + '" y="' + (y - 7) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">' + shortNum(d.v) + '</text>';
      h += '<text x="' + (x + w / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="12" fill="#64748b">' + (i === days.length - 1 ? 'Today' : dayShort(d.t)) + '</text>';
    });
    return h + '</svg>';
  }

  /* ======================================================================
     POS
     ====================================================================== */
  VIEWS.pos = function () {
    $('#view').innerHTML =
      '<div class="pos"><section class="pos-main">' +
      '<div class="row"><div class="search">' + ic('search', 17) + '<input id="pos-q" class="input" placeholder="Search menu items…" value="' + esc(ui.q) + '" data-in="posq" autocomplete="off"></div></div>' +
      '<div class="chips" id="chips"></div><div class="menu-grid" id="grid"></div></section>' +
      '<aside class="cart" id="cart"></aside></div>' +
      '<button class="cart-fab" data-act="cart-open">' + ic('bag', 20) + ' <span>View order</span><span class="n" id="fab-n">0</span></button>';
    renderChips(); renderGrid(); renderCart();
  };

  function renderChips() {
    var all = S.menu.filter(function (m) { return m.active; });
    var h = '<button class="chip ' + (ui.cat === 'all' ? 'on' : '') + '" data-act="cat" data-id="all">🍽️ All <small>' + all.length + '</small></button>';
    S.categories.forEach(function (c) {
      var n = all.filter(function (m) { return m.cat === c.id; }).length;
      h += '<button class="chip ' + (ui.cat === c.id ? 'on' : '') + '" data-act="cat" data-id="' + c.id + '">' + c.emoji + ' ' + esc(c.name) + ' <small>' + n + '</small></button>';
    });
    $('#chips').innerHTML = h;
  }

  function renderGrid() {
    var q = ui.q.trim().toLowerCase();
    var list = S.menu.filter(function (m) {
      return m.active && (ui.cat === 'all' || m.cat === ui.cat) && (!q || (m.name + ' ' + m.desc).toLowerCase().indexOf(q) > -1);
    });
    if (!list.length) { $('#grid').innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="big">🔍</div>No items found</div>'; return; }
    $('#grid').innerHTML = list.map(function (m) {
      var c = catOf(m.cat) || { color: '#94a3b8' };
      var off = m.stock <= 0;
      return '<button class="item ' + (off ? 'off' : '') + '" data-act="add" data-id="' + m.id + '">' +
        '<div class="pic" style="background:linear-gradient(135deg,' + tint(c.color) + ',' + c.color + '44)">' + m.emoji +
        (m.best ? '<span class="best">★ BESTSELLER</span>' : '') + '<span class="prep">⏱ ' + m.prep + 'm</span></div>' +
        '<div class="info"><h4>' + esc(m.name) + '</h4><p>' + esc(m.desc) + '</p>' +
        '<div class="foot"><span class="price">' + (m.variants ? '<small>from</small>' : '') + fmt(m.price) + '</span>' +
        (off ? '<span class="tag out">Sold out</span>' : (m.stock <= S.settings.lowStock ? '<span class="stk">' + m.stock + ' left</span>' : '<span class="add">' + ic('plus', 16) + '</span>')) +
        '</div></div></button>';
    }).join('');
  }

  function busyTables() {
    var b = {};
    S.orders.forEach(function (o) { if (o.type === 'dine-in' && o.table && o.status !== 'cancelled' && (isActive(o) || !o.paid)) b[o.table] = true; });
    return b;
  }

  function sumRows(t, c) {
    return '<div><span>Subtotal</span><span>' + fmt(t.sub) + '</span></div>' +
      (t.disc ? '<div><span>Discount</span><span>- ' + fmt(t.disc) + '</span></div>' : '') +
      '<div><span>Tax (' + S.settings.taxRate + '%)</span><span>' + fmt(t.tax) + '</span></div>' +
      (c.type === 'dine-in' && S.settings.serviceRate ? '<div><span>Service (' + S.settings.serviceRate + '%)</span><span>' + fmt(t.service) + '</span></div>' : '') +
      (t.delivery ? '<div><span>Delivery fee</span><span>' + fmt(t.delivery) + '</span></div>' : '');
  }

  function renderCart() {
    var c = S.cart, t = calc(c.items, c.type, c.dt, c.dv);
    var qtyN = c.items.reduce(function (a, i) { return a + i.qty; }, 0);
    var h = '<div class="cart-h"><div class="r1"><div><h3>Current Order</h3><small class="muted">Order #' + S.nextOrder + ' · ' + qtyN + ' item' + (qtyN === 1 ? '' : 's') + '</small></div>' +
      '<div class="row" style="gap:6px">' + (c.items.length ? '<button class="btn sm danger" data-act="clear-cart">' + ic('trash', 14) + ' Clear</button>' : '') +
      '<button class="btn sm icon cart-close-btn" data-act="cart-close" style="display:' + (window.innerWidth <= 1200 ? 'inline-flex' : 'none') + '">' + ic('x', 15) + '</button></div></div>' +
      '<div class="seg">' + ['dine-in', 'takeaway', 'delivery'].map(function (k) {
        return '<button class="' + (c.type === k ? 'on' : '') + '" data-act="otype" data-id="' + k + '">' + { 'dine-in': '🍽️', takeaway: '🛍️', delivery: '🛵' }[k] + ' ' + TYPE_LABEL[k] + '</button>';
      }).join('') + '</div></div>';

    h += '<div class="cart-scroll">';
    h += '<div class="cart-ctx">';
    if (c.type === 'dine-in') {
      var busy = busyTables(), tb = '';
      for (var i = 1; i <= S.settings.tables; i++) {
        var id = 'T' + i;
        tb += '<button class="' + (c.table === id ? 'on' : (busy[id] ? 'busy' : '')) + '" data-act="table" data-id="' + id + '" title="' + (busy[id] ? 'Occupied' : 'Free') + '">' + id + '</button>';
      }
      h += '<label class="f">Select table <span class="muted" style="font-weight:500">(amber = occupied)</span></label><div class="tables">' + tb + '</div>';
    } else {
      h += '<div class="grid2"><div><label class="f">Customer name</label><input class="input" data-bind="name" value="' + esc(c.cust.name) + '" placeholder="Optional"></div>' +
        '<div><label class="f">Phone' + (c.type === 'delivery' ? ' *' : '') + '</label><input class="input" data-bind="phone" value="' + esc(c.cust.phone) + '" placeholder="03xx xxxxxxx" inputmode="tel"></div></div>';
      if (c.type === 'delivery') h += '<div style="margin-top:10px"><label class="f">Delivery address *</label><input class="input" data-bind="address" value="' + esc(c.cust.address) + '" placeholder="House, street, area"></div>';
    }
    h += '</div>';

    h += '<div class="cart-items">';
    if (!c.items.length) {
      h += '<div class="cart-empty"><div><div class="big">🛒</div><b>No items yet</b><div style="font-size:12.5px;margin-top:4px">Tap a menu item to add it to the order</div></div></div>';
    } else {
      c.items.forEach(function (i) {
        h += '<div class="line"><div class="emo">' + i.emoji + '</div><div><b>' + esc(i.name) + '</b><small>' + (i.variant ? esc(i.variant) + ' · ' : '') + fmt(i.price) + '</small>' +
          '<div class="qty"><button data-act="qty" data-id="' + esc(i.key) + '" data-d="-1" aria-label="Decrease">' + ic('minus', 14) + '</button><span>' + i.qty + '</span><button data-act="qty" data-id="' + esc(i.key) + '" data-d="1" aria-label="Increase">' + ic('plus', 14) + '</button></div></div>' +
          '<div class="amt">' + fmt(i.price * i.qty) + '<br><button class="rm" data-act="rm" data-id="' + esc(i.key) + '" aria-label="Remove">' + ic('trash', 15) + '</button></div></div>';
      });
    }
    h += '</div>';

    h += '<div class="cart-opts"><div class="disc"><select class="select" data-bind="dt"><option value="percent"' + (c.dt === 'percent' ? ' selected' : '') + '>Discount %</option><option value="amount"' + (c.dt === 'amount' ? ' selected' : '') + '>Discount ' + esc(S.settings.currency) + '</option></select>' +
      '<input class="input" type="number" min="0" data-bind="dv" value="' + (c.dv || '') + '" placeholder="0"></div>' +
      '<input class="input" data-bind="note" value="' + esc(c.note) + '" placeholder="Order note (e.g. no onions, extra spicy)"></div>' +
      '<div class="sum">' + sumRows(t, c) + '</div></div>';
    h += '<div class="cart-f"><div class="tot-row"><span>Total</span><span>' + fmt(t.total) + '</span></div>' +
      '<div class="cart-actions"><button class="btn" data-act="hold" ' + (c.items.length ? '' : 'disabled') + '>' + ic('flame', 16) + ' Send to Kitchen</button>' +
      '<button class="btn primary" data-act="charge" ' + (c.items.length ? '' : 'disabled') + '>' + ic('dollar', 16) + ' Charge ' + fmt(t.total) + '</button></div></div>';

    var el = $('#cart');
    if (!el) return;
    var oldScroll = $('.cart-scroll', el), keep = oldScroll ? oldScroll.scrollTop : 0;
    el.innerHTML = h;
    var newScroll = $('.cart-scroll', el); if (newScroll) newScroll.scrollTop = keep;
    el.classList.toggle('open', ui.cartOpen);
    var fab = $('#fab-n'); if (fab) fab.textContent = qtyN;
  }

  function addToCart(id, vi) {
    var m = menuItem(id); if (!m || !m.active) return;
    var v = m.variants ? m.variants[vi] : null;
    var key = id + (v ? ':' + vi : '');
    var inCart = S.cart.items.filter(function (i) { return i.id === id; }).reduce(function (a, i) { return a + i.qty; }, 0);
    if (inCart >= m.stock) { toast('Only ' + m.stock + ' of ' + m.name + ' in stock', 'warn'); return; }
    var line = S.cart.items.filter(function (i) { return i.key === key; })[0];
    if (line) line.qty++;
    else S.cart.items.push({ key: key, id: id, name: m.name, variant: v ? v.n : '', price: v ? v.p : m.price, qty: 1, emoji: m.emoji });
    save(); renderCart();
    var last = $('.cart-items .line:last-child'); if (last && last.scrollIntoView) last.scrollIntoView({ block: 'nearest' });
  }

  function validateCart() {
    var c = S.cart;
    if (!c.items.length) { toast('Add at least one item', 'warn'); return false; }
    if (c.type === 'dine-in' && !c.table) { toast('Please select a table', 'warn'); return false; }
    if (c.type === 'delivery' && (!c.cust.phone.trim() || !c.cust.address.trim())) { toast('Delivery needs phone and address', 'warn'); return false; }
    return true;
  }

  function placeOrder(paid, payment) {
    var c = S.cart, t = calc(c.items, c.type, c.dt, c.dv);
    var o = {
      id: 'o' + Date.now(), no: S.nextOrder++, type: c.type, table: c.type === 'dine-in' ? c.table : '',
      cust: clone(c.cust), items: c.items.map(function (i) { return { id: i.id, name: i.name, variant: i.variant, price: i.price, qty: i.qty, emoji: i.emoji }; }),
      dt: c.dt, dv: c.dv, sub: t.sub, disc: t.disc, tax: t.tax, service: t.service, delivery: t.delivery, total: t.total,
      note: c.note, status: 'new', paid: !!paid, payment: payment || null, createdAt: Date.now(), updatedAt: Date.now()
    };
    o.items.forEach(function (i) { var m = menuItem(i.id); if (m) m.stock = Math.max(0, m.stock - i.qty); });
    S.orders.push(o);
    S.cart = blankCart();
    ui.cartOpen = false;
    save();
    return o;
  }

  /* ---------- payment ---------- */
  function openPayment(ctx) {
    var total = ctx.kind === 'cart' ? calc(S.cart.items, S.cart.type, S.cart.dt, S.cart.dv).total : orderById(ctx.id).total;
    pay = { ctx: ctx, method: 'cash', tendered: '', total: total };
    var h = modalHead('Collect payment') + '<div class="modal-b"><div class="pay-total"><small>Amount due</small><b>' + fmt(total) + '</b></div>' +
      '<div class="methods">' + Object.keys(METHOD).map(function (k) {
        return '<button class="' + (k === 'cash' ? 'on' : '') + '" data-act="pay-method" data-id="' + k + '"><span class="e">' + METHOD[k][1] + '</span>' + METHOD[k][0] + '</button>';
      }).join('') + '</div><div id="cash-box"></div></div>' +
      '<div class="modal-f"><button class="btn" data-act="modal-close">Cancel</button><button class="btn ok" data-act="pay-confirm">' + ic('check', 16) + ' Confirm payment</button></div>';
    openModal(h);
    renderCashBox();
  }
  function renderCashBox() {
    var box = $('#cash-box'); if (!box) return;
    if (pay.method !== 'cash') {
      box.innerHTML = '<div class="muted" style="text-align:center;padding:6px 0 2px;font-size:13px">Confirm once the ' + METHOD[pay.method][0] + ' payment is received.</div>';
      return;
    }
    var tot = pay.total, quick = [0, 500, 1000, 2000, 5000];
    box.innerHTML = '<label class="f">Cash received</label><input class="input" id="tendered" type="number" min="0" placeholder="' + Math.round(tot) + '" value="' + (pay.tendered || '') + '" data-in="tendered" autofocus>' +
      '<div class="quick">' + quick.map(function (q) {
        return '<button class="btn sm" data-act="quick-cash" data-v="' + (q === 0 ? Math.ceil(tot) : q) + '">' + (q === 0 ? 'Exact' : fmt(q)) + '</button>';
      }).join('') + '</div><div class="change" id="change"></div>';
    updateChange();
  }
  function updateChange() {
    var el = $('#change'); if (!el) return;
    var t = Number(pay.tendered) || 0, ch = t - pay.total;
    el.innerHTML = t ? (ch >= 0 ? '<span>Change to return</span><span>' + fmt(ch) + '</span>' : '<span style="color:var(--brand-d)">Short by</span><span style="color:var(--brand-d)">' + fmt(-ch) + '</span>') : '<span>Change to return</span><span>' + fmt(0) + '</span>';
    el.style.background = (t && ch < 0) ? 'var(--brand-l)' : '';
  }
  function confirmPayment() {
    var payment = { method: pay.method, tendered: pay.total, change: 0 };
    if (pay.method === 'cash') {
      var t = Number(pay.tendered) || pay.total;
      if (t < pay.total - 0.5) { toast('Cash received is less than the amount due', 'warn'); return; }
      payment.tendered = t; payment.change = Math.max(0, t - pay.total);
    }
    var ctx = pay.ctx, order;
    if (ctx.kind === 'cart') {
      if (!validateCart()) return;
      order = placeOrder(true, payment);
    } else {
      order = orderById(ctx.id);
      order.paid = true; order.payment = payment; order.updatedAt = Date.now();
      save();
    }
    closeModal();
    toast('Payment received · Order #' + order.no, 'ok');
    showReceipt(order.id);
    rerender();
  }

  /* ---------- receipt ---------- */
  function receiptHTML(o) {
    var s = S.settings, b = curBranch(), r = '<div class="receipt"><div class="c"><h2>' + esc(s.name) + '</h2><div>' + esc(s.tagline) + '</div><div><b>' + esc(b.name) + '</b></div><div>' + esc(brAddr(b) || s.address) + '</div>' + ((b.phone || s.phone) ? '<div>Tel: ' + esc(b.phone || s.phone) + '</div>' : '') + '</div><hr>' +
      '<div class="r"><span>Order #' + o.no + '</span><span>' + TYPE_LABEL[o.type] + (o.table ? ' · ' + esc(o.table) : '') + '</span></div>' +
      '<div class="r"><span>' + dateStr(o.createdAt) + '</span><span>' + timeStr(o.createdAt) + '</span></div>';
    if (o.cust && (o.cust.name || o.cust.phone)) r += '<div>Customer: ' + esc(o.cust.name) + ' ' + esc(o.cust.phone) + '</div>';
    if (o.cust && o.cust.address) r += '<div>Addr: ' + esc(o.cust.address) + '</div>';
    r += '<hr>';
    o.items.forEach(function (i) {
      r += '<div class="li"><div>' + esc(i.name) + (i.variant ? ' (' + esc(i.variant) + ')' : '') + '</div><div class="r"><span>' + i.qty + ' x ' + Math.round(i.price).toLocaleString('en-US') + '</span><span>' + Math.round(i.qty * i.price).toLocaleString('en-US') + '</span></div></div>';
    });
    r += '<hr><div class="r"><span>Subtotal</span><span>' + fmt(o.sub) + '</span></div>';
    if (o.disc) r += '<div class="r"><span>Discount</span><span>- ' + fmt(o.disc) + '</span></div>';
    r += '<div class="r"><span>Tax (' + s.taxRate + '%)</span><span>' + fmt(o.tax) + '</span></div>';
    if (o.service) r += '<div class="r"><span>Service charge</span><span>' + fmt(o.service) + '</span></div>';
    if (o.delivery) r += '<div class="r"><span>Delivery fee</span><span>' + fmt(o.delivery) + '</span></div>';
    r += '<hr><div class="r tt"><span>TOTAL</span><span>' + fmt(o.total) + '</span></div>';
    if (o.paid && o.payment) {
      r += '<div class="r"><span>Paid by</span><span>' + METHOD[o.payment.method][0] + '</span></div>';
      if (o.payment.method === 'cash') r += '<div class="r"><span>Received</span><span>' + fmt(o.payment.tendered) + '</span></div><div class="r"><span>Change</span><span>' + fmt(o.payment.change) + '</span></div>';
    } else r += '<div class="c" style="margin-top:6px"><b>** PAYMENT PENDING **</b></div>';
    if (o.note) r += '<hr><div>Note: ' + esc(o.note) + '</div>';
    return r + '<hr><div class="c">' + esc(s.footer) + '</div><div class="c">Powered by PizzaBank POS</div></div>';
  }
  function showReceipt(id) {
    var o = orderById(id); if (!o) return;
    openModal(modalHead('Receipt · #' + o.no) + '<div class="modal-b"><div class="receipt-wrap">' + receiptHTML(o) + '</div></div>' +
      '<div class="modal-f"><button class="btn" data-act="modal-close">Close</button><button class="btn dark" data-act="print" data-id="' + o.id + '">' + ic('printer', 16) + ' Print receipt</button></div>');
  }

  /* ======================================================================
     ORDERS
     ====================================================================== */
  VIEWS.orders = function () {
    var now = Date.now(), today = sod(now);
    var q = ui.oq.trim().toLowerCase();
    var base = S.orders.filter(function (o) {
      if (ui.odate === 'today' && sod(o.createdAt) !== today) return false;
      if (ui.odate === '7d' && o.createdAt < today - 6 * 86400000) return false;
      if (q && ('#' + o.no + ' ' + (o.cust.name || '') + ' ' + (o.cust.phone || '') + ' ' + (o.table || '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var tabs = [
      ['active', 'Active', function (o) { return isActive(o); }],
      ['unpaid', 'Unpaid', function (o) { return !o.paid && o.status !== 'cancelled'; }],
      ['completed', 'Completed', function (o) { return o.status === 'completed'; }],
      ['cancelled', 'Cancelled', function (o) { return o.status === 'cancelled'; }],
      ['all', 'All', function () { return true; }]
    ];
    var cur2 = tabs.filter(function (t) { return t[0] === ui.ostatus; })[0];
    var list = base.filter(cur2[2]).sort(function (a, b) { return b.createdAt - a.createdAt; });

    var h = '<div class="toolbar"><div class="tabs">' + tabs.map(function (t) {
      return '<button class="' + (ui.ostatus === t[0] ? 'on' : '') + '" data-act="otab" data-id="' + t[0] + '">' + t[1] + '<span>' + base.filter(t[2]).length + '</span></button>';
    }).join('') + '</div><div style="flex:1"></div>' +
      '<div class="search" style="max-width:260px">' + ic('search', 17) + '<input class="input" id="oq" placeholder="Order #, name, phone, table" value="' + esc(ui.oq) + '" data-in="oq" autocomplete="off"></div>' +
      '<select class="select" style="width:150px" data-sel="odate"><option value="today"' + (ui.odate === 'today' ? ' selected' : '') + '>Today</option><option value="7d"' + (ui.odate === '7d' ? ' selected' : '') + '>Last 7 days</option><option value="all"' + (ui.odate === 'all' ? ' selected' : '') + '>All time</option></select>' +
      '<a class="btn primary" href="#/pos">' + ic('plus', 16) + ' New order</a></div>';

    h += '<div class="card"><div class="table-wrap">';
    if (!list.length) {
      h += '<div class="empty"><div class="big">🧾</div><b>No orders here</b><div>Orders matching this filter will appear in this list.</div></div>';
    } else {
      h += '<table><thead><tr><th>Order</th><th>Date / time</th><th>Type</th><th>Items</th><th class="num">Total</th><th>Payment</th><th>Status</th><th class="num">Actions</th></tr></thead><tbody>';
      list.slice(0, 80).forEach(function (o) {
        var units = o.items.reduce(function (a, i) { return a + i.qty; }, 0);
        var next = { new: 'Start', preparing: 'Ready', ready: 'Complete' }[o.status];
        h += '<tr><td><b>#' + o.no + '</b></td><td>' + dateStr(o.createdAt) + '<div class="muted" style="font-size:12px">' + timeStr(o.createdAt) + '</div></td><td>' + typeCell(o) + '</td><td>' + units + '</td><td class="num"><b>' + fmt(o.total) + '</b></td><td>' + payTag(o) + '</td><td><span class="tag ' + o.status + '">' + STATUS_LABEL[o.status] + '</span></td>' +
          '<td class="num"><div class="row" style="justify-content:flex-end;gap:6px">' +
          (next ? '<button class="btn sm" data-act="advance" data-id="' + o.id + '">' + next + '</button>' : '') +
          (!o.paid && o.status !== 'cancelled' ? '<button class="btn sm ok" data-act="collect" data-id="' + o.id + '">Collect</button>' : '') +
          '<button class="btn sm icon" title="View" data-act="view-order" data-id="' + o.id + '">' + ic('eye', 15) + '</button>' +
          '<button class="btn sm icon" title="Receipt" data-act="receipt" data-id="' + o.id + '">' + ic('printer', 15) + '</button></div></td></tr>';
      });
      h += '</tbody></table>';
    }
    h += '</div></div>';
    if (list.length > 80) h += '<p class="muted" style="margin-top:10px;font-size:12.5px">Showing latest 80 of ' + list.length + ' orders. Use search or date filters to narrow down.</p>';
    $('#view').innerHTML = h;
  };

  function viewOrder(id) {
    var o = orderById(id); if (!o) return;
    var h = modalHead('Order #' + o.no + ' <span class="tag ' + o.status + '" style="margin-left:8px;vertical-align:middle">' + STATUS_LABEL[o.status] + '</span>') + '<div class="modal-b">' +
      '<div class="grid2" style="margin-bottom:14px"><div><small class="muted">Type</small><div><b>' + TYPE_LABEL[o.type] + (o.table ? ' · ' + esc(o.table) : '') + '</b></div></div><div><small class="muted">Placed</small><div><b>' + dateStr(o.createdAt) + ' · ' + timeStr(o.createdAt) + '</b></div></div>' +
      (o.cust.name || o.cust.phone ? '<div><small class="muted">Customer</small><div><b>' + esc(o.cust.name || '—') + '</b> ' + esc(o.cust.phone) + '</div></div>' : '') +
      (o.cust.address ? '<div><small class="muted">Address</small><div><b>' + esc(o.cust.address) + '</b></div></div>' : '') + '</div>' +
      '<div class="card" style="box-shadow:none"><table><tbody>' + o.items.map(function (i) {
        return '<tr><td><div class="cell-item"><span style="font-size:22px">' + i.emoji + '</span><div><b>' + esc(i.name) + '</b><div class="muted" style="font-size:12px">' + (i.variant ? esc(i.variant) + ' · ' : '') + fmt(i.price) + ' × ' + i.qty + '</div></div></div></td><td class="num"><b>' + fmt(i.price * i.qty) + '</b></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="sum" style="margin-top:12px"><div><span>Subtotal</span><span>' + fmt(o.sub) + '</span></div>' + (o.disc ? '<div><span>Discount</span><span>- ' + fmt(o.disc) + '</span></div>' : '') +
      '<div><span>Tax</span><span>' + fmt(o.tax) + '</span></div>' + (o.service ? '<div><span>Service</span><span>' + fmt(o.service) + '</span></div>' : '') + (o.delivery ? '<div><span>Delivery</span><span>' + fmt(o.delivery) + '</span></div>' : '') +
      '<div class="tot"><span>Total</span><span>' + fmt(o.total) + '</span></div></div>' +
      '<div style="margin-top:12px">' + payTag(o) + '</div>' + (o.note ? '<div class="k-note" style="margin-top:12px">📝 ' + esc(o.note) + '</div>' : '') + '</div>' +
      '<div class="modal-f">' + (o.status !== 'cancelled' && o.status !== 'completed' ? '<button class="btn danger" data-act="cancel-order" data-id="' + o.id + '" style="margin-right:auto">Cancel order</button>' : '') +
      (!o.paid && o.status !== 'cancelled' ? '<button class="btn ok" data-act="collect" data-id="' + o.id + '">Collect payment</button>' : '') +
      '<button class="btn dark" data-act="print" data-id="' + o.id + '">' + ic('printer', 16) + ' Print</button></div>';
    openModal(h, 'wide');
  }

  function advance(id) {
    var o = orderById(id); if (!o) return;
    var nx = { new: 'preparing', preparing: 'ready', ready: 'completed' }[o.status];
    if (!nx) return;
    o.status = nx; o.updatedAt = Date.now(); save();
    if (nx === 'completed' && !o.paid) toast('Order #' + o.no + ' completed – payment still pending', 'warn');
    rerender();
  }

  function cancelOrder(id) {
    var o = orderById(id); if (!o) return;
    if (!confirm('Cancel order #' + o.no + '? Stock will be returned.')) return;
    o.status = 'cancelled'; o.updatedAt = Date.now();
    o.items.forEach(function (i) { var m = menuItem(i.id); if (m) m.stock += i.qty; });
    save(); closeModal(); toast('Order #' + o.no + ' cancelled', 'warn'); rerender();
  }

  /* ======================================================================
     KITCHEN
     ====================================================================== */
  VIEWS.kitchen = function () {
    var cols = [['new', 'New orders', '🔔', 'Start preparing'], ['preparing', 'Preparing', '🔥', 'Mark ready'], ['ready', 'Ready to serve', '✅', 'Complete']];
    var h = '<div class="kitchen">';
    cols.forEach(function (c) {
      var list = S.orders.filter(function (o) { return o.status === c[0]; }).sort(function (a, b) { return a.createdAt - b.createdAt; });
      h += '<div class="k-col"><h3>' + c[2] + ' ' + c[1] + ' <span class="count">' + list.length + '</span></h3>';
      if (!list.length) h += '<div class="card"><div class="empty" style="padding:30px 10px">Nothing here</div></div>';
      list.forEach(function (o) {
        var late = (Date.now() - o.createdAt) > 20 * 60000 && c[0] !== 'ready';
        h += '<div class="k-card ' + c[0] + (late ? ' late' : '') + '"><div class="k-head"><b>#' + o.no + ' · ' + (o.type === 'dine-in' ? esc(o.table || 'Dine-in') : TYPE_LABEL[o.type]) + '</b><span class="k-time">' + ic('clock', 13) + ' ' + ago(o.createdAt) + '</span></div>' +
          '<span class="tag">' + TYPE_LABEL[o.type] + '</span>' + (!o.paid ? ' <span class="tag unpaid">Unpaid</span>' : '') +
          '<div class="k-items">' + o.items.map(function (i) { return '<div><b>' + i.qty + '×</b><span>' + esc(i.name) + (i.variant ? ' <span class="muted">(' + esc(i.variant) + ')</span>' : '') + '</span></div>'; }).join('') + '</div>' +
          (o.note ? '<div class="k-note">📝 ' + esc(o.note) + '</div>' : '') +
          '<div class="row"><button class="btn primary block" data-act="advance" data-id="' + o.id + '">' + c[3] + '</button><button class="btn icon" title="Details" data-act="view-order" data-id="' + o.id + '">' + ic('eye', 16) + '</button></div></div>';
      });
      h += '</div>';
    });
    $('#view').innerHTML = h + '</div>';
  };

  /* ======================================================================
     MENU MANAGEMENT
     ====================================================================== */
  VIEWS.menu = function () {
    var q = ui.mq.trim().toLowerCase();
    var list = S.menu.filter(function (m) { return (ui.mcat === 'all' || m.cat === ui.mcat) && (!q || m.name.toLowerCase().indexOf(q) > -1); });
    var h = '<div class="toolbar"><div class="search" style="max-width:300px">' + ic('search', 17) + '<input class="input" id="mq" placeholder="Search items…" value="' + esc(ui.mq) + '" data-in="mq" autocomplete="off"></div>' +
      '<select class="select" style="width:190px" data-sel="mcat"><option value="all">All categories</option>' + S.categories.map(function (c) { return '<option value="' + c.id + '"' + (ui.mcat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select>' +
      '<div style="flex:1"></div><button class="btn" data-act="cat-new">' + ic('plus', 16) + ' Category</button><button class="btn primary" data-act="menu-new">' + ic('plus', 16) + ' New item</button></div>';
    h += '<div class="card"><div class="table-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Stock</th><th>Available</th><th class="num">Actions</th></tr></thead><tbody>';
    list.forEach(function (m) {
      var c = catOf(m.cat) || { name: '—', color: '#94a3b8' };
      h += '<tr><td><div class="cell-item"><div class="emo" style="background:' + tint(c.color) + '">' + m.emoji + '</div><div><b>' + esc(m.name) + '</b>' + (m.best ? ' <span class="tag low">★ Best</span>' : '') + '<div class="muted" style="font-size:12px;max-width:340px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(m.desc) + '</div></div></div></td>' +
        '<td>' + esc(c.name) + '</td><td>' + (m.variants ? m.variants.map(function (v) { return '<div style="font-size:12.5px">' + esc(v.n) + ': <b>' + fmt(v.p) + '</b></div>'; }).join('') : '<b>' + fmt(m.price) + '</b>') + '</td>' +
        '<td><span class="tag ' + (m.stock === 0 ? 'out' : m.stock <= S.settings.lowStock ? 'low' : '') + '">' + m.stock + '</span></td>' +
        '<td><button class="btn sm ' + (m.active ? 'ok' : '') + '" data-act="menu-toggle" data-id="' + m.id + '">' + (m.active ? 'Visible' : 'Hidden') + '</button></td>' +
        '<td class="num"><div class="row" style="justify-content:flex-end;gap:6px"><button class="btn sm icon" data-act="menu-edit" data-id="' + m.id + '" title="Edit">' + ic('edit', 15) + '</button><button class="btn sm icon danger" data-act="menu-del" data-id="' + m.id + '" title="Delete">' + ic('trash', 15) + '</button></div></td></tr>';
    });
    if (!list.length) h += '<tr><td colspan="6"><div class="empty">No items found</div></td></tr>';
    $('#view').innerHTML = h + '</tbody></table></div></div>';
  };

  function menuForm(id) {
    var m = id ? menuItem(id) : { name: '', cat: S.categories[0] ? S.categories[0].id : '', emoji: '🍽️', price: '', variants: null, desc: '', prep: 10, stock: 50, best: false, active: true };
    var vtxt = m.variants ? m.variants.map(function (v) { return v.n + ':' + v.p; }).join(', ') : '';
    openModal(modalHead(id ? 'Edit item' : 'New menu item') + '<div class="modal-b stack" data-id="' + (id || '') + '">' +
      '<div class="grid2"><div><label class="f">Item name *</label><input class="input" id="f-name" value="' + esc(m.name) + '"></div><div><label class="f">Category *</label><select class="select" id="f-cat">' + S.categories.map(function (c) { return '<option value="' + c.id + '"' + (m.cat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="grid3"><div><label class="f">Emoji</label><input class="input" id="f-emoji" value="' + esc(m.emoji) + '"></div><div><label class="f">Price (' + esc(S.settings.currency) + ')</label><input class="input" id="f-price" type="number" min="0" value="' + (m.variants ? '' : m.price) + '" placeholder="Base price"></div><div><label class="f">Prep time (min)</label><input class="input" id="f-prep" type="number" min="0" value="' + m.prep + '"></div></div>' +
      '<div><label class="f">Sizes / variants <span class="muted" style="font-weight:500">(optional, overrides price) — e.g. Small:650, Medium:1100, Large:1500</span></label><input class="input" id="f-var" value="' + esc(vtxt) + '"></div>' +
      '<div><label class="f">Description</label><textarea class="textarea" id="f-desc" rows="2">' + esc(m.desc) + '</textarea></div>' +
      '<div class="grid3"><div><label class="f">Stock quantity</label><input class="input" id="f-stock" type="number" min="0" value="' + m.stock + '"></div><div><label class="f">Bestseller</label><select class="select" id="f-best"><option value="0">No</option><option value="1"' + (m.best ? ' selected' : '') + '>Yes</option></select></div><div><label class="f">Visible in POS</label><select class="select" id="f-active"><option value="1">Yes</option><option value="0"' + (m.active ? '' : ' selected') + '>No</option></select></div></div></div>' +
      '<div class="modal-f"><button class="btn" data-act="modal-close">Cancel</button><button class="btn primary" data-act="menu-save">Save item</button></div>');
  }

  function saveMenuItem() {
    var id = $('.modal-b').getAttribute('data-id');
    var name = $('#f-name').value.trim(); if (!name) { toast('Item name is required', 'warn'); return; }
    var variants = null, vt = $('#f-var').value.trim();
    if (vt) {
      variants = vt.split(',').map(function (p) {
        var i = p.lastIndexOf(':'); if (i < 1) return null;
        var pr = Number(p.slice(i + 1).trim()); if (!(pr >= 0)) return null;
        return { n: p.slice(0, i).trim(), p: pr };
      }).filter(Boolean);
      if (!variants.length) { toast('Variants format: Small:650, Large:1500', 'warn'); return; }
    }
    var price = variants ? Math.min.apply(null, variants.map(function (v) { return v.p; })) : Number($('#f-price').value);
    if (!(price >= 0) || (!variants && $('#f-price').value === '')) { toast('Enter a valid price', 'warn'); return; }
    var data = {
      name: name, cat: $('#f-cat').value, emoji: $('#f-emoji').value.trim() || '🍽️', price: price, variants: variants, desc: $('#f-desc').value.trim(),
      prep: Number($('#f-prep').value) || 0, stock: Math.max(0, Math.floor(Number($('#f-stock').value) || 0)), best: $('#f-best').value === '1', active: $('#f-active').value === '1'
    };
    if (id) Object.assign(menuItem(id), data);
    else S.menu.push(Object.assign({ id: 'm' + Date.now() }, data));
    save(); closeModal(); toast('Menu item saved', 'ok'); rerender();
  }

  /* ======================================================================
     INVENTORY
     ====================================================================== */
  VIEWS.inventory = function () {
    var th = S.settings.lowStock;
    var low = S.menu.filter(function (m) { return m.stock > 0 && m.stock <= th; }).length;
    var out = S.menu.filter(function (m) { return m.stock === 0; }).length;
    var list = S.menu.filter(function (m) { return ui.inv === 'all' || (ui.inv === 'low' && m.stock > 0 && m.stock <= th) || (ui.inv === 'out' && m.stock === 0); });
    var h = '<div class="kpis" style="grid-template-columns:repeat(3,1fr)">' +
      '<div class="card kpi"><div class="k-ic" style="background:#eff8ff;color:#175cd3">' + ic('inventory', 22) + '</div><div><small>Total items</small><b>' + S.menu.length + '</b></div></div>' +
      '<div class="card kpi"><div class="k-ic" style="background:#fffaeb;color:#b54708">' + ic('alert', 22) + '</div><div><small>Low stock (≤ ' + th + ')</small><b>' + low + '</b></div></div>' +
      '<div class="card kpi"><div class="k-ic" style="background:#fef3f2;color:#b42318">' + ic('x', 22) + '</div><div><small>Out of stock</small><b>' + out + '</b></div></div></div>';
    h += '<div class="toolbar"><div class="tabs">' + [['all', 'All items'], ['low', 'Low stock'], ['out', 'Out of stock']].map(function (t) { return '<button class="' + (ui.inv === t[0] ? 'on' : '') + '" data-act="invtab" data-id="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div style="flex:1"></div>' +
      '<button class="btn" data-act="restock">' + ic('plus', 16) + ' Restock low items to 50</button></div>';
    h += '<div class="card"><div class="table-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>Status</th><th class="num">Stock</th></tr></thead><tbody>';
    list.forEach(function (m) {
      var c = catOf(m.cat) || { name: '—', color: '#94a3b8' };
      h += '<tr><td><div class="cell-item"><div class="emo" style="background:' + tint(c.color) + '">' + m.emoji + '</div><b>' + esc(m.name) + '</b></div></td><td>' + esc(c.name) + '</td><td><span class="tag ' + (m.stock === 0 ? 'out' : m.stock <= th ? 'low' : 'paid') + '">' + (m.stock === 0 ? 'Out of stock' : m.stock <= th ? 'Low stock' : 'In stock') + '</span></td>' +
        '<td class="num"><div class="row" style="justify-content:flex-end;gap:6px"><button class="btn sm icon" data-act="stock" data-id="' + m.id + '" data-d="-5">−5</button><button class="btn sm icon" data-act="stock" data-id="' + m.id + '" data-d="-1">' + ic('minus', 14) + '</button>' +
        '<input class="input" style="width:76px;height:32px;text-align:center" type="number" min="0" value="' + m.stock + '" data-stockset="' + m.id + '"><button class="btn sm icon" data-act="stock" data-id="' + m.id + '" data-d="1">' + ic('plus', 14) + '</button><button class="btn sm icon" data-act="stock" data-id="' + m.id + '" data-d="10">+10</button></div></td></tr>';
    });
    if (!list.length) h += '<tr><td colspan="4"><div class="empty">Nothing to show 🎉</div></td></tr>';
    $('#view').innerHTML = h + '</tbody></table></div></div>';
  };

  /* ======================================================================
     SETTINGS
     ====================================================================== */
  VIEWS.settings = function () {
    var s = S.settings;
    var f = function (id, label, val, type, extra) { return '<div><label class="f">' + label + '</label><input class="input" id="s-' + id + '" type="' + (type || 'text') + '" value="' + esc(val) + '" ' + (extra || '') + '></div>'; };
    $('#view').innerHTML = '<div class="dash-grid" style="grid-template-columns:1.4fr 1fr">' +
      '<div class="card"><div class="card-h"><h3>Business & billing</h3></div><div class="card-b stack">' +
      '<div class="grid2">' + f('name', 'Restaurant / hotel name', s.name) + f('tagline', 'Tagline', s.tagline) + '</div>' +
      '<div class="grid2">' + f('address', 'Address', s.address) + f('phone', 'Phone', s.phone) + '</div>' +
      '<div class="grid3">' + f('currency', 'Currency symbol', s.currency) + f('taxRate', 'Tax / GST %', s.taxRate, 'number', 'min="0" step="0.5"') + f('serviceRate', 'Service charge % (dine-in)', s.serviceRate, 'number', 'min="0" step="0.5"') + '</div>' +
      '<div class="grid3">' + f('deliveryFee', 'Delivery fee', s.deliveryFee, 'number', 'min="0"') + f('tables', 'Number of tables', s.tables, 'number', 'min="1" max="60"') + f('lowStock', 'Low-stock threshold', s.lowStock, 'number', 'min="0"') + '</div>' +
      f('footer', 'Receipt footer message', s.footer) +
      '<div><button class="btn primary" data-act="settings-save">' + ic('check', 16) + ' Save settings</button></div></div></div>' +
      '<div class="card"><div class="card-h"><h3>Data management</h3></div><div class="card-b stack">' +
      '<p class="muted" style="font-size:13px">All data is stored in this browser (localStorage). Export a backup anytime, or reset for a fresh start before going live.</p>' +
      '<button class="btn block" data-act="export">' + ic('download', 16) + ' Export backup (JSON)</button>' +
      '<label class="btn block" style="cursor:pointer">' + ic('upload', 16) + ' Import backup<input type="file" accept="application/json" id="import-file" hidden></label>' +
      '<button class="btn block" data-act="orders-clear">' + ic('trash', 16) + ' Clear all orders (keep menu)</button>' +
      '<button class="btn block danger" data-act="reset">' + ic('alert', 16) + ' Reset to demo data</button></div></div></div>';
  };

  function saveSettings() {
    var g = function (id) { return $('#s-' + id).value; };
    var n = function (id, d) { var v = Number(g(id)); return v >= 0 ? v : d; };
    var s = S.settings;
    s.name = g('name').trim() || s.name; s.tagline = g('tagline').trim(); s.address = g('address').trim(); s.phone = g('phone').trim();
    s.currency = g('currency').trim() || 'Rs.'; s.taxRate = n('taxRate', 0); s.serviceRate = n('serviceRate', 0); s.deliveryFee = n('deliveryFee', 0);
    s.tables = Math.min(60, Math.max(1, Math.floor(n('tables', 12)))); s.lowStock = Math.floor(n('lowStock', 10)); s.footer = g('footer').trim();
    save(); toast('Settings saved', 'ok'); rerender();
  }


  /* ======================================================================
     STORE LOCATOR
     ====================================================================== */
  function defaultBranches() {
    return [
      { id: 'b1', name: 'Pizza Bank - Gakhar Mandi', city: 'Gakhar Mandi 52200, Pakistan', address: 'Main GT Rd, Muhallah Peer Abdullah Shah Ghakhar', phone: '', open: '11:00', close: '00:00', manager: '', lat: '', lng: '', dine: true, take: true, deliv: true, active: true }
    ];
  }
  function curBranch() {
    var id = S.settings.currentBranch, list = S.branches || [];
    return list.filter(function (b) { return b.id === id; })[0] || list[0] || { name: S.settings.name, address: S.settings.address, city: '', phone: S.settings.phone };
  }
  function brAddr(b) { return [b.address, b.city].filter(Boolean).join(', '); }
  function toMin(t) { var p = String(t || '0:0').split(':'); return (Number(p[0]) || 0) * 60 + (Number(p[1]) || 0); }
  function t12(t) { var p = String(t || '0:0').split(':'), h = Number(p[0]) || 0; return ((h % 12) || 12) + ':' + (p[1] || '00') + ' ' + (h >= 12 ? 'PM' : 'AM'); }
  function openNow(b) {
    var n = new Date(), m = n.getHours() * 60 + n.getMinutes(), a = toMin(b.open), c = toMin(b.close);
    if (a === c) return true;
    return a < c ? (m >= a && m < c) : (m >= a || m < c);
  }
  function mapQuery(b) { return (b.lat !== '' && b.lng !== '' && b.lat != null && b.lng != null) ? (b.lat + ',' + b.lng) : [b.name, brAddr(b)].filter(Boolean).join(', '); }

  VIEWS.locator = function () {
    if (!S.branches.some(function (b) { return b.id === ui.br; })) ui.br = curBranch().id;
    var open = S.branches.filter(function (b) { return b.active && openNow(b); }).length;
    var tabs = [['all', 'All'], ['dine', 'Dine-in'], ['take', 'Takeaway'], ['deliv', 'Delivery']];
    $('#view').innerHTML = '<div class="toolbar"><div class="search" style="max-width:320px">' + ic('search', 17) + '<input class="input" id="brq" placeholder="Search branch, area or phone…" value="' + esc(ui.brq) + '" data-in="brq" autocomplete="off"></div>' +
      '<div class="tabs">' + tabs.map(function (t) { return '<button class="' + (ui.brsvc === t[0] ? 'on' : '') + '" data-act="brsvc" data-id="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div style="flex:1"></div><span class="pill ok"><i class="dot"></i> ' + open + ' of ' + S.branches.length + ' open now</span>' +
      '<button class="btn primary" data-act="br-new">' + ic('plus', 16) + ' Add branch</button></div>' +
      '<div class="locator"><div class="br-list" id="br-list"></div><div class="card br-map" id="br-map"></div></div>';
    renderBranchList(); renderBranchMap();
  };

  function renderBranchList() {
    var q = ui.brq.trim().toLowerCase();
    var list = S.branches.filter(function (b) {
      var svc = ui.brsvc === 'all' || b[ui.brsvc];
      return svc && (!q || (b.name + ' ' + b.address + ' ' + b.city + ' ' + b.phone).toLowerCase().indexOf(q) > -1);
    });
    var el = $('#br-list'); if (!el) return;
    if (!list.length) { el.innerHTML = '<div class="card"><div class="empty"><div class="big">📍</div><b>No branches found</b><div>Try another search or filter.</div></div></div>'; return; }
    el.innerHTML = list.map(function (b) {
      var isOpen = b.active && openNow(b), isCur = b.id === S.settings.currentBranch;
      var dir = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(mapQuery(b));
      return '<div class="br-card' + (b.id === ui.br ? ' on' : '') + (b.active ? '' : ' off') + '" data-act="br-select" data-id="' + b.id + '">' +
        '<div class="br-top"><div class="emo" style="background:#fef3f2">🏪</div><div style="flex:1;min-width:0"><b>' + esc(b.name) + '</b>' + (isCur ? ' <span class="tag paid">This counter</span>' : '') +
        '<div class="muted" style="font-size:12.5px">' + esc(brAddr(b)) + '</div></div>' +
        '<span class="tag ' + (!b.active ? 'cancelled' : isOpen ? 'paid' : 'unpaid') + '">' + (!b.active ? 'Inactive' : isOpen ? 'Open now' : 'Closed') + '</span></div>' +
        '<div class="br-meta"><span>' + ic('clock', 14) + ' ' + t12(b.open) + ' – ' + t12(b.close) + '</span>' + (b.phone ? '<span>' + ic('phone', 14) + ' ' + esc(b.phone) + '</span>' : '') + (b.manager ? '<span>👤 ' + esc(b.manager) + '</span>' : '') + '</div>' +
        '<div class="br-tags">' + (b.dine ? '<span class="tag">🍽️ Dine-in</span>' : '') + (b.take ? '<span class="tag">🛍️ Takeaway</span>' : '') + (b.deliv ? '<span class="tag">🛵 Delivery</span>' : '') + '</div>' +
        '<div class="br-actions"><a class="btn sm" target="_blank" rel="noopener" href="' + esc(dir) + '">' + ic('navigate', 14) + ' Directions</a>' +
        (b.phone ? '<a class="btn sm" href="tel:' + esc(String(b.phone).replace(/[^+\d]/g, '')) + '">' + ic('phone', 14) + ' Call</a>' : '') +
        (isCur ? '' : '<button class="btn sm" data-act="br-current" data-id="' + b.id + '">Use for this counter</button>') +
        '<button class="btn sm icon" title="Edit" data-act="br-edit" data-id="' + b.id + '">' + ic('edit', 14) + '</button></div></div>';
    }).join('');
  }

  function renderBranchMap() {
    var b = S.branches.filter(function (x) { return x.id === ui.br; })[0], el = $('#br-map'); if (!el) return;
    if (!b) { el.innerHTML = '<div class="empty"><div class="big">🗺️</div>Select a branch to see it on the map</div>'; return; }
    var qy = encodeURIComponent(mapQuery(b));
    el.innerHTML = '<div class="card-h" style="padding-bottom:12px"><div style="min-width:0"><h3>' + esc(b.name) + '</h3><small class="muted">' + esc(brAddr(b)) + '</small></div>' +
      '<a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + qy + '">Open in Google Maps</a></div>' +
      '<div class="br-frame"><iframe title="Map of ' + esc(b.name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' + qy + '&z=15&output=embed"></iframe></div>';
  }

  function branchForm(id) {
    var b = id ? S.branches.filter(function (x) { return x.id === id; })[0] : { name: '', city: '', address: '', phone: '', open: '11:00', close: '23:00', manager: '', lat: '', lng: '', dine: true, take: true, deliv: true, active: true };
    var yn = function (fid, v) { return '<select class="select" id="' + fid + '"><option value="1"' + (v ? ' selected' : '') + '>Yes</option><option value="0"' + (v ? '' : ' selected') + '>No</option></select>'; };
    openModal(modalHead(id ? 'Edit branch' : 'Add branch') + '<div class="modal-b stack" data-id="' + (id || '') + '">' +
      '<div><label class="f">Branch name *</label><input class="input" id="bf-name" value="' + esc(b.name) + '"></div>' +
      '<div class="grid2"><div><label class="f">Address *</label><input class="input" id="bf-address" value="' + esc(b.address) + '"></div><div><label class="f">City</label><input class="input" id="bf-city" value="' + esc(b.city) + '"></div></div>' +
      '<div class="grid2"><div><label class="f">Phone</label><input class="input" id="bf-phone" value="' + esc(b.phone) + '"></div><div><label class="f">Manager</label><input class="input" id="bf-manager" value="' + esc(b.manager) + '"></div></div>' +
      '<div class="grid2"><div><label class="f">Opens</label><input class="input" id="bf-open" type="time" value="' + esc(b.open) + '"></div><div><label class="f">Closes</label><input class="input" id="bf-close" type="time" value="' + esc(b.close) + '"></div></div>' +
      '<div class="grid2"><div><label class="f">Latitude <span class="muted" style="font-weight:500">(optional, exact pin)</span></label><input class="input" id="bf-lat" value="' + esc(b.lat) + '" placeholder="32.5742"></div><div><label class="f">Longitude</label><input class="input" id="bf-lng" value="' + esc(b.lng) + '" placeholder="74.0754"></div></div>' +
      '<div class="grid3"><div><label class="f">Dine-in</label>' + yn('bf-dine', b.dine) + '</div><div><label class="f">Takeaway</label>' + yn('bf-take', b.take) + '</div><div><label class="f">Delivery</label>' + yn('bf-deliv', b.deliv) + '</div></div>' +
      '<div><label class="f">Branch status</label><select class="select" id="bf-active"><option value="1"' + (b.active ? ' selected' : '') + '>Active</option><option value="0"' + (b.active ? '' : ' selected') + '>Inactive</option></select></div></div>' +
      '<div class="modal-f">' + (id ? '<button class="btn danger" data-act="br-del" data-id="' + id + '" style="margin-right:auto">Delete</button>' : '') + '<button class="btn" data-act="modal-close">Cancel</button><button class="btn primary" data-act="br-save">Save branch</button></div>', 'wide');
  }

  function saveBranch() {
    var id = $('.modal-b').getAttribute('data-id'), g = function (x) { return $('#bf-' + x).value.trim(); };
    if (!g('name') || !g('address')) { toast('Branch name and address are required', 'warn'); return; }
    var lat = g('lat'), lng = g('lng');
    if ((lat !== '' || lng !== '') && (isNaN(Number(lat)) || isNaN(Number(lng)) || lat === '' || lng === '')) { toast('Enter both latitude and longitude as numbers, or leave both empty', 'warn'); return; }
    var data = {
      name: g('name'), address: g('address'), city: g('city'), phone: g('phone'), manager: g('manager'),
      open: $('#bf-open').value || '11:00', close: $('#bf-close').value || '23:00', lat: lat, lng: lng,
      dine: $('#bf-dine').value === '1', take: $('#bf-take').value === '1', deliv: $('#bf-deliv').value === '1', active: $('#bf-active').value === '1'
    };
    if (id) Object.assign(S.branches.filter(function (x) { return x.id === id; })[0], data);
    else { data.id = 'b' + Date.now(); S.branches.push(data); ui.br = data.id; }
    save(); closeModal(); toast('Branch saved', 'ok'); rerender();
  }

  /* ---------- events ---------- */
  var H = {
    'modal-close': closeModal,
    overlay: function (t, e) { if (e.target === t) closeModal(); },
    'cart-open': function () { ui.cartOpen = true; renderCart(); },
    'cart-close': function () { ui.cartOpen = false; renderCart(); },
    cat: function (t) { ui.cat = t.dataset.id; renderChips(); renderGrid(); },
    add: function (t) {
      var m = menuItem(t.dataset.id);
      if (m.variants) {
        openModal(modalHead(esc(m.name)) + '<div class="modal-b"><p class="muted" style="margin-bottom:12px">Choose a size</p>' + m.variants.map(function (v, i) {
          return '<button class="var-btn" data-act="variant" data-id="' + m.id + '" data-i="' + i + '"><span>' + esc(v.n) + '</span><b>' + fmt(v.p) + '</b></button>';
        }).join('') + '</div>');
      } else addToCart(m.id, 0);
    },
    variant: function (t) { closeModal(); addToCart(t.dataset.id, Number(t.dataset.i)); },
    qty: function (t) {
      var l = S.cart.items.filter(function (i) { return i.key === t.dataset.id; })[0]; if (!l) return;
      var d = Number(t.dataset.d), m = menuItem(l.id);
      if (d > 0) {
        var inCart = S.cart.items.filter(function (i) { return i.id === l.id; }).reduce(function (a, i) { return a + i.qty; }, 0);
        if (m && inCart >= m.stock) { toast('Only ' + m.stock + ' in stock', 'warn'); return; }
      }
      l.qty += d;
      if (l.qty <= 0) S.cart.items = S.cart.items.filter(function (i) { return i !== l; });
      save(); renderCart();
    },
    rm: function (t) { S.cart.items = S.cart.items.filter(function (i) { return i.key !== t.dataset.id; }); save(); renderCart(); },
    otype: function (t) { S.cart.type = t.dataset.id; save(); renderCart(); },
    table: function (t) { S.cart.table = S.cart.table === t.dataset.id ? '' : t.dataset.id; save(); renderCart(); },
    'clear-cart': function () { if (confirm('Clear the current order?')) { S.cart = blankCart(); save(); renderCart(); } },
    hold: function () {
      if (!validateCart()) return;
      var o = placeOrder(false, null);
      toast('Order #' + o.no + ' sent to kitchen (payment pending)', 'ok'); rerender();
    },
    charge: function () { if (validateCart()) openPayment({ kind: 'cart' }); },
    'pay-method': function (t) {
      pay.method = t.dataset.id;
      $$('.methods button').forEach(function (b) { b.classList.toggle('on', b === t); });
      renderCashBox();
    },
    'quick-cash': function (t) { pay.tendered = t.dataset.v; var i = $('#tendered'); if (i) i.value = pay.tendered; updateChange(); },
    'pay-confirm': confirmPayment,
    collect: function (t) { closeModal(); openPayment({ kind: 'order', id: t.dataset.id }); },
    receipt: function (t) { showReceipt(t.dataset.id); },
    'view-order': function (t) { viewOrder(t.dataset.id); },
    print: function (t) { var o = orderById(t.dataset.id); $('#print-area').innerHTML = receiptHTML(o); window.print(); },
    advance: function (t) { advance(t.dataset.id); },
    'cancel-order': function (t) { cancelOrder(t.dataset.id); },
    otab: function (t) { ui.ostatus = t.dataset.id; VIEWS.orders(); },
    invtab: function (t) { ui.inv = t.dataset.id; VIEWS.inventory(); },
    stock: function (t) { var m = menuItem(t.dataset.id); m.stock = Math.max(0, m.stock + Number(t.dataset.d)); save(); VIEWS.inventory(); renderChrome(); },
    restock: function () {
      var n = 0; S.menu.forEach(function (m) { if (m.stock <= S.settings.lowStock) { m.stock = 50; n++; } });
      save(); toast(n + ' item' + (n === 1 ? '' : 's') + ' restocked', 'ok'); VIEWS.inventory();
    },
    'menu-new': function () { menuForm(null); },
    'menu-edit': function (t) { menuForm(t.dataset.id); },
    'menu-save': saveMenuItem,
    'menu-toggle': function (t) { var m = menuItem(t.dataset.id); m.active = !m.active; save(); VIEWS.menu(); },
    'menu-del': function (t) {
      var m = menuItem(t.dataset.id);
      if (confirm('Delete "' + m.name + '"? Past orders are not affected.')) { S.menu = S.menu.filter(function (x) { return x.id !== m.id; }); save(); toast('Item deleted', 'warn'); VIEWS.menu(); }
    },
    'cat-new': function () {
      openModal(modalHead('Add category') + '<div class="modal-b stack"><div><label class="f">Category name *</label><input class="input" id="c-name" placeholder="e.g. Salads"></div><div class="grid2"><div><label class="f">Emoji</label><input class="input" id="c-emoji" value="🍽️"></div><div><label class="f">Colour</label><input class="input" id="c-color" type="color" value="#e5484d" style="padding:4px"></div></div></div>' +
        '<div class="modal-f"><button class="btn" data-act="modal-close">Cancel</button><button class="btn primary" data-act="cat-save">Add category</button></div>');
    },
    'cat-save': function () {
      var n = $('#c-name').value.trim(); if (!n) { toast('Enter a category name', 'warn'); return; }
      S.categories.push({ id: 'c' + Date.now(), name: n, emoji: $('#c-emoji').value.trim() || '🍽️', color: $('#c-color').value });
      save(); closeModal(); toast('Category added', 'ok'); VIEWS.menu();
    },
    'br-select': function (t) { ui.br = t.dataset.id; renderBranchList(); renderBranchMap(); },
    brsvc: function (t) { ui.brsvc = t.dataset.id; VIEWS.locator(); },
    'br-current': function (t) {
      S.settings.currentBranch = t.dataset.id; save();
      toast('Receipts and this counter now use ' + curBranch().name, 'ok'); rerender();
    },
    'br-new': function () { branchForm(null); },
    'br-edit': function (t) { branchForm(t.dataset.id); },
    'br-save': saveBranch,
    'br-del': function (t) {
      var id = t.dataset.id;
      if (S.branches.length <= 1) { toast('You need at least one branch', 'warn'); return; }
      if (id === S.settings.currentBranch) { toast('Switch this counter to another branch before deleting', 'warn'); return; }
      if (confirm('Delete this branch?')) { S.branches = S.branches.filter(function (b) { return b.id !== id; }); save(); closeModal(); toast('Branch deleted', 'warn'); rerender(); }
    },
    'settings-save': saveSettings,
    export: function () {
      var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'pizzabank-pos-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    },
    'orders-clear': function () {
      if (confirm('Delete ALL orders? Menu and settings are kept. This cannot be undone.')) { S.orders = []; S.nextOrder = 1001; save(); toast('All orders cleared', 'warn'); rerender(); }
    },
    reset: function () {
      if (confirm('Reset everything to the demo data? All your changes will be lost.')) { S = seed(); save(); toast('Demo data restored', 'ok'); rerender(); }
    }
  };

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var fn = H[t.dataset.act]; if (fn) fn(t, e);
  });

  document.addEventListener('input', function (e) {
    var t = e.target, k;
    if ((k = t.getAttribute('data-bind'))) {
      if (k === 'name' || k === 'phone' || k === 'address') { S.cart.cust[k] = t.value; }
      else if (k === 'note') { S.cart.note = t.value; }
      else if (k === 'dv') { S.cart.dv = t.value === '' ? 0 : Number(t.value); }
      save();
      if (k === 'dv') { liveSummary(); }
      return;
    }
    k = t.getAttribute('data-in');
    if (k === 'posq') { ui.q = t.value; renderGrid(); }
    else if (k === 'oq') { ui.oq = t.value; var p = t.selectionStart; VIEWS.orders(); var n = $('#oq'); n.focus(); n.setSelectionRange(p, p); }
    else if (k === 'mq') { ui.mq = t.value; var p2 = t.selectionStart; VIEWS.menu(); var n2 = $('#mq'); n2.focus(); n2.setSelectionRange(p2, p2); }
    else if (k === 'tendered' && pay) { pay.tendered = t.value; updateChange(); }
    else if (k === 'brq') { ui.brq = t.value; renderBranchList(); }
  });

  // refresh only the numbers while typing a discount so the input keeps focus
  function liveSummary() {
    var c = S.cart, t = calc(c.items, c.type, c.dt, c.dv), sum = $('.cart .sum'); if (!sum) return;
    sum.innerHTML = sumRows(t, c);
    var tr = $('.cart .tot-row span:last-child'); if (tr) tr.textContent = fmt(t.total);
    var ch = $('.cart-actions .primary'); if (ch) ch.innerHTML = ic('dollar', 16) + ' Charge ' + fmt(t.total);
  }

  document.addEventListener('change', function (e) {
    var t = e.target, k;
    if ((k = t.getAttribute('data-bind')) && k === 'dt') { S.cart.dt = t.value; save(); renderCart(); return; }
    if ((k = t.getAttribute('data-sel'))) {
      if (k === 'odate') { ui.odate = t.value; VIEWS.orders(); }
      if (k === 'mcat') { ui.mcat = t.value; VIEWS.menu(); }
      return;
    }
    if ((k = t.getAttribute('data-stockset'))) {
      var m = menuItem(k); m.stock = Math.max(0, Math.floor(Number(t.value) || 0)); save(); VIEWS.inventory(); renderChrome(); return;
    }
    if (t.id === 'import-file' && t.files[0]) {
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var d = JSON.parse(rd.result);
          if (!d || d.v !== 1 || !d.menu || !d.orders) throw new Error('bad');
          S = d; if (!S.cart) S.cart = blankCart(); save(); toast('Backup imported', 'ok'); rerender();
        } catch (err) { toast('Invalid backup file', 'err'); }
      };
      rd.readAsText(t.files[0]);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && pay && e.target.id === 'tendered') confirmPayment();
  });

  window.addEventListener('hashchange', route);
  window.addEventListener('resize', function () { if (cur === 'pos') renderCart(); });
  // keep clocks / kitchen timers fresh
  setInterval(function () { tick(); if ((cur === 'kitchen') && !$('#modal-root').innerHTML) VIEWS.kitchen(); }, 30000);

  route();
})();
