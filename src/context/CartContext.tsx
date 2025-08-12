import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartContextType, CartItem, WishlistItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import toast from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { getProductById } = useProducts();

  // Load cart and wishlist from localStorage on mount and sync with auth state
  useEffect(() => {
    const loadUserData = () => {
      const storageKey = isAuthenticated ? `cart-${user?.id}` : 'guest-cart';
      const wishlistKey = isAuthenticated ? `wishlist-${user?.id}` : 'guest-wishlist';
      
      const savedCart = localStorage.getItem(storageKey);
      const savedWishlist = localStorage.getItem(wishlistKey);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setItems(parsedCart);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      } else {
        setItems([]);
      }
      
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      } else {
        setWishlist([]);
      }
      
      setIsInitialized(true);
    };

    loadUserData();
  }, [user, isAuthenticated]); // Re-run when auth state changes

  // Save cart to localStorage whenever it changes (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      const storageKey = isAuthenticated ? `cart-${user?.id}` : 'guest-cart';
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, isInitialized, isAuthenticated, user?.id]);

  // Save wishlist to localStorage whenever it changes (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      const wishlistKey = isAuthenticated ? `wishlist-${user?.id}` : 'guest-wishlist';
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized, isAuthenticated, user?.id]);

  const addToCart = async (product: Product, quantity: number = 1, size?: string) => {
    // Get fresh product data from context
    const currentProduct = getProductById(product.id) || product;
    
    if (!currentProduct.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.product.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        toast.success('Updated quantity in cart');
        return prevItems.map(item =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity, product: currentProduct }
            : item
        );
      } else {
        toast.success('Added to cart');
        return [...prevItems, { product: currentProduct, quantity, selectedSize: size }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.some(item => item.product.id === product.id);
      if (exists) {
        toast.error('Already in wishlist');
        return prevWishlist;
      }
      
      toast.success('Added to wishlist');
      return [...prevWishlist, { product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prevWishlist => 
      prevWishlist.filter(item => item.product.id !== productId)
    );
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Use discount price if available and valid, otherwise use regular price
      const effectivePrice = item.product.discountPrice && item.product.discountPrice < item.product.price 
        ? item.product.discountPrice 
        : item.product.price;
      return total + (effectivePrice * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Function to validate cart items and remove out-of-stock items
  const validateCartItems = async () => {
    const validItems: CartItem[] = [];
    const removedItems: string[] = [];

    items.forEach(cartItem => {
      const currentProduct = getProductById(cartItem.product.id);
      
      if (currentProduct && currentProduct.inStock) {
        // Update product data and keep in cart
        validItems.push({
          ...cartItem,
          product: currentProduct
        });
      } else {
        // Product is out of stock or doesn't exist
        removedItems.push(cartItem.product.name);
      }
    });

    return { validItems, removedItems };
  };

  const value: CartContextType = {
    items,
    wishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getTotalPrice,
    getTotalItems,
    validateCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};