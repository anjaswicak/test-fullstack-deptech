<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'notes',
        'user_id'
    ];

    /**
     * Get the product that owns the transaction
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user that made the transaction
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Boot method to automatically update product stock
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($transaction) {
            $transaction->product->updateStock($transaction->quantity, $transaction->type);
        });
    }
}
