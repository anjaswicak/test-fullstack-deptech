<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        try {
            $query = Product::with('category');

            // Filter by category
            if ($request->has('category_id') && $request->category_id) {
                $query->where('category_id', $request->category_id);
            }

            // Search by name
            if ($request->has('search') && $request->search) {
                $query->where('nama_produk', 'like', '%' . $request->search . '%');
            }

            $products = $query->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Products retrieved successfully',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_produk' => 'required|string|max:255|unique:products',
            'deskripsi_produk' => 'nullable|string',
            'gambar_produk' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'required|exists:categories,id',
            'stok_produk' => 'required|integer|min:0',
            'harga_produk' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $productData = [
                'nama_produk' => $request->nama_produk,
                'deskripsi_produk' => $request->deskripsi_produk,
                'category_id' => $request->category_id,
                'stok_produk' => $request->stok_produk,
                'harga_produk' => $request->harga_produk,
            ];

            // Handle image upload
            if ($request->hasFile('gambar_produk')) {
                $image = $request->file('gambar_produk');
                $filename = time() . '_' . str_replace(' ', '_', $request->nama_produk) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $productData['gambar_produk'] = $path;
            }

            $product = Product::create($productData);
            $product->load('category');

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product
     */
    public function show($id)
    {
        try {
            $product = Product::with(['category', 'transactions.user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Product retrieved successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nama_produk' => 'required|string|max:255|unique:products,nama_produk,' . $id,
            'deskripsi_produk' => 'nullable|string',
            'gambar_produk' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'required|exists:categories,id',
            'stok_produk' => 'required|integer|min:0',
            'harga_produk' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::findOrFail($id);
            
            $productData = [
                'nama_produk' => $request->nama_produk,
                'deskripsi_produk' => $request->deskripsi_produk,
                'category_id' => $request->category_id,
                'stok_produk' => $request->stok_produk,
                'harga_produk' => $request->harga_produk,
            ];

            // Handle image upload
            if ($request->hasFile('gambar_produk')) {
                // Delete old image
                if ($product->gambar_produk && Storage::disk('public')->exists($product->gambar_produk)) {
                    Storage::disk('public')->delete($product->gambar_produk);
                }

                $image = $request->file('gambar_produk');
                $filename = time() . '_' . str_replace(' ', '_', $request->nama_produk) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $productData['gambar_produk'] = $path;
            }

            $product->update($productData);
            $product->load('category');

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product
     */
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            
            // Delete image if exists
            if ($product->gambar_produk && Storage::disk('public')->exists($product->gambar_produk)) {
                Storage::disk('public')->delete($product->gambar_produk);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get low stock products
     */
    public function lowStock(Request $request)
    {
        try {
            $threshold = $request->input('threshold', 10);
            
            $products = Product::with('category')
                             ->where('stok_produk', '<=', $threshold)
                             ->orderBy('stok_produk', 'asc')
                             ->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Low stock products retrieved successfully',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve low stock products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
