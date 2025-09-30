import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { User, Calendar, Shield, Heart, ShoppingBag, Star, Palette, TrendingUp, Award, Eye, Sparkles, Brush, Camera, Crown, ChevronLeft, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { formatDate } from '../lib/utils';

// Memoized skeleton arrays to prevent recreation
const GALLERY_SKELETON_ITEMS = Array.from({ length: 3 }, (_, i) => i);
const PRODUCT_SKELETON_ITEMS = Array.from({ length: 4 }, (_, i) => i);

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { wishlist, getTotalItems } = useCart();
  const { products, featuredProducts, isLoading, error } = useProducts();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoize derived data to prevent unnecessary recalculations
  const { newArrivals, paintingProducts, apparelProducts, accessoryProducts } = useMemo(() => {
    const sortedByDate = [...products].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    
    return {
      newArrivals: sortedByDate.slice(0, 8),
      paintingProducts: products.filter(p => p.category === 'painting').slice(0, 4),
      apparelProducts: products.filter(p => p.category === 'apparel').slice(0, 4),
      accessoryProducts: products.filter(p => p.category === 'accessories').slice(0, 4)
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


  // Image cache utilities
  const HERO_CACHE_KEY = 'hero_images_cache';
  const CACHE_DURATION_HOURS = 1; // 1 hour as requested
  
  const imageCache = {
    set: (key: string, data: any, expiryHours: number = 1) => {
      try {
        const cacheItem = {
          data,
          timestamp: Date.now(),
          expiry: Date.now() + (expiryHours * 60 * 60 * 1000) // Convert hours to milliseconds
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
      } catch (error) {
        console.warn('Failed to cache data:', error);
      }
    },

    get: (key: string) => {
      try {
        const cached = localStorage.getItem(`cache_${key}`);
        if (!cached) return null;

        const cacheItem = JSON.parse(cached);
        
        // Check if cache has expired
        if (Date.now() > cacheItem.expiry) {
          localStorage.removeItem(`cache_${key}`);
          return null;
        }

        return cacheItem.data;
      } catch (error) {
        console.warn('Failed to retrieve cached data:', error);
        return null;
      }
    },

    clear: (key: string) => {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn('Failed to clear cache:', error);
      }
    }
  };

  // Function to manually refresh hero images (clears cache and fetches fresh)
  const refreshHeroImages = async () => {
    imageCache.clear(HERO_CACHE_KEY);
    setHeroLoading(true);
    try {
      const res = await import('../lib/adminApi').then(m => m.adminAPI.getHeroImages());
      if (res.success && Array.isArray(res.images)) {
        setHeroImages(res.images);
        imageCache.set(HERO_CACHE_KEY, res.images, CACHE_DURATION_HOURS);
      } else {
        setHeroImages([]);
      }
    } catch (error) {
      console.error('Error refreshing hero images:', error);
      setHeroImages([]);
    } finally {
      setHeroLoading(false);
    }
  };

  // Hero gallery images from API with caching
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  useEffect(() => {
    const fetchHeroImages = async () => {
      setHeroLoading(true);
      try {
        // Try to get from cache first
        const cachedImages = imageCache.get(HERO_CACHE_KEY);
        if (cachedImages) {
          setHeroImages(cachedImages);
          setHeroLoading(false);
          return;
        }

        // Fetch from API if not in cache
        const res = await import('../lib/adminApi').then(m => m.adminAPI.getHeroImages());
        if (res.success && Array.isArray(res.images)) {
          setHeroImages(res.images);
          // Cache the successful response for 1 hour
          imageCache.set(HERO_CACHE_KEY, res.images, CACHE_DURATION_HOURS);
        } else {
          setHeroImages([]);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // If API fails, try to use cached data even if expired
        const cachedImages = imageCache.get(HERO_CACHE_KEY);
        if (cachedImages) {
          setHeroImages(cachedImages);
        } else {
          setHeroImages([]);
        }
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHeroImages();
  }, []);

  // Gallery images (category: 'gallery') for auto-scroll carousel
  const galleryImages = useMemo(() => 
    heroImages.filter(img => img.category === 'gallery'), 
    [heroImages]
  );
  
  const heroGalleryCards = useMemo(() => 
    heroImages.filter(img => img.category !== 'gallery'), 
    [heroImages]
  );
  
  // Auto-scroll for gallery carousel
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setGalleryIndex(prev => (prev + 1) % galleryImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const scrollGallery = useCallback((direction: 'left' | 'right') => {
    const gallery = document.getElementById('hero-gallery');
    if (gallery) {
      const scrollAmount = 320; // Width of one card plus gap
      gallery.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

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
        {/* Hero Section with Gallery Carousel */}
        <div className="relative mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden">
            {/* Gallery Carousel replacing Welcome Header */}
            {galleryImages.length > 0 ? (
              <div className="relative w-full h-80 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] overflow-hidden">
                {galleryImages.map((image, idx) => (
                  <Link
                    key={image._id || idx}
                    to="/shop/painting"
                    onClick={scrollToTop}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      idx === galleryIndex ? 'opacity-100' : 'opacity-0'
                    } cursor-pointer`}
                  >
                    <img
                      src={image.image}
                      alt={image.title || 'Gallery Image'}
                      className="w-full h-full object-cover object-center"
                      style={{ objectPosition: 'center top' }}
                    />
                    {/* Simple gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
                  </Link>
                ))}
                
                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                        idx === galleryIndex 
                          ? 'bg-white scale-110' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : heroLoading ? (
              <div className="w-full h-80 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] bg-gray-200 animate-pulse rounded-lg"></div>
            ) : (
              <div className="w-full h-80 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 font-serif">Welcome to Rangleela</h1>
                  <p className="text-lg opacity-90">No Internet</p>
                </div>
              </div>
            )}

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
                  className="flex gap-4 overflow-x-auto custom-scrollbar scroll-smooth pb-2"
                >
                  {heroLoading ? (
                    // Show 3 skeleton cards matching the gallery card size
                    GALLERY_SKELETON_ITEMS.map((i) => (
                      <div key={i} className="group flex-shrink-0 w-80 relative">
                        <div className="relative overflow-hidden rounded-lg shadow-xl transition-all duration-500">
                          <div className="w-full h-48 sm:h-48 md:h-52 bg-gray-200/60 animate-pulse rounded-lg" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent rounded-lg"></div>
                        </div>
                      </div>
                    ))
                  ) : heroGalleryCards.length === 0 ? (
                    <div className="w-full text-center py-8 text-gray-400">...</div>
                  ) : (
                    heroGalleryCards.map((image, index) => (
                      <Link
                        key={image._id || index}
                        to={image.link || `/shop/${image.category || 'painting'}`}
                        className="group flex-shrink-0 w-80 relative"
                      >
                        <div className="relative overflow-hidden rounded-lg shadow-xl transition-all duration-500">
                          <ImageWithSkeleton
                            src={image.image}
                            alt={image.title}
                            className="w-full h-48 sm:h-48 md:h-52 object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            skeletonClassName="w-full h-48 sm:h-48 md:h-52"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-500"></div>
                          {/* Content */}
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="flex items-center mb-2">
                              {image.category === 'painting' ? (
                                <Brush className="w-4 h-4 mr-2" />
                              ) : image.category === 'apparel' ? (
                                <Crown className="w-4 h-4 mr-2" />
                              ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                              )}
                              <h3 className="text-lg font-bold font-serif">{image.title}</h3>
                            </div>
                            {image.subtitle && (
                              <p className="text-white/90 text-sm mb-3 font-light">{image.subtitle}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-yellow-300 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                                {image.category === 'painting' ? 'Paintings' 
                                  : image.category === 'apparel' ? 'Apparel' 
                                  : 'Accessories'}
                              </span>
                              <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                                <Eye className="w-3 h-3 mr-1" />
                                <span className="text-xs font-medium">Explore</span>
                              </div>
                            </div>
                          </div>
                          {/* Hover Effect Border (removed border grow on hover, only subtle border) */}
                          <div className="absolute inset-0 border-2 border-transparent rounded-lg transition-all duration-300"></div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              {/* <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link to="/shop/painting" onClick={scrollToTop} className="w-full sm:w-[180px]">
                  <Button className="group w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-center">
                      <div className="mr-2 p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <Brush className="w-4 h-4" />
                      </div>
                      <span className="font-medium whitespace-nowrap">Explore Paintings</span>
                    </div>
                  </Button>
                </Link>
                <Link to="/shop/apparel" onClick={scrollToTop} className="w-full sm:w-[180px]">
                  <Button className="group w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-center">
                      <div className="mr-2 p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <Crown className="w-4 h-4" />
                      </div>
                      <span className="font-medium whitespace-nowrap">Shop Apparel</span>
                    </div>
                  </Button>
                </Link> 
                <Link to="/shop/accessories" onClick={scrollToTop} className="w-full sm:w-[180px]">
                  <Button className="group w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-center">
                      <div className="mr-2 p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-medium whitespace-nowrap">Shop Accessories</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div> */}

        {/* Stats Cards - Only show if authenticated */}
        {isAuthenticated && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 p-6 transition-all duration-300"
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
              <Link to="/shop/painting" onClick={scrollToTop}>
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
        {/* <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-serif bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/shop/painting" onClick={scrollToTop} className="group">
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
                    <span className="text-sm font-medium">View Collection</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/shop/apparel" onClick={scrollToTop} className="group">
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

            <Link to="/shop/accessories" onClick={scrollToTop} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500">
                <ImageWithSkeleton
                  src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Accessories"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  skeletonClassName="w-full h-64"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 group-hover:from-amber-500/30 group-hover:to-red-500/30 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center mb-2">
                    <Sparkles className="w-5 h-5 mr-2" />
                    <h3 className="text-xl font-bold font-serif">Artistic Accessories</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-2">Complete your look with artistic flair</p>
                  <div className="flex items-center text-yellow-300 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Discover Items</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div> */}


        {/* Soulful Banner Section (responsive) */}
        <div className="mb-10">
          <Link to="/about" onClick={scrollToTop} className="block">
            <div className="relative w-full h-56 md:h-64 lg:h-72 rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <img
                src="https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&w=1600&h=800&fit=crop"
                alt="Pastel hand-painted canvas banner"
                className="w-full h-full object-cover object-center transition-all duration-700"
              />

              {/* Gradient overlay to ensure text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/60 via-blue-600/40 to-purple-600/60"></div>

              {/* Desktop / md+: centered card */}
              <div className="hidden md:flex absolute inset-y-0 inset-x-0 items-center px-4 md:px-8 lg:px-12">
                <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-sm text-left rounded-2xl p-6 md:p-8 lg:p-10 border border-white/20">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-3 drop-shadow">Discover Rangleela's Artistic World</h2>
                  <ul className="text-sm md:text-base text-white/95 font-light space-y-1.5">
                    <li>Soulful paintings – from mini collectibles to large canvases</li>
                    <li>Hand-painted wooden articles – magnets, coasters, bookmarks & boxes</li>
                    <li>Customized artistic apparels and accessories</li>
                  </ul>
                  <div className="mt-4">
                    <span className="inline-block bg-white/20 text-white font-medium px-4 py-2 rounded-full shadow-sm border border-white/25">Learn More</span>
                  </div>
                </div>
              </div>

              {/* Mobile: compact bottom sheet style */}
              <div className="md:hidden absolute left-0 right-0 bottom-0 px-4 pb-4">
                <div className="w-full bg-white/95 rounded-xl p-3 shadow-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Palette className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800">Discover Rangleela's Artistic World</h3>
                      <p className="text-sm text-gray-600 mt-1">Soulful paintings, hand-painted wooden articles, and customized apparels.</p>
                      <div className="mt-3 flex gap-2">
                        <span className="inline-block bg-emerald-600 text-white text-sm px-3 py-1 rounded-full">Learn More</span>
                        <span className="inline-block text-sm text-gray-500 px-3 py-1 rounded-full">Explore</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        {/* New Arrivals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">New Arrivals</h2>
              <p className="text-gray-600">Fresh artworks, apparel and added accessories</p>
            </div>
            <Link to="/shop/painting" onClick={scrollToTop}>
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-sm px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              PRODUCT_SKELETON_ITEMS.map((i) => <ProductCardSkeleton key={i} />)
            ) : newArrivals.length > 0 ? (
              newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
                  <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 font-serif">No Internet Connection</h3>
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
            <div className="text-center group">
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <Palette className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Abstract Art</h3>
              <p className="text-gray-600 text-sm">Modern abstract paintings with bold colors</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Limited Editions</h3>
              <p className="text-gray-600 text-sm">Exclusive limited edition pieces</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">Sustainable art materials and organic apparel</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Contact Buttons */}
      <div className="fixed right-4 bottom-4 flex flex-col gap-3 z-50">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919389556890?text=Hello!%20I'm%20interested%20in%20your%20products"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </a>
        
        {/* Call Button */}
        <a
          href="tel:+919389556890"
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Call us"
        >
          <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
