
// This file now serves as a compatibility layer for local development
// All API calls should go through the api.ts service which connects to the backend

import { MenuItem, OfferItem, Feedback, Order, OrderType } from '@/models/types';
import * as api from './api';
import { toast } from 'sonner';

// Reexporting all API functions for backward compatibility
export { 
  getMenuItems, 
  getMenuItemById, 
  getMenuItemsByCategory,
  getPopularMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getOffers,
  addOffer,
  updateOffer,
  getActiveOffers,
  getMenuCategories,
  getUploadDirectoryInfo,
  getFeedback,
  getPublishedFeedback,
  addFeedback,
  updateFeedbackPublication,
  getOrders,
  addOrder,
  updateOrderStatus,
  sendContactMessage
} from './api';

// Add the missing deleteFeedback function
export const deleteFeedback = async (id: number): Promise<boolean> => {
  try {
    // Since this isn't implemented in the API yet, we'll just show a toast
    toast.error('Feedback deletion is not implemented on the server yet');
    return false;
  } catch (error) {
    console.error(`Error deleting feedback ${id}:`, error);
    toast.error('Failed to delete feedback');
    return false;
  }
};

// Add the missing deleteOffer function for the admin panel
export const deleteOffer = async (id: number): Promise<boolean> => {
  try {
    // Since this isn't fully implemented in the API yet, we'll just show a toast
    toast.error('Offer deletion is not implemented on the server yet');
    return false;
  } catch (error) {
    console.error(`Error deleting offer ${id}:`, error);
    toast.error('Failed to delete offer');
    return false;
  }
};

// Initialize placeholder data function
export const initializeData = () => {
  console.log('Database module loaded - using API service for all data operations');
};
