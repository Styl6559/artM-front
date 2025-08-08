import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Hero Images
  getHeroImages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hero-images`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      console.error('Get hero images API error:', error);
      return error.response?.data || { success: false, message: 'Failed to fetch hero images' };
    }
  },

  addHeroImage: async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/hero-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        timeout: 60000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Add hero image API error:', error);
      return error.response?.data || { success: false, message: 'Failed to add hero image' };
    }
  },

  deleteHeroImage: async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/hero-images/${id}`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      console.error('Delete hero image API error:', error);
      return error.response?.data || { success: false, message: 'Failed to delete hero image' };
    }
  },
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

  replyToContact: async (id: string, reply: string) => {
    try {
      const response = await adminApi.post(`/contacts/${id}/reply`, { reply });
      return response.data;
    } catch (error: any) {
      console.error('Reply to contact API error:', error);
      return error.response?.data || { 
        success: false, 
        message: 'Failed to send reply' 
      };
    }
  },
};

export default adminApi;