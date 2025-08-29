import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowLeft, 
  Package, 
  Palette,
  Ruler,
  Shield,
  Truck,
  Eye,
  Shirt
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../lib/api';
import Button from '../components/ui/Button';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await productsAPI.getProduct(id);
        if (response.success) {
          setProduct(response.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedQuantity);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Products</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product Image */}
          <div className="flex flex-col-reverse">
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ImageWithSkeleton
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Category Badge */}
              <div className="mb-4 flex items-center flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 text-white capitalize">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    Featured
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating - Only show if there are actual reviews */}
              {product.rating && product.rating > 0 && product.reviews && product.reviews > 0 ? (
                <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviews} reviews)
                  </p>
                </div>
              ) : null}

              {/* Price */}
              <div className="mb-6 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                <div className="flex items-center">
                  {product.discountPrice && product.discountPrice < product.price ? (
                    <>
                      <span className="text-2xl font-bold text-emerald-600">₹{product.discountPrice}</span>
                      <span className="ml-3 text-lg text-gray-500 line-through">₹{product.price}</span>
                      <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-emerald-600" />
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
                </div>
              </div>

              {/* Specifications */}
              {(product.size || product.material) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Palette className="w-4 h-4 mr-2 text-emerald-600" />
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.size && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center">
                          <Ruler className="w-4 h-4 text-emerald-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Size</p>
                            <p className="text-sm text-gray-600">{product.size}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {product.material && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center">
                          <Shirt className="w-4 h-4 text-emerald-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Material</p>
                            <p className="text-sm text-gray-600">{product.material}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-900 mr-3">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                      className="block w-16 py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>

                  <Button
                    onClick={handleToggleWishlist}
                    variant="outline"
                    className={`px-4 border transition-all duration-300 ${
                      isInWishlist(product.id)
                        ? 'border-pink-500 text-pink-600 hover:bg-pink-50 bg-pink-50'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart 
                      className="w-4 h-4" 
                      fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
                    />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Shield className="w-4 h-4 text-emerald-600 mr-2" />
                    <span className="text-xs font-medium text-emerald-700">Quality Assured</span>
                  </div>
                  <div className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <Truck className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-xs font-medium text-blue-700">Fast Delivery</span>
                  </div>
                  <div className="flex items-center p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <Package className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-xs font-medium text-purple-700">Secure Packaging</span>
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

export default ProductDetailPage;
