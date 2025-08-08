import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, className }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group ${className || ''}`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 shadow-sm ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Status Badges */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
        {product.discountPrice && product.discountPrice < product.price && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discountPrice && product.discountPrice < product.price ? (
              <>
                <span className="text-lg font-bold text-emerald-600">₹{product.discountPrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-emerald-600">₹{product.price}</span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-xs px-3 py-2"
          >
            <ShoppingCart className="w-6 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
