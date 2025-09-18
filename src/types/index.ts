export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  lastLogin?: string;
  createdAt?: string;
  googleId?: string;
  password?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: User;
    verificationCode?: string;
    verificationCodeExpires?: string;
    email?: string;
    name?: string;
    password?: string;
  };
  needsVerification?: boolean;
  email?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  googleAuth: (credential: string) => Promise<AuthResponse>;
  verify: (email: string, code: string) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  pendingUserData?: any;
  isPublicRoute?: boolean;
  refreshProfile: () => Promise<void>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string; // Primary image (for backward compatibility)
  additionalImages?: Array<{
    url: string;
    cloudinaryId: string;
  }>;
  video?: {
    url: string;
    cloudinaryId: string;
    fileSize: number;
    mimeType: string;
  };
  category: 'painting' | 'apparel' | 'accessories';
  size?: string;
  material?: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface CartContextType {
  items: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  validateCartItems?: () => Promise<{ validItems: CartItem[]; removedItems: string[] }>;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
