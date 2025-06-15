import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (productId: string) => {
    const wishlistItem = wishlist.find(item => item.product.id === productId);
    if (wishlistItem) {
      addToCart(wishlistItem.product);
      removeFromWishlist(productId);
    }
  };

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

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlist.map((item) => (
              <div
                key={item.product.id}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="p-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-110 duration-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {!item.product.inStock && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-semibold bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded text-xs shadow-xl">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <div className="mb-1">
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide bg-emerald-100 px-2 py-1 rounded-full">
                    {item.product.category}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2 font-serif">{item.product.name}</h3>
                
                {item.product.artist && (
                  <p className="text-xs text-gray-600 mb-1 italic font-light">by {item.product.artist}</p>
                )}
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(item.product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1 font-light">
                    ({item.product.reviews || 0})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">₹{item.product.price}</span>
                  <span className="text-xs text-gray-500 font-light">
                    {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleAddToCart(item.product.id)}
                  disabled={!item.product.inStock}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="sm"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add to Cart
                </Button>
              </div>
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
                    removeFromWishlist(item.product.id);
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
