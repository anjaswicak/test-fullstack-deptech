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

## 🧪 Testing

### Backend Testing

**Menggunakan Docker Compose:**
```bash
# Masuk ke container API
docker-compose exec api bash

# Jalankan tests
php artisan test
```

**Menggunakan Script Helper:**
```bash
# Via Docker
./docker.sh shell-api
php artisan test
```

**Manual (Non-Docker):**
```bash
cd api
php artisan test
```

### Frontend Testing

**Menggunakan Docker Compose:**
```bash
# Masuk ke container APP
docker-compose exec app sh

# Jalankan tests
npm test
```

**Menggunakan Script Helper:**
```bash
# Via Docker
./docker.sh shell-app
npm test
```

**Manual (Non-Docker):**
```bash
cd apps
npm test
```

## 🔧 Development

### Hot Reload Development

**Opsi 1: Menggunakan Docker Compose**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Lihat logs development
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

**Opsi 2: Menggunakan Script Helper**
```bash
# Start development environment
./docker.sh dev

# Stop development environment  
./docker.sh dev-down
```

Kedua aplikasi akan auto-reload pada perubahan file:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

### Database Management

**Menggunakan Docker Compose:**
```bash
# Akses database
docker-compose exec mysql mysql -u stock_user -p stock_management

# Reset database
docker-compose exec api php artisan migrate:fresh --seed
```

**Menggunakan Script Helper:**
```bash
# Akses database
./docker.sh db

# Reset database
./docker.sh shell-api
php artisan migrate:fresh --seed
```

## 📦 Production Deployment

### Docker Production

**Menggunakan Docker Compose:**
```bash
# Build dan deploy
docker-compose build
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Health check
docker-compose exec api curl http://localhost/health.php
docker-compose exec app curl http://localhost:3000
```

**Menggunakan Script Helper:**
```bash
# Build dan deploy
./docker.sh build
./docker.sh up

# Monitor logs
./docker.sh logs
```

### Environment Setup
1. Copy `.env.docker` files ke `.env`
2. Update configuration sesuai environment production
3. Generate Laravel app key
4. Setup database credentials
5. Configure JWT secret

## 🛠️ Troubleshooting

### Port Conflicts
```bash
# Check port usage
lsof -i :3000
lsof -i :8000
lsof -i :3306

# Change ports in docker-compose.yml if needed
```

### Permission Issues

**Menggunakan Docker Compose:**
```bash
# Fix Laravel permissions
docker-compose exec api bash
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

**Menggunakan Script Helper:**
```bash
# Fix Laravel permissions
./docker.sh shell-api
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### Database Issues

**Menggunakan Docker Compose:**
```bash
# Reset database
docker-compose exec api php artisan migrate:fresh --seed

# Check database connection
docker-compose exec mysql mysql -u stock_user -p stock_management
```

**Menggunakan Script Helper:**
```bash
# Reset database
./docker.sh shell-api
php artisan migrate:fresh --seed

# Check database connection
./docker.sh db
```

### Advanced Troubleshooting

**Docker Compose Commands:**
```bash
# Rebuild without cache
docker-compose build --no-cache

# Start dengan rebuild
docker-compose up --build -d

# Remove volumes (reset database)
docker-compose down -v

# Remove everything (containers, networks, images)
docker-compose down --rmi all -v

# Monitor resource usage
docker-compose top
docker stats $(docker-compose ps -q)
```

## 📄 License

Project ini menggunakan lisensi MIT.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📞 Support

Untuk bantuan dan support:
- Create issue di repository
- Email: support@stockmanagement.com
- Documentation: Check README files di masing-masing folder

---

**Made with ❤️ using Laravel & Next.js**
