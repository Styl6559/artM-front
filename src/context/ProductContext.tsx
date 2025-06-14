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

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [allProductsResponse, featuredResponse] = await Promise.all([
        productsAPI.getProducts({ limit: 100 }),
        productsAPI.getFeaturedProducts()
      ]);
      
      if (allProductsResponse.success && allProductsResponse.data?.products) {
        setProducts(allProductsResponse.data.products);
      }
      
      if (featuredResponse.success && featuredResponse.data?.products) {
        setFeaturedProducts(featuredResponse.data.products);
      } else {
        // Fallback to featured products from all products
        const featured = allProductsResponse.data?.products?.filter(p => p.featured) || [];
        setFeaturedProducts(featured);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    await fetchProducts();
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