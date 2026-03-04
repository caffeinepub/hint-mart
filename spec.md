# HINT Mart Grocery Store App

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full grocery store web app for HINT Mart (HINT MARKET RAY STORE)
- Store info: Mobile 7797796622, Hours 9 AM – 9 PM, Website hintmr.com
- Product catalog with categories:
  - Kirana (Dal, Food Oil, Masale, Rice, Tomato Ketchup)
  - Soft Drinks
  - Electronic Products
  - Books (Kid's story books)
  - Home Equipment
  - Woman Clothing (Saree)
- Sample products seeded from real store data:
  - Moong Dal – ₹140 → ₹120 (Sale)
  - Maaza 1.2 liter – ₹75 → ₹60 (Sale)
  - Basmati Rice 5kg – ₹500 → ₹450 (Sale)
  - चीनी (Sugar) 500gm – ₹25 → ₹24 (Sale)
  - Chat Masala 250gm – ₹185 → ₹170 (Sale)
  - Tomato Ketchup 500gm – ₹110 → ₹90 (Sale)
  - Kashmiri Red Chili Powder 1kg – ₹400 → ₹350 (Sale)
  - Turmeric Powder (Haldi) 1kg – ₹300 → ₹250 (Sale)
  - Mirinda 2.25 liter – ₹100 → ₹85 (Sale)
  - Fanta 2.25 liter – ₹100 → ₹90 (Sale)
  - 7up 2.25 liter – ₹100 → ₹90 (Sale)
  - Pepsi 2.25 liter – ₹100 → ₹90 (Sale)
  - Basmati Rice 1kg – ₹100 → ₹95 (Sale)
  - चीनी (Sugar) 1kg – ₹50 → ₹48 (Sale)
  - Chana Dal 500gm – ₹63 → ₹50 (Sale)
  - Chana Dal 1kg – ₹125 → ₹100 (Sale)
- Shopping cart (add/remove/update quantity, view total)
- Product browsing: filter by category, search by name
- Order placement: customer fills name, phone, address; submits order
- Admin panel (password protected): view all orders, manage products (add/edit/delete), mark orders as fulfilled
- Store info page: address, hours, phone, link to hintmr.com

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - Product type: id, name, category, subcategory, price, originalPrice, inStock, description
   - Category type: name, subcategories
   - CartItem type: productId, quantity
   - Order type: id, customerName, phone, address, items, total, status, timestamp
   - Admin auth: simple password check
   - Queries: getProducts, getProductsByCategory, searchProducts, getCategories, getOrders (admin)
   - Updates: addProduct, updateProduct, deleteProduct, placeOrder, updateOrderStatus (admin)
   - Seed data: all 16+ products pre-loaded

2. Frontend:
   - Homepage: hero banner, featured categories, featured sale products
   - Shop page: product grid with category filter sidebar and search
   - Product card: image placeholder, name, price with strikethrough original, sale badge, add to cart button
   - Cart drawer/sidebar: item list, quantities, subtotal, place order button
   - Checkout modal: form for name, phone, address
   - Order confirmation screen
   - Store info section in footer: hours, phone, hintmr.com link
   - Admin login page (password: admin)
   - Admin dashboard: orders list with status, product management table with add/edit/delete
