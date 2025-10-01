# 🏢 Stock Management System

Sistem manajemen stok inventori dengan teknologi full-stack modern yang mendukung deployment menggunakan Docker.

## 🚀 Teknologi Stack

### Backend (Laravel API)
- **Laravel 12.21.0** - PHP Framework
- **PHP 8.2** - Server-side language
- **MySQL 8.0** - Database
- **JWT Authentication** - Secure API authentication
- **Redis** - Caching and session storage

### Frontend (Next.js)
- **Next.js 15.5.4** - React Framework
- **React 18** - UI Library
- **Tailwind CSS** - Utility-first CSS framework
- **React Select** - Advanced select components
- **Axios** - HTTP client
- **js-cookie** - Cookie management

## 🔧 Manual Setup

### Backend Setup
```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```
- sesuaikan koneksi database dengan yang digunakan

### Frontend Setup
```bash
cd apps
npm install
cp .env.example .env.local
npm run dev
```

## 🎯 Fitur Aplikasi

### 🔐 Authentication
- Login/Logout dengan JWT
- Refresh Token functionality
- Role-based access control (User, Admin, Super Admin)

### 📂 Category Management
- CRUD kategori produk
- Search dan filter
- Pagination

### 📦 Product Management
- CRUD produk dengan upload gambar
- Kategori assignment
- Stock tracking
- Low stock alerts

### 🔄 Transaction Management
- Stock in/out transactions
- Transaction history
- Real-time stock updates

### 👥 Admin Management
- User admin management (Super Admin only)
- Role assignment
- User profile management

### 📊 Dashboard
- Real-time statistics
- Animated counters
- Recent transactions
- Low stock alerts

## 🌍 Environment Configuration

### API (.env)
```env
APP_NAME="Stock Management API"
APP_ENV=production
APP_KEY=base64:YourGeneratedAppKeyHere
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=stock_management
DB_USERNAME=stock_user
DB_PASSWORD=stock_password

JWT_SECRET=your_jwt_secret_key
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Stock Management System"
```

## 🚦 Default Credentials

Setelah setup selesai, gunakan kredensial berikut:

### Super Admin
- **Email**: admin@example.com
- **Password**: password

### Admin
- **Email**: user@example.com
- **Password**: password

## 📋 API Documentation

Dokumentasi API lengkap tersedia di:
- **File**: `api/README.md`
- **Endpoints**: `/api/v1/*`
- **Authentication**: Bearer Token (JWT)

### Base URLs
- **Production**: http://localhost:8000/api
- **Development**: http://localhost:8000/api

