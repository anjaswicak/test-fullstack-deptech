'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  FolderOpen,
  Package
} from 'lucide-react';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
            <FolderOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{category.nama_kategori}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{category.deskripsi_kategori}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Kategori"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus Kategori"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-auto flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Package className="h-4 w-4" />
          <span>{category.products_count || 0} Produk</span>
        </div>
        <div>
          Dibuat: {new Date(category.created_at).toLocaleDateString('id-ID')}
        </div>
      </div>
    </div>
  );
};

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    nama_kategori: '',
    deskripsi_kategori: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        nama_kategori: category.nama_kategori || '',
        deskripsi_kategori: category.deskripsi_kategori || ''
      });
    } else {
      setFormData({
        nama_kategori: '',
        deskripsi_kategori: ''
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let response;
      if (category) {
        response = await api.put(`/v1/categories/${category.id}`, formData);
      } else {
        response = await api.post('/v1/categories', formData);
      }

      onSave(response.data.data);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {category ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nama_kategori" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kategori *
            </label>
            <input
              type="text"
              id="nama_kategori"
              name="nama_kategori"
              value={formData.nama_kategori}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nama_kategori ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama kategori"
              required
            />
            {errors.nama_kategori && (
              <p className="text-red-500 text-sm mt-1">{errors.nama_kategori[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="deskripsi_kategori" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Kategori
            </label>
            <textarea
              id="deskripsi_kategori"
              name="deskripsi_kategori"
              value={formData.deskripsi_kategori}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.deskripsi_kategori ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan deskripsi kategori"
            />
            {errors.deskripsi_kategori && (
              <p className="text-red-500 text-sm mt-1">{errors.deskripsi_kategori[0]}</p>
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
              {loading ? 'Menyimpan...' : (category ? 'Perbarui' : 'Buat')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, category, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/v1/categories/${category.id}`);
      onConfirm(category.id);
      onClose();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Gagal menghapus kategori. Mungkin masih ada produk terkait.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hapus Kategori</h2>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus <strong>{category?.nama_kategori}</strong>? 
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/categories');
      setCategories(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleSaveCategory = (savedCategory) => {
    if (selectedCategory) {
      setCategories(categories.map(cat => 
        cat.id === savedCategory.id ? savedCategory : cat
      ));
    } else {
      setCategories([savedCategory, ...categories]);
    }
  };

  const handleConfirmDelete = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const filteredCategories = categories.filter(category =>
    category.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.deskripsi_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
              <p className="text-gray-600">Kelola kategori produk</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada kategori ditemukan</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Tidak ada kategori yang sesuai dengan pencarian Anda.' : 'Mulai dengan membuat kategori pertama Anda.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Tambah Kategori</span>
                </button>
              )}
            </div>
          )}
        </div>

        <CategoryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          category={selectedCategory}
          onSave={handleSaveCategory}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          category={selectedCategory}
          onConfirm={handleConfirmDelete}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}