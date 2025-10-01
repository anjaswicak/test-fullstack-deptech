'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Package, 
  FolderOpen, 
  ArrowUpDown, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Home
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const menuItems = [
    { href: '/dashboard', label: 'Beranda', icon: Home },
    { href: '/dashboard/categories', label: 'Kategori', icon: FolderOpen },
    { href: '/dashboard/products', label: 'Produk', icon: Package },
    { href: '/dashboard/transactions', label: 'Transaksi', icon: ArrowUpDown },
  ];

  if (isSuperAdmin) {
    menuItems.push({ href: '/dashboard/admins', label: 'Pengguna Admin', icon: Users });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Sistem Stok</h1>
            </div>
            <button onClick={onClose} className="lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.nama_depan?.charAt(0) || user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={onClose}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b px-4 py-3 h-[65px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                Selamat datang kembali, {user?.nama_depan || user?.name}!
              </h2>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;