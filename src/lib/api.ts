import axios from 'axios';
import { AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log 401 errors if they're not from profile endpoint (expected for unauthenticated users)
    if (error.response?.status === 401 && error.config?.url !== '/auth/profile') {
      console.warn('Unauthorized - token may be expired');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', { email, password, name });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    }
  },

  googleAuth: async (credential: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/google', { credential });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Google authentication failed. Please try again.' 
      };
    }
  },

  verify: async (email: string, code: string, userData?: any): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/verify', { email, code, userData });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Verification failed. Please try again.' 
      };
    }
  },

  resendVerification: async (email: string, userData?: any): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/resend-verification', { email, userData });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to resend verification code.' 
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch profile.' 
      };
    }
  },

  updateProfile: async (name: string, avatar?: string) => {
    try {
      const response = await api.put('/auth/profile', { name, avatar });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to update profile.' 
      };
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to change password.' 
      };
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      return { success: true, message: 'Logged out successfully' };
    }
  }
};

export const productsAPI = {
  getProducts: async (params?: any) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch products.' 
      };
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch product.' 
      };
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured/list');
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch featured products.' 
      };
    }
  }
};

export const contactAPI = {
  submitContact: async (data: any) => {
    try {
      const response = await api.post('/contact', data);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to send message.' 
      };
    }
  },

  submitContactWithImages: async (formData: FormData) => {
    try {
      const response = await api.post('/contact/with-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to send message with images.' 
      };
    }
  }
};

export const paymentAPI = {
  createOrder: async (orderData: any) => {
    try {
      const response = await api.post('/payment/create-order', orderData);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to create order.' 
      };
    }
  },

  verifyPayment: async (paymentData: any) => {
    try {
      const response = await api.post('/payment/verify-payment', paymentData);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Payment verification failed.' 
      };
    }
  },

  getOrders: async (params?: any) => {
    try {
      const response = await api.get('/payment/orders', { params });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch orders.' 
      };
    }
  },

  getOrder: async (id: string) => {
    try {
      const response = await api.get(`/payment/orders/${id}`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch order.' 
      };
    }
  },

  rateItem: async (ratingData: any) => {
    try {
      const response = await api.post('/payment/rate-item', ratingData);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { 
        success: false, 
        message: 'Failed to submit rating.' 
      };
    }
  }
};

export default api;
