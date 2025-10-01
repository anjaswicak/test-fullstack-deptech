<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_produk',
        'deskripsi_produk',
        'gambar_produk',
        'category_id',
        'stok_produk',
        'harga_produk'
    ];

    protected $casts = [
        'harga_produk' => 'decimal:2'
    ];

    /**
     * Get the category that owns the product
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get transactions for this product
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Update stock based on transaction
     */
    public function updateStock($quantity, $type)
    {
        if ($type === 'stock_in') {
            $this->increment('stok_produk', $quantity);
        } elseif ($type === 'stock_out') {
            $this->decrement('stok_produk', $quantity);
        }
    }
}
