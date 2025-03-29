import axios from 'axios';
import { MenuItem, OfferItem, Feedback, Order } from '@/models/types';
import { toast } from 'sonner';

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Changed to false to prevent CORS preflight issues
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    // Log form data contents if present
    if (config.data instanceof FormData) {
      console.log('FormData contents:');
      for (const pair of (config.data as any).entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
      }
    }
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Auth API
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

// Menu Items API
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

export const getMenuItemById = async (id: number): Promise<MenuItem | undefined> => {
  try {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    toast.error('Failed to load menu item details');
    return undefined;
  }
};

export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    const allItems = await getMenuItems();
    return allItems.filter(item => item.category === category);
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    toast.error('Failed to load category items');
    return [];
  }
};

export const getPopularMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const allItems = await getMenuItems();
    return allItems.filter(item => item.popular);
  } catch (error) {
    console.error('Error fetching popular menu items:', error);
    toast.error('Failed to load popular items');
    return [];
  }
};

export const addMenuItem = async (
  item: Omit<MenuItem, 'id'> | FormData
): Promise<MenuItem> => {
  try {
    let formData: FormData;
    
    if (item instanceof FormData) {
      formData = item;
    } else {
      // Handle JSON objects by creating FormData
      formData = new FormData();
      Object.entries(item).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    // Log FormData contents for debugging
    console.log('FormData contents for upload:');
    for (const pair of (formData as any).entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
    }

    const response = await api.post('/menu-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Menu item added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      toast.error(`Failed to add menu item: ${error.response.data.message || error.message}`);
    } else {
      toast.error('Failed to add menu item');
    }
    
    throw error;
  }
};

export const updateMenuItem = async (
  id: number, 
  updates: Partial<MenuItem> | FormData
): Promise<MenuItem | undefined> => {
  try {
    let formData: FormData;
    
    if (updates instanceof FormData) {
      formData = updates;
    } else {
      // Convert to FormData
      formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    // Log FormData contents for debugging
    console.log('Update FormData contents:');
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
      toast.error(`Failed to update menu item: ${error.response.data.message || error.message}`);
    } else {
      toast.error('Failed to update menu item');
    }
    
    return undefined;
  }
};

export const deleteMenuItem = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/menu-items/${id}`);
    toast.success('Menu item deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    toast.error('Failed to delete menu item');
    return false;
  }
};

// Offers API with file upload support
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

export const addOffer = async (
  offer: Omit<OfferItem, 'id'> | FormData
): Promise<OfferItem> => {
  try {
    let response;
    
    if (offer instanceof FormData) {
      // Log FormData contents for debugging
      console.log('Offer FormData contents:');
      for (const pair of (offer as any).entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      response = await api.post('/offers', offer, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Create FormData for regular JSON objects
      const formData = new FormData();
      Object.entries(offer).forEach(([key, value]) => {
        if (key === 'imageFile' && value instanceof File) {
          formData.append('image', value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      response = await api.post('/offers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    toast.success('Offer added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding offer:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      toast.error(`Failed to add offer: ${error.response.data.message || error.message}`);
    } else {
      toast.error('Failed to add offer');
    }
    
    throw error;
  }
};

export const updateOffer = async (
  id: number, 
  updates: Partial<OfferItem> | FormData
): Promise<OfferItem | undefined> => {
  try {
    let response;
    
    if (updates instanceof FormData) {
      response = await api.put(`/offers/${id}`, updates, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Convert to FormData
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'imageFile' && value instanceof File) {
          formData.append('image', value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      response = await api.put(`/offers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    toast.success('Offer updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating offer ${id}:`, error);
    
    if (axios.isAxiosError(error) && error.response) {
      toast.error(`Failed to update offer: ${error.response.data.message || error.message}`);
    } else {
      toast.error('Failed to update offer');
    }
    
    return undefined;
  }
};

export const getActiveOffers = async (): Promise<OfferItem[]> => {
  try {
    const offers = await getOffers();
    const today = new Date().toISOString().split('T')[0];
    
    return offers.filter(offer => 
      offer.isActive && 
      offer.startDate <= today && 
      offer.endDate >= today
    );
  } catch (error) {
    console.error('Error fetching active offers:', error);
    toast.error('Failed to load active offers');
    return [];
  }
};

// Categories API
export const getMenuCategories = async (): Promise<string[]> => {
  try {
    const items = await getMenuItems();
    const categories = [...new Set(items.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    toast.error('Failed to load categories');
    return [];
  }
};

// Get upload directory information
export const getUploadDirectoryInfo = async (): Promise<{ path: string, url: string }> => {
  try {
    const response = await api.get('/upload-path');
    console.log('Upload directory info:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching upload directory info:', error);
    return { path: 'server/uploads', url: '/uploads' };
  }
};

// Feedback API
export const getFeedback = async (): Promise<Feedback[]> => {
  try {
    const response = await api.get('/feedback');
    console.log('Received feedback data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    toast.error('Failed to load feedback');
    return [];
  }
};

export const getPublishedFeedback = async (): Promise<Feedback[]> => {
  try {
    const feedback = await getFeedback();
    console.log('Filtering published feedback from:', feedback);
    return feedback.filter(f => f.isPublished);
  } catch (error) {
    console.error('Error fetching published feedback:', error);
    toast.error('Failed to load feedback');
    return [];
  }
};

export const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt' | 'isPublished'>): Promise<Feedback> => {
  try {
    console.log('Submitting feedback:', feedback);
    const response = await api.post('/feedback', feedback);
    console.log('Feedback submission response:', response.data);
    toast.success('Feedback submitted successfully! Thank you for your comments.');
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    toast.error('Failed to submit feedback');
    throw error;
  }
};

export const updateFeedbackPublication = async (id: number, isPublished: boolean): Promise<Feedback | undefined> => {
  try {
    const response = await api.patch(`/feedback/${id}/publish`, { isPublished });
    toast.success(`Feedback ${isPublished ? 'published' : 'unpublished'} successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error updating feedback ${id} publication:`, error);
    toast.error('Failed to update feedback');
    return undefined;
  }
};

// Orders API
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

export const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
  try {
    const response = await api.post('/orders', orderData);
    toast.success('Order placed successfully!');
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Failed to place order');
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order | undefined> => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    toast.success(`Order status updated to ${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    toast.error('Failed to update order status');
    return undefined;
  }
};

// Contact API
export const sendContactMessage = async (contactData: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
  try {
    await api.post('/contact', contactData);
    toast.success('Message sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending contact message:', error);
    toast.error('Failed to send message');
    return false;
  }
};

export default api;
