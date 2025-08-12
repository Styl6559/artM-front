import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, MapPin, Shield, Package, Globe, CheckCircle, AlertCircle } from 'lucide-react';

const ShippingInfoPage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gallery</span>
          </Link>
          
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <Truck className="relative w-16 h-16 text-emerald-600 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Shipping Information
            </h1>
            <p className="text-lg text-gray-600 font-light">
              We deliver beautiful artworks across India with care and precision
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8 lg:p-12">
            
            {/* India-wide Delivery */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 font-serif">Pan-India Delivery</h2>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-2">Nationwide Coverage</h3>
                    <p className="text-emerald-700">
                      We deliver to every corner of India! From metropolitan cities to remote villages, 
                      your favorite artworks will reach you safely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Times by Location */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">Local Areas</h3>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-green-700">3-4 Days</span>
                  </div>
                  <p className="text-green-600 text-sm mb-3">Delhi, Dehradun & nearby areas</p>
                  <ul className="text-green-600 text-xs space-y-1">
                    <li>• Same-day dispatch available</li>
                    <li>• Express handling</li>
                    <li>• Real-time tracking</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Truck className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800">Major Cities</h3>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-blue-700">7 Days</span>
                  </div>
                  <p className="text-blue-600 text-sm mb-3">Mumbai, Bangalore, Kolkata, Chennai</p>
                  <ul className="text-blue-600 text-xs space-y-1">
                    <li>• Standard shipping</li>
                    <li>• Secure packaging</li>
                    <li>• Insurance included</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-800">Remote Areas</h3>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-purple-700">Up to 10 Days</span>
                  </div>
                  <p className="text-purple-600 text-sm mb-3">Hill stations, rural & remote locations</p>
                  <ul className="text-purple-600 text-xs space-y-1">
                    <li>• Extra care in packaging</li>
                    <li>• Weather-protected delivery</li>
                    <li>• Local courier partnerships</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shipping Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">What Makes Our Shipping Special</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Art-Safe Packaging</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Every artwork is carefully wrapped in protective materials, ensuring your purchase arrives in perfect condition.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Insurance Coverage</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    All shipments are insured against damage and loss during transit for your complete peace of mind.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Real-Time Tracking</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Track your order every step of the way with our real-time tracking system and SMS updates.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">FREE Shipping</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Enjoy free shipping on all orders across India. No minimum order value required!
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Process */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">How It Works</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-emerald-600 font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Order Placed</h3>
                  <p className="text-gray-600 text-sm">Your order is confirmed and payment processed</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Careful Packaging</h3>
                  <p className="text-gray-600 text-sm">Artwork is professionally packaged for safe transit</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">In Transit</h3>
                  <p className="text-gray-600 text-sm">Your package is on its way with tracking updates</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 font-bold text-xl">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Delivered</h3>
                  <p className="text-gray-600 text-sm">Safe delivery to your doorstep</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-3">Important Shipping Notes</h3>
                  <ul className="text-yellow-700 space-y-2 text-sm">
                    <li>• Delivery times may vary during festival seasons and adverse weather conditions</li>
                    <li>• Remote area deliveries might require additional 1-2 days</li>
                    <li>• We ship Monday to Friday (excluding national holidays)</li>
                    <li>• Signature required for delivery to ensure safe receipt</li>
                    <li>• For expedited delivery needs, please contact our customer support</li>
                    <li>• Large artwork pieces may require special handling and delivery arrangements</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact for Shipping */}
            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200 text-center">
              <h3 className="font-semibold text-gray-800 mb-2">Have Shipping Questions?</h3>
              <p className="text-gray-600 mb-4">Our team is here to help with any shipping-related queries</p>
              <Link 
                to="/contact?subject=shipping"
                onClick={scrollToTop}
                className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;