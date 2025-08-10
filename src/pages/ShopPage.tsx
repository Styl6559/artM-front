import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, SortAsc, Search, Palette, Crown, Sparkles, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Button from '../components/ui/Button';

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category: 'painting' | 'apparel' | 'accessories' }>();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [discountFilter, setDiscountFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [discountRange, setDiscountRange] = useState([0, 100]);
  const [ratingRange, setRatingRange] = useState([0, 5]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomOrderNavigation = (category: string) => {
    scrollToTop();
    navigate(`/contact?subject=custom&category=${category}`);
  };

  // Debounce search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = category 
      ? products.filter(p => p.category === category)
      : products;

    // Filter by search query (name only)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by discount
    if (discountFilter !== 'all') {
      filtered = filtered.filter(p => {
        const hasDiscount = p.discountPrice && p.discountPrice < p.price;
        if (!hasDiscount) return false;
        
        const discount = Math.round(((p.price - (p.discountPrice || 0)) / p.price) * 100);
        switch (discountFilter) {
          case '10':
            return discount >= 10;
          case '25':
            return discount >= 25;
          case '50':
            return discount >= 50;
          default:
            return true;
        }
      });
    }

    // Filter by discount range
    filtered = filtered.filter(p => {
      const hasDiscount = p.discountPrice && p.discountPrice < p.price;
      if (!hasDiscount && discountRange[0] > 0) return false;
      if (!hasDiscount) return true;
      
      const discount = Math.round(((p.price - (p.discountPrice || 0)) / p.price) * 100);
      return discount >= discountRange[0] && discount <= discountRange[1];
    });

    // Filter by rating
    if (ratingFilter > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= ratingFilter);
    }

    // Filter by rating range
    filtered = filtered.filter(p => {
      const rating = p.rating || 0;
      return rating >= ratingRange[0] && rating <= ratingRange[1];
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, category, debouncedSearchQuery, priceRange, sortBy, discountFilter, ratingFilter, discountRange, ratingRange]);

  const categoryTitle = category === 'painting' ? 'Original Paintings' 
    : category === 'apparel' ? 'Designer Apparel' 
    : category === 'accessories' ? 'Artistic Accessories'
    : 'All Products';
  const categoryDescription = category === 'painting' 
    ? 'Discover unique paintings from around the world' 
    : category === 'apparel' 
    ? 'Fashion-forward designs'
    : category === 'accessories'
    ? 'Complete your look with artistic accessories'
    : 'Browse our complete collection';

  const categoryIcon = category === 'painting' ? Palette 
    : category === 'apparel' ? Crown 
    : category === 'accessories' ? Star 
    : Sparkles;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-200/50 rounded w-80 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200/50 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg p-3 shadow-xl">
                    {React.createElement(categoryIcon, { className: "w-6 h-6 text-white" })}
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-serif bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">{categoryTitle}</h1>
                  <p className="text-gray-600 font-light text-sm sm:text-base">{categoryDescription}</p>
                </div>
              </div>
              
              {/* Custom Order Link */}
              {category && (
                <div className="lg:text-right">
                  <p className="text-gray-600 font-light text-sm sm:text-base">
                    Create your custom piece?{' '}
                    <button
                      onClick={() => handleCustomOrderNavigation(category)}
                      className="text-emerald-600 hover:text-emerald-700 underline font-medium transition-colors duration-200"
                    >
                      contact us
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Dropdown */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-emerald-600" />
                <span className="font-semibold text-gray-800 font-serif">Filters</span>
              </div>
              {isFiltersOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {isFiltersOpen && (
              <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-serif">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 shadow-lg"
                    />
                  </div>
                </div>

                {/* Discount Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-serif">
                    Discount: {discountRange[0]}% - {discountRange[1]}%
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-8">Min:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={discountRange[0]}
                        onChange={(e) => setDiscountRange([parseInt(e.target.value), discountRange[1]])}
                        className="flex-1 h-2 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer accent-orange-600 shadow-lg"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-8">Max:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={discountRange[1]}
                        onChange={(e) => setDiscountRange([discountRange[0], parseInt(e.target.value)])}
                        className="flex-1 h-2 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer accent-orange-600 shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-serif">
                    Rating: {ratingRange[0]}★ - {ratingRange[1]}★
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-8">Min:</span>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={ratingRange[0]}
                        onChange={(e) => setRatingRange([parseInt(e.target.value), ratingRange[1]])}
                        className="flex-1 h-2 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg appearance-none cursor-pointer accent-yellow-500 shadow-lg"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-8">Max:</span>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={ratingRange[1]}
                        onChange={(e) => setRatingRange([ratingRange[0], parseInt(e.target.value)])}
                        className="flex-1 h-2 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg appearance-none cursor-pointer accent-yellow-500 shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, 10000]);
                    setSearchQuery('');
                    setDiscountRange([0, 100]);
                    setRatingRange([0, 5]);
                  }}
                  className="w-full font-serif shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-64 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center font-serif">
                <Filter className="w-5 h-5 mr-2 text-emerald-600" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 font-serif">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 shadow-lg"
                  />
                </div>
              </div>

              {/* Discount Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 font-serif">
                  Discount: {discountRange[0]}% - {discountRange[1]}%
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-8">Min:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={discountRange[0]}
                      onChange={(e) => setDiscountRange([parseInt(e.target.value), discountRange[1]])}
                      className="flex-1 h-2 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer accent-orange-600 shadow-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-8">Max:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={discountRange[1]}
                      onChange={(e) => setDiscountRange([discountRange[0], parseInt(e.target.value)])}
                      className="flex-1 h-2 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer accent-orange-600 shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 font-serif">
                  Rating: {ratingRange[0]}★ - {ratingRange[1]}★
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-8">Min:</span>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={ratingRange[0]}
                      onChange={(e) => setRatingRange([parseInt(e.target.value), ratingRange[1]])}
                      className="flex-1 h-2 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg appearance-none cursor-pointer accent-yellow-500 shadow-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-8">Max:</span>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={ratingRange[1]}
                      onChange={(e) => setRatingRange([ratingRange[0], parseInt(e.target.value)])}
                      className="flex-1 h-2 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg appearance-none cursor-pointer accent-yellow-500 shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSearchQuery('');
                  setDiscountFilter('all');
                  setRatingFilter(0);
                  setDiscountRange([0, 100]);
                  setRatingRange([0, 5]);
                }}
                className="w-full font-serif shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-lg w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 z-10" />
                  <input
                    type="text"
                    placeholder={`Search ${category || 'products'} by name...`}
                    maxLength={100}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm shadow-sm font-light placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm font-serif shadow-sm"
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex border border-gray-300/50 rounded-lg overflow-hidden shadow-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 bg-white/80'} transition-all duration-300`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 bg-white/80'} transition-all duration-300`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div className="w-full" key={product.id}>
                    <ProductCard product={product} className="w-full max-w-xl mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-8">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <Search className="relative w-16 h-16 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">No products found</h3>
                  <p className="text-gray-600 mb-6 font-light">
                    {debouncedSearchQuery 
                      ? `No products match "${debouncedSearchQuery}". Try different keywords or clear filters.`
                      : 'No products found matching your criteria'
                    }
                  </p>
                  <Button
                    onClick={() => {
                      setPriceRange([0, 10000]);
                      setSearchQuery('');
                      setDiscountRange([0, 100]);
                      setRatingRange([0, 5]);
                    }}
                    variant="outline"
                    className="font-serif shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Orders Section - Below Product Cards */}
        <div className="mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center font-serif">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Custom Orders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="primary"
                onClick={() => handleCustomOrderNavigation('painting')}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 active:from-teal-700 active:to-cyan-700"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Palette className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Create Custom Painting</span>
                </div>
              </Button>
              <Button
                variant="primary"
                onClick={() => handleCustomOrderNavigation('apparel')}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Crown className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Design Custom Apparel</span>
                </div>
              </Button>
              <Button
                variant="primary"
                onClick={() => handleCustomOrderNavigation('accessories')}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:from-orange-700 active:to-amber-700"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Star className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Create Custom Accessories</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
