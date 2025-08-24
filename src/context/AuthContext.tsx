import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, AuthContextType, AuthResponse } from '../types';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/dashboard',
  '/shop/painting',
  '/shop/apparel',
  '/about',
  '/help',
  '/privacy',
  '/terms',
  '/contact',
  '/shipping',
  '/login',
  '/register',
  '/verify'
];

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    if (route.includes('/shop/')) return pathname.startsWith('/shop/');
    return pathname === route;
  });
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUserData, setPendingUserData] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialized = useRef(false);
  const location = useLocation();

  // Only fetch profile on initial mount for protected routes
  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profileResponse = await authAPI.getProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    fetchProfile();
  }, []); // <-- Only on mount, not on every route change

  // Refresh profile method for explicit updates
  const refreshProfile = async () => {
    try {
      const profileResponse = await authAPI.getProfile();
      if (profileResponse.success) {
        setUser(profileResponse.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Welcome back!');
        // Trigger cart/wishlist sync by updating user state
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.register(email, password, name);
      
      if (response.success && response.data) {
        setPendingUserData(response.data);
        toast.success('Registration successful! Please check your email for verification.');
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const googleAuth = async (credential: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.googleAuth(credential);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Google authentication successful!');
        // Trigger cart/wishlist sync by updating user state
      }
      
      return response;
    } catch (error) {
      console.error('Google auth error:', error);
      return { success: false, message: 'Google authentication failed. Please try again.' };
    }
  };

  const verify = async (email: string, code: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.verify(email, code, pendingUserData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setPendingUserData(null);
        toast.success('Email verified successfully! Welcome to Rangleela!');
        // Trigger cart/wishlist sync by updating user state
      }
      
      return response;
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, message: 'Verification failed. Please try again.' };
    }
  };

  const resendVerification = async (email: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.resendVerification(email, pendingUserData);
      
      if (response.success && response.data) {
        setPendingUserData({
          ...pendingUserData,
          verificationCode: response.data.verificationCode,
          verificationCodeExpires: response.data.verificationCodeExpires
        });
        toast.success('Verification code sent! Please check your email.');
      }
      
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, message: 'Failed to resend verification code.' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setPendingUserData(null);
      toast.success('Logged out successfully');
      window.history.replaceState(null, '', '/login');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setPendingUserData(null);
      window.history.replaceState(null, '', '/login');
      window.location.href = '/login';
    }
  };

  const isAuthenticated = !!(user && user.isVerified);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    googleAuth,
    verify,
    resendVerification,
    logout,
    isAuthenticated,
    pendingUserData,
    isPublicRoute: isPublicRoute(location.pathname),
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
