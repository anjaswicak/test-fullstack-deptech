<?php

use Illuminate\Support\Facades\Route;

// API-only application - web routes disabled
// All routes should be defined in routes/api.php
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