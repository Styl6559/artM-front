import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, AlertTriangle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { paymentAPI } from '../lib/api';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart, validateCartItems } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validItems, setValidItems] = useState(items);
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    const { name, email, phone, address, city, state, pincode } = shippingAddress;

    if (!name.trim() || name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Valid Email is required');
      return false;
    }
    if (!phone.trim() || !/^\d{10,}$/.test(phone.trim())) {
      toast.error('Phone number must be at least 10 digits');
      return false;
    }
    if (!address.trim() || address.trim().length < 10) {
      toast.error('Address must be at least 10 characters');
      return false;
    }
    if (!city.trim() || city.trim().length < 2) {
      toast.error('City must be at least 2 characters');
      return false;
    }
    if (!state.trim() || state.trim().length < 2) {
      toast.error('State must be at least 2 characters');
      return false;
    }
    if (!pincode.trim() || !/^\d{6,}$/.test(pincode.trim())) {
      toast.error('Pincode must be at least 6 digits');
      return false;
    }
    return true;
  };

  const handleProceedToCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate cart items
    if (validateCartItems) {
      const validation = await validateCartItems();
      setValidItems(validation.validItems);
      setRemovedItems(validation.removedItems);

      if (validation.removedItems.length > 0) {
        setShowConfirmation(true);
        return;
      }
    }

    setShowCheckout(true);
  };

  const confirmCheckout = () => {
    // Update cart with only valid items
    validItems.forEach(item => {
      const currentItem = items.find(i => i.product.id === item.product.id);
      if (!currentItem) {
        // Item was removed, remove from cart
        removeFromCart(item.product.id);
      }
    });

    // Remove invalid items from cart
    removedItems.forEach(itemName => {
      const itemToRemove = items.find(item => item.product.name === itemName);
      if (itemToRemove) {
        removeFromCart(itemToRemove.product.id);
      }
    });

    setShowConfirmation(false);
    setShowCheckout(true);
  };

  const handleCheckout = async () => {
    const itemsToCheckout = validItems.length > 0 ? validItems : items.filter(item => item.product.inStock);
    
    if (itemsToCheckout.length === 0) {
      toast.error('No items available for checkout');
      return;
    }

    if (!validateAddress()) return;

    setIsProcessing(true);

    try {
      // Prepare order data with only in-stock items
      const orderData = {
        items: itemsToCheckout.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize
        })),
        shippingAddress,
        notes: ''
      };

      // Create order
      const orderResponse = await paymentAPI.createOrder(orderData);
      
      if (!orderResponse.success) {
        toast.error(orderResponse.message);
        return;
      }

      const { orderId, amount, currency, key } = orderResponse.data;

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key,
          amount,
          currency,
          name: 'Rangleela',
          description: `Order for ${itemsToCheckout.length} item${itemsToCheckout.length > 1 ? 's' : ''}`,
          order_id: orderId,
          prefill: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            contact: shippingAddress.phone
          },
          theme: {
            color: '#10b981'
          },
          handler: async (response: any) => {
            try {
              // Verify payment
              const verifyResponse = await paymentAPI.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.success) {
                toast.success('Payment successful! Order placed.');
                // Remove only checked out items from cart
                itemsToCheckout.forEach(item => removeFromCart(item.product.id));
                setShowCheckout(false);
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => {
              toast.error('Payment cancelled');
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        toast.error('Failed to load payment gateway');
      };

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <ShoppingBag className="relative w-20 h-20 text-gray-400 mx-auto mb-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Your Cart Awaits
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-light">Discover beautiful artworks to fill your creative space</p>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Art Collection
            </h1>
            <p className="text-lg text-gray-600 font-light">
              {items.length} masterpiece{items.length !== 1 ? 's' : ''} ready for checkout
            </p>
          </div>
        </div>

        {!showCheckout ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <ImageWithSkeleton
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                        skeletonClassName="w-20 h-20 rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 font-serif">
                        {item.product.name}
                      </h3>
                      {item.product.artist && (
                        <p className="text-sm text-gray-600 mb-1 italic">by {item.product.artist}</p>
                      )}
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600 mb-2">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{item.product.price}
                      </p>
                      
                      {!item.product.inStock && (
                        <div className="mt-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                          <span className="text-sm text-orange-600 font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-200/80 transition-colors rounded-l-lg"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 py-2 font-semibold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-200/80 transition-colors rounded-r-lg"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-lg text-gray-800">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 font-serif">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items):</span>
                    <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-semibold text-gray-800">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200/50 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 mb-4 py-3 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 font-light">
                    Secure checkout powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 font-serif">Shipping Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                  size="sm"
                >
                  Back to Cart
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Full Name"
                  name="name"
                  maxLength={30}
                  value={shippingAddress.name}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  maxLength={50}
                  value={shippingAddress.email}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  maxLength={15}
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  maxLength={10}
                  value={shippingAddress.pincode}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="mb-6">
                <Input
                  label="Address"
                  name="address"
                  maxLength={100}
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="City"
                  name="city"
                  maxLength={50}
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  maxLength={50}
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">GST (18%):</span>
                    <span className="font-semibold text-gray-800">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-3">
                    <span className="text-gray-800">Total:</span>
                    <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                isLoading={isProcessing}
                className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 py-3 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="text-center mb-6">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Items Removed</h3>
                <p className="text-gray-600">
                  {removedItems.length} item{removedItems.length > 1 ? 's' : ''} removed due to stock unavailability:
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <ul className="text-sm text-orange-800 space-y-1">
                  {removedItems.map((itemName, index) => (
                    <li key={index}>• {itemName}</li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-600 mb-6 text-center">
                Continue with {validItems.length} available item{validItems.length > 1 ? 's' : ''}?
              </p>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmCheckout}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
