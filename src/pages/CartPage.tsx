import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const { items, updateQuantity, removeFromCart, clearCart, validateCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showClearCartConfirmation, setShowClearCartConfirmation] = useState(false);
  const [validItems, setValidItems] = useState(items);
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [autoFilledFromPincode, setAutoFilledFromPincode] = useState({ city: false, state: false });
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
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

  // Live validation function
  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.trim().length > 30) {
          error = 'Name must not exceed 30 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        } else if (value.length > 50) {
          error = 'Email must not exceed 50 characters';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value.trim())) {
          error = 'Phone number must be 10 digits';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.trim().length < 10) {
          error = 'Address must be at least 10 characters';
        } else if (value.trim().length > 100) {
          error = 'Address must not exceed 100 characters';
        }
        break;
      case 'city':
        if (!value.trim()) {
          error = 'City is required';
        } else if (value.trim().length < 2) {
          error = 'City must be at least 2 characters';
        } else if (value.trim().length > 50) {
          error = 'City must not exceed 50 characters';
        }
        break;
      case 'state':
        if (!value.trim()) {
          error = 'State is required';
        } else if (value.trim().length < 2) {
          error = 'State must be at least 2 characters';
        } else if (value.trim().length > 50) {
          error = 'State must not exceed 50 characters';
        }
        break;
      case 'pincode':
        if (!value.trim()) {
          error = 'Pincode is required';
        } else if (!/^\d{6}$/.test(value.trim())) {
          error = 'Pincode must be 6 digits';
        }
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));

    // Live validation
    validateField(name, value);

    // Reset auto-fill indicators if user manually changes city or state
    if (name === 'city' || name === 'state') {
      setAutoFilledFromPincode(prev => ({ ...prev, [name]: false }));
    }

    // If pincode is changed and is 6 digits, fetch city and state
    if (name === 'pincode') {
      if (value.length === 6 && /^\d{6}$/.test(value)) {
        fetchLocationFromPincode(value);
      } else {
        // Clear auto-fill indicators if pincode is not 6 digits
        setAutoFilledFromPincode({ city: false, state: false });
      }
    }
  };

  const fetchLocationFromPincode = async (pincode: string) => {
    setIsLoadingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const newCity = postOffice.District || '';
        const newState = postOffice.State || '';
        
        // Only update if we got valid data
        if (newCity && newState) {
          setShippingAddress(prev => ({
            ...prev,
            city: newCity,
            state: newState
          }));
          
          setAutoFilledFromPincode({
            city: true,
            state: true
          });
          
          // Removed success toast - silent auto-fill
        } else {
          toast.error('Incomplete location data for this pincode');
        }
      } else {
        toast.error('Invalid pincode or location not found');
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      toast.error('Failed to fetch location data. Please enter manually.');
    } finally {
      setIsLoadingPincode(false);
    }
  };

  const validateAddress = () => {
    const { name, email, phone, address, city, state, pincode } = shippingAddress;
    
    // Validate all fields
    const nameValid = validateField('name', name);
    const emailValid = validateField('email', email);
    const phoneValid = validateField('phone', phone);
    const addressValid = validateField('address', address);
    const cityValid = validateField('city', city);
    const stateValid = validateField('state', state);
    const pincodeValid = validateField('pincode', pincode);

    // Return true only if all fields are valid
    const allValid = nameValid && emailValid && phoneValid && addressValid && cityValid && stateValid && pincodeValid;
    
    return allValid;
  };

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    setShowClearCartConfirmation(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearCartConfirmation(false);
  };

  // Check if form has any errors or empty required fields
  const hasFormErrors = () => {
    const { name, email, phone, address, city, state, pincode } = shippingAddress;
    
    // Check if any validation errors exist
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    
    // Check if any required fields are empty
    const hasEmptyFields = !name.trim() || !email.trim() || !phone.trim() || 
                          !address.trim() || !city.trim() || !state.trim() || !pincode.trim();
    
    return hasErrors || hasEmptyFields;
  };

  const handleProceedToCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast.error('Please login to proceed with checkout');
      setTimeout(() => navigate('/login'), 1500); // Redirect after 1.5 seconds
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
    // Check if user is authenticated
    if (!user) {
      toast.error('Please login to proceed with checkout');
      setTimeout(() => navigate('/login'), 1500); // Redirect after 1.5 seconds
      return;
    }

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
                toast.success('Payment successful! Redirecting to your orders...');
                // Remove only checked out items from cart
                itemsToCheckout.forEach(item => removeFromCart(item.product.id));
                setShowCheckout(false);
                // Redirect to my-orders page after successful payment
                setTimeout(() => navigate('/my-orders'), 1500);
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

    } catch (error: any) {
      console.error('Checkout error:', error);
      const backendMsg = error?.response?.data?.message;
      if (backendMsg) {
        toast.error(backendMsg); // or your preferred notification method
      } else {
        toast.error('Failed to place order. Please try again.');
      }
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

  const subtotal = items.reduce((total, item) => {
    // Use discount price if available and valid, otherwise use regular price
    const effectivePrice = item.product.discountPrice && item.product.discountPrice < item.product.price 
      ? item.product.discountPrice 
      : item.product.price;
    return total + (effectivePrice * item.quantity);
  }, 0);
  
  // Calculate total savings from discounts
  const totalSavings = items.reduce((savings, item) => {
    if (item.product.discountPrice && item.product.discountPrice < item.product.price) {
      const itemSavings = (item.product.price - item.product.discountPrice) * item.quantity;
      return savings + itemSavings;
    }
    return savings;
  }, 0);
  
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

        {/* Login Prompt for Non-authenticated Users */}
        {!user && items.length > 0 && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-blue-600 text-sm">
                    <strong>� Ready to Checkout?</strong> Login to save your cart and complete your purchase!
                  </div>
                </div>
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-300 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  Login to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}

        {!showCheckout ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                  {/* Mobile Layout: Stack everything vertically */}
                  <div className="flex sm:hidden flex-col space-y-4">
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
                        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2 capitalize">
                          {item.product.category}
                        </p>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600 mb-2">Size: {item.selectedSize}</p>
                        )}
                        <div className="flex items-center gap-2">
                          {item.product.discountPrice && item.product.discountPrice < item.product.price ? (
                            <>
                              <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                ₹{item.product.discountPrice}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                ₹{item.product.price}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                              ₹{item.product.price}
                            </p>
                          )}
                        </div>
                        
                        {!item.product.inStock && (
                          <div className="mt-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                            <span className="text-sm text-orange-600 font-medium">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls moved below on mobile */}
                    <div className="flex items-center justify-between">
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
                  </div>

                  {/* Desktop Layout: Keep original horizontal layout */}
                  <div className="hidden sm:flex items-start space-x-4">
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
                      <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2 capitalize">
                        {item.product.category}
                      </p>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600 mb-2">Size: {item.selectedSize}</p>
                      )}
                      <div className="flex items-center gap-2">
                        {item.product.discountPrice && item.product.discountPrice < item.product.price ? (
                          <>
                            <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                              ₹{item.product.discountPrice}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{item.product.price}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            ₹{item.product.price}
                          </p>
                        )}
                      </div>
                      
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
                      <span className="font-semibold text-lg text-gray-800">
                        ₹{((item.product.discountPrice && item.product.discountPrice < item.product.price 
                          ? item.product.discountPrice 
                          : item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
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
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                      <span className="font-medium">🎉 You Saved:</span>
                      <span className="font-bold">₹{totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200/50 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-800">Total (incl. all taxes):</span>
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
                  Checkout
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
                <div>
                  <Input
                    label="Full Name"
                    name="name"
                    maxLength={30}
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>
                <div>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    maxLength={50}
                    value={shippingAddress.email}
                    onChange={handleAddressChange}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <Input
                    label="Phone"
                    name="phone"
                    maxLength={10}
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    required
                  />
                  {validationErrors.phone && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.phone}</p>
                  )}
                </div>
                <div className="relative">
                  <Input
                    label="Pincode"
                    name="pincode"
                    maxLength={6}
                    value={shippingAddress.pincode}
                    onChange={handleAddressChange}
                    required
                    placeholder="Enter 6-digit pincode"
                  />
                  {isLoadingPincode && (
                    <div className="absolute right-3 top-9 text-blue-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {validationErrors.pincode && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.pincode}</p>
                  )}
                  {!validationErrors.pincode && !isLoadingPincode && (
                    <p className="text-xs text-gray-500 mt-1">
                      City and state will be auto-filled based on pincode
                    </p>
                  )}
                </div>
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
                {validationErrors.address && (
                  <p className="text-red-600 text-xs mt-1">{validationErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Input
                    label="City"
                    name="city"
                    maxLength={50}
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                  {validationErrors.city && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.city}</p>
                  )}
                  {autoFilledFromPincode.city && !validationErrors.city && (
                    <p className="text-blue-600 text-xs mt-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                      Auto-filled from pincode
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="State"
                    name="state"
                    maxLength={50}
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                  />
                  {validationErrors.state && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.state}</p>
                  )}
                  {autoFilledFromPincode.state && !validationErrors.state && (
                    <p className="text-blue-600 text-xs mt-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                      Auto-filled from pincode
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 bg-emerald-100 px-3 py-2 rounded-lg">
                      <span className="font-medium">🎉 You Saved:</span>
                      <span className="font-bold">₹{totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-3">
                    <span className="text-gray-800">Total (incl. all taxes):</span>
                    <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Policy Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700 text-center">
                  By proceeding with checkout, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/refund-policy" className="text-blue-600 hover:text-blue-800 underline font-medium">
                    Refund Policy
                  </Link>
                  . Read our 7-day return policy for peace of mind.
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                isLoading={isProcessing}
                disabled={isProcessing || hasFormErrors()}
                className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Proceed with Razorpay'}
              </Button>
              
              {hasFormErrors() && !isProcessing && (
                <p className="text-red-600 text-xs mt-2 text-center">
                  Please complete all required fields correctly to proceed
                </p>
              )}
            </div>
          </div>
        )}

        {/* Clear Cart Confirmation Modal */}
        {showClearCartConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="text-center mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Clear Cart</h3>
                <p className="text-gray-600">
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowClearCartConfirmation(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmClearCart}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Clear Cart
                </Button>
              </div>
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
