<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        try {
            $categories = Category::withCount('products')->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_kategori' => 'required|string|max:255|unique:categories',
            'deskripsi_kategori' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $category = Category::create([
                'nama_kategori' => $request->nama_kategori,
                'deskripsi_kategori' => $request->deskripsi_kategori,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified category
     */
    public function show($id)
    {
        try {
            $category = Category::with('products')->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Category retrieved successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nama_kategori' => 'required|string|max:255|unique:categories,nama_kategori,' . $id,
            'deskripsi_kategori' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $category = Category::findOrFail($id);
            
            $category->update([
                'nama_kategori' => $request->nama_kategori,
                'deskripsi_kategori' => $request->deskripsi_kategori,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified category
     */
    public function destroy($id)
    {
        try {
            $category = Category::findOrFail($id);
            
            // Check if category has products
            if ($category->products()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with associated products'
                ], 400);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all categories for dropdown
     */
    public function dropdown()
    {
        try {
            $categories = Category::select('id', 'nama_kategori')->get();

            return response()->json([
                'success' => true,
                'message' => 'Categories for dropdown retrieved successfully',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
