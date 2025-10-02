'use client';

import { useState, useEffect } from 'react';
import { profileAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Calendar, Users, Lock, Save, Edit2, X } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        // name: '',
        nama_depan: '',
        nama_belakang: '',
        email: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    useEffect(() => {
        fetchProfile();
        // Test toast saat component mount
        console.log('Component mounted, toast should be available');
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getProfile();
            const userData = response.data.data.user;

            setProfile(userData);
            // console.log(userData)
            const formattedDate = userData.tanggal_lahir ? new Date(userData.tanggal_lahir).toISOString().split('T')[0] : '';
            setFormData({
                // name: userData.name || '',
                nama_depan: userData.nama_depan || '',
                nama_belakang: userData.nama_belakang || '',
                email: userData.email || '',
                tanggal_lahir: formattedDate || '',
                jenis_kelamin: userData.jenis_kelamin || '',
                current_password: '',
                password: '',
                password_confirmation: ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Gagal memuat profil');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (showPasswordFields) {
            if (formData.password !== formData.password_confirmation) {
                toast.error('Konfirmasi password tidak cocok');
                return;
            }

            if (formData.password && !formData.current_password) {
                toast.error('Password saat ini harus diisi untuk mengubah password');
                return;
            }
        }

        try {
            setIsUpdating(true);

            const updateData = {
                // name: formData.name,
                nama_depan: formData.nama_depan,
                nama_belakang: formData.nama_belakang,
                email: formData.email,
                tanggal_lahir: formData.tanggal_lahir,
                jenis_kelamin: formData.jenis_kelamin
            };

            if (showPasswordFields && formData.password) {
                updateData.current_password = formData.current_password;
                updateData.password = formData.password;
                updateData.password_confirmation = formData.password_confirmation;
            }

            const response = await profileAPI.updateProfile(updateData);

            setProfile(response.data.data.user);
            setIsEditing(false);
            setShowPasswordFields(false);
            setFormData(prev => ({
                ...prev,
                current_password: '',
                password: '',
                password_confirmation: ''
            }));

            console.log('Profile updated successfully');
            toast.success('Profil berhasil diperbarui');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    errors[key].forEach(message => {
                        console.log('Toast error:', message);
                        toast.error(message);
                    });
                });
            } else {
                const errorMessage = error.response?.data?.message || 'Gagal memperbarui profil';
                console.log('Toast error:', errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setShowPasswordFields(false);
        // Reset form data to original profile data
        if (profile) {
            setFormData({
                name: profile.name || '',
                nama_depan: profile.nama_depan || '',
                nama_belakang: profile.nama_belakang || '',
                email: profile.email || '',
                tanggal_lahir: profile.tanggal_lahir || '',
                jenis_kelamin: profile.jenis_kelamin || '',
                current_password: '',
                password: '',
                password_confirmation: ''
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'super_admin':
                return 'bg-red-100 text-red-800';
            case 'admin':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleText = (role) => {
        switch (role) {
            case 'super_admin':
                return 'Super Admin';
            case 'admin':
                return 'Admin';
            default:
                return 'User';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <DashboardLayout>

                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
                                    <p className="text-gray-600">Kelola informasi profil dan keamanan akun Anda</p>
                                </div>
                                
                            </div>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white shadow-sm rounded-lg">
                            {/* Header with avatar and basic info */}
                            <div className="px-6 py-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
                                            <User className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {profile?.name || 'Nama tidak tersedia'}
                                            </h2>
                                            <p className="text-gray-600">{profile?.email}</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(profile?.role)}`}>
                                                {getRoleText(profile?.role)}
                                            </span>
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <button
                                            onClick={() => {
                                                console.log('Edit button clicked');
                                                toast('Masuk ke mode edit');
                                                setIsEditing(true);
                                            }}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                        >
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit Profil
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="px-6 py-6">
                                {!isEditing ? (
                                    /* View Mode */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                                    Nama Depan
                                                </label>
                                                <p className="text-gray-900">{profile?.nama_depan || '-'}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                                    Nama Belakang
                                                </label>
                                                <p className="text-gray-900">{profile?.nama_belakang || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                                    Email
                                                </label>
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-gray-900">{profile?.email || '-'}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                                    Tanggal Lahir
                                                </label>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-gray-900">{formatDate(profile?.tanggal_lahir)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                                    Jenis Kelamin
                                                </label>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-gray-900">
                                                        {profile?.jenis_kelamin === 'L' ? 'Laki-laki' :
                                                            profile?.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Edit Mode */
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nama Lengkap *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="nama_depan" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nama Depan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="nama_depan"
                                                        name="nama_depan"
                                                        value={formData.nama_depan}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="nama_belakang" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nama Belakang
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="nama_belakang"
                                                        name="nama_belakang"
                                                        value={formData.nama_belakang}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Tanggal Lahir
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_lahir"
                                                        name="tanggal_lahir"
                                                        value={formData.tanggal_lahir}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Jenis Kelamin
                                                    </label>
                                                    <select
                                                        id="jenis_kelamin"
                                                        name="jenis_kelamin"
                                                        value={formData.jenis_kelamin}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Pilih Jenis Kelamin</option>
                                                        <option value="L">Laki-laki</option>
                                                        <option value="P">Perempuan</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Password Section */}
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                                        <Lock className="h-5 w-5 mr-2" />
                                                        Ubah Password
                                                    </h3>
                                                    <p className="text-sm text-gray-600">Opsional - kosongkan jika tidak ingin mengubah password</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                                                >
                                                    {showPasswordFields ? 'Batal Ubah Password' : 'Ubah Password'}
                                                </button>
                                            </div>

                                            {showPasswordFields && (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Password Saat Ini *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="current_password"
                                                            name="current_password"
                                                            value={formData.current_password}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Password Baru *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="password"
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Konfirmasi Password *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="password_confirmation"
                                                            name="password_confirmation"
                                                            value={formData.password_confirmation}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-8 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                            >
                                                {isUpdating ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}