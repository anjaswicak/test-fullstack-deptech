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
  Users,
  Mail,
  Calendar,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminCard = ({ admin, onEdit, onDelete, onViewProfile }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {admin.nama_depan?.charAt(0) || admin.name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {admin.nama_depan} {admin.nama_belakang}
            </h3>
            <p className="text-gray-600 text-sm">{admin.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                {getRoleLabel(admin.role)}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {admin.jenis_kelamin === 'L' ? 'Male' : 'Female'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewProfile(admin)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
            title="Lihat Profil"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(admin)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Admin"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(admin)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus Admin"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Lahir: {new Date(admin.tanggal_lahir).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>Bergabung: {new Date(admin.created_at).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminModal = ({ isOpen, onClose, admin, onSave }) => {
  const [formData, setFormData] = useState({
    nama_depan: '',
    nama_belakang: '',
    email: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L',
    role: 'admin',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setFormData({
        nama_depan: admin.nama_depan || '',
        nama_belakang: admin.nama_belakang || '',
        email: admin.email || '',
        tanggal_lahir: admin.tanggal_lahir ? admin.tanggal_lahir.split('T')[0] : '',
        jenis_kelamin: admin.jenis_kelamin || 'L',
        role: admin.role || 'admin',
        password: '',
        password_confirmation: ''
      });
    } else {
      setFormData({
        nama_depan: '',
        nama_belakang: '',
        email: '',
        tanggal_lahir: '',
        jenis_kelamin: 'L',
        role: 'admin',
        password: '',
        password_confirmation: ''
      });
    }
    setErrors({});
  }, [admin, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Don't send password fields if they're empty during update
      const submitData = { ...formData };
      if (admin && !submitData.password) {
        delete submitData.password;
        delete submitData.password_confirmation;
      }

      let response;
      if (admin) {
        // Update existing admin
        response = await api.put(`/v1/admins/${admin.id}`, submitData);
      } else {
        // Create new admin
        response = await api.post('/v1/admins', submitData);
      }

      onSave(response.data.data);
      onClose();
    } catch (error) {
      console.error('Error saving admin:', error);
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
    
    // Clear error for this field
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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {admin ? 'Edit Pengguna Admin' : 'Tambah Pengguna Admin Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama_depan" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Depan *
              </label>
              <input
                type="text"
                id="nama_depan"
                name="nama_depan"
                value={formData.nama_depan}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nama_depan ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama depan"
                required
              />
              {errors.nama_depan && (
                <p className="text-red-500 text-sm mt-1">{errors.nama_depan[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="nama_belakang" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Belakang *
              </label>
              <input
                type="text"
                id="nama_belakang"
                name="nama_belakang"
                value={formData.nama_belakang}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nama_belakang ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama belakang"
                required
              />
              {errors.nama_belakang && (
                <p className="text-red-500 text-sm mt-1">{errors.nama_belakang[0]}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan alamat email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir *
              </label>
              <input
                type="date"
                id="tanggal_lahir"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tanggal_lahir ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.tanggal_lahir && (
                <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin *
              </label>
              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.jenis_kelamin ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              {errors.jenis_kelamin && (
                <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin[0]}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Peran *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.role ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password {!admin && '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={admin ? "Leave empty to keep current" : "Enter password"}
                  required={!admin}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password {!admin && '*'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm password"
                required={!admin && formData.password}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Saving...' : (admin ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose, admin }) => {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Profile</h2>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-medium text-2xl">
                {admin.nama_depan?.charAt(0) || admin.name?.charAt(0)}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {admin.nama_depan} {admin.nama_belakang}
            </h3>
            <p className="text-gray-600">{admin.email}</p>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium capitalize">{admin.role?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{admin.jenis_kelamin === 'L' ? 'Male' : 'Female'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Birth Date:</span>
              <span className="font-medium">{new Date(admin.tanggal_lahir).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Joined:</span>
              <span className="font-medium">{new Date(admin.created_at).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, admin, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/v1/admins/${admin.id}`);
      onConfirm(admin.id);
      onClose();
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin user.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Admin User</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{admin?.nama_depan} {admin?.nama_belakang}</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/admins');
      setAdmins(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleViewProfile = (admin) => {
    setSelectedAdmin(admin);
    setShowProfileModal(true);
  };

  const handleDeleteAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleSaveAdmin = (savedAdmin) => {
    if (selectedAdmin) {
      // Update existing admin
      setAdmins(admins.map(admin => 
        admin.id === savedAdmin.id ? savedAdmin : admin
      ));
    } else {
      // Add new admin
      setAdmins([savedAdmin, ...admins]);
    }
  };

  const handleConfirmDelete = (adminId) => {
    setAdmins(admins.filter(admin => admin.id !== adminId));
  };

  const filteredAdmins = admins.filter(admin =>
    admin.nama_depan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.nama_belakang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requiredRole="super_admin">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengguna Admin</h1>
              <p className="text-gray-600">Kelola akun admin dan super admin</p>
            </div>
            <button
              onClick={handleAddAdmin}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah Admin</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari pengguna admin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Admins Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAdmins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdmins.map((admin) => (
                <AdminCard
                  key={admin.id}
                  admin={admin}
                  onEdit={handleEditAdmin}
                  onDelete={handleDeleteAdmin}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pengguna admin ditemukan</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Tidak ada pengguna admin yang sesuai dengan pencarian Anda.' : 'Mulai dengan membuat pengguna admin pertama Anda.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddAdmin}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Tambah Admin</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <AdminModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          admin={selectedAdmin}
          onSave={handleSaveAdmin}
        />

        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          admin={selectedAdmin}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          admin={selectedAdmin}
          onConfirm={handleConfirmDelete}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}