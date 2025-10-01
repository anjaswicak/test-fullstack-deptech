<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ImageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Test API route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now(),
        'version' => 'v1'
    ]);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('refresh', [AuthController::class, 'refresh']); // Moved outside auth middleware
    
    // Protected auth routes
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Image upload routes (protected)
Route::middleware('auth:api')->prefix('images')->group(function () {
    Route::post('upload', [ImageController::class, 'upload']);
    Route::post('upload-multiple', [ImageController::class, 'uploadMultiple']);
    Route::delete('delete', [ImageController::class, 'delete']);
    Route::get('list', [ImageController::class, 'list']);
});

// Stock Management API Routes
Route::middleware('auth:api')->prefix('v1')->group(function () {
    
    // Add refresh token route specifically for v1 API
    Route::post('auth/refresh', [AuthController::class, 'refresh'])->withoutMiddleware('auth:api');
    
    // Admin Management Routes (Super Admin Only)
    Route::middleware('role:super_admin')->prefix('admins')->group(function () {
        Route::get('/', [AdminController::class, 'index']);
        Route::post('/', [AdminController::class, 'store']);
        Route::get('/{id}', [AdminController::class, 'show']);
        Route::put('/{id}', [AdminController::class, 'update']);
        Route::delete('/{id}', [AdminController::class, 'destroy']);
    });

    // Category Management Routes (Admin & Super Admin)
    Route::middleware('role:admin,super_admin')->prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::get('/dropdown', [CategoryController::class, 'dropdown']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    // Product Management Routes (Admin & Super Admin)
    Route::middleware('role:admin,super_admin')->prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::post('/', [ProductController::class, 'store']);
        Route::get('/low-stock', [ProductController::class, 'lowStock']);
        Route::get('/{id}', [ProductController::class, 'show']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });

    // Transaction Management Routes (Admin & Super Admin)
    Route::middleware('role:admin,super_admin')->prefix('transactions')->group(function () {
        Route::get('/', [TransactionController::class, 'index']);
        Route::post('/', [TransactionController::class, 'store']);
        Route::get('/stats', [TransactionController::class, 'stats']);
        Route::get('/product/{productId}/history', [TransactionController::class, 'productHistory']);
        Route::get('/{id}', [TransactionController::class, 'show']);
    });

    // Dashboard routes
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        
        if (!$user->isAdmin() && !$user->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $stats = [
            'total_products' => \App\Models\Product::count(),
            'total_categories' => \App\Models\Category::count(),
            'low_stock_products' => \App\Models\Product::where('stok_produk', '<=', 10)->count(),
            'total_transactions_today' => \App\Models\Transaction::whereDate('created_at', today())->count(),
            'recent_transactions' => \App\Models\Transaction::with(['product', 'user'])
                                                            ->orderBy('created_at', 'desc')
                                                            ->limit(5)
                                                            ->get()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Dashboard data retrieved successfully',
            'data' => $stats
        ]);
    });

    // User profile route
    Route::get('/profile', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'User profile',
            'user' => $request->user(),
            'permissions' => [
                'is_admin' => $request->user()->isAdmin(),
                'is_super_admin' => $request->user()->isSuperAdmin(),
                'is_user' => $request->user()->isUser(),
            ]
        ]);
    });
});

// Fallback route for 404 - must be at the end
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API route not found',
        'error' => 'The requested endpoint does not exist',
        'status_code' => 404,
        'timestamp' => now()->toISOString()
    ], 404)
    ->header('Content-Type', 'application/json');
});