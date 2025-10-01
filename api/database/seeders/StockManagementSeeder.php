<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StockManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::create([
            'name' => 'Super Administrator',
            'nama_depan' => 'Super',
            'nama_belakang' => 'Administrator',
            'email' => 'superadmin@stock.com',
            'tanggal_lahir' => '1990-01-01',
            'jenis_kelamin' => 'L',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
        ]);

        // Create Admin
        $admin = User::create([
            'name' => 'Administrator',
            'nama_depan' => 'Admin',
            'nama_belakang' => 'User',
            'email' => 'admin@stock.com',
            'tanggal_lahir' => '1992-05-15',
            'jenis_kelamin' => 'P',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create Categories
        $categories = [
            [
                'nama_kategori' => 'Elektronik',
                'deskripsi_kategori' => 'Produk elektronik dan gadget'
            ],
            [
                'nama_kategori' => 'Pakaian',
                'deskripsi_kategori' => 'Pakaian dan fashion'
            ],
            [
                'nama_kategori' => 'Makanan & Minuman',
                'deskripsi_kategori' => 'Produk makanan dan minuman'
            ],
            [
                'nama_kategori' => 'Rumah Tangga',
                'deskripsi_kategori' => 'Peralatan rumah tangga'
            ],
            [
                'nama_kategori' => 'Olahraga',
                'deskripsi_kategori' => 'Peralatan dan perlengkapan olahraga'
            ]
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Create Products
        $products = [
            [
                'nama_produk' => 'Smartphone Samsung Galaxy A54',
                'deskripsi_produk' => 'Smartphone Android dengan kamera 50MP',
                'category_id' => 1, // Elektronik
                'stok_produk' => 25,
                'harga_produk' => 5999000
            ],
            [
                'nama_produk' => 'Laptop ASUS VivoBook',
                'deskripsi_produk' => 'Laptop dengan processor Intel Core i5',
                'category_id' => 1, // Elektronik
                'stok_produk' => 10,
                'harga_produk' => 8500000
            ],
            [
                'nama_produk' => 'Kaos Polo Lacoste',
                'deskripsi_produk' => 'Kaos polo original dari Lacoste',
                'category_id' => 2, // Pakaian
                'stok_produk' => 50,
                'harga_produk' => 899000
            ],
            [
                'nama_produk' => 'Celana Jeans Levi\'s',
                'deskripsi_produk' => 'Celana jeans premium dari Levi\'s',
                'category_id' => 2, // Pakaian
                'stok_produk' => 30,
                'harga_produk' => 1250000
            ],
            [
                'nama_produk' => 'Kopi Arabica Premium',
                'deskripsi_produk' => 'Kopi arabica single origin premium',
                'category_id' => 3, // Makanan & Minuman
                'stok_produk' => 100,
                'harga_produk' => 125000
            ],
            [
                'nama_produk' => 'Blender Philips HR2115',
                'deskripsi_produk' => 'Blender dengan kapasitas 2 liter',
                'category_id' => 4, // Rumah Tangga
                'stok_produk' => 15,
                'harga_produk' => 650000
            ],
            [
                'nama_produk' => 'Sepatu Lari Nike Air Zoom',
                'deskripsi_produk' => 'Sepatu lari dengan teknologi Air Zoom',
                'category_id' => 5, // Olahraga
                'stok_produk' => 8, // Low stock untuk testing
                'harga_produk' => 1800000
            ],
            [
                'nama_produk' => 'Dumbell Set 20kg',
                'deskripsi_produk' => 'Set dumbell adjustable hingga 20kg',
                'category_id' => 5, // Olahraga
                'stok_produk' => 5, // Low stock untuk testing
                'harga_produk' => 750000
            ]
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        echo "Stock Management data seeded successfully!\n";
        echo "Super Admin: superadmin@stock.com / password123\n";
        echo "Admin: admin@stock.com / password123\n";
        echo "Categories: " . count($categories) . " created\n";
        echo "Products: " . count($products) . " created\n";
    }
}
