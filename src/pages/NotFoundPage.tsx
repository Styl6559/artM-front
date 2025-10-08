import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Palette } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 flex items-center justify-center">
      <SEO 
        title="Page Not Found - RangLeela"
        description="The page you're looking for doesn't exist. Browse our collection of unique paintings, apparel, and accessories."
        noindex={true}
      />
      
      <div className="max-w-md w-full text-center px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {/* 404 Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Palette className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          
          {/* 404 Text */}
          <h1 className="text-6xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            404
          </h1>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/dashboard" className="block">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Link to="/shop/painting" className="block">
              <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white py-3 transition-all duration-300">
                <Search className="w-5 h-5 mr-2" />
                Browse Products
              </Button>
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="w-full text-gray-600 hover:text-emerald-600 py-2 transition-colors duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
          
          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/about" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                Contact
              </Link>
              <Link to="/help" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
