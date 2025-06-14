import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <Heart className="w-16 h-16 text-pink-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Save items you love to your wishlist</p>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlist.map((item) => (
            <div key={item.product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {!item.product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold bg-red-600 px-2 py-1 rounded text-xs">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <div className="mb-1">
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                    {item.product.category}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2">{item.product.name}</h3>
                
                {item.product.artist && (
                  <p className="text-xs text-gray-600 mb-1">by {item.product.artist}</p>
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
                  <span className="text-xs text-gray-500 ml-1">
                    ({item.product.reviews || 0})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-emerald-600">₹{item.product.price}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleAddToCart(item.product.id)}
                  disabled={!item.product.inStock}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
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
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => {
              wishlist.forEach(item => {
                if (item.product.inStock) {
                  addToCart(item.product);
                  removeFromWishlist(item.product.id);
                }
              });
            }}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            Add All to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;