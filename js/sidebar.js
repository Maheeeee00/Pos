/* ============================================================
   PIZZA BANK POS — SHARED SIDEBAR & TOPBAR
   ============================================================ */

function renderTopbar(activePage) {
  const showTables = activePage === 'pos';
  document.getElementById('topbar').innerHTML = `
    <a class="logo" href="index.html">
      <div class="logo-icon">🍕</div>
      Pizza <span>Bank</span>
    </a>
    ${showTables ? `
    <div class="topbar-center" style="gap:8px;flex-wrap:wrap;">
      <span style="font-size:11px;color:var(--fg3);margin-right:4px;">TABLE:</span>
      ${TABLES.map(t => `
        <div class="table-chip ${t.status==='occupied'?'occupied':''}" id="chip-${t.id}" onclick="selectTable('${t.id}')">
          ${t.id}${t.status==='occupied'?' ●':''}
        </div>`).join('')}
    </div>` : `<div class="topbar-center"></div>`}
    <div class="topbar-right">
      <div class="top-stat">
        <span>Today Sales</span>
        <strong>Rs. 84,250</strong>
      </div>
      <div class="divider-v"></div>
      <div class="top-stat" id="clock"></div>
      <div class="divider-v"></div>
      <div class="avatar">ZK</div>
    </div>
  `;
}

function renderSidebar(activePage) {
  const links = [
    { id:'pos',       label:'New Order',       icon:'🏠', href:'index.html',     badge:null },
    { id:'orders',    label:'Orders',          icon:'📋', href:'pages/orders.html',   badge:'3' },
    { id:'kitchen',   label:'Kitchen Display', icon:'🖥️', href:'pages/kitchen.html',  badge:'5', badgeColor:'var(--danger)' },
    { id:'delivery',  label:'Delivery',        icon:'🛵', href:'pages/delivery.html', badge:null },
    { id:'menu',      label:'Menu Mgmt',       icon:'📖', href:'pages/menu.html',     badge:null },
    { id:'inventory', label:'Inventory',       icon:'📦', href:'pages/inventory.html',badge:null },
    { id:'customers', label:'Customers',       icon:'👥', href:'pages/customers.html',badge:null },
    { id:'reports',   label:'Reports',         icon:'📊', href:'pages/reports.html',  badge:null },
    { id:'settings',  label:'Settings',        icon:'⚙️', href:'pages/settings.html', badge:null },
  ];

  const ops = links.slice(0,4);
  const cat = links.slice(4,7);
  const ana = links.slice(7);

  const renderLinks = arr => arr.map(l => `
    <a class="nav-item ${activePage===l.id?'active':''}" href="${l.href}">
      <span class="nav-icon">${l.icon}</span> ${l.label}
      ${l.badge ? `<span class="badge-pill" style="${l.badgeColor?'background:'+l.badgeColor:''}">${l.badge}</span>` : ''}
    </a>`).join('');

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-section">OPERATIONS</div>
    ${renderLinks(ops)}
    <div class="sidebar-section" style="margin-top:8px;">CATALOG & STOCK</div>
    ${renderLinks(cat)}
    <div class="sidebar-section" style="margin-top:8px;">ANALYTICS</div>
    ${renderLinks(ana)}
    <div class="sidebar-bottom">
      <div class="cashier-info">
        <div class="avatar" style="width:34px;height:34px;font-size:14px;">ZK</div>
        <div>
          <div class="name">Zohaib Khan</div>
          <div class="role">Cashier · Shift A</div>
        </div>
      </div>
    </div>
  `;
}

function initPage(pageId) {
  renderTopbar(pageId);
  renderSidebar(pageId);
  initClock();
}
