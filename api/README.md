# 📚 Stock Management System API Documentation

Sistem API untuk manajemen stok inventori dengan fitur lengkap untuk kategori, produk, transaksi, dan manajemen admin.

## 🚀 Base URL

```
http://localhost:8000/api
```

## 🔐 Authentikasi

Sistem menggunakan JWT (JSON Web Token) untuk authentikasi. Setelah login, sertakan token di header setiap request:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Register

Mendaftarkan user baru ke sistem.

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com", 
  "password": "password123",
  "password_confirmation": "password123",
  "role": "user|admin|super_admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  },
  "token": "<JWT_TOKEN>",
  "refresh_token": "<REFRESH_TOKEN>",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Login

Masuk ke sistem dengan kredensial yang valid.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin"
  },
  "token": "<JWT_TOKEN>",
  "refresh_token": "<REFRESH_TOKEN>",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Refresh Token

Memperbarui access token yang sudah expired.

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "<REFRESH_TOKEN>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "<NEW_JWT_TOKEN>",
    "refresh_token": "<NEW_REFRESH_TOKEN>",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {...}
  }
}
```

### Logout

Keluar dari sistem dan invalidate token.

```http
POST /api/auth/logout
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "refresh_token": "<REFRESH_TOKEN>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Get User Profile

Mendapatkan informasi profil user yang sedang login.

```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

## 📂 Category Management

Endpoint untuk mengelola kategori produk (Admin & Super Admin only).

### Get All Categories

```http
GET /api/v1/categories
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `search` (optional): Pencarian berdasarkan nama kategori
- `page` (optional): Nomor halaman untuk pagination
- `per_page` (optional): Jumlah data per halaman (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "nama_kategori": "Elektronik",
        "deskripsi_kategori": "Produk elektronik dan gadget",
        "products_count": 5,
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z"
      }
    ],
    "last_page": 1,
    "per_page": 10,
    "total": 1
  }
}
```

### Create Category

```http
POST /api/v1/categories
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "nama_kategori": "Furniture",
  "deskripsi_kategori": "Perabotan rumah dan kantor"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 2,
    "nama_kategori": "Furniture",
    "deskripsi_kategori": "Perabotan rumah dan kantor",
    "products_count": 0,
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

### Get Category Dropdown

Mendapatkan list kategori untuk dropdown/select.

```http
GET /api/v1/categories/dropdown
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Categories dropdown retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama_kategori": "Elektronik"
    },
    {
      "id": 2,
      "nama_kategori": "Furniture"
    }
  ]
}
```

### Update Category

```http
PUT /api/v1/categories/{id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "nama_kategori": "Electronics Updated",
  "deskripsi_kategori": "Updated description"
}
```

### Delete Category

```http
DELETE /api/v1/categories/{id}
Authorization: Bearer <JWT_TOKEN>
```

## 📦 Product Management

Endpoint untuk mengelola produk (Admin & Super Admin only).

### Get All Products

```http
GET /api/v1/products
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `search` (optional): Pencarian berdasarkan nama produk
- `category_id` (optional): Filter berdasarkan kategori
- `page` (optional): Nomor halaman untuk pagination
- `per_page` (optional): Jumlah data per halaman (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "nama_produk": "Smartphone Samsung",
        "deskripsi_produk": "Smartphone flagship dengan kamera canggih",
        "harga_produk": "5000000.00",
        "stok_produk": 25,
        "gambar_produk": "products/smartphone.jpg",
        "category_id": 1,
        "category": {
          "id": 1,
          "nama_kategori": "Elektronik"
        },
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z"
      }
    ],
    "last_page": 1,
    "per_page": 10,
    "total": 1
  }
}
```

### Create Product

```http
POST /api/v1/products
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

{
  "nama_produk": "Laptop Gaming",
  "deskripsi_produk": "Laptop gaming dengan spesifikasi tinggi",
  "harga_produk": 15000000,
  "stok_produk": 10,
  "category_id": 1,
  "gambar_produk": <file>
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 2,
    "nama_produk": "Laptop Gaming",
    "deskripsi_produk": "Laptop gaming dengan spesifikasi tinggi",
    "harga_produk": "15000000.00",
    "stok_produk": 10,
    "gambar_produk": "products/laptop-gaming.jpg",
    "category_id": 1,
    "category": {
      "id": 1,
      "nama_kategori": "Elektronik"
    },
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

### Get Low Stock Products

Mendapatkan produk dengan stok rendah (≤ 10).

```http
GET /api/v1/products/low-stock
Authorization: Bearer <JWT_TOKEN>
```

### Update Product

```http
PUT /api/v1/products/{id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

{
  "nama_produk": "Updated Product Name",
  "harga_produk": 16000000,
  "stok_produk": 15,
  "gambar_produk": <file> (optional)
}
```

### Delete Product

```http
DELETE /api/v1/products/{id}
Authorization: Bearer <JWT_TOKEN>
```

## 🔄 Transaction Management

Endpoint untuk mengelola transaksi stok (Admin & Super Admin only).

### Get All Transactions

```http
GET /api/v1/transactions
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `search` (optional): Pencarian berdasarkan nama produk atau catatan
- `type` (optional): Filter berdasarkan tipe (`stock_in` atau `stock_out`)
- `product_id` (optional): Filter berdasarkan produk
- `page` (optional): Nomor halaman untuk pagination
- `per_page` (optional): Jumlah data per halaman (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "product_id": 1,
        "user_id": 1,
        "type": "stock_in",
        "quantity": 50,
        "notes": "Restock bulanan dari supplier",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "product": {
          "id": 1,
          "nama_produk": "Smartphone Samsung"
        },
        "user": {
          "id": 1,
          "name": "Admin User"
        }
      }
    ],
    "last_page": 1,
    "per_page": 10,
    "total": 1
  }
}
```

### Create Transaction

```http
POST /api/v1/transactions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "product_id": 1,
  "type": "stock_out",
  "quantity": 5,
  "notes": "Penjualan ke customer ABC"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 2,
    "product_id": 1,
    "user_id": 1,
    "type": "stock_out",
    "quantity": 5,
    "notes": "Penjualan ke customer ABC",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "product": {
      "id": 1,
      "nama_produk": "Smartphone Samsung",
      "stok_produk": 45
    },
    "user": {
      "id": 1,
      "name": "Admin User"
    }
  }
}
```

### Get Transaction Stats

Mendapatkan statistik transaksi harian.

```http
GET /api/v1/transactions/stats
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction stats retrieved successfully",
  "data": {
    "today_stock_in": 25,
    "today_stock_out": 15,
    "total_transactions": 150,
    "total_products_moved": 500
  }
}
```

### Get Product Transaction History

Mendapatkan riwayat transaksi untuk produk tertentu.

```http
GET /api/v1/transactions/product/{productId}/history
Authorization: Bearer <JWT_TOKEN>
```

## 👥 Admin Management

Endpoint untuk mengelola pengguna admin (Super Admin only).

### Get All Admins

```http
GET /api/v1/admins
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "nama_depan": "John",
        "nama_belakang": "Doe",
        "email": "admin@example.com",
        "tanggal_lahir": "1990-01-01",
        "jenis_kelamin": "L",
        "role": "admin",
        "created_at": "2025-01-01T00:00:00.000000Z"
      }
    ],
    "last_page": 1,
    "per_page": 10,
    "total": 1
  }
}
```

### Create Admin

```http
POST /api/v1/admins
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "nama_depan": "Jane",
  "nama_belakang": "Smith",
  "email": "jane@example.com",
  "tanggal_lahir": "1985-05-15",
  "jenis_kelamin": "P",
  "role": "admin",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Update Admin

```http
PUT /api/v1/admins/{id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "nama_depan": "Jane Updated",
  "role": "super_admin"
}
```

### Delete Admin

```http
DELETE /api/v1/admins/{id}
Authorization: Bearer <JWT_TOKEN>
```

## 📊 Dashboard

Endpoint untuk mendapatkan data dashboard.

### Get Dashboard Stats

```http
GET /api/v1/dashboard
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "total_products": 50,
    "total_categories": 8,
    "low_stock_products": 5,
    "total_transactions_today": 12,
    "recent_transactions": [
      {
        "id": 1,
        "type": "stock_in",
        "quantity": 10,
        "product": {
          "nama_produk": "Smartphone Samsung"
        },
        "user": {
          "name": "Admin User"
        },
        "created_at": "2025-01-01T00:00:00.000000Z"
      }
    ]
  }
}
```

## 🖼️ Image Upload

Endpoint untuk upload gambar produk.

### Upload Single Image

```http
POST /api/images/upload
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

{
  "image": <file>,
  "folder": "products" (optional)
}
```

### Upload Multiple Images

```http
POST /api/images/upload-multiple
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

{
  "images[]": <file1>,
  "images[]": <file2>,
  "folder": "products" (optional)
}
```

## 🔒 Role-based Access Control

### Roles:
- **user**: Read-only access
- **admin**: Full CRUD access to categories, products, transactions
- **super_admin**: All admin permissions + admin user management

### Required Roles per Endpoint:
- **Categories**: admin, super_admin
- **Products**: admin, super_admin  
- **Transactions**: admin, super_admin
- **Admin Management**: super_admin only
- **Dashboard**: admin, super_admin

## ⚠️ Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  },
  "status_code": 422
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid credentials",
  "status_code": 401
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied",
  "status_code": 403
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found",
  "status_code": 404
}
```

## 🧪 Testing API

### Test Connection
```http
GET /api/test
```

**Response:**
```json
{
  "message": "API is working!",
  "timestamp": "2025-01-01T00:00:00.000000Z",
  "version": "v1"
}
```

## 📝 Notes

1. Semua timestamp menggunakan format ISO 8601
2. File upload maksimal 2MB per file
3. Format gambar yang didukung: JPG, JPEG, PNG, GIF
4. Pagination default: 10 items per page
5. Token expired dalam 1 jam, refresh token 7 hari
6. Semua endpoint (kecuali auth) memerlukan authentication
7. Base currency: Rupiah (IDR)