import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, Grid, List, SortAsc, Search, Palette, Crown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Button from '../components/ui/Button';

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category: 'painting' | 'apparel' }>();
  const { products, isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize filtered and sorted products
  const { filteredProducts, artists } = useMemo(() => {
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

    // Filter by artist
    if (selectedArtist) {
      filtered = filtered.filter(p => p.artist === selectedArtist);
    }

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

    const uniqueArtists = [...new Set(products.map(p => p.artist))].filter(Boolean);

    return { filteredProducts: filtered, artists: uniqueArtists };
  }, [products, category, debouncedSearchQuery, priceRange, selectedArtist, sortBy]);

  const categoryTitle = category === 'painting' ? 'Original Paintings' : category === 'apparel' ? 'Artistic Apparel' : 'All Products';
  const categoryDescription = category === 'painting' 
    ? 'Discover unique paintings from talented artists worldwide' 
    : category === 'apparel' 
    ? 'Wearable art and fashion-forward designs'
    : 'Browse our complete collection';

  const categoryIcon = category === 'painting' ? Palette : Crown;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-80 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 p-8">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-3 shadow-lg mr-4">
                {React.createElement(categoryIcon, { className: "w-6 h-6 text-white" })}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{categoryTitle}</h1>
                <p className="text-gray-600">{categoryDescription}</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${category || 'products'} by name...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90 backdrop-blur-sm shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Modern Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-emerald-600" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Artist Filter */}
              {artists.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Artist
                  </label>
                  <select
                    value={selectedArtist}
                    onChange={(e) => setSelectedArtist(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
                  >
                    <option value="">All Artists</option>
                    {artists.map(artist => (
                      <option key={artist} value={artist}>{artist}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedArtist('');
                  setSearchQuery('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Modern Toolbar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                  {debouncedSearchQuery && (
                    <span className="ml-2 text-emerald-600 font-medium">
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
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
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
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 p-8">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    {debouncedSearchQuery 
                      ? `No products match "${debouncedSearchQuery}". Try different keywords or clear filters.`
                      : 'No products found matching your criteria'
                    }
                  </p>
                  <Button
                    onClick={() => {
                      setPriceRange([0, 10000]);
                      setSelectedArtist('');
                      setSearchQuery('');
                    }}
                    variant="outline"
                  >
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