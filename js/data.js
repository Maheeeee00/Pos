/* PizzaBank Hotel POS - seed data (menu, categories, default settings) */
window.PB_DATA = (function () {
  var cats = [
    { id: 'pizza', name: 'Pizzas', emoji: '🍕', color: '#e5484d' },
    { id: 'burgers', name: 'Burgers', emoji: '🍔', color: '#f59e0b' },
    { id: 'pasta', name: 'Pasta', emoji: '🍝', color: '#eab308' },
    { id: 'sides', name: 'Wings & Sides', emoji: '🍗', color: '#f97316' },
    { id: 'drinks', name: 'Beverages', emoji: '🥤', color: '#0ea5e9' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰', color: '#a855f7' },
    { id: 'deals', name: 'Deals', emoji: '🎁', color: '#10b981' }
  ];

  var n = 0;
  function it(cat, name, desc, emoji, price, prep, stock, best) {
    var o = { id: 'm' + (++n), cat: cat, name: name, desc: desc, emoji: emoji, prep: prep, stock: stock, best: !!best, active: true, variants: null, price: 0 };
    if (Array.isArray(price)) {
      o.variants = price.map(function (x) { return { n: x[0], p: x[1] }; });
      o.price = Math.min.apply(null, price.map(function (x) { return x[1]; }));
    } else {
      o.price = price;
    }
    return o;
  }
  var SML = function (a, b, c) { return [['Small', a], ['Medium', b], ['Large', c]]; };

  var menu = [
    // Pizzas
    it('pizza', 'Chicken Tikka Supreme Pizza', 'Charcoal grilled tikka chunks, spiced marinara, red onion, green chilies', '🍕', SML(650, 1100, 1500), 20, 80, true),
    it('pizza', 'Rustic Pepperoni Feast Pizza', 'Artisanal beef pepperoni, crushed tomato, fresh basil, mozzarella', '🍕', SML(700, 1150, 1650), 18, 80, true),
    it('pizza', 'Mexican Fajita Fiesta Pizza', 'Fajita chicken strips, caramelized onion, bell peppers, jalapeno', '🌶️', SML(680, 1100, 1550), 18, 70),
    it('pizza', 'Margherita Classic Pizza', 'San Marzano sauce, fior di latte mozzarella, fresh basil', '🍕', SML(500, 850, 1200), 15, 90),
    it('pizza', 'BBQ Chicken Ranch Pizza', 'Smoky BBQ glaze, grilled chicken, red onion, ranch drizzle', '🍕', SML(650, 1050, 1450), 18, 60),
    it('pizza', 'Four Cheese Lovers Pizza', 'Mozzarella, cheddar, parmesan and cream cheese blend', '🧀', SML(700, 1150, 1600), 16, 60),
    it('pizza', 'Garden Veggie Pizza', 'Mushrooms, olives, capsicum, sweet corn, tomato', '🥬', SML(550, 900, 1250), 15, 50),
    it('pizza', 'Crown Crust Special Pizza', 'Cheese-stuffed crust with chicken, sausage and beef toppings', '👑', SML(750, 1250, 1750), 24, 40, true),

    // Burgers
    it('burgers', 'Classic Angus Smashed Burger', '100% prime Angus beef patties smashed on grill, cheddar, pickles', '🍔', 920, 16, 60, true),
    it('burgers', 'Zinger Crunch Burger', 'Crispy spicy fried chicken fillet, lettuce, house mayo', '🍔', 650, 12, 70, true),
    it('burgers', 'Double Patty Beast', 'Two beef patties, double cheese, caramelized onion, smoky sauce', '🍔', 1150, 18, 40),
    it('burgers', 'Grilled Chicken Burger', 'Herb-marinated grilled chicken breast, avocado spread', '🍔', 720, 14, 45),
    it('burgers', 'Mushroom Swiss Burger', 'Beef patty, sauteed mushrooms, Swiss cheese, garlic aioli', '🍄', 880, 16, 35),

    // Pasta
    it('pasta', 'Creamy Fettuccine Alfredo', 'Hand-rolled fettuccine tossed in rich garlic parmesan cream', '🍝', 1250, 18, 50, true),
    it('pasta', 'Penne Arrabbiata', 'Penne in spicy tomato and garlic sauce, fresh parsley', '🍝', 980, 15, 50),
    it('pasta', 'Chicken Lasagna', 'Layered pasta sheets, chicken ragu, bechamel, baked mozzarella', '🍝', 1350, 22, 30),
    it('pasta', 'Baked Mac & Cheese', 'Three-cheese sauce, crispy breadcrumb crown', '🧀', 890, 15, 40),

    // Wings & Sides
    it('sides', 'Peri-Peri Glazed Chicken Wings', 'Flame-grilled wings glazed in house peri-peri sauce', '🍗', [['6 pcs', 690], ['12 pcs', 1250]], 14, 90, true),
    it('sides', 'Loaded Cheese Fries', 'Crispy fries, cheese sauce, jalapeno, chicken bits', '🍟', 520, 10, 100),
    it('sides', 'Garlic Bread with Cheese', 'Toasted baguette, garlic butter, melted mozzarella', '🥖', 420, 8, 100),
    it('sides', 'Crispy Onion Rings', 'Golden beer-battered onion rings with dip', '🧅', 350, 8, 80),
    it('sides', 'Chicken Nuggets', 'Crunchy chicken nuggets with honey mustard', '🍗', [['6 pcs', 480], ['12 pcs', 880]], 10, 90),

    // Beverages
    it('drinks', 'Belgian Chocolate Fudge Shake', 'Thick hand-made shake with Belgian chocolate fudge', '🥛', 480, 6, 60, true),
    it('drinks', 'Fresh Mint Lemonade Cooler', 'Crushed mint, fresh lemon, sparkling soda', '🍋', 320, 5, 120, true),
    it('drinks', 'Blue Lagoon Mojito', 'Blue curacao syrup, lime, mint, soda (non-alcoholic)', '🧊', 380, 5, 100),
    it('drinks', 'Iced Latte', 'Double espresso over milk and ice', '☕', 450, 5, 80),
    it('drinks', 'Mango Shake', 'Seasonal mango pulp blended with cold milk', '🥭', 420, 6, 60),
    it('drinks', 'Soft Drink', 'Chilled Pepsi / 7Up / Mirinda', '🥤', [['345 ml', 120], ['1.5 L', 260]], 2, 300),
    it('drinks', 'Mineral Water', '500 ml bottled water', '💧', 80, 1, 300),

    // Desserts
    it('desserts', 'Molten Chocolate Lava Cake', 'Warm cake with a flowing dark chocolate center', '🍫', 550, 12, 40, true),
    it('desserts', 'New York Cheesecake', 'Baked cheesecake with berry compote', '🍰', 620, 5, 30),
    it('desserts', 'Brownie with Ice Cream', 'Walnut brownie, vanilla ice cream, chocolate drizzle', '🍨', 480, 8, 50),
    it('desserts', 'Gulab Jamun (2 pcs)', 'Warm milk dumplings in cardamom syrup', '🍮', 300, 4, 60),

    // Deals
    it('deals', 'Solo Deal', '1 small pizza + fries + soft drink', '🎁', 1100, 20, 60),
    it('deals', 'Student Combo', 'Zinger burger + fries + soft drink', '🎓', 990, 14, 60, true),
    it('deals', 'Couple Deal', '2 medium pizzas + garlic bread + 2 soft drinks', '💑', 2350, 24, 40),
    it('deals', 'Family Feast', '1 large pizza + 6 wings + fries + 1.5 L drink', '👨‍👩‍👧‍👦', 2999, 26, 30, true),
    it('deals', 'Party Box', '3 large pizzas + 12 wings + 2 x 1.5 L drinks + dessert', '🎉', 6499, 35, 15)
  ];

  var settings = {
    name: 'PizzaBank Hotel',
    tagline: 'Pizza · Grill · Fine Dining',
    address: 'Main Boulevard, Your City',
    phone: '+92 300 0000000',
    currency: 'Rs.',
    taxRate: 5,
    serviceRate: 5,
    deliveryFee: 150,
    tables: 12,
    lowStock: 10,
    footer: 'Thank you for dining with us!'
  };

  return { categories: cats, menu: menu, settings: settings };
})();
