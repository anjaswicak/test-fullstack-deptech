<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Display a listing of admins
     */
    public function index()
    {
        try {
            $admins = User::whereIn('role', ['admin', 'super_admin'])
                         ->select('id', 'name', 'nama_depan', 'nama_belakang', 'email', 'tanggal_lahir', 'jenis_kelamin', 'role', 'created_at')
                         ->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Admins retrieved successfully',
                'data' => $admins
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve admins',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created admin
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'nama_depan' => 'required|string|max:255',
            'nama_belakang' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,super_admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $admin = User::create([
                'name' => $request->name,
                'nama_depan' => $request->nama_depan,
                'nama_belakang' => $request->nama_belakang,
                'email' => $request->email,
                'tanggal_lahir' => $request->tanggal_lahir,
                'jenis_kelamin' => $request->jenis_kelamin,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin created successfully',
                'data' => $admin->makeHidden(['password'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified admin
     */
    public function show($id)
    {
        try {
            $admin = User::whereIn('role', ['admin', 'super_admin'])
                        ->where('id', $id)
                        ->select('id', 'name', 'nama_depan', 'nama_belakang', 'email', 'tanggal_lahir', 'jenis_kelamin', 'role', 'created_at')
                        ->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Admin retrieved successfully',
                'data' => $admin
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified admin
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'nama_depan' => 'required|string|max:255',
            'nama_belakang' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'password' => 'nullable|string|min:6|confirmed',
            'role' => 'required|in:admin,super_admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $admin = User::whereIn('role', ['admin', 'super_admin'])->findOrFail($id);

            $updateData = [
                'name' => $request->name,
                'nama_depan' => $request->nama_depan,
                'nama_belakang' => $request->nama_belakang,
                'email' => $request->email,
                'tanggal_lahir' => $request->tanggal_lahir,
                'jenis_kelamin' => $request->jenis_kelamin,
                'role' => $request->role,
            ];

            if ($request->password) {
                $updateData['password'] = Hash::make($request->password);
            }

            $admin->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Admin updated successfully',
                'data' => $admin->makeHidden(['password'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified admin
     */
    public function destroy($id)
    {
        try {
            $admin = User::whereIn('role', ['admin', 'super_admin'])->findOrFail($id);
            
            // Prevent deleting the last super admin
            if ($admin->role === 'super_admin') {
                $superAdminCount = User::where('role', 'super_admin')->count();
                if ($superAdminCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot delete the last super admin'
                    ], 400);
                }
            }

            $admin->delete();

            return response()->json([
                'success' => true,
                'message' => 'Admin deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
