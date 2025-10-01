<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'error' => 'Authentication required',
                'status_code' => 401
            ], 401);
        }

        $user = auth()->user();
        
        // Check if user has any of the required roles
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden',
                'error' => 'Insufficient permissions. Required roles: ' . implode(', ', $roles),
                'status_code' => 403
            ], 403);
        }

        return $next($request);
    }
}
