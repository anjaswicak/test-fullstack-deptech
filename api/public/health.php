<?php

// Simple health check endpoint for Docker
header('Content-Type: application/json');

try {
    // Check database connection
    $pdo = new PDO(
        'mysql:host=' . ($_ENV['DB_HOST'] ?? 'localhost') . ';dbname=' . ($_ENV['DB_DATABASE'] ?? 'stock_management'),
        $_ENV['DB_USERNAME'] ?? 'root',
        $_ENV['DB_PASSWORD'] ?? '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $status = [
        'status' => 'healthy',
        'database' => 'connected',
        'timestamp' => date('Y-m-d H:i:s'),
        'version' => '1.0.0'
    ];
    
    http_response_code(200);
    echo json_encode($status);
    
} catch (Exception $e) {
    $status = [
        'status' => 'unhealthy',
        'database' => 'disconnected',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    http_response_code(503);
    echo json_encode($status);
}