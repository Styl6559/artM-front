import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Package, Users, MessageSquare, TrendingUp, 
  Eye, Plus, Palette, Image
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { adminAPI } from '../../lib/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminAPI.getAnalytics();
      
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError(response.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setError('Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-purple-600" />
          <p className="mt-4 text-gray-600 font-serif">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAnalytics} className="bg-gradient-to-r from-purple-600 to-orange-500">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100">
      {/* Artistic Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4 border border-white/30">
                  <Palette className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-serif">Admin Dashboard</h1>
                <p className="text-white/90 font-light">RangLeela Management Portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl blur-sm opacity-30"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-serif">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 font-serif">
                  {analytics?.overview?.totalProducts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-sm opacity-30"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-serif">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 font-serif">
                  {analytics?.overview?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl blur-sm opacity-30"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-serif">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900 font-serif">
                  {analytics?.overview?.totalContacts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl blur-sm opacity-30"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-serif">New Messages</p>
                <p className="text-3xl font-bold text-gray-900 font-serif">
                  {analytics?.overview?.newContacts || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Products by Category */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Products by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.productsByCategory || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(analytics?.productsByCategory || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Contacts by Subject */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Messages by Subject</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.contactsBySubject || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis tickFormatter={(value) => Math.floor(value).toString()} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Quick Actions - Improved layout */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <Link to="/admin/products">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-emerald-50 transition group cursor-pointer border border-gray-100">
                  <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 font-serif mb-1">Manage Products</h4>
                  <p className="text-gray-600 text-sm">Add, edit, or remove products</p>
                </div>
              </Link>
              <Link to="/admin/orders">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-indigo-50 transition group cursor-pointer border border-gray-100">
                  <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 font-serif mb-1">Order Management</h4>
                  <p className="text-gray-600 text-sm">View and manage orders</p>
                </div>
              </Link>
              <Link to="/admin/contacts">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-green-50 transition group cursor-pointer border border-gray-100">
                  <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 font-serif mb-1">Manage Contacts</h4>
                  <p className="text-gray-600 text-sm">Respond to customer inquiries</p>
                </div>
              </Link>
              <Link to="/admin/hero-images">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-pink-50 transition group cursor-pointer border border-gray-100">
                  <div className="p-4 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 font-serif mb-1">Gallery Management</h4>
                  <p className="text-gray-600 text-sm">Manage gallery and collection images</p>
                </div>
              </Link>
              <Link to="/admin/analytics">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-orange-50 transition group cursor-pointer border border-gray-100">
                  <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 font-serif mb-1">Analytics</h4>
                  <p className="text-gray-600 text-sm">View detailed business insights</p>
                </div>
              </Link>
              <Link to="/dashboard">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-purple-50 transition group cursor-pointer border border-gray-100">
                  <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 font-serif mb-1">View Site</h4>
                  <p className="text-gray-600 text-sm">Go to main website</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Recent Messages</h3>
          <div className="space-y-4">
            {analytics?.recentContacts?.length > 0 ? (
              analytics.recentContacts.slice(0, 3).map((contact: any) => (
                <div key={contact._id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div>
                    <h4 className="font-bold text-gray-900 font-serif">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-sm text-gray-500 capitalize">{contact.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      contact.status === 'new' ? 'bg-red-100 text-red-800' :
                      contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {contact.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-serif">No recent messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
