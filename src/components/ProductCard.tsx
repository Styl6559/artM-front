import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

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
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {product.discountPrice && product.discountPrice < product.price && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white text-center py-[3px] text-sm font-bold shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              <span className="relative z-10 tracking-wider">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </span>
            </div>
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
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{product.description}</p>
        
        {/* Price */}
        <div className="mb-4">
          {product.discountPrice && product.discountPrice < product.price ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-600">₹{product.discountPrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-emerald-600">₹{product.price}</span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-1.5 text-sm bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
