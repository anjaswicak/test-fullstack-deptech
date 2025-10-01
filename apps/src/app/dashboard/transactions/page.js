'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { 
  Plus, 
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Package,
  Filter,
  Calendar,
  User,
  FileText
} from 'lucide-react';

const TransactionCard = ({ transaction }) => {
  const isStockIn = transaction.type === 'stock_in';
  
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${isStockIn ? 'bg-green-50' : 'bg-red-50'}`}>
            {isStockIn ? (
              <TrendingUp className="h-6 w-6 text-green-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{transaction.product?.nama_produk}</h3>
            <p className="text-gray-600 text-sm mt-1">{transaction.notes}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{transaction.user?.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(transaction.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${isStockIn ? 'text-green-600' : 'text-red-600'}`}>
            {isStockIn ? '+' : '-'}{transaction.quantity}
          </div>
          <div className="text-sm text-gray-500 capitalize">
            {transaction.type.replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    selectedProduct: null,
    type: 'stock_in',
    quantity: '',
    notes: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      setFormData({
        selectedProduct: null,
        type: 'stock_in',
        quantity: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/v1/products');
      setProducts(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/v1/transactions', {
        product_id: formData.selectedProduct?.value,
        type: formData.type,
        quantity: parseInt(formData.quantity),
        notes: formData.notes
      });

      onSave(response.data.data);
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
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
    
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const handleProductChange = (selectedOption) => {
    setFormData({
      ...formData,
      selectedProduct: selectedOption
    });
    
    // Clear error for product_id field
    if (errors.product_id) {
      setErrors({
        ...errors,
        product_id: null
      });
    }
  };
//   console.log(products.data)
  const selectedProduct = formData.selectedProduct ? 
    products.find(p => p.id === formData.selectedProduct.value) : null;

  // Prepare options for react-select
  const productOptions = products.map(product => ({
    value: product.id,
    label: `${product.nama_produk} (Stok: ${product.stok_produk})`,
    product: product
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Transaksi Baru</h2>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
              Produk *
            </label>
            <Select
              value={formData.selectedProduct}
              onChange={handleProductChange}
              options={productOptions}
              placeholder="Pilih Produk"
              isClearable
              isSearchable
              className={`react-select-container ${
                errors.product_id ? 'react-select-error' : ''
              }`}
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errors.product_id ? '#f87171' : state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                  '&:hover': {
                    borderColor: errors.product_id ? '#f87171' : '#3b82f6'
                  }
                })
              }}
            />
            {errors.product_id && (
              <p className="text-red-500 text-sm mt-1">{errors.product_id[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Transaksi *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.type ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="stock_in">Stok Masuk (Barang Masuk)</option>
              <option value="stock_out">Stok Keluar (Barang Keluar)</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max={formData.type === 'stock_out' && selectedProduct ? selectedProduct.stok_produk : undefined}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.quantity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan jumlah"
              required
            />
            {selectedProduct && formData.type === 'stock_out' && (
              <p className="text-sm text-gray-500 mt-1">
                Stok tersedia: {selectedProduct.stok_produk}
              </p>
            )}
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Catatan *
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.notes ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan catatan transaksi..."
              required
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes[0]}</p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Buat Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      params.append('page', page);

      const response = await api.get(`/v1/transactions?${params.toString()}`);
      const data = response.data.data;
      
      setTransactions(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setShowModal(true);
  };

  const handleSaveTransaction = (savedTransaction) => {
    setTransactions([savedTransaction, ...transactions]);
  };

  const handleSearch = () => {
    fetchTransactions(1);
  };

  const handlePageChange = (page) => {
    fetchTransactions(page);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.product?.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
              <p className="text-gray-600">Kelola transaksi stok dan pergerakan inventori</p>
            </div>
            <button
              onClick={handleAddTransaction}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah Transaksi</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Semua Tipe</option>
                  <option value="stock_in">Stok Masuk</option>
                  <option value="stock_out">Stok Keluar</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Transaction Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-50 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stok Masuk Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transactions.filter(t => 
                      t.type === 'stock_in' && 
                      new Date(t.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-50 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stok Keluar Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transactions.filter(t => 
                      t.type === 'stock_out' && 
                      new Date(t.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-full">
                  <ArrowUpDown className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Transaksi</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
              
              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md ${
                        page === pagination.current_page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ArrowUpDown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada transaksi ditemukan</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter ? 'Tidak ada transaksi yang sesuai dengan filter Anda.' : 'Mulai dengan membuat transaksi pertama Anda.'}
              </p>
              {!searchTerm && !typeFilter && (
                <button
                  onClick={handleAddTransaction}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Tambah Transaksi</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        <TransactionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTransaction}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}