import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { User, Calendar, Shield, Heart, ShoppingBag, Star, Palette, TrendingUp, Award, ArrowRight, Eye, Sparkles, Brush, Camera } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-emerald-500 to-blue-500">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 rounded-xl mb-8 shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative px-6 py-12">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {isAuthenticated ? `Welcome back, ${user?.name}!` : 'Welcome to Artistic Manifestation'} 🎨
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Discover unique paintings and artistic apparel from talented creators
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/shop/painting">
                  <Button className="bg-white text-emerald-600 hover:bg-gray-100 px-6 py-2">
                    <Brush className="w-4 h-4 mr-2" />
                    Explore Paintings 
                  </Button>
                </Link>
                <Link to="/shop/apparel">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-6 py-2">
                    <Camera className="w-4 h-4 mr-2" />
                    Shop Apparel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Only show if authenticated */}
        {isAuthenticated && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Arrivals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">New Arrivals</h2>
              <p className="text-gray-600">Fresh artworks and apparel just added</p>
            </div>
            <Link to="/shop/painting">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-sm px-4 py-2">
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Yet</h3>
                  <p className="text-gray-600 text-sm">Start by adding some beautiful artworks!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/shop/painting" className="group">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <ImageWithSkeleton
                  src="https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Paintings"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  skeletonClassName="w-full h-48"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Original Paintings</h3>
                  <p className="text-white/90 text-sm mb-2">Unique artworks from talented artists</p>
                  <div className="flex items-center text-yellow-300">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">View Collection ({paintingProducts.length} items)</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/shop/apparel" className="group">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <ImageWithSkeleton
                  src="https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Apparel"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  skeletonClassName="w-full h-48"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Artistic Apparel</h3>
                  <p className="text-white/90 text-sm mb-2">Wearable art and fashion-forward designs</p>
                  <div className="flex items-center text-yellow-300">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Shop Now ({apparelProducts.length} items)</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Featured Artworks</h2>
                <p className="text-gray-600">Handpicked selections from our curators</p>
              </div>
              <Link to="/shop/painting">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-sm px-4 py-2">
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

        {/* Trending Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <TrendingUp className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Trending This Week</h2>
            <p className="text-gray-600">Discover what's popular among art enthusiasts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Abstract Art</h3>
              <p className="text-gray-600 text-sm">Modern abstract paintings with bold colors</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Limited Editions</h3>
              <p className="text-gray-600 text-sm">Exclusive limited edition pieces</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">Sustainable art materials and organic apparel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;