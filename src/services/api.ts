
import axios from 'axios';
import { MenuItem, OfferItem, Feedback, Order, OrderStatus } from '@/models/types';
import { toast } from 'sonner';

// Create an axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
});

// System Diagnostics
export const checkApiHealth = async (): Promise<{ ok: boolean, message: string }> => {
  try {
    const response = await api.get('/health');
    return { ok: true, message: response.data.message || 'Server is running' };
  } catch (error) {
    console.error('API health check failed:', error);
    return { ok: false, message: 'Server connection failed' };
  }
};

export const getDiagnosticInfo = async (): Promise<any> => {
  try {
    const response = await api.get('/diagnostics');
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnostic info:', error);
    throw error;
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
    throw error;
  }
};

export const getMenuItemById = async (id: number): Promise<MenuItem | undefined> => {
  try {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    toast.error('Failed to load menu item');
    throw error;
  }
};

export const addMenuItem = async (
  item: Omit<MenuItem, 'id'> | FormData
): Promise<MenuItem> => {
  try {
    const response = await api.post('/menu-items', item, {
      headers: item instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    toast.success('Menu item added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    toast.error('Failed to add menu item');
    throw error;
  }
};

export const updateMenuItem = async (
  id: number, 
  updates: Partial<MenuItem> | FormData
): Promise<MenuItem> => {
  try {
    const response = await api.put(`/menu-items/${id}`, updates, {
      headers: updates instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    toast.success('Menu item updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    toast.error('Failed to update menu item');
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

// Menu Categories
export const getMenuCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get('/menu-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    toast.error('Failed to load menu categories');
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
    throw error;
  }
};

export const getOfferById = async (id: number): Promise<OfferItem | undefined> => {
  try {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching offer ${id}:`, error);
    toast.error('Failed to load offer');
    throw error;
  }
};

export const addOffer = async (offer: FormData): Promise<OfferItem> => {
  try {
    const response = await api.post('/offers', offer, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success('Offer added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding offer:', error);
    toast.error('Failed to add offer');
    throw error;
  }
};

export const updateOffer = async (id: number, updates: FormData): Promise<OfferItem> => {
  try {
    const response = await api.put(`/offers/${id}`, updates, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success('Offer updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating offer ${id}:`, error);
    toast.error('Failed to update offer');
    throw error;
  }
};

export const deleteOffer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/offers/${id}`);
    toast.success('Offer deleted successfully');
  } catch (error) {
    console.error(`Error deleting offer ${id}:`, error);
    toast.error('Failed to delete offer');
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
    throw error;
  }
};

export const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt' | 'isPublished'>): Promise<Feedback> => {
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
    const response = await api.patch(`/feedback/${id}`, { isPublished });
    toast.success(`Feedback ${isPublished ? 'published' : 'unpublished'} successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error updating feedback ${id} publication status:`, error);
    toast.error('Failed to update feedback publication status');
    throw error;
  }
};

export const deleteFeedback = async (id: number): Promise<void> => {
  try {
    await api.delete(`/feedback/${id}`);
    toast.success('Feedback deleted successfully');
  } catch (error) {
    console.error(`Error deleting feedback ${id}:`, error);
    toast.error('Failed to delete feedback');
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
    throw error;
  }
};

export const addOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
  try {
    const response = await api.post('/orders', order);
    toast.success('Order placed successfully');
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Failed to place order');
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order> => {
  try {
    const response = await api.patch(`/orders/${id}`, { status });
    toast.success('Order status updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    toast.error('Failed to update order status');
    throw error;
  }
};

// Contact
export const sendContactMessage = async (contactData: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
  try {
    await api.post('/contact', contactData);
    toast.success('Message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact message:', error);
    toast.error('Failed to send message');
    throw error;
  }
};

// Upload directory
export const getUploadDirectoryInfo = async (): Promise<{ path: string, url: string }> => {
  try {
    const response = await api.get('/upload-directory');
    return response.data;
  } catch (error) {
    console.error('Error fetching upload directory info:', error);
    throw error;
  }
};

// Export the axios instance for direct use if needed
export { api };
