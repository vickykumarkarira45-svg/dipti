# Dipti's Restaurant - Aesthetic Food Web Application & Admin Panel

An aesthetic, responsive food restaurant website for **Dipti's Restaurant** featuring an interactive customer menu, category filters, real-time search, interactive shopping cart, order checkout, full-featured admin management panel, and seamless Supabase database integration.

---

## 🌟 Features

### 🍽️ Customer Storefront (`index.html`)
- **Aesthetic Design**: Crafted with warm bistro tones, glassmorphism cards, micro-interactions, and custom typography.
- **Dynamic Menu Grid**: Aesthetic dish cards with high-definition Unsplash images, prices, descriptions, VEG/NON-VEG tags, and highlight badges (*Bestseller*, *Chef Special*, *Spicy*).
- **Category Filter Tabs**: Instant filtering by *All*, *Starters*, *Main Course*, *Desserts*, and *Beverages*.
- **Real-time Search Bar**: Filter dishes by title or ingredients live as you type.
- **Interactive Cart Drawer**: Floating cart badge counter with item quantity increment/decrement and price calculation.
- **Customer Checkout Modal**: Collect customer contact details and save orders directly to the database.

### 🛡️ Admin Management Panel (`admin.html`)
- **Metrics Dashboard**: Live overview of Total Revenue, Total Customer Orders, Active Menu Dishes, and Out-of-Stock count.
- **Menu Management (CRUD)**:
  - Add new dishes with image URL, price, category, veg/non-veg status, and badges.
  - Edit existing dishes and update prices/descriptions.
  - In-Stock / Out-of-Stock toggle switch with instant customer storefront updates.
  - Delete dishes from menu.
- **Live Order Tracker**:
  - View all incoming customer orders with timestamp, customer phone, delivery address, and ordered items.
  - Change status dropdown (*Pending*, *Preparing*, *Ready*, *Delivered*, *Cancelled*).
- **Supabase Cloud Connection**:
  - Input field to save Supabase Project URL and Public Anon Key.
  - Immediate local storage fallback if Supabase credentials are not entered.

---

## 📁 Project File Structure

```
dipti/
├── index.html       # Customer storefront (Hero, Menu, Cart Drawer, Checkout)
├── admin.html       # Admin Panel (Dashboard metrics, Menu CRUD, Orders management)
├── styles.css       # Main stylesheet (Theme variables, grid layout, animations)
├── app.js           # Customer storefront interactive JS logic
├── admin.js         # Admin panel interactive JS logic
├── supabase.js      # Unified database service (Supabase client + local DB fallback)
├── schema.sql       # SQL table definitions and seed data for Supabase
└── README.md        # Documentation
```

---

## 🚀 How to Run

1. Simply double-click `index.html` or open it directly in any modern Web Browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. To access the Admin Dashboard, click **Admin Panel** in the top navigation bar or open `admin.html`.

---

## ⚡ Connecting to Supabase Cloud Database (Optional)

1. Go to your [Supabase Dashboard](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in Supabase and paste the contents of `schema.sql`. Run the query to create `menu_items` and `orders` tables.
3. In Supabase, navigate to **Project Settings -> API** and copy your **Project URL** and **anon public key**.
4. Open `admin.html` in your browser, go to the **Database & Supabase Config** tab, paste your credentials, and click **Save Supabase Connection**.
