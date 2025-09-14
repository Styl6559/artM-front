import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { productsAPI } from '../lib/api';

interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Product cache utilities
  const PRODUCTS_CACHE_KEY = 'products_cache';
  const FEATURED_CACHE_KEY = 'featured_products_cache';
  const CACHE_DURATION_HOURS = 1; // 1 hour cache duration
  
  const productCache = {
    set: (key: string, data: any, expiryHours: number = 1) => {
      try {
        const cacheItem = {
          data,
          timestamp: Date.now(),
          expiry: Date.now() + (expiryHours * 60 * 60 * 1000)
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
      } catch (error) {
        console.warn('Failed to cache products:', error);
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
        console.warn('Failed to retrieve cached products:', error);
        return null;
      }
    },

    clear: (key: string) => {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn('Failed to clear product cache:', error);
      }
    }
  };

  const fetchProducts = async (useCache: boolean = true) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get from cache first if useCache is true
      if (useCache) {
        const cachedProducts = productCache.get(PRODUCTS_CACHE_KEY);
        const cachedFeatured = productCache.get(FEATURED_CACHE_KEY);
        
        if (cachedProducts && cachedFeatured) {
          setProducts(cachedProducts);
          setFeaturedProducts(cachedFeatured);
          setIsLoading(false);
          return;
        }
        
        // If we have some cached data, use it while fetching fresh data
        if (cachedProducts) {
          setProducts(cachedProducts);
          setIsLoading(false);
        }
        if (cachedFeatured) {
          setFeaturedProducts(cachedFeatured);
        }
      }
      
      // Fetch from API if not in cache or cache disabled
      const [allProductsResponse, featuredResponse] = await Promise.all([
        productsAPI.getProducts({ limit: 100 }),
        productsAPI.getFeaturedProducts()
      ]);
      
      if (allProductsResponse.success && allProductsResponse.data?.products) {
        const products = allProductsResponse.data.products;
        setProducts(products);
        // Cache the successful response
        productCache.set(PRODUCTS_CACHE_KEY, products, CACHE_DURATION_HOURS);
      }
      
      if (featuredResponse.success && featuredResponse.data?.products) {
        const featured = featuredResponse.data.products;
        setFeaturedProducts(featured);
        // Cache the featured products
        productCache.set(FEATURED_CACHE_KEY, featured, CACHE_DURATION_HOURS);
      } else {
        // Fallback to featured products from all products
        const featured = allProductsResponse.data?.products?.filter(p => p.featured) || [];
        setFeaturedProducts(featured);
        productCache.set(FEATURED_CACHE_KEY, featured, CACHE_DURATION_HOURS);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      
      // If API fails, try to use cached data even if expired
      const cachedProducts = productCache.get(PRODUCTS_CACHE_KEY);
      const cachedFeatured = productCache.get(FEATURED_CACHE_KEY);
      
      if (cachedProducts) {
        setProducts(cachedProducts);
        setError('Using cached products (network error)');
      }
      if (cachedFeatured) {
        setFeaturedProducts(cachedFeatured);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    // Clear cache and fetch fresh data
    productCache.clear(PRODUCTS_CACHE_KEY);
    productCache.clear(FEATURED_CACHE_KEY);
    await fetchProducts(false);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const value: ProductContextType = {
    products,
    featuredProducts,
    isLoading,
    error,
    refreshProducts,
    getProductsByCategory,
    getProductById
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
