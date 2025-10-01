<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // API-only middleware configuration
        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Force all 404 responses to be JSON (API-only application)
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            return response()->json([
                'success' => false,
                'message' => 'API endpoint not found',
                'error' => 'The requested resource could not be found',
                'status_code' => 404,
                'timestamp' => now()->toISOString()
            ], 404);
        });
        
        // Force all 405 responses to be JSON
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException $e, $request) {
            return response()->json([
                'success' => false,
                'message' => 'Method not allowed',
                'error' => 'The HTTP method used is not allowed for this endpoint',
                'status_code' => 405,
                'timestamp' => now()->toISOString()
            ], 405);
        });
        
        // Force all other errors to be JSON if it's an API-only app
        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                
                return response()->json([
                    'success' => false,
                    'message' => 'An error occurred',
                    'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                    'status_code' => $statusCode,
                    'timestamp' => now()->toISOString()
                ], $statusCode);
            }
        });
    })->create();
