# CORS Configuration Fix

## Masalah yang Diperbaiki
Akses API terkena CORS (Cross-Origin Resource Sharing) error saat frontend Next.js mencoba mengakses Laravel API.

## Perubahan yang Dilakukan

### 1. Update Bootstrap App (`api/bootstrap/app.php`)
Menambahkan CORS middleware ke API routes:

```php
->withMiddleware(function (Middleware $middleware): void {
    // API-only middleware configuration
    $middleware->alias([
        'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        'role' => \App\Http\Middleware\RoleMiddleware::class,
    ]);
    
    // Add CORS middleware for API routes
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

### 2. Update CORS Config (`api/config/cors.php`)
Mengkonfigurasi allowed origins dan headers yang lebih spesifik:

```php
'allowed_origins' => [
    'http://localhost:3000',    // Next.js development
    'http://127.0.0.1:3000',   // Alternative localhost
    'http://localhost:3001',    // Alternative port
    'http://127.0.0.1:3001',   
    'http://localhost:8080',    // Webpack dev server
    'http://127.0.0.1:8080',   
    'http://localhost:8000',    // Laravel development
    'http://127.0.0.1:8000',   
],

'allowed_headers' => [
    'Accept',
    'Authorization',
    'Content-Type',
    'X-Requested-With',
    'X-CSRF-TOKEN',
    'X-Socket-ID',
],
```

## Testing CORS

### 1. Test dengan Curl
```bash
# Test basic API call
curl -X GET "http://127.0.0.1:8000/api/test" \
     -H "Origin: http://localhost:3000" \
     -i

# Test preflight request
curl -X OPTIONS "http://127.0.0.1:8000/api/test" \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -i
```

### 2. Test dengan Browser
Buka file `cors-test.html` di browser untuk test CORS secara visual.

### 3. Response Headers yang Diharapkan
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Vary: Origin
```

## Frontend Configuration
Pastikan frontend menggunakan URL yang benar di file environment:

```bash
# apps/.env.docker atau apps/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Troubleshooting

### 1. Jika Masih Ada Error CORS
- Pastikan Laravel server berjalan di port 8000
- Pastikan frontend berjalan di port 3000
- Clear browser cache dan hard refresh
- Periksa browser developer tools untuk melihat preflight requests

### 2. Jika API Tidak Responsif
```bash
# Restart Laravel server
cd api
php artisan serve --host=127.0.0.1 --port=8000
```

### 3. Jika Error di Production
Sesuaikan `allowed_origins` dengan domain production:
```php
'allowed_origins' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
],
```

## Commands untuk Testing

```bash
# Start Laravel API server
cd api
php artisan serve --host=127.0.0.1 --port=8000

# Start Next.js frontend (di terminal terpisah)
cd apps
npm run dev

# Test API endpoint
curl http://127.0.0.1:8000/api/test
```

## Status
✅ CORS middleware ditambahkan ke API routes
✅ CORS config dikonfigurasi dengan allowed origins yang spesifik
✅ Testing berhasil dengan curl menunjukkan header CORS yang benar
✅ API endpoint /test responsif dan mengembalikan JSON yang benar