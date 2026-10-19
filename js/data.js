/* ============================================================
   PIZZA BANK POS — MENU & SHARED DATA
   ============================================================ */

const MENU = [
  { id:1,  cat:'Pizza',    name:'Margherita Classic',   desc:'San Marzano tomato, fresh mozzarella, basil',         price:1200, emoji:'🍕', best:false },
  { id:2,  cat:'Pizza',    name:'Chicken Tikka Pizza',  desc:'Spiced chicken, jalapeños, red onion, yogurt base',    price:1500, emoji:'🍕', best:true  },
  { id:3,  cat:'Pizza',    name:'BBQ Loaded Beef',      desc:'BBQ sauce, ground beef, bell peppers, cheddar',       price:1600, emoji:'🍕', best:false },
  { id:4,  cat:'Pizza',    name:'Peri-Peri Chicken',    desc:'Peri-peri sauce, grilled chicken, corn, cheese',      price:1550, emoji:'🍕', best:true  },
  { id:5,  cat:'Pizza',    name:'Veggie Supreme',       desc:'Mixed peppers, mushrooms, olives, cherry tomato',     price:1100, emoji:'🍕', best:false },
  { id:6,  cat:'Pizza',    name:'Pepperoni Feast',      desc:'Double pepperoni, mozzarella, oregano oil',           price:1700, emoji:'🍕', best:false },
  { id:7,  cat:'Burgers',  name:'Smash Beef Burger',    desc:'Double smash patty, American cheese, pickles',        price:850,  emoji:'🍔', best:true  },
  { id:8,  cat:'Burgers',  name:'Crispy Chicken Burger',desc:'Buttermilk fried chicken, coleslaw, sriracha mayo',   price:780,  emoji:'🍔', best:false },
  { id:9,  cat:'Burgers',  name:'Zinger Tower',         desc:'Zinger fillet, hash brown, cheese, lettuce',          price:900,  emoji:'🍔', best:false },
  { id:10, cat:'Pasta',    name:'Fettuccine Alfredo',   desc:'Creamy parmesan sauce, chicken strips, herbs',        price:950,  emoji:'🍝', best:true  },
  { id:11, cat:'Pasta',    name:'Arrabiata Penne',      desc:'Spicy tomato, garlic, fresh chili, basil',            price:800,  emoji:'🍝', best:false },
  { id:12, cat:'Pasta',    name:'Lasagna al Forno',     desc:'Beef bolognese, béchamel, mozzarella',                price:1100, emoji:'🍝', best:false },
  { id:13, cat:'Sides',    name:'Garlic Bread',         desc:'Toasted baguette, herb butter, parsley',              price:280,  emoji:'🥖', best:false },
  { id:14, cat:'Sides',    name:'Loaded Fries',         desc:'Cheese sauce, jalapeños, sour cream',                 price:450,  emoji:'🍟', best:true  },
  { id:15, cat:'Sides',    name:'Caesar Salad',         desc:'Romaine, parmesan, croutons, caesar dressing',        price:520,  emoji:'🥗', best:false },
  { id:16, cat:'Drinks',   name:'Lemonade Mint',        desc:'Fresh squeezed, crushed mint, sea salt rim',          price:220,  emoji:'🥤', best:false },
  { id:17, cat:'Drinks',   name:'Oreo Shake',           desc:'Blended Oreo, vanilla ice cream, whipped cream',     price:380,  emoji:'🥤', best:true  },
  { id:18, cat:'Drinks',   name:'Soft Drink',           desc:'Coke / Sprite / Fanta — 330ml chilled',              price:120,  emoji:'🥤', best:false },
  { id:19, cat:'Desserts', name:'Chocolate Lava Cake',  desc:'Warm dark chocolate, vanilla ice cream',              price:550,  emoji:'🎂', best:true  },
  { id:20, cat:'Desserts', name:'Tiramisu',             desc:'Mascarpone, espresso-soaked ladyfingers',             price:480,  emoji:'🍮', best:false },
];

const CATEGORIES = ['All', ...new Set(MENU.map(i => i.cat))];

const TABLES = [
  { id:'T1', status:'free' }, { id:'T2', status:'occupied' },
  { id:'T3', status:'free' }, { id:'T4', status:'occupied' },
  { id:'T5', status:'free' }, { id:'T6', status:'occupied' },
  { id:'T7', status:'free' }, { id:'T8', status:'free' },
];

const SAMPLE_ORDERS = [
  { id:'#1042', table:'T2', type:'Dine-in',  items:3, total:3850, status:'preparing', time:'10:15 AM' },
  { id:'#1041', table:'T4', type:'Dine-in',  items:5, total:6200, status:'ready',     time:'10:08 AM' },
  { id:'#1040', table:'-',  type:'Delivery', items:2, total:2100, status:'pending',   time:'10:02 AM' },
  { id:'#1039', table:'T6', type:'Dine-in',  items:4, total:4750, status:'delivered', time:'09:48 AM' },
  { id:'#1038', table:'-',  type:'Takeaway', items:1, total:1500, status:'delivered', time:'09:30 AM' },
];

const INVENTORY = [
  { id:1, name:'Mozzarella Cheese', unit:'kg',  qty:12.5, min:5,  cost:1200 },
  { id:2, name:'Pizza Dough',       unit:'kg',  qty:8.0,  min:4,  cost:180  },
  { id:3, name:'Tomato Sauce',      unit:'ltr', qty:15.0, min:6,  cost:220  },
  { id:4, name:'Chicken Breast',    unit:'kg',  qty:6.5,  min:3,  cost:650  },
  { id:5, name:'Beef Mince',        unit:'kg',  qty:4.0,  min:3,  cost:800  },
  { id:6, name:'Pepperoni',         unit:'kg',  qty:2.5,  min:2,  cost:950  },
  { id:7, name:'All-purpose Flour', unit:'kg',  qty:25.0, min:10, cost:95   },
  { id:8, name:'Olive Oil',         unit:'ltr', qty:3.0,  min:2,  cost:550  },
  { id:9, name:'Soft Drinks (cans)',unit:'pcs', qty:48,   min:24, cost:60   },
  { id:10,name:'Ice Cream (tub)',   unit:'ltr', qty:4.0,  min:2,  cost:480  },
];

const CUSTOMERS = [
  { id:1, name:'Ahmed Raza',     phone:'0300-1234567', visits:12, spent:28400, last:'Today' },
  { id:2, name:'Sara Malik',     phone:'0321-9876543', visits:8,  spent:19750, last:'Yesterday' },
  { id:3, name:'Bilal Khan',     phone:'0333-5551234', visits:5,  spent:12300, last:'3 days ago' },
  { id:4, name:'Nadia Hussain',  phone:'0345-7778889', visits:20, spent:51200, last:'Today' },
  { id:5, name:'Usman Tariq',    phone:'0311-2223334', visits:3,  spent:7100,  last:'1 week ago' },
];

function fmt(n) { return 'Rs. ' + n.toLocaleString(); }

function showToast(msg, err=false) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.background = err ? 'var(--danger)' : 'var(--success)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const t = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  const d = now.toLocaleDateString('en-PK', { weekday:'short', month:'short', day:'numeric' });
  el.innerHTML = `<strong>${t}</strong><br>${d}`;
}

function initClock() { updateClock(); setInterval(updateClock, 1000); }
