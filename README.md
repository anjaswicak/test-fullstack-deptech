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
APP_NAME=Test-Fullstack-Deptech
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=test-fullstack-deptech
# DB_USERNAME=root
# DB_PASSWORD=Jasswi14
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=stock_management
DB_USERNAME=stock_user
DB_PASSWORD=stock_password
DB_SSLMODE=disable
MYSQL_ATTR_SSL_CA=
MYSQL_ATTR_SSL_VERIFY_SERVER_CERT=false


SESSION_DRIVER=array
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=array
# CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

# API Configuration
API_PREFIX=api
API_VERSION=v1

# CORS Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000,localhost:8080,127.0.0.1:8080

JWT_SECRET=iqZ5C4hEHhBHpbsZPPDmCy6nb7f7Afhwz1SlhU7PTyv4lrTmEVZtGsIVVcegh8M2

```