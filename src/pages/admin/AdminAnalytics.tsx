import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Users, Package, Star, ShoppingCart, 
  Calendar, Award,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { adminAPI } from '../../lib/adminApi';

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    dailyRevenue: Array<{ date: string; amount: number }>;
    monthlyRevenue: Array<{ month: string; amount: number }>;
  };
  customers: {
    topCustomers: Array<{
      name: string;
      email: string;
      totalSpent: number;
      orderCount: number;
    }>;
    totalCustomers: number;
    newThisMonth: number;
    returningCustomers: number;
  };
  products: {
    mostSold: Array<{
      name: string;
      totalSold: number;
      revenue: number;
      category: string;
    }>;
    mostRated: Array<{
      name: string;
      rating: number;
      reviewCount: number;
      category: string;
    }>;
    totalProducts: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    pending: number;
    completed: number;
    cancelled: number;
    statusDistribution: Array<{ status: string; count: number }>;
    categoryDistribution: Array<{ category: string; count: number; value: number }>;
  };
  performance: {
    conversionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
    returnCustomerRate: number;
  };
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch real data from multiple endpoints
      const [analyticsResponse, ordersResponse, productsResponse] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getOrders(),
        adminAPI.getProducts()
      ]);
      
      if (analyticsResponse.success || ordersResponse.success || productsResponse.success) {
        // Process real data into analytics format
        const processedAnalytics = await processRealData({
          analytics: analyticsResponse.success ? analyticsResponse.data : null,
          orders: ordersResponse.success ? ordersResponse.data : { orders: [] },
          products: productsResponse.success ? productsResponse.data : { products: [] }
        });
        
        setAnalytics(processedAnalytics);
      } else {
        throw new Error('Failed to fetch data from all endpoints');
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setError('Failed to load analytics data. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processRealData = async (data: any): Promise<AnalyticsData> => {
    const { orders, products, analytics } = data;
    const ordersArray = orders?.orders || [];
    const productsArray = products?.products || [];
    
    // Get monthly users from analytics data
    const monthlyUsers = analytics?.overview?.monthlyUsers || 0;

    // Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Process orders for revenue and customer analytics
    const thisMonthOrders = ordersArray.filter((order: any) => 
      new Date(order.createdAt) >= thisMonth
    );
    const lastMonthOrders = ordersArray.filter((order: any) => 
      new Date(order.createdAt) >= lastMonth && new Date(order.createdAt) <= endLastMonth
    );
    const completedOrders = ordersArray.filter((order: any) => 
      order.status === 'completed' || order.status === 'delivered'
    );

    // Calculate monthly orders (past 30 days, excluding pending)
    const monthlyOrders = ordersArray.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= thirtyDaysAgo && order.status !== 'pending';
    });
    const monthlyOrdersThisMonth = thisMonthOrders.filter((order: any) => 
      order.status !== 'pending'
    ).length;

    // Calculate revenue (excluding pending orders)
    const totalRevenue = ordersArray
      .filter((order: any) => order.status !== 'pending')
      .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
    
    // Monthly revenue (past 30 days based on createdAt, excluding pending)
    const monthlyRevenueAmount = ordersArray.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= thirtyDaysAgo && order.status !== 'pending';
    }).reduce((sum: number, order: any) => 
      sum + (order.totalAmount || 0), 0
    );
    
    const thisMonthRevenue = thisMonthOrders
      .filter((order: any) => order.status !== 'pending')
      .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
    const lastMonthRevenue = lastMonthOrders
      .filter((order: any) => order.status !== 'pending')
      .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Generate daily revenue for last 30 days
    const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayOrders = completedOrders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dayStart && orderDate < dayEnd;
      });
      
      return {
        date: date.toLocaleDateString(),
        amount: dayOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
      };
    });

    // Generate monthly revenue for last 5 months
    const monthlyRevenue = Array.from({ length: 5 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - (4 - i) + 1, 1);
      
      const monthOrders = completedOrders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthDate && orderDate < nextMonth;
      });
      
      return {
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
      };
    });

    // Process customer analytics
    const customerMap = new Map();
    ordersArray.forEach((order: any) => {
      const customerId = order.userId || order.userEmail;
      if (customerId) {
        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            name: order.userName || order.userEmail?.split('@')[0] || 'Customer',
            email: order.userEmail || `customer${customerId}@example.com`,
            totalSpent: 0,
            orderCount: 0
          });
        }
        const customer = customerMap.get(customerId);
        customer.totalSpent += order.totalAmount || 0;
        customer.orderCount += 1;
      }
    });

    const topCustomers = Array.from(customerMap.values())
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const uniqueCustomers = customerMap.size;
    const newCustomersThisMonth = new Set(
      thisMonthOrders.map((order: any) => order.userId || order.userEmail)
    ).size;

    // Process product analytics
    const productSalesMap = new Map();
    const productRatingsMap = new Map();

    ordersArray.forEach((order: any) => {
      // Only count products from non-pending orders
      if (order.status !== 'pending' && order.items) {
        order.items.forEach((item: any) => {
          const productId = item.productId || item.product?._id;
          if (productId) {
            if (!productSalesMap.has(productId)) {
              productSalesMap.set(productId, {
                name: item.name || item.product?.name || 'Unknown Product',
                category: item.category || item.product?.category || 'other',
                totalSold: 0,
                revenue: 0
              });
            }
            const product = productSalesMap.get(productId);
            product.totalSold += item.quantity || 1;
            product.revenue += (item.price || 0) * (item.quantity || 1);
          }
        });
      }
    });

    // Process product ratings from products data
    productsArray.forEach((product: any) => {
      if (product.rating && product.rating > 0) {
        productRatingsMap.set(product._id, {
          name: product.name,
          category: product.category,
          rating: product.rating,
          reviewCount: product.reviews || 0
        });
      }
    });

    const mostSold = Array.from(productSalesMap.values())
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 5);

    const mostRated = Array.from(productRatingsMap.values())
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 5);

    // Process order status distribution
    const statusCounts = ordersArray.reduce((acc: any, order: any) => {
      const status = order.status || 'unknown';
      const statusKey = status.charAt(0).toUpperCase() + status.slice(1);
      acc[statusKey] = (acc[statusKey] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number
    }));

    // Process category distribution
    const categoryMap = new Map();
    ordersArray.forEach((order: any) => {
      if (order.items) {
        order.items.forEach((item: any) => {
          const category = item.category || item.product?.category || 'Other';
          const categoryKey = category.charAt(0).toUpperCase() + category.slice(1) + 's';
          
          if (!categoryMap.has(categoryKey)) {
            categoryMap.set(categoryKey, { count: 0, value: 0 });
          }
          const cat = categoryMap.get(categoryKey);
          cat.count += item.quantity || 1;
          cat.value += (item.price || 0) * (item.quantity || 1);
        });
      }
    });

    const categoryDistribution = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      value: data.value
    }));

    // Calculate performance metrics
    const averageOrderValue = ordersArray.length > 0 
      ? totalRevenue / ordersArray.length 
      : 0;
    
    const returningCustomers = Array.from(customerMap.values())
      .filter((customer: any) => customer.orderCount > 1).length;
    
    const returnCustomerRate = uniqueCustomers > 0 
      ? (returningCustomers / uniqueCustomers) * 100 
      : 0;

    return {
      revenue: {
        total: totalRevenue,
        thisMonth: monthlyRevenueAmount, // Past 30 days revenue
        lastMonth: lastMonthRevenue,
        growth: revenueGrowth,
        dailyRevenue,
        monthlyRevenue
      },
      customers: {
        topCustomers,
        totalCustomers: monthlyUsers, // Use monthly users from backend (past 30 days)
        newThisMonth: newCustomersThisMonth,
        returningCustomers
      },
      products: {
        mostSold,
        mostRated,
        totalProducts: productsArray.length,
        outOfStock: productsArray.filter((p: any) => p.stock === 0).length
      },
      orders: {
        total: monthlyOrders.length, // Monthly orders (past 30 days, non-pending)
        thisMonth: monthlyOrdersThisMonth, // This month orders (non-pending)
        pending: ordersArray.filter((o: any) => o.status === 'pending').length,
        completed: completedOrders.length,
        cancelled: ordersArray.filter((o: any) => o.status === 'cancelled').length,
        statusDistribution,
        categoryDistribution
      },
      performance: {
        conversionRate: 3.2, // This would need website analytics integration
        averageOrderValue,
        customerLifetimeValue: averageOrderValue * 1.8, // Estimated based on AOV
        returnCustomerRate
      }
    };
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-purple-600" />
          <p className="mt-4 text-gray-600 font-serif">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100/80 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Error Loading Analytics</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={fetchAnalytics} className="bg-gradient-to-r from-emerald-500 to-blue-500">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4 border border-white/30">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-serif">Business Analytics</h1>
                <p className="text-white/90 font-light">Comprehensive insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.history.back()}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
              >
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.total)}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.thisMonth)}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.orders.total}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-full p-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.customers.totalCustomers}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Top 5 Customers
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Spent</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Orders</th>
                </tr>
              </thead>
              <tbody>
                {analytics.customers.topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(customer.totalSpent)}</td>
                    <td className="py-3 px-4 text-right">{customer.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Most Sold Products
            </h3>
            <div className="space-y-4">
              {analytics.products.mostSold.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.totalSold} sold</p>
                    <p className="text-sm text-gray-600">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Highest Rated Products
            </h3>
            <div className="space-y-4">
              {analytics.products.mostRated.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{product.reviewCount} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Package className="w-5 h-5 mr-2 text-indigo-600" />
            Category Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.orders.categoryDistribution.map((category, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">{category.category}</h4>
                <p className="text-2xl font-bold text-purple-600 mb-1">{category.count}</p>
                <p className="text-sm text-gray-600 mb-2">Orders</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(category.value)}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
