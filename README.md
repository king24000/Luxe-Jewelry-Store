# Luxe & Co — Full-Stack E-Commerce (Jewelry · Makeup · Perfume · Accessories)

A multi-brand e-commerce platform with a **React storefront**, a **Vue admin panel**, a **FastAPI backend**, and a **SQLite** database — all running locally with zero external services.

---

## 🏗 Architecture

| Layer       | Tech                              | Port  |
|-------------|-----------------------------------|-------|
| **Backend** | Python · FastAPI · SQLAlchemy 2  | 8000  |
| **Store**   | React 18 · Vite · Custom CSS      | 5173  |
| **Admin**   | Vue 3 · Vite · Custom CSS         | 5174  |
| **Database**| SQLite (`ecommerce.db`)           | —     |

---

## 📂 Project Structure

```
├── backend/               # FastAPI REST API
│   ├── main.py             # App entry + CORS + routers
│   ├── database.py         # SQLite engine/session
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic v2 request/response schemas
│   ├── auth.py             # JWT tokens + password hashing
│   ├── seed.py             # Demo data seeder
│   ├── requirements.txt    # Python deps
│   └── routers/
│       ├── auth.py         # register / login / me
│       ├── products.py     # CRUD + filtering
│       ├── categories.py   # CRUD
│       ├── brands.py       # CRUD
│       ├── cart.py         # per-user cart
│       ├── orders.py       # create / list / status update
│       ├── wishlist.py     # add / remove / list
│       └── admin.py        # stats + user list
│
├── frontend-store/         # React 18 storefront (Vite)
│   └── src/
│       ├── api/            # axios client + endpoints
│       ├── context/        # AuthContext, CartContext
│       ├── components/     # Navbar, ProductCard, Footer
│       ├── pages/          # Home, Shop, Detail, Cart, Checkout, Login, Register, Account, Wishlist
│       └── styles/         # custom CSS files
│
└── frontend-admin/          # Vue 3 admin panel (Vite)
    └── src/
        ├── api/            # axios client + endpoints
        ├── store/          # reactive auth state
        ├── router/         # Vue Router with guards
        ├── layouts/        # AdminLayout (sidebar + topbar)
        ├── views/          # Dashboard, Products, Categories, Brands, Orders, Users, Login
        └── styles/         # custom CSS
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** (3.14 works too)
- **Node.js 18+** (npm included)

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python seed.py              # creates DB + demo data
uvicorn main:app --reload   # starts on http://localhost:8000
```

> Swagger docs available at http://localhost:8000/docs

### 2. React Storefront (new terminal)

```bash
cd frontend-store
npm install
npm run dev                 # starts on http://localhost:5173
```

### 3. Vue Admin Panel (new terminal)

```bash
cd frontend-admin
npm install
npm run dev                 # starts on http://localhost:5174
```

---

## 🔑 Demo Accounts

| Role     | Email              | Password  |
|----------|--------------------|-----------|
| Customer | demo@user.com      | demo123   |
| Admin    | admin@store.com    | admin123  |

---

## 📦 Seed Data

The `seed.py` script creates:

- **2 users** (admin + demo customer)
- **4 categories**: Jewelry, Makeup, Perfume, Accessories
- **5 brands**: Toops, Aurelle, Lumiere, Velvet Co., Maison Noir
- **14 products** spread across categories/brands (with Unsplash images)
- Re-running is **safe** (idempotent)

---

## 🛍 Storefront Features

- **Home**: Hero banner, category tiles, featured products, brand showcase
- **Shop**: Filter by category, brand, price range + search + sort
- **Product Detail**: Large image, quantity picker, add to cart/wishlist, related items
- **Cart**: Update quantities, remove items, order summary, free shipping threshold
- **Checkout**: Shipping address form → mock payment → creates order
- **Auth**: Register / Login with JWT (persisted in localStorage)
- **Account**: Order history, wishlist, profile info
- **Responsive**: Mobile-first CSS with hamburger menu

---

## ⚙ Admin Panel Features

- **Dashboard**: Product/order/user counts, revenue, recent orders
- **Products**: Table with image thumbnails, add/edit modal, delete
- **Categories**: Full CRUD
- **Brands**: Full CRUD
- **Orders**: List all orders, inline status dropdown (pending → shipped → delivered → cancelled)
- **Users**: View all registered users
- **Auth guard**: Only admin-role users can access (redirects to login)
- **Responsive**: Collapsible sidebar on mobile

---

## 🔌 API Endpoints

| Method | Endpoint                | Auth  | Description           |
|--------|-------------------------|-------|-----------------------|
| POST   | `/api/auth/register`    | —     | Register new customer |
| POST   | `/api/auth/login`       | —     | Login → JWT token    |
| GET    | `/api/auth/me`          | ✅    | Current user info     |
| GET    | `/api/products`         | —     | List (filter by category, brand, search, price) |
| GET    | `/api/products/{slug}`  | —     | Single product detail |
| POST   | `/api/products`         | Admin | Create product        |
| PUT    | `/api/products/{id}`    | Admin | Update product        |
| DELETE | `/api/products/{id}`    | Admin | Delete product        |
| GET    | `/api/categories`       | —     | List categories       |
| POST/PUT/DELETE | `/api/categories/{id}` | Admin | CRUD |
| GET    | `/api/brands`           | —     | List brands           |
| POST/PUT/DELETE | `/api/brands/{id}`     | Admin | CRUD |
| GET    | `/api/cart`             | ✅    | List cart items       |
| POST   | `/api/cart`             | ✅    | Add to cart           |
| PUT    | `/api/cart/{id}`        | ✅    | Update quantity       |
| DELETE | `/api/cart/{id}`        | ✅    | Remove item           |
| POST   | `/api/orders`           | ✅    | Create order (checkout) |
| GET    | `/api/orders`           | ✅    | List own orders       |
| PUT    | `/api/orders/{id}/status` | Admin | Update status       |
| GET    | `/api/wishlist`         | ✅    | List wishlist         |
| POST   | `/api/wishlist/{pid}`   | ✅    | Add to wishlist       |
| DELETE | `/api/wishlist/{pid}`   | ✅    | Remove from wishlist  |
| GET    | `/api/admin/stats`      | Admin | Dashboard stats       |
| GET    | `/api/admin/users`      | Admin | User list             |

---

## 🗃 Database Schema

**Users** → **CartItems** / **Orders** / **WishlistItems**
**Categories** ← **Products** → **Brands**
**Orders** → **OrderItems** (product snapshot at order time)

All models use auto-increment integer PKs. Slugs are auto-generated from names.

---

## 🔧 Extending

- **Real payments**: Replace the mock checkout endpoint with Stripe / Razorpay in `routers/orders.py`
- **Image uploads**: Add `python-multipart` file upload endpoint + serve from `backend/static/`
- **Email notifications**: Hook into order creation for confirmation emails
- **Search**: Add full-text search with SQLite FTS5 or swap to PostgreSQL
- **Rate limiting**: Add `slowapi` middleware for production

---

## 📝 Notes

- Checkout is **mock** (no real payment gateway) — orders are created with `status: "pending"`
- Product images use Unsplash URLs — works offline too (just shows placeholder background)
- SQLite is file-based (`backend/ecommerce.db`) — no external database needed
- Both frontends share the same backend API with CORS enabled for local dev ports
