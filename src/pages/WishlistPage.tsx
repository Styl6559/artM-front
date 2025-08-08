import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';

const WishlistPage: React.FC = () => {
  const { wishlist, addToCart } = useCart();
  const { user } = useAuth();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-12">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <Heart className="relative w-16 h-16 text-pink-400 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                Your Wishlist Awaits
              </h2>
              <p className="text-gray-600 mb-8 font-light">Save the artworks that speak to your soul</p>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 hover:from-pink-600 hover:via-red-600 hover:to-rose-600 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Discover Art
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <Heart className="relative w-12 h-12 text-pink-600 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-serif bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-gray-600 font-light">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {/* Login Prompt for Non-authenticated Users */}
        {!user && wishlist.length > 0 && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-pink-600 text-sm">
                    <strong>💖 Keep Your Favorites:</strong> Login to sync your wishlist across all devices!
                  </div>
                </div>
                <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium text-sm border border-pink-300 px-3 py-1 rounded-lg hover:bg-pink-50 transition-colors">
                  Login to Sync
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlist.map((item) => (
            <div key={item.product.id} className="relative">
              <ProductCard 
                product={item.product}
                onViewDetails={() => {}} 
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6 inline-block">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 font-serif">Love them all?</h3>
            <p className="text-gray-600 mb-4 font-light">Add all available items to your cart</p>
            <Button
              onClick={() => {
                wishlist.forEach(item => {
                  if (item.product.inStock) {
                    addToCart(item.product);
                    // Removed removeFromWishlist - items stay in wishlist
                  }
                });
              }}
              className="bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 hover:from-pink-600 hover:via-red-600 hover:to-rose-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-4 h-4 mr-2" />
              Add All to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
