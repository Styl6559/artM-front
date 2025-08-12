import React, { useState, useEffect } from 'react';
import { Package, Eye, Truck, CheckCircle, Clock, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import { adminAPI } from '../../lib/adminApi';
import toast from 'react-hot-toast';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getOrders();
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await adminAPI.updateOrder(id, { status });
      if (response.success) {
        toast.success(`Order marked as ${status}!`);
        fetchOrders();
        if (selectedOrder?._id === id) {
          setSelectedOrder(response.data.order);
        }
      }
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 font-serif">Order Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {orders.filter(o => o.status === 'paid' || o.status === 'processing').length} pending orders
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedOrder?._id === order._id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 font-serif">
                          #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Customer: {order.user?.name || order.shippingAddress.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Email: {order.user?.email || order.shippingAddress.email}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Items: {order.items.length} | Total: ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Eye className="w-4 h-4 text-gray-400 mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-serif">Order Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order ID</label>
                    <p className="text-gray-900">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer</label>
                    <p className="text-gray-900">{selectedOrder.user?.name || selectedOrder.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.user?.email || selectedOrder.shippingAddress.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Items</label>
                    <div className="space-y-2 mt-1">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.product?.name || 'Product'}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Shipping Address</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                      <p>{selectedOrder.shippingAddress.name}</p>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p>{selectedOrder.shippingAddress.pincode}</p>
                      <p>{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-lg font-bold text-purple-600">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Update Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {selectedOrder.status === 'paid' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      <Package className="w-4 h-4 mr-1" />
                      Mark as Processing
                    </Button>
                  )}

                  {selectedOrder.status === 'processing' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      size="sm"
                    >
                      <Truck className="w-4 h-4 mr-1" />
                      Mark as Shipped
                    </Button>
                  )}

                  {selectedOrder.status === 'shipped' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;