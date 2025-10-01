'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import Image from 'next/image';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Package,
  Image as ImageIcon,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const isLowStock = product.stok_produk <= 10;
  
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.gambar_produk ? (
              <Image 
                src={`http://localhost:8000/storage/${product.gambar_produk}`}
                alt={product.nama_produk}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{product.nama_produk}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.deskripsi_produk}</p>
            <p className="text-sm text-blue-600 mt-1">{product.category?.nama_kategori}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Produk"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus Produk"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Harga:</span>
          <span className="font-semibold text-green-600">
            Rp {Number(product.harga_produk).toLocaleString('id-ID')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Stok:</span>
          <div className="flex items-center space-x-1">
            {isLowStock && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
            <span className={`font-semibold ${isLowStock ? 'text-yellow-600' : 'text-gray-900'}`}>
              {product.stok_produk}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi_produk: '',
    category_id: '',
    stok_produk: '',
    harga_produk: '',
    gambar_produk: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        nama_produk: product.nama_produk || '',
        deskripsi_produk: product.deskripsi_produk || '',
        category_id: product.category_id || '',
        stok_produk: product.stok_produk || '',
        harga_produk: product.harga_produk || '',
        gambar_produk: null
      });
      if (product.gambar_produk) {
        setImagePreview(`http://localhost:8000/storage/${product.gambar_produk}`);
      }
    } else {
      setFormData({
        nama_produk: '',
        deskripsi_produk: '',
        category_id: '',
        stok_produk: '',
        harga_produk: '',
        gambar_produk: null
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [product, isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/v1/categories/dropdown');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      submitData.append('nama_produk', formData.nama_produk);
      submitData.append('deskripsi_produk', formData.deskripsi_produk);
      submitData.append('category_id', formData.category_id);
      submitData.append('stok_produk', formData.stok_produk);
      submitData.append('harga_produk', formData.harga_produk);
      
      if (formData.gambar_produk) {
        submitData.append('gambar_produk', formData.gambar_produk);
      }

      let response;
      if (product) {
        // Update existing product
        submitData.append('_method', 'PUT');
        response = await api.post(`/v1/products/${product.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new product
        response = await api.post('/v1/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSave(response.data.data);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'gambar_produk' && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {product ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama_produk" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk *
              </label>
              <input
                type="text"
                id="nama_produk"
                name="nama_produk"
                value={formData.nama_produk}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nama_produk ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama produk"
                required
              />
              {errors.nama_produk && (
                <p className="text-red-500 text-sm mt-1">{errors.nama_produk[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category_id ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama_kategori}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="deskripsi_produk" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Produk
            </label>
            <textarea
              id="deskripsi_produk"
              name="deskripsi_produk"
              value={formData.deskripsi_produk}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.deskripsi_produk ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan deskripsi produk"
            />
            {errors.deskripsi_produk && (
              <p className="text-red-500 text-sm mt-1">{errors.deskripsi_produk[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stok_produk" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Stok *
              </label>
              <input
                type="number"
                id="stok_produk"
                name="stok_produk"
                value={formData.stok_produk}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stok_produk ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan jumlah stok"
                required
              />
              {errors.stok_produk && (
                <p className="text-red-500 text-sm mt-1">{errors.stok_produk[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="harga_produk" className="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp) *
              </label>
              <input
                type="number"
                id="harga_produk"
                name="harga_produk"
                value={formData.harga_produk}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.harga_produk ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan harga produk"
                required
              />
              {errors.harga_produk && (
                <p className="text-red-500 text-sm mt-1">{errors.harga_produk[0]}</p>
              )}
            </div>
          </div>

          <div>
                        <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Produk
            </label>
            <input
              type="file"
              id="gambar_produk"
              name="gambar_produk"
              onChange={handleChange}
              accept="image/*"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gambar_produk ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.gambar_produk && (
              <p className="text-red-500 text-sm mt-1">{errors.gambar_produk[0]}</p>
            )}
            
            {imagePreview && (
              <div className="mt-2">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : (product ? 'Perbarui' : 'Buat')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, product, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/v1/products/${product.id}`);
      onConfirm(product.id);
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hapus Produk</h2>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus <strong>{product?.nama_produk}</strong>? 
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/products');
      setProducts(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleSaveProduct = (savedProduct) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(products.map(prod => 
        prod.id === savedProduct.id ? savedProduct : prod
      ));
    } else {
      // Add new product
      setProducts([savedProduct, ...products]);
    }
  };

  const handleConfirmDelete = (productId) => {
    setProducts(products.filter(prod => prod.id !== productId));
  };

  const filteredProducts = products.filter(product =>
    product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.deskripsi_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
              <p className="text-gray-600">Kelola inventori produk Anda</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah Produk</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Tidak ada produk yang sesuai dengan pencarian Anda.' : 'Mulai dengan menambahkan produk pertama Anda.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddProduct}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  <span>Tambah Produk</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <ProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          product={selectedProduct}
          onConfirm={handleConfirmDelete}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}