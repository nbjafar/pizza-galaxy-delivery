import axios from 'axios';
import { MenuItem, OfferItem, Feedback, Order } from '@/models/types';
import { toast } from 'sonner';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  }
});

// Log all request and response for debugging
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      if (config.data) {
        console.log('Request data:', config.data);
      }
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (axios.isAxiosError(error)) {
      // Log detailed error information
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
    }
    
    return Promise.reject(error);
  }
);

// API functions

// Auth
export const loginAdmin = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Menu Categories
export const getMenuCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get('/categories');
    // Map to array of category names
    return response.data.map((category: { id: number, name: string }) => category.name);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await api.get('/menu-items');
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    toast.error('Failed to load menu items');
    return [];
  }
};

export const getMenuItemById = async (id: number): Promise<MenuItem | null> => {
  try {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    throw error;
  }
};

export const deleteMenuItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`/menu-items/${id}`);
    toast.success('Menu item deleted successfully');
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    toast.error('Failed to delete menu item');
    throw error;
  }
};

export const addMenuItem = async (item: FormData | object): Promise<MenuItem> => {
  try {
    let formData: FormData;
    
    // Check if item is already FormData
    if (item instanceof FormData) {
      formData = item;
    } else {
      // Convert object to FormData
      formData = new FormData();
      
      Object.entries(item).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (key === 'imageFile' && value instanceof File) {
          formData.append('image', value); // Make sure we use 'image' as the field name for the server
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    // Ensure boolean values are properly stringified
    if (!formData.has('popular') && item instanceof Object && 'popular' in item) {
      formData.set('popular', (item as any).popular ? 'true' : 'false');
    }

    // Log FormData contents for debugging
    console.log('FormData contents:');
    for (const pair of (formData as any).entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
    }

    // Make the request with the right headers for file upload
    const response = await api.post('/menu-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Menu item added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    
    // Enhanced error reporting
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      console.error('Server error response:', errorData);
      toast.error(`Failed to add menu item: ${errorData.message || error.message}`);
    } else {
      toast.error('Failed to add menu item');
    }
    
    throw error;
  }
};

export const updateMenuItem = async (id: number, updates: FormData | object): Promise<MenuItem> => {
  try {
    let formData: FormData;
    
    // Check if updates is already FormData
    if (updates instanceof FormData) {
      formData = updates;
    } else {
      // Convert object to FormData
      formData = new FormData();
      
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (key === 'imageFile' && value instanceof File) {
          formData.append('image', value); // Make sure we use 'image' as the field name for the server
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    // Ensure boolean values are properly stringified
    if (!formData.has('popular') && updates instanceof Object && 'popular' in updates) {
      formData.set('popular', (updates as any).popular ? 'true' : 'false');
    }

    // Log FormData contents for debugging
    console.log('FormData contents:');
    for (const pair of (formData as any).entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
    }
    
    const response = await api.put(`/menu-items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Menu item updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      console.error('Server error response:', errorData);
      toast.error(`Failed to update menu item: ${errorData.message || error.message}`);
    } else {
      toast.error('Failed to update menu item');
    }
    
    throw error;
  }
};

// Offers
export const getOffers = async (): Promise<OfferItem[]> => {
  try {
    const response = await api.get('/offers');
    return response.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    toast.error('Failed to load offers');
    return [];
  }
};

export const addOffer = async (offer: FormData): Promise<OfferItem> => {
  try {
    const response = await api.post('/offers', offer, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Offer added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding offer:', error);
    toast.error('Failed to add offer');
    throw error;
  }
};

export const updateOffer = async (id: number, offer: FormData): Promise<OfferItem> => {
  try {
    const response = await api.put(`/offers/${id}`, offer, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Offer updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating offer ${id}:`, error);
    toast.error('Failed to update offer');
    throw error;
  }
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast.error('Failed to load orders');
    return [];
  }
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    toast.success('Order status updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    toast.error('Failed to update order status');
    throw error;
  }
};

// Feedback
export const getFeedback = async (): Promise<Feedback[]> => {
  try {
    const response = await api.get('/feedback');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    toast.error('Failed to load feedback');
    return [];
  }
};

export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt' | 'isPublished'>): Promise<Feedback> => {
  try {
    const response = await api.post('/feedback', feedback);
    toast.success('Feedback submitted successfully');
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    toast.error('Failed to submit feedback');
    throw error;
  }
};

export const updateFeedbackPublishStatus = async (id: number, isPublished: boolean): Promise<Feedback> => {
  try {
    const response = await api.patch(`/feedback/${id}/publish`, { isPublished });
    toast.success('Feedback status updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating feedback ${id} publish status:`, error);
    toast.error('Failed to update feedback status');
    throw error;
  }
};

// Contact
export const submitContactForm = async (data: { name: string; email: string; subject: string; message: string }): Promise<{ id: number; message: string }> => {
  try {
    const response = await api.post('/contact', data);
    toast.success('Contact form submitted successfully');
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    toast.error('Failed to submit contact form');
    throw error;
  }
};
