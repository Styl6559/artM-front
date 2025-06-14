import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, Star, ShoppingCart, Eye } from 'lucide-react';
import { paymentAPI } from '../lib/api';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingOrder, setRatingOrder] = useState<any>(null);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await paymentAPI.getOrders();
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleRateItem = async (orderId: string, productId: string, rating: number) => {
    try {
      const response = await paymentAPI.rateItem({
        orderId,
        productId,
        rating
      });

      if (response.success) {
        toast.success('Rating submitted successfully!');
        setRatingOrder(null);
        setRatings({});
        fetchOrders(); // Refresh orders
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-lg text-gray-600">Track your purchases and rate delivered items</p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">₹{order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start gap-3">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-lg shadow-sm"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 mb-1 line-clamp-2">
                              {item.product?.name || 'Product'}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                            {item.selectedSize && (
                              <p className="text-xs text-gray-500 mb-2">Size: {item.selectedSize}</p>
                            )}
                            
                            {/* Rating Display */}
                            {item.rating && (
                              <div className="flex items-center gap-1 mb-2">
                                <span className="text-xs text-gray-600">Your rating:</span>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 mt-2">
                              {order.status === 'delivered' && !item.rating && (
                                <Button
                                  onClick={() => setRatingOrder({ 
                                    orderId: order._id, 
                                    productId: item.product._id, 
                                    productName: item.product.name,
                                    productImage: item.product.image
                                  })}
                                  size="sm"
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Rate Item
                                </Button>
                              )}
                              
                              <Button
                                onClick={() => handleAddToCart(item.product)}
                                size="sm"
                                variant="outline"
                                className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Buy Again
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      variant="ghost"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {selectedOrder?._id === order._id ? 'Hide' : 'View'} Order Details
                    </Button>
                  </div>

                  {/* Expanded Order Details */}
                  {selectedOrder?._id === order._id && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Shipping Address</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                        <p>{order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
              <p className="text-lg text-gray-600 mb-6">Start shopping to see your orders here!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop/painting">
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                    Browse Paintings
                  </Button>
                </Link>
                <Link to="/shop/apparel">
                  <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                    Shop Apparel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {ratingOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <div className="text-center mb-6">
                {ratingOrder.productImage && (
                  <img
                    src={ratingOrder.productImage}
                    alt={ratingOrder.productName}
                    className="w-16 h-16 object-cover rounded-lg mx-auto mb-4 shadow-md"
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Rate Your Purchase</h3>
                <p className="text-gray-600">{ratingOrder.productName}</p>
              </div>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatings({ ...ratings, [ratingOrder.productId]: star })}
                    className="p-2 hover:scale-110 transition-transform duration-200"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (ratings[ratingOrder.productId] || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setRatingOrder(null);
                    setRatings({});
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const rating = ratings[ratingOrder.productId];
                    if (rating) {
                      handleRateItem(ratingOrder.orderId, ratingOrder.productId, rating);
                    }
                  }}
                  disabled={!ratings[ratingOrder.productId]}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                >
                  Submit Rating
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;