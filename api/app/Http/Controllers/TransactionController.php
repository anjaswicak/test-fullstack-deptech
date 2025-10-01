<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions
     */
    public function index(Request $request)
    {
        try {
            $query = Transaction::with(['product.category', 'user']);

            // Filter by type
            if ($request->has('type') && in_array($request->type, ['stock_in', 'stock_out'])) {
                $query->where('type', $request->type);
            }

            // Filter by product
            if ($request->has('product_id') && $request->product_id) {
                $query->where('product_id', $request->product_id);
            }

            // Filter by date range
            if ($request->has('start_date') && $request->start_date) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            if ($request->has('end_date') && $request->end_date) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            $transactions = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Transactions retrieved successfully',
                'data' => $transactions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created transaction
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:stock_in,stock_out',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $product = Product::findOrFail($request->product_id);

            // Check if stock out quantity is available
            if ($request->type === 'stock_out' && $product->stok_produk < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock. Available: ' . $product->stok_produk,
                    'available_stock' => $product->stok_produk
                ], 400);
            }

            $transaction = Transaction::create([
                'product_id' => $request->product_id,
                'type' => $request->type,
                'quantity' => $request->quantity,
                'notes' => $request->notes,
                'user_id' => auth()->id(),
            ]);

            $transaction->load(['product.category', 'user']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified transaction
     */
    public function show($id)
    {
        try {
            $transaction = Transaction::with(['product.category', 'user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Transaction retrieved successfully',
                'data' => $transaction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get transaction statistics
     */
    public function stats(Request $request)
    {
        try {
            $startDate = $request->input('start_date', now()->startOfMonth());
            $endDate = $request->input('end_date', now()->endOfMonth());

            $stats = [
                'total_transactions' => Transaction::whereBetween('created_at', [$startDate, $endDate])->count(),
                'stock_in_transactions' => Transaction::where('type', 'stock_in')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->count(),
                'stock_out_transactions' => Transaction::where('type', 'stock_out')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->count(),
                'total_stock_in' => Transaction::where('type', 'stock_in')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('quantity'),
                'total_stock_out' => Transaction::where('type', 'stock_out')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('quantity'),
            ];

            // Most active products
            $activeProducts = Transaction::select('product_id', DB::raw('COUNT(*) as transaction_count'))
                ->with('product:id,nama_produk')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('product_id')
                ->orderBy('transaction_count', 'desc')
                ->limit(5)
                ->get();

            $stats['most_active_products'] = $activeProducts;

            return response()->json([
                'success' => true,
                'message' => 'Transaction statistics retrieved successfully',
                'data' => $stats,
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transaction statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get transaction history for a specific product
     */
    public function productHistory($productId, Request $request)
    {
        try {
            $query = Transaction::where('product_id', $productId)
                              ->with(['user:id,name,email']);

            if ($request->has('type') && in_array($request->type, ['stock_in', 'stock_out'])) {
                $query->where('type', $request->type);
            }

            $transactions = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Product transaction history retrieved successfully',
                'data' => $transactions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve product transaction history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
