
import axios from 'axios';
import { MenuItem, OfferItem, Feedback, Order, OrderStatus } from '@/models/types';
import { toast } from 'sonner';

// Create an axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  if (import.meta.env.VITE_DEBUG === 'true') {
    console.log('API Request:', request.method?.toUpperCase(), request.url);
  }
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log('API Response:', response.status, response.config.method?.toUpperCase(), response.config.url);
    }
    return response;
  },
  error => {
    if (axios.isAxiosError(error)) {
      const url = error.config?.url || 'unknown endpoint';
      const method = error.config?.method?.toUpperCase() || 'unknown method';
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        console.error(`Network error (${method} ${url}):`, error.message);
      } else if (error.response) {
        console.error(`API error ${error.response.status} (${method} ${url}):`, error.response.data);
      } else {
        console.error(`API error (${method} ${url}):`, error.message);
      }
    } else {
      console.error('Non-Axios API error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Fallback data - will be used when API is not available
const fallbackData = {
  menuItems: [
    {
      id: 1,
      name: "Margherita",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 9.99,
      category: "Classic Pizzas",
      image: "/placeholder.svg",
      popular: true,
      discount: 0,
      availableSizes: ["Small", "Medium", "Large"],
      availableToppings: ["Extra Cheese", "Mushrooms", "Onions"]
    },
    {
      id: 2,
      name: "Pepperoni",
      description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      price: 11.99,
      category: "Classic Pizzas",
      image: "/placeholder.svg",
      popular: true,
      discount: 10,
      availableSizes: ["Small", "Medium", "Large", "Family"],
      availableToppings: ["Extra Cheese", "Mushrooms", "Onions", "Bell Peppers"]
    },
    {
      id: 3,
      name: "Vegetarian",
      description: "Pizza with tomato sauce, mozzarella, and assorted vegetables",
      price: 10.99,
      category: "Specialty Pizzas",
      image: "/placeholder.svg",
      popular: false,
      discount: 0,
      availableSizes: ["Medium", "Large"],
      availableToppings: ["Extra Cheese", "Mushrooms", "Onions", "Bell Peppers", "Olives"]
    }
  ],
  offers: [
    {
      id: 1,
      title: "Family Weekend Deal",
      description: "Get 20% off on all family-sized pizzas every weekend",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      discount: 20,
      imageUrl: "/placeholder.svg",
      isActive: true,
      menuItemIds: [1, 2]
    }
  ],
  feedback: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      rating: 5,
      message: "The pizza was delicious!",
      createdAt: "2023-01-15T12:00:00Z",
      isPublished: true
    }
  ],
  orders: [
    {
      id: 1,
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "555-1234",
      items: [
        { id: 1, name: "Margherita", price: 9.99, quantity: 2 }
      ],
      totalAmount: 19.98,
      status: "delivered",
      orderType: "delivery",
      address: "123 Main St, Anytown",
      createdAt: "2023-01-20T15:30:00Z"
    }
  ]
};

// Helper function to safely make API requests with fallback
const safeApiCall = async <T>(
  apiCallFn: () => Promise<T>, 
  fallbackValue: T, 
  errorMessage: string
): Promise<T> => {
  try {
    return await apiCallFn();
  } catch (error) {
    if (axios.isAxiosError(error) && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')) {
      // Only show toast for network errors, not for other types of errors
      toast.error(`${errorMessage} - Using offline data`, {
        description: "Server connection failed. Check your internet or server status."
      });
      console.warn(`Using fallback data for "${errorMessage}"`);
      return fallbackValue;
    }
    throw error; // Re-throw other errors to be handled by the caller
  }
};

// System Diagnostics
export const checkApiHealth = async (): Promise<{ ok: boolean, message: string }> => {
  return safeApiCall(
    async () => {
      const response = await api.get('/health');
      return { ok: true, message: response.data.message || 'Server is running' };
    },
    { ok: true, message: 'Server connection failed - offline mode' }, // Changed false to true here
    'API health check failed'
  );
};

export const getDiagnosticInfo = async (): Promise<any> => {
  return safeApiCall(
    async () => {
      const response = await api.get('/diagnostics');
      return response.data;
    },
    { status: 'offline', version: 'unknown', uptime: 0, memoryUsage: {}, environment: 'offline' },
    'Error fetching diagnostic info'
  );
};

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  return safeApiCall(
    async () => {
      const response = await api.get('/menu-items');
      return response.data;
    },
    fallbackData.menuItems,
    'Failed to load menu items'
  );
};

export const getMenuItemById = async (id: number): Promise<MenuItem | undefined> => {
  return safeApiCall(
    async () => {
      const response = await api.get(`/menu-items/${id}`);
      return response.data;
    },
    fallbackData.menuItems.find(item => item.id === id),
    `Failed to load menu item ${id}`
  );
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
  return safeApiCall(
    async () => {
      const response = await api.get('/menu-categories');
      return response.data;
    },
    [...new Set(fallbackData.menuItems.map(item => item.category))],
    'Failed to load menu categories'
  );
};

// Offers
export const getOffers = async (): Promise<OfferItem[]> => {
  return safeApiCall(
    async () => {
      const response = await api.get('/offers');
      return response.data;
    },
    fallbackData.offers,
    'Failed to load offers'
  );
};

export const getOfferById = async (id: number): Promise<OfferItem | undefined> => {
  return safeApiCall(
    async () => {
      const response = await api.get(`/offers/${id}`);
      return response.data;
    },
    fallbackData.offers.find(offer => offer.id === id),
    `Failed to load offer ${id}`
  );
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
  return safeApiCall(
    async () => {
      const response = await api.get('/feedback');
      return response.data;
    },
    fallbackData.feedback,
    'Failed to load feedback'
  );
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
  return safeApiCall(
    async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    fallbackData.orders,
    'Failed to load orders'
  );
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
  return safeApiCall(
    async () => {
      const response = await api.get('/upload-directory');
      return response.data;
    },
    { path: 'server/uploads', url: '/uploads' },
    'Error fetching upload directory info'
  );
};

// Export the axios instance for direct use if needed
export { api };

