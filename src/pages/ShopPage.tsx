import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, Grid, List, SortAsc, Search, Palette, Crown, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Button from '../components/ui/Button';

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category: 'painting' | 'apparel' | 'accessories' }>();
  const { products, isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');

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
  }, [products, category, debouncedSearchQuery, priceRange, sortBy]);

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

  const categoryIcon = category === 'painting' ? Palette : Crown;

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
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg p-3 shadow-xl">
                  {React.createElement(categoryIcon, { className: "w-6 h-6 text-white" })}
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-800 font-serif bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">{categoryTitle}</h1>
                <p className="text-gray-600 font-light">{categoryDescription}</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg blur-xl"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={`Search ${category || 'products'} by name...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm shadow-xl font-light placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
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

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSearchQuery('');
                }}
                className="w-full font-serif shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Clear Filters
              </Button>
            </div>

            {/* Customization Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center font-serif">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Custom Orders
              </h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/contact?subject=custom-painting'}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <Palette className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Create Custom Painting</span>
                  </div>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/contact?subject=custom-apparel'}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <Crown className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Design Custom Apparel</span>
                  </div>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/contact?subject=custom-accessories'}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Create Custom Accessories</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-gray-600 font-serif">
                  Showing <span className="font-bold text-emerald-600">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
                  {debouncedSearchQuery && (
                    <span className="ml-2 text-emerald-600 font-semibold">
                      for "{debouncedSearchQuery}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm font-serif shadow-lg"
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
                  <div className="w-full">
                    <ProductCard key={product.id} product={product} className="w-full max-w-xl mx-auto" />
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
      </div>
    </div>
  );
};

export default ShopPage;
