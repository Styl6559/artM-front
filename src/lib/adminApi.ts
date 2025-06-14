import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance for admin API
const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // Increased timeout for file uploads
  withCredentials: true,
});

// Request interceptor for debugging
adminApi.interceptors.request.use(
  (config) => {
    console.log('Admin API Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data instanceof FormData ? 'FormData' : config.data
    });
    return config;
  },
  (error) => {
    console.error('Admin API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => {
    console.log('Admin API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Admin API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.log('Admin authentication failed, redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Analytics
  getAnalytics: async () => {
    try {
      const response = await adminApi.get('/analytics');
      return response.data;
    } catch (error: any) {
      console.error('Analytics API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch analytics' 
      };
    }
  },

  // Orders
  getOrders: async (params?: any) => {
    try {
      const response = await adminApi.get('/orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get orders API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch orders' 
      };
    }
  },

  updateOrder: async (id: string, data: any) => {
    try {
      const response = await adminApi.put(`/orders/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update order API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to update order' 
      };
    }
  },

  // Products
  getProducts: async (params?: any) => {
    try {
      const response = await adminApi.get('/products', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get products API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch products' 
      };
    }
  },

  createProduct: async (formData: FormData) => {
    try {
      console.log('Creating product with FormData...');
      
      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }
      
      const response = await adminApi.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout for uploads
      });
      return response.data;
    } catch (error: any) {
      console.error('Create product API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to create product: ' + (error.message || 'Unknown error')
      };
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    try {
      console.log('Updating product with ID:', id);
      
      const response = await adminApi.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Update product API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to update product: ' + (error.message || 'Unknown error')
      };
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await adminApi.delete(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete product API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to delete product' 
      };
    }
  },

  // Contacts
  getContacts: async (params?: any) => {
    try {
      const response = await adminApi.get('/contacts', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get contacts API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to fetch contacts' 
      };
    }
  },

  updateContact: async (id: string, data: any) => {
    try {
      const response = await adminApi.put(`/contacts/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update contact API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to update contact' 
      };
    }
  },
};

export default adminApi;