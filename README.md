<div align="center">
  <img src="./app/favicon.ico" alt="GoCart Logo" width="60" />
  <h1>GoCart 🛒</h1>
  <p><strong>A production-ready Full Stack Multi-Vendor E-Commerce Platform</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192?style=for-the-badge&logo=postgresql)
  ![Prisma](https://img.shields.io/badge/Prisma-6.6-2D3748?style=for-the-badge&logo=prisma)
  ![Stripe](https://img.shields.io/badge/Stripe-Payment-6772E5?style=for-the-badge&logo=stripe)
  ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

  <br />

  🌐 **Live Demo:** [gocart-psi-six.vercel.app](https://gocart-psi-six.vercel.app)
  
  📦 **GitHub:** [github.com/akshaykumar112151/gocart](https://github.com/akshaykumar112151/gocart)

</div>

---

## 📌 About

GoCart is a **production-ready Full Stack Multi-Vendor E-Commerce Platform** built with Next.js 15. It supports three distinct roles — **Customer, Seller (Vendor), and Admin** — each with their own dedicated dashboard and features.

---

## ✨ Features

### 👤 Customer
- 🔐 Google OAuth Login/Logout
- 🛍️ Browse, Search & Filter products by category
- 📦 Product detail page with ratings & reviews
- 🛒 Cart management (add, remove, update quantity)
- 📍 Address management (add, edit, delete)
- 🎟️ Coupon/discount code support
- 💳 Place orders via **COD** or **Stripe Payment**
- 📋 Order history with status tracking
- ❌ Cancel & Delete orders
- ⭐ Rate & Review delivered products
- 📄 Pagination on shop page

### 🏪 Seller (Vendor)
- 🏗️ Create & manage your own store
- ➕ Add, Edit, Delete products
- 🔄 Toggle product stock on/off
- 📊 Store dashboard with real earnings & chart
- 📦 View & manage store orders
- 🔄 Update order status
- ⭐ View customer reviews & ratings

### 👨‍💼 Admin
- 📊 Dashboard with real stats (Products, Revenue, Orders, Stores)
- 📈 Orders/Day area chart
- ✅ Approve / Reject store applications
- 🔛 Toggle store active/inactive
- 🗑️ Delete stores
- 🎟️ Manage discount coupons
- 📄 Pagination everywhere

---

## 🛠️ Tech Stack

| Technology | Version | Use |
|---|---|---|
| **Next.js** | 15.3.5 | Framework (SSR + API Routes) |
| **React** | 19 | UI Components |
| **Tailwind CSS** | v4 | Styling + Responsive Design |
| **Redux Toolkit** | latest | Global State Management |
| **NextAuth.js** | v4 | Google OAuth Authentication |
| **Prisma ORM** | 6.6.0 | Database Queries |
| **PostgreSQL** | 17 | Cloud Database (Neon) |
| **Cloudinary** | latest | Image Upload & Storage |
| **Stripe** | latest | Online Payment Gateway |
| **Recharts** | latest | Charts & Graphs |
| **React Hot Toast** | latest | Notifications |
| **Lucide React** | latest | Icons |

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| **User** | Logged in users (Google OAuth) |
| **Store** | Vendor stores |
| **Product** | Products |
| **Order** | Customer orders |
| **OrderItem** | Products inside each order |
| **Address** | Delivery addresses |
| **Rating** | Product ratings & reviews |
| **Coupon** | Discount coupons |

---

## 🔗 Pages

### 👤 Customer
| Page | URL |
|---|---|
| Home | `/` |
| Shop | `/shop` |
| Store Shop | `/shop/[username]` |
| Product Detail | `/product/[id]` |
| Cart | `/cart` |
| Orders | `/orders` |
| Create Store | `/create-store` |
| Pricing | `/pricing` |

### 🏪 Seller
| Page | URL |
|---|---|
| Dashboard | `/store` |
| Add Product | `/store/add-product` |
| Manage Products | `/store/manage-product` |
| Store Orders | `/store/orders` |

### 👨‍💼 Admin
| Page | URL |
|---|---|
| Dashboard | `/admin` |
| Approve Stores | `/admin/approve` |
| All Stores | `/admin/stores` |
| Coupons | `/admin/coupons` |

---

## 🔌 API Routes (27 Total)

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | Google Login/Logout |
| `/api/store/create` | POST | Create new store |
| `/api/store/my-store` | GET | Get my store |
| `/api/store/[username]` | GET | Get store by username |
| `/api/store/dashboard` | GET | Store stats |
| `/api/store/orders` | GET/PUT | Store orders |
| `/api/product/all` | GET | All products |
| `/api/product/add` | POST | Add product |
| `/api/product/my-products` | GET | My products |
| `/api/product/toggle-stock` | POST | Toggle stock |
| `/api/product/delete` | POST | Delete product |
| `/api/order/place` | POST | Place COD order |
| `/api/order/my-orders` | GET/PATCH/DELETE | My orders |
| `/api/address/add` | POST | Add address |
| `/api/address/update` | PUT | Update address |
| `/api/address/delete` | DELETE | Delete address |
| `/api/coupon/apply` | POST | Apply coupon |
| `/api/rating/add` | POST | Add rating |
| `/api/rating/my-ratings` | GET | My ratings |
| `/api/admin/dashboard` | GET | Admin stats |
| `/api/admin/stores` | GET | All stores |
| `/api/admin/approve-store` | POST | Approve/Reject store |
| `/api/admin/delete-store` | DELETE | Delete store |
| `/api/payment/create-checkout-session` | POST | Stripe session |
| `/api/payment/webhook` | POST | Stripe webhook |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Cloudinary account
- Stripe account
- Google OAuth credentials

### Installation
```bash
# Clone the repository
git clone https://github.com/akshaykumar112151/gocart.git
cd gocart

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in your environment variables

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ADMIN_EMAIL=
NEXT_PUBLIC_CURRENCY_SYMBOL=$
```

---

## 📱 Responsive Design

GoCart is fully responsive and works on all devices:
- ✅ Mobile hamburger menu
- ✅ Cart page — card layout on mobile
- ✅ Shop page — 2 column grid
- ✅ Store Orders — card layout on mobile
- ✅ Admin Dashboard — 2 column cards on mobile

---

## 👨‍💻 Author

**Akshay Kumar**
- GitHub: [@akshaykumar112151](https://github.com/akshaykumar112151)

---

## 📄 License

This project is licensed under the MIT License.
