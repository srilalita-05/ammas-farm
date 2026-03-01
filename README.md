<<<<<<< HEAD
# 🌾 Amma's Farm — Local Farmer Direct-to-Customer E-Commerce Platform

A full-stack web application that allows a local farmer (admin) to sell agricultural products directly to customers.

---

## 🏗️ Project Structure

```
farmer-platform/
├── backend/                    # Django REST API
│   ├── farmer_backend/         # Main Django settings & URLs
│   ├── accounts/               # User authentication (JWT)
│   ├── products/               # Product management
│   ├── cart/                   # Shopping cart
│   ├── orders/                 # Order management
│   ├── media/                  # Uploaded images
│   ├── requirements.txt
│   ├── manage.py
│   └── seed_data.py            # Sample data script
│
└── frontend/                   # React.js application
    ├── src/
    │   ├── components/          # Layout, Navbar
    │   ├── context/             # Auth & Cart context
    │   ├── pages/
    │   │   ├── admin/           # Dashboard, Products, Orders
    │   │   └── customer/        # Shop, Cart, Checkout, My Orders
    │   ├── services/            # Axios API calls
    │   └── index.css            # Rural-themed styles
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Backend    | Django 4.2 + Django REST Framework   |
| Auth       | JWT (SimpleJWT)                      |
| Database   | SQLite (development)                 |
| Frontend   | React 18 + React Router 6            |
| HTTP Client| Axios                                |
| Styling    | Custom CSS (rural theme)             |
| Build Tool | Vite                                 |

---

## 🚀 Setup & Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip

---

### 1️⃣ Backend Setup

```bash
# Navigate to backend
cd farmer-platform/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Load sample data (creates admin + products)
python seed_data.py

# Start backend server
python manage.py runserver
```

✅ Backend runs at: **http://localhost:8000**

---

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend
cd farmer-platform/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend runs at: **http://localhost:3000**

---

## 🔐 Demo Login Credentials

| Role     | Username    | Password     |
|----------|-------------|--------------|
| Admin    | `admin`     | `admin123`   |
| Customer | `customer1` | `customer123`|

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint              | Description          | Auth    |
|--------|-----------------------|----------------------|---------|
| POST   | /api/auth/register/   | Register new user    | Public  |
| POST   | /api/auth/login/      | Login (get JWT)      | Public  |
| POST   | /api/auth/logout/     | Logout               | User    |
| POST   | /api/auth/token/refresh/ | Refresh JWT       | Public  |
| GET    | /api/auth/profile/    | Get profile          | User    |
| PATCH  | /api/auth/profile/    | Update profile       | User    |

### Products (Public)
| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | /api/products/        | List all products (searchable) |
| GET    | /api/products/{id}/   | Product detail                 |

### Products (Admin Only)
| Method | Endpoint                          | Description          |
|--------|-----------------------------------|----------------------|
| GET    | /api/products/admin/              | All products (admin) |
| POST   | /api/products/admin/              | Create product       |
| PATCH  | /api/products/admin/{id}/         | Update product       |
| DELETE | /api/products/admin/{id}/         | Delete product       |
| GET    | /api/products/admin/dashboard/stats/ | Dashboard stats  |

### Cart (Authenticated)
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | /api/cart/            | View cart             |
| POST   | /api/cart/add/        | Add item to cart      |
| PATCH  | /api/cart/item/{id}/  | Update item quantity  |
| DELETE | /api/cart/item/{id}/  | Remove item           |
| DELETE | /api/cart/clear/      | Clear entire cart     |

### Orders
| Method | Endpoint                        | Description             | Auth     |
|--------|---------------------------------|-------------------------|----------|
| POST   | /api/orders/create/             | Place order from cart   | Customer |
| GET    | /api/orders/my-orders/          | Customer order history  | Customer |
| GET    | /api/orders/admin/              | All orders              | Admin    |
| PUT    | /api/orders/admin/{id}/status/  | Update order status     | Admin    |

---

## 📋 Query Parameters (Products)

```
GET /api/products/?search=tomato
GET /api/products/?available_only=true
GET /api/products/?seasonal_availability=true
GET /api/products/?ordering=price
GET /api/products/?ordering=-price
GET /api/products/?page=2
```

---

## 🧑‍💼 User Roles

### Admin (Farmer)
- Login with admin credentials
- Manage all products (add/edit/delete/price/stock/image)
- Toggle seasonal availability
- View all customer orders
- Update order status (Pending → Packed → Shipped → Delivered)
- Dashboard with stats & low stock alerts

### Customer
- Browse all products publicly (no login needed)
- Register/login to place orders
- Add/remove items from cart, update quantities
- Place orders with delivery details
- View order history with live status tracker

---

## 🎨 UI Features

- 🌾 Rural farm theme with earthy green & cream palette
- 📱 Mobile responsive
- 🔍 Search & filter products
- ⚠️ Low stock alerts on dashboard
- 📊 Order progress tracker (Pending → Packed → Shipped → Delivered)
- 🛒 Live cart counter in navbar
- 🔄 Auto JWT token refresh

---

## 🔧 Environment Notes

- In production, change `SECRET_KEY` in `settings.py`
- Set `DEBUG = False` for production
- Replace SQLite with PostgreSQL for production
- Configure proper `ALLOWED_HOSTS`
- Use environment variables (python-decouple)
- Set up proper media file storage (S3/Cloudinary for images)

---

## 📦 Database Models

### User (accounts)
- id, username, email, first_name, last_name
- phone_number, address, role (admin/customer)

### Product (products)
- id, name, description, price, stock_quantity
- seasonal_availability, image, unit, low_stock_threshold
- created_at, updated_at

### CartItem (cart)
- id, user (FK), product (FK), quantity, created_at

### Order (orders)
- id, user (FK), total_amount, order_status
- delivery_address, phone_number, notes, created_at

### OrderItem (orders)
- id, order (FK), product (FK)
- product_name (snapshot), product_price (snapshot)
- quantity, unit

---

*Built with ❤️ for Amma's Farm*
=======
# ammas-farm
>>>>>>> 76da21e13bdfb682da0a286b0a1c5a916e372d62
