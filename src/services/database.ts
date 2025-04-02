// This file now serves as a compatibility layer for local development
// All API calls should go through the api.ts service which connects to the backend

import { MenuItem, OfferItem, Feedback, Order, OrderType } from '@/models/types';
import * as api from './api';
import { toast } from 'sonner';

// Local data cache to store resolved API responses
let menuItemsCache: MenuItem[] = [];
let offersCache: OfferItem[] = [];
let feedbackCache: Feedback[] = [];
let ordersCache: Order[] = [];
let categoriesCache: string[] = [];

// Helper function to load data with caching
const loadWithCache = async <T>(
  apiCall: () => Promise<T>,
  cache: T | null,
  setCache: (data: T) => void
): Promise<T> => {
  try {
    if (cache) return cache;
    const data = await apiCall();
    setCache(data);
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

// Synchronous versions of the API functions that resolve the Promises
export const getMenuItems = (): MenuItem[] => {
  // For immediate use in components, return cached data if available
  if (menuItemsCache.length > 0) return menuItemsCache;
  
  // Otherwise fetch and update cache in background
  api.getMenuItems().then(data => {
    menuItemsCache = data;
  }).catch(error => {
    console.error('Error fetching menu items:', error);
  });
  
  return menuItemsCache;
};

export const getMenuItemById = (id: number): MenuItem | undefined => {
  // First try to find in cache
  const cachedItem = menuItemsCache.find(item => item.id === id);
  if (cachedItem) return cachedItem;
  
  // If not in cache, fetch individually
  // For compatibility, return undefined and update in background
  api.getMenuItemById(id).then(data => {
    if (data) {
      // Add to cache if found
      if (!menuItemsCache.some(item => item.id === id)) {
        menuItemsCache.push(data);
      }
    }
  }).catch(error => {
    console.error(`Error fetching menu item ${id}:`, error);
  });
  
  // Return undefined or find in updated cache
  return menuItemsCache.find(item => item.id === id);
};

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  // Filter from cache
  return getMenuItems().filter(item => item.category === category);
};

export const getPopularMenuItems = (): MenuItem[] => {
  // Filter from cache
  return getMenuItems().filter(item => item.popular);
};

export const addMenuItem = async (
  item: Omit<MenuItem, 'id'> | FormData
): Promise<MenuItem> => {
  try {
    const newItem = await api.addMenuItem(item);
    // Update cache
    menuItemsCache.push(newItem);
    return newItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (
  id: number, 
  updates: Partial<MenuItem> | FormData
): Promise<MenuItem | undefined> => {
  try {
    const updatedItem = await api.updateMenuItem(id, updates);
    if (updatedItem) {
      // Update cache
      const index = menuItemsCache.findIndex(item => item.id === id);
      if (index !== -1) {
        menuItemsCache[index] = updatedItem;
      } else {
        menuItemsCache.push(updatedItem);
      }
    }
    return updatedItem;
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    throw error;
  }
};

export const deleteMenuItem = async (id: number): Promise<boolean> => {
  try {
    await api.deleteMenuItem(id);
    // Update cache
    menuItemsCache = menuItemsCache.filter(item => item.id !== id);
    return true;
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    throw error;
  }
};

export const getOffers = (): OfferItem[] => {
  // For immediate use in components, return cached data if available
  if (offersCache.length > 0) return offersCache;
  
  // Otherwise fetch and update cache in background
  api.getOffers().then(data => {
    offersCache = data;
  }).catch(error => {
    console.error('Error fetching offers:', error);
  });
  
  return offersCache;
};

export const getOfferById = (id: number): OfferItem | undefined => {
  // First try to find in cache
  const cachedOffer = offersCache.find(offer => offer.id === id);
  if (cachedOffer) return cachedOffer;
  
  // If not in cache, fetch individually and update cache in background
  api.getOffers().then(data => {
    offersCache = data;
  }).catch(error => {
    console.error(`Error fetching offers for id ${id}:`, error);
  });
  
  // Return undefined or find in updated cache
  return offersCache.find(offer => offer.id === id);
};

export const addOffer = async (
  offer: FormData
): Promise<OfferItem> => {
  try {
    const newOffer = await api.addOffer(offer);
    // Update cache
    offersCache.push(newOffer);
    return newOffer;
  } catch (error) {
    console.error('Error adding offer:', error);
    throw error;
  }
};

export const updateOffer = async (
  id: number, 
  updates: FormData
): Promise<OfferItem | undefined> => {
  try {
    const updatedOffer = await api.updateOffer(id, updates);
    if (updatedOffer) {
      // Update cache
      const index = offersCache.findIndex(offer => offer.id === id);
      if (index !== -1) {
        offersCache[index] = updatedOffer;
      } else {
        offersCache.push(updatedOffer);
      }
    }
    return updatedOffer;
  } catch (error) {
    console.error(`Error updating offer ${id}:`, error);
    throw error;
  }
};

export const getActiveOffers = (): OfferItem[] => {
  const offers = getOffers();
  const today = new Date().toISOString().split('T')[0];
  
  return offers.filter(offer => 
    offer.isActive && 
    offer.startDate <= today && 
    offer.endDate >= today
  );
};

export const deleteOffer = async (id: number): Promise<boolean> => {
  try {
    // Call the API to delete the offer
    await api.deleteOffer(id);
    
    // Update cache after successful deletion
    offersCache = offersCache.filter(offer => offer.id !== id);
    
    return true;
  } catch (error) {
    console.error(`Error deleting offer ${id}:`, error);
    toast.error('Failed to delete offer');
    return false;
  }
};

export const getMenuCategories = (): string[] => {
  if (categoriesCache.length > 0) return categoriesCache;
  
  const items = getMenuItems();
  categoriesCache = [...new Set(items.map(item => item.category))];
  return categoriesCache;
};

export const getUploadDirectoryInfo = async (): Promise<{ path: string, url: string }> => {
  try {
    return await api.getUploadDirectoryInfo();
  } catch (error) {
    console.error('Error fetching upload directory info:', error);
    return { path: 'server/uploads', url: '/uploads' };
  }
};

export const getFeedback = (): Feedback[] => {
  // For immediate use in components, return cached data if available
  if (feedbackCache.length > 0) return feedbackCache;
  
  // Otherwise fetch and update cache in background
  api.getFeedback().then(data => {
    feedbackCache = data;
  }).catch(error => {
    console.error('Error fetching feedback:', error);
  });
  
  return feedbackCache;
};

export const getPublishedFeedback = (): Feedback[] => {
  const feedback = getFeedback();
  return feedback.filter(f => f.isPublished);
};

export const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt' | 'isPublished'>): Promise<Feedback> => {
  try {
    const newFeedback = await api.addFeedback(feedback);
    // Update cache
    feedbackCache.push(newFeedback);
    return newFeedback;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const updateFeedbackPublication = async (id: number, isPublished: boolean): Promise<Feedback | undefined> => {
  try {
    const updatedFeedback = await api.updateFeedbackPublishStatus(id, isPublished);
    if (updatedFeedback) {
      // Update cache
      const index = feedbackCache.findIndex(f => f.id === id);
      if (index !== -1) {
        feedbackCache[index] = updatedFeedback;
      }
    }
    return updatedFeedback;
  } catch (error) {
    console.error(`Error updating feedback ${id} publication:`, error);
    throw error;
  }
};

export const deleteFeedback = async (id: number): Promise<boolean> => {
  try {
    // Since this isn't implemented in the API yet, we'll just show a toast
    toast.error('Feedback deletion is not implemented on the server yet');
    // Update cache anyway for UI responsiveness
    feedbackCache = feedbackCache.filter(f => f.id !== id);
    return true;
  } catch (error) {
    console.error(`Error deleting feedback ${id}:`, error);
    toast.error('Failed to delete feedback');
    return false;
  }
};

export const getOrders = (): Order[] => {
  // For immediate use in components, return cached data if available
  if (ordersCache.length > 0) return ordersCache;
  
  // Otherwise fetch and update cache in background
  api.getOrders().then(data => {
    ordersCache = data;
  }).catch(error => {
    console.error('Error fetching orders:', error);
  });
  
  return ordersCache;
};

export const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
  try {
    const newOrder = await api.addOrder(orderData);
    // Update cache
    ordersCache.push(newOrder);
    return newOrder;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order | undefined> => {
  try {
    const updatedOrder = await api.updateOrderStatus(id, status);
    if (updatedOrder) {
      // Update cache
      const index = ordersCache.findIndex(order => order.id === id);
      if (index !== -1) {
        ordersCache[index] = updatedOrder;
      }
    }
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
};

export const sendContactMessage = async (contactData: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
  try {
    return await api.sendContactMessage(contactData);
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};

// Initialize placeholder data function - preload data for immediate use
export const initializeData = () => {
  console.log('Database module loaded - initializing data caches');
  
  // Preload all data types
  api.getMenuItems().then(data => {
    menuItemsCache = data;
    console.log(`Loaded ${data.length} menu items`);
    
    // After menu items are loaded, derive categories
    const categorySet = new Set<string>();
    data.forEach(item => {
      if (item.category) categorySet.add(item.category);
    });
    categoriesCache = Array.from(categorySet);
  }).catch(error => {
    console.error('Error preloading menu items:', error);
  });
  
  api.getOffers().then(data => {
    offersCache = data;
    console.log(`Loaded ${data.length} offers`);
  }).catch(error => {
    console.error('Error preloading offers:', error);
  });
  
  api.getFeedback().then(data => {
    feedbackCache = data;
    console.log(`Loaded ${data.length} feedback items`);
  }).catch(error => {
    console.error('Error preloading feedback:', error);
  });
  
  api.getOrders().then(data => {
    ordersCache = data;
    console.log(`Loaded ${data.length} orders`);
  }).catch(error => {
    console.error('Error preloading orders:', error);
  });
};
