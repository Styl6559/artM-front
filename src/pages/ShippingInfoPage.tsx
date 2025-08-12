import React from 'react';
import { Truck, Clock, MapPin, Shield, Package, Globe } from 'lucide-react';

const ShippingInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about our shipping options and policies
          </p>
        </div>

        {/* Shipping Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Shipping</h3>
              <p className="text-gray-600 mb-4">5-7 business days</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">FREE</p>
              <p className="text-sm text-gray-600">On orders over $75</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Shipping</h3>
              <p className="text-gray-600 mb-4">2-3 business days</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">$15.99</p>
              <p className="text-sm text-gray-600">Expedited delivery</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overnight</h3>
              <p className="text-gray-600 mb-4">Next business day</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">$29.99</p>
              <p className="text-sm text-gray-600">Fastest option</p>
            </div>
          </div>
        </div>

        {/* Domestic Shipping */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Domestic Shipping (US)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Rates</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Orders under $75</span>
                  <span className="font-medium">$8.99</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Orders $75 and above</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Express Shipping</span>
                  <span className="font-medium">$15.99</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Overnight Shipping</span>
                  <span className="font-medium">$29.99</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Orders placed before 2 PM EST ship the same day</li>
                <li>• Orders placed after 2 PM EST ship the next business day</li>
                <li>• Custom orders may require 3-5 business days</li>
                <li>• Original paintings require special handling (2-3 days)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">International Shipping</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Countries</h3>
              <p className="text-gray-600 mb-4">
                We ship to most countries worldwide. Shipping costs and delivery times vary by destination.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Canada</span>
                  <span className="font-medium">$19.99 (7-10 days)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Europe</span>
                  <span className="font-medium">$29.99 (10-14 days)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Australia/Asia</span>
                  <span className="font-medium">$39.99 (14-21 days)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Other Countries</span>
                  <span className="font-medium">Contact us</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Customs duties and taxes are the buyer's responsibility</li>
                <li>• Some countries may have restrictions on certain items</li>
                <li>• Delivery times are estimates and may vary</li>
                <li>• Original paintings require special customs documentation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Special Item Handling</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Paintings</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Professionally packaged with protective materials</li>
                <li>• Insured for full value during transit</li>
                <li>• Signature required upon delivery</li>
                <li>• Additional 2-3 days processing time</li>
                <li>• Special handling fee: $25 for paintings over $500</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apparel Items</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Carefully folded and packaged to prevent wrinkles</li>
                <li>• Eco-friendly packaging materials</li>
                <li>• Multiple items combined when possible</li>
                <li>• Care instructions included with each item</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessories</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Individual protective packaging for each item</li>
                <li>• Padded envelopes for delicate pieces</li>
                <li>• Gift-ready presentation</li>
                <li>• Care and authenticity cards included</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
            <p className="text-white/90 mb-6">
              Once your order ships, you'll receive a tracking number via email. 
              You can also track your order status in your account dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="text"
                placeholder="Enter tracking number"
                className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;