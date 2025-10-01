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

## 🐳 Docker Deployment

### Prasyarat
- Docker & Docker Compose terinstall
- Port 3000, 8000, 3306, 6379 tersedia

### 🚀 Quick Start

**Opsi 1: Setup Otomatis (Recommended)**

1. **Clone Repository**
   ```bash
   git clone https://github.com/anjaswicak/test-fullstack-deptech.git
   cd test-fullstack-deptech
   ```

2. **Setup Aplikasi dengan Script**
   ```bash
   ./docker.sh setup
   ```
   Script ini akan:
   - Copy file environment
   - Build semua container
   - Setup database dan migrasi
   - Menjalankan seeder

**Opsi 2: Setup Manual dengan Docker Compose**

1. **Clone Repository**
   ```bash
   git clone https://github.com/anjaswicak/test-fullstack-deptech.git
   cd test-fullstack-deptech
   ```

2. **Setup Environment Files**
   ```bash
   cp api/.env.docker api/.env
   cp app/.env.docker app/.env.local
   cp .env.docker .env
   ```

3. **Build dan Start Containers**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Setup Database**
   ```bash
   # Wait for database to be ready (30 seconds)
   sleep 30
   
   # Generate Laravel app key
   docker-compose exec api php artisan key:generate --force
   
   # Run migrations
   docker-compose exec api php artisan migrate --force
   
   # Run seeders
   docker-compose exec api php artisan db:seed --force
   ```

**Akses Aplikasi**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 🗄️ **Database**: localhost:3306

### 🛠️ Docker Commands

#### Opsi 1: Menggunakan Docker Compose Langsung

**Production Environment**
```bash
# Build semua containers
docker-compose build

# Start aplikasi
docker-compose up -d

# Stop aplikasi
docker-compose down

# Lihat status
docker-compose ps

# Lihat logs
docker-compose logs -f

# Restart services
docker-compose restart
```

**Development Environment**
```bash
# Start development (dengan hot reload)
docker-compose -f docker-compose.dev.yml up -d

# Stop development
docker-compose -f docker-compose.dev.yml down

# Build development containers
docker-compose -f docker-compose.dev.yml build
```

**Utility Commands**
```bash
# Akses shell container
docker-compose exec api bash        # Laravel container
docker-compose exec app sh          # Next.js container

# Akses database
docker-compose exec mysql mysql -u stock_user -p stock_management

# Lihat logs service tertentu
docker-compose logs -f api
docker-compose logs -f app

# Restart service tertentu
docker-compose restart api

# Cleanup lengkap
docker-compose down -v --rmi all
```

#### Opsi 2: Menggunakan Script Helper (Recommended)

**Production Environment**
```bash
# Start aplikasi
./docker.sh up

# Stop aplikasi
./docker.sh down

# Build ulang container
./docker.sh build

# Restart container
./docker.sh restart
```

**Development Environment**
```bash
# Start development (dengan hot reload)
./docker.sh dev

# Stop development
./docker.sh dev-down
```

**Utility Commands**
```bash
# Lihat status container
./docker.sh status

# Lihat logs semua service
./docker.sh logs

# Lihat logs service tertentu
./docker.sh logs api
./docker.sh logs app

# Akses shell container
./docker.sh shell-api    # Laravel container
./docker.sh shell-app    # Next.js container

# Akses database
./docker.sh db

# Cleanup lengkap
./docker.sh clean
```

### 📁 Struktur Docker

```
test-fullstack-deptech/
├── api/                     # Laravel Backend
│   ├── Dockerfile          # Production build
│   ├── Dockerfile.dev      # Development build
│   ├── .dockerignore       # Docker ignore rules
│   └── .env.docker         # Environment template
├── app/                     # Next.js Frontend
│   ├── Dockerfile          # Production build
│   ├── .dockerignore       # Docker ignore rules
│   ├── next.config.js      # Next.js configuration
│   └── .env.docker         # Environment template
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── .env.docker            # Main environment template
└── docker.sh              # Docker management script (optional)
```

### ⚙️ Cara Penggunaan

Anda memiliki **2 opsi** untuk menjalankan aplikasi:

#### 🎯 **Opsi 1: Docker Compose Standar (Recommended untuk DevOps)**
- Menggunakan perintah `docker-compose` standar
- Familiar untuk tim DevOps dan production deployment
- Full control atas semua docker commands
- Sesuai dengan dokumentasi Docker official

#### 🛠️ **Opsi 2: Script Helper (Recommended untuk Developer)**  
- Menggunakan script `./docker.sh` 
- User-friendly dengan colored output
- Automated setup dan error handling
- Shortcuts untuk development workflow

**Pilih sesuai preferensi tim Anda!** Kedua cara memberikan hasil yang sama.

## 🔧 Manual Setup (Non-Docker)

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

### Frontend Setup
```bash
cd app
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
cd app
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
