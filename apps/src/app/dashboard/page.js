'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { 
  Package, 
  FolderOpen, 
  AlertTriangle, 
  TrendingUp,
  Clock
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color].split(' ')[2]}`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const RecentTransactionCard = ({ transaction }) => {
  const isStockIn = transaction.type === 'stock_in';
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${isStockIn ? 'bg-green-50' : 'bg-red-50'}`}>
          <TrendingUp className={`h-4 w-4 ${isStockIn ? 'text-green-600' : 'text-red-600'} ${!isStockIn ? 'rotate-180' : ''}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.product?.nama_produk}</p>
          <p className="text-sm text-gray-500">{transaction.notes}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${isStockIn ? 'text-green-600' : 'text-red-600'}`}>
          {isStockIn ? '+' : '-'}{transaction.quantity}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requiredRole="admin">
        <DashboardLayout>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your stock management system</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Products"
              value={stats?.total_products || 0}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Categories"
              value={stats?.total_categories || 0}
              icon={FolderOpen}
              color="green"
            />
            <StatCard
              title="Low Stock Alert"
              value={stats?.low_stock_products || 0}
              icon={AlertTriangle}
              color="yellow"
            />
            <StatCard
              title="Today's Transactions"
              value={stats?.total_transactions_today || 0}
              icon={Clock}
              color="red"
            />
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="p-6">
              {stats?.recent_transactions?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_transactions.map((transaction) => (
                    <RecentTransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No recent transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}