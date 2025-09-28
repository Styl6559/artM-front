import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const RefundPolicyPage: React.FC = () => {
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
              <Shield className="relative w-16 h-16 text-emerald-600 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Refund & Cancellation Policy
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Your satisfaction is our priority. Learn about our return and refund process.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8 lg:p-12">
            
            {/* Return Period */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 font-serif">7-Day Return Policy</h2>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-2">Easy Returns Within 7 Days</h3>
                    <p className="text-emerald-700">
                      You can return any artwork within 7 days of delivery if you're not completely satisfied. 
                      Items must be in original condition with all packaging materials.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">What Can Be Returned:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Artworks in original condition
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Items with original packaging
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Unused apparel with tags
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Undamaged frames and accessories
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-red-800 mb-3">What Cannot Be Returned:</h3>
                  <ul className="space-y-2 text-red-600">
                    <li className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      Custom or personalized artworks
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      Damaged items (not our fault)
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      Items without original packaging
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      Returns after 7 days
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Refund Process */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 font-serif">Refund Process</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Quick 3-Day Processing</h3>
                    <p className="text-blue-700">
                      Once we receive your returned item and verify its condition, we'll process your refund within 3 business days. 
                      The refund will be credited to your original payment method.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-emerald-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Contact Us</h3>
                  <p className="text-gray-600 text-sm">Reach out with your return request and order details</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Ship Item</h3>
                  <p className="text-gray-600 text-sm">Send the item back in original packaging</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Get Refund</h3>
                  <p className="text-gray-600 text-sm">Receive refund within 3 business days</p>
                </div>
              </div>
            </div>

            {/* Contact for Returns */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8 border border-emerald-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Need to Return Something?</h2>
                <p className="text-gray-600">
                  Contact us to initiate your return or exchange process
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact?subject=return"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact for Exchange
                </Link>
                
                <Link 
                  to="/contact?subject=general"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  General Contact
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• Return shipping costs may apply unless the item was damaged or incorrect</li>
                      <li>• Custom artworks and personalized items cannot be returned</li>
                      <li>• Original shipping charges are non-refundable</li>
                      <li>• Refunds will be processed to the original payment method only</li>
                      <li>• For international orders, customs duties are non-refundable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
