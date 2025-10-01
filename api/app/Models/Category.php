<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_kategori',
        'deskripsi_kategori'
    ];

    /**
     * Get products for this category
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
