import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { User, Calendar, Shield, Heart, ShoppingBag, Star, Palette, TrendingUp, Award, ArrowRight, Eye, Sparkles, Brush, Camera, Crown } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { formatDate } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { wishlist, getTotalItems } = useCart();
  const { products, featuredProducts, isLoading, error } = useProducts();

  // Memoize derived data to prevent unnecessary recalculations
  const { newArrivals, paintingProducts, apparelProducts } = useMemo(() => {
    const sortedByDate = [...products].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    
    return {
      newArrivals: sortedByDate.slice(0, 8),
      paintingProducts: products.filter(p => p.category === 'painting').slice(0, 4),
      apparelProducts: products.filter(p => p.category === 'apparel').slice(0, 4)
    };
  }, [products]);

  const stats = useMemo(() => {
    if (!isAuthenticated) return [];
    
    return [
      {
        label: 'Account Status',
        value: user?.isVerified ? 'Verified' : 'Pending',
        icon: Shield,
        color: user?.isVerified ? 'text-emerald-600' : 'text-orange-600',
        bgColor: user?.isVerified ? 'bg-emerald-100' : 'bg-orange-100',
      },
      {
        label: 'Wishlist Items',
        value: wishlist.length.toString(),
        icon: Heart,
        color: 'text-pink-600',
        bgColor: 'bg-pink-100',
      },
      {
        label: 'Cart Items',
        value: getTotalItems().toString(),
        icon: ShoppingBag,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        label: 'Member Since',
        value: user?.createdAt ? formatDate(user.createdAt).split(',')[0] : 'Today',
        icon: Calendar,
        color: 'text-violet-600',
        bgColor: 'bg-violet-100',
      }
    ];
  }, [isAuthenticated, user, wishlist.length, getTotalItems]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100/80 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Palette className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-emerald-500 to-blue-500 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Redesigned Hero Section */}
        <div className="relative overflow-hidden mb-8">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 rounded-xl"></div>
          <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
          
          {/* Floating Art Elements */}
          <div className="absolute top-4 left-8 w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-8 right-12 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-yellow-300/30 rounded-full blur-lg animate-bounce"></div>
          
          {/* Artistic Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent transform rotate-12"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-white/5 to-transparent transform -rotate-12"></div>
          </div>
          
          <div className="relative px-6 py-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated Icon */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              
              {/* Main Heading with Artistic Typography */}
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif leading-tight">
                {isAuthenticated ? (
                  <>
                    <span className="block text-2xl md:text-3xl font-light opacity-90 mb-2">Welcome back,</span>
                    <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                      {user?.name}
                    </span>
                    <span className="inline-block ml-3 text-4xl">🎨</span>
                  </>
                ) : (
                  <>
                    <span className="block">Welcome to</span>
                    <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                      Artistic Manifestation
                    </span>
                    <span className="inline-block ml-3 text-4xl">🎨</span>
                  </>
                )}
              </h1>
              
              {/* Subtitle with Artistic Flair */}
              <p className="text-lg md:text-xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                <span className="inline-block mr-2"></span>
                Discover unique paintings and artistic apparel from talented creators worldwide
                <span className="inline-block ml-2">✨</span>
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop/painting">
                  <Button className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white px-6 py-3 shadow-2xl hover:shadow-white/25 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="mr-3 p-1 bg-white/20 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <Brush className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Explore Paintings</span>
                    </div>
                  </Button>
                </Link>
                <Link to="/shop/apparel">
                  <Button className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white px-6 py-3 shadow-2xl hover:shadow-white/25 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="mr-3 p-1 bg-white/20 rounded-full group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                        <Crown className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Shop Apparel</span>
                    </div>
                  </Button>
                </Link>
              </div>
                            
              {/* Artistic Divider */}
              <div className="mt-8 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-400"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Only show if authenticated */}
        {isAuthenticated && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor} shadow-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 font-serif">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-800 font-serif">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Featured Artworks</h2>
                <p className="text-gray-600">Handpicked selections from our curators</p>
              </div>
              <Link to="/shop/painting">
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-sm px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-serif bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/shop/painting" className="group">
              <div className="relative overflow-hidden rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500">
                <ImageWithSkeleton
                  src="https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Paintings"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  skeletonClassName="w-full h-64"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center mb-2">
                    <Brush className="w-5 h-5 mr-2" />
                    <h3 className="text-xl font-bold font-serif">Original Paintings</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-2">Unique artworks from talented artists</p>
                  <div className="flex items-center text-yellow-300 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">View Collection ({paintingProducts.length} items)</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/shop/apparel" className="group">
              <div className="relative overflow-hidden rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500">
                <ImageWithSkeleton
                  src="https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Apparel"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  skeletonClassName="w-full h-64"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center mb-2">
                    <Crown className="w-5 h-5 mr-2" />
                    <h3 className="text-xl font-bold font-serif">Artistic Apparel</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-2">Wearable art and fashion-forward designs</p>
                  <div className="flex items-center text-yellow-300 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Shop Now ({apparelProducts.length} items)</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        {/* New Arrivals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">New Arrivals</h2>
              <p className="text-gray-600">Fresh artworks and apparel just added</p>
            </div>
            <Link to="/shop/painting">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-sm px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : newArrivals.length > 0 ? (
              newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
                  <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 font-serif">No Products Yet</h3>
                  <p className="text-gray-600 text-sm">Start by adding some beautiful artworks!</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Trending Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <TrendingUp className="relative w-12 h-12 text-emerald-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Trending This Week</h2>
            <p className="text-gray-600">Discover what's popular among art enthusiasts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <Palette className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Abstract Art</h3>
              <p className="text-gray-600 text-sm">Modern abstract paintings with bold colors</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Limited Editions</h3>
              <p className="text-gray-600 text-sm">Exclusive limited edition pieces</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">Sustainable art materials and organic apparel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
