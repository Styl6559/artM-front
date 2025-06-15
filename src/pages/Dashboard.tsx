import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { User, Calendar, Shield, Heart, ShoppingBag, Star, Palette, TrendingUp, Award, Eye, Sparkles, Brush, Camera, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Hero gallery images
  const heroImages = [
    {
      url: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Abstract Masterpieces",
      subtitle: "Modern art that speaks to the soul",
      category: "painting"
    },
    {
      url: "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Contemporary Portraits",
      subtitle: "Capturing human emotion in every stroke",
      category: "painting"
    },
    {
      url: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Artistic Apparel",
      subtitle: "Wearable art for the creative spirit",
      category: "apparel"
    },
    {
      url: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Gallery Collection",
      subtitle: "Curated pieces from emerging artists",
      category: "painting"
    },
    {
      url: "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Limited Editions",
      subtitle: "Exclusive artworks in limited quantities",
      category: "painting"
    }
  ];

  const scrollGallery = (direction: 'left' | 'right') => {
    const gallery = document.getElementById('hero-gallery');
    if (gallery) {
      const scrollAmount = 320; // Width of one card plus gap
      gallery.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
        {/* Hero Section with Image Gallery */}
        <div className="relative mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden">
            {/* Welcome Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 px-6 py-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif leading-tight">
                  {isAuthenticated ? (
                    <>
                      <span className="block text-xl md:text-2xl font-light opacity-90 mb-1">Welcome back,</span>
                      <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                        {user?.name}
                      </span>
                      <span className="inline-block ml-2 text-3xl">🎨</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Welcome to</span>
                      <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                        Artistic Manifestation
                      </span>
                      <span className="inline-block ml-2 text-3xl">🎨</span>
                    </>
                  )}
                </h1>
                <p className="text-lg text-white/90 font-light">
                  Discover unique paintings and artistic apparel from talented creators worldwide
                </p>
              </div>
            </div>

            {/* Scrollable Image Gallery */}
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Collections
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollGallery('left')}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-white/20 hover:bg-white transition-all duration-300 group"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" />
                  </button>
                  <button
                    onClick={() => scrollGallery('right')}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-white/20 hover:bg-white transition-all duration-300 group"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Gallery Container */}
              <div className="relative">
                <div
                  id="hero-gallery"
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {heroImages.map((image, index) => (
                    <Link
                      key={index}
                      to={`/shop/${image.category}`}
                      className="group flex-shrink-0 w-80 relative"
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                        <ImageWithSkeleton
                          src={image.url}
                          alt={image.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          skeletonClassName="w-full h-48"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-500"></div>
                        
                        {/* Content */}
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <div className="flex items-center mb-2">
                            {image.category === 'painting' ? (
                              <Brush className="w-4 h-4 mr-2" />
                            ) : (
                              <Crown className="w-4 h-4 mr-2" />
                            )}
                            <h3 className="text-lg font-bold font-serif">{image.title}</h3>
                          </div>
                          <p className="text-white/90 text-sm mb-3 font-light">{image.subtitle}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-yellow-300 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                              {image.category === 'painting' ? 'Paintings' : 'Apparel'}
                            </span>
                            <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                              <Eye className="w-3 h-3 mr-1" />
                              <span className="text-xs font-medium">Explore</span>
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect Border */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg transition-all duration-300"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link to="/shop/painting">
                  <Button className="group bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center">
                      <div className="mr-2 p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <Brush className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Explore Paintings</span>
                    </div>
                  </Button>
                </Link>
                <Link to="/shop/apparel">
                  <Button className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center">
                      <div className="mr-2 p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <Crown className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Shop Apparel</span>
                    </div>
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
