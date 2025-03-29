import { MenuItem, OfferItem, Feedback, Order } from '@/models/types';
import { toast } from 'sonner';

// This is a mock database service for demo purposes
// In a real application, this would connect to your MySQL database

// Initial menu items
const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    category: 'Classic Pizzas',
    image: '/pizzas/margherita.jpg',
    popular: true,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Mushrooms', 'Olives', 'Peppers']
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza topped with spicy pepperoni slices',
    price: 14.99,
    category: 'Classic Pizzas',
    image: '/pizzas/pepperoni.jpg',
    popular: true,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Mushrooms', 'Olives', 'Peppers']
  },
  {
    id: 3,
    name: 'Vegetarian Pizza',
    description: 'Fresh vegetables, including bell peppers, onions, mushrooms, and olives',
    price: 13.99,
    category: 'Vegetarian',
    image: '/pizzas/vegetarian.jpg',
    popular: false,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Pineapple', 'Extra Vegetables', 'Jalapenos']
  },
  {
    id: 4,
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
    price: 15.99,
    category: 'Special Pizzas',
    image: '/pizzas/bbq-chicken.jpg',
    popular: true,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Extra Chicken', 'Bacon', 'Peppers']
  },
  {
    id: 5,
    name: 'Supreme Pizza',
    description: 'Loaded with pepperoni, sausage, bell peppers, onions, and olives',
    price: 16.99,
    category: 'Special Pizzas',
    image: '/pizzas/supreme.jpg',
    popular: true,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Extra Meat', 'Mushrooms', 'Jalapenos']
  },
  {
    id: 6,
    name: 'Hawaiian Pizza',
    description: 'Ham and pineapple with a tomato base',
    price: 14.99,
    category: 'Classic Pizzas',
    image: '/pizzas/hawaiian.jpg',
    popular: false,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Extra Pineapple', 'Extra Ham', 'Bacon']
  },
  {
    id: 7,
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter and herbs',
    price: 4.99,
    category: 'Sides',
    image: '/sides/garlic-bread.jpg',
    popular: true
  },
  {
    id: 8,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with Caesar dressing and croutons',
    price: 6.99,
    category: 'Sides',
    image: '/sides/caesar-salad.jpg',
    popular: false
  },
  {
    id: 9,
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with vanilla ice cream',
    price: 5.99,
    category: 'Desserts',
    image: '/desserts/chocolate-brownie.jpg',
    popular: true
  },
  {
    id: 10,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    price: 6.99,
    category: 'Desserts',
    image: '/desserts/tiramisu.jpg',
    popular: false
  }
];

// Initial offers
const initialOffers: OfferItem[] = [
  {
    id: 1,
    title: 'Monday Madness',
    description: 'Get 30% off on all classic pizzas every Monday!',
    imageUrl: '/offers/monday-offer.jpg',
    discount: 30,
    menuItemIds: [1, 2, 6],
    startDate: '2023-08-01',
    endDate: '2023-12-31',
    isActive: true
  },
  {
    id: 2,
    title: 'Family Feast',
    description: 'Order any 2 family-sized pizzas and get a free garlic bread!',
    imageUrl: '/offers/family-feast.jpg',
    discount: 0,
    menuItemIds: [1, 2, 3, 4, 5, 6],
    startDate: '2023-08-01',
    endDate: '2023-12-31',
    isActive: true
  },
  {
    id: 3,
    title: 'Dessert Delight',
    description: 'Get 50% off on all desserts when you spend over $30',
    imageUrl: '/offers/dessert-offer.jpg',
    discount: 50,
    menuItemIds: [9, 10],
    startDate: '2023-08-01',
    endDate: '2023-12-31',
    isActive: true
  }
];

// Initial feedback
const initialFeedback: Feedback[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    rating: 5,
    message: 'Best pizza in town! The Margherita is absolutely fantastic.',
    createdAt: '2023-08-10',
    isPublished: true
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    rating: 4,
    message: 'Really enjoyed the BBQ Chicken pizza. Delivery was quick too!',
    createdAt: '2023-08-15',
    isPublished: true
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    rating: 5,
    message: 'Great customer service and the pizzas are consistently delicious.',
    createdAt: '2023-08-20',
    isPublished: true
  }
];

// Initial orders
const initialOrders: Order[] = [];

// Helper function to load data from localStorage or use initial data
const loadData = <T>(key: string, initialData: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Error parsing ${key} data:`, error);
      return initialData;
    }
  }
  return initialData;
};

// Helper function to save data to localStorage
const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Menu Items CRUD
export const getMenuItems = (): MenuItem[] => {
  return loadData('menuItems', initialMenuItems);
};

export const getMenuItemById = (id: number): MenuItem | undefined => {
  const items = getMenuItems();
  return items.find(item => item.id === id);
};

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  const items = getMenuItems();
  return items.filter(item => item.category === category);
};

export const getPopularMenuItems = (): MenuItem[] => {
  const items = getMenuItems();
  return items.filter(item => item.popular);
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
  const items = getMenuItems();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { ...item, id: newId };
  
  const updatedItems = [...items, newItem];
  saveData('menuItems', updatedItems);
  toast.success('Menu item added successfully');
  
  return newItem;
};

export const updateMenuItem = (id: number, updates: Partial<MenuItem>): MenuItem | undefined => {
  const items = getMenuItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    toast.error('Menu item not found');
    return undefined;
  }
  
  const updatedItem = { ...items[index], ...updates };
  const updatedItems = [...items];
  updatedItems[index] = updatedItem;
  
  saveData('menuItems', updatedItems);
  toast.success('Menu item updated successfully');
  
  return updatedItem;
};

export const deleteMenuItem = (id: number): boolean => {
  const items = getMenuItems();
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) {
    toast.error('Menu item not found');
    return false;
  }
  
  saveData('menuItems', filteredItems);
  toast.success('Menu item deleted successfully');
  
  return true;
};

// Offers CRUD
export const getOffers = (): OfferItem[] => {
  return loadData('offers', initialOffers);
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

export const getOfferById = (id: number): OfferItem | undefined => {
  const offers = getOffers();
  return offers.find(offer => offer.id === id);
};

export const addOffer = (offer: Omit<OfferItem, 'id'>): OfferItem => {
  const offers = getOffers();
  const newId = offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1;
  const newOffer = { ...offer, id: newId };
  
  const updatedOffers = [...offers, newOffer];
  saveData('offers', updatedOffers);
  toast.success('Offer added successfully');
  
  return newOffer;
};

export const updateOffer = (id: number, updates: Partial<OfferItem>): OfferItem | undefined => {
  const offers = getOffers();
  const index = offers.findIndex(offer => offer.id === id);
  
  if (index === -1) {
    toast.error('Offer not found');
    return undefined;
  }
  
  const updatedOffer = { ...offers[index], ...updates };
  const updatedOffers = [...offers];
  updatedOffers[index] = updatedOffer;
  
  saveData('offers', updatedOffers);
  toast.success('Offer updated successfully');
  
  return updatedOffer;
};

export const deleteOffer = (id: number): boolean => {
  const offers = getOffers();
  const filteredOffers = offers.filter(offer => offer.id !== id);
  
  if (filteredOffers.length === offers.length) {
    toast.error('Offer not found');
    return false;
  }
  
  saveData('offers', filteredOffers);
  toast.success('Offer deleted successfully');
  
  return true;
};

// Feedback CRUD
export const getFeedback = (): Feedback[] => {
  return loadData('feedback', initialFeedback);
};

export const getPublishedFeedback = (): Feedback[] => {
  const feedback = getFeedback();
  return feedback.filter(f => f.isPublished);
};

export const getFeedbackById = (id: number): Feedback | undefined => {
  const feedback = getFeedback();
  return feedback.find(f => f.id === id);
};

export const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt' | 'isPublished'>): Feedback => {
  const feedbacks = getFeedback();
  const newId = feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) + 1 : 1;
  const newFeedback = { 
    ...feedback, 
    id: newId, 
    createdAt: new Date().toISOString().split('T')[0],
    isPublished: false
  };
  
  const updatedFeedbacks = [...feedbacks, newFeedback];
  saveData('feedback', updatedFeedbacks);
  toast.success('Feedback submitted successfully! Thank you for your comments.');
  
  return newFeedback;
};

export const updateFeedbackPublication = (id: number, isPublished: boolean): Feedback | undefined => {
  const feedbacks = getFeedback();
  const index = feedbacks.findIndex(f => f.id === id);
  
  if (index === -1) {
    toast.error('Feedback not found');
    return undefined;
  }
  
  const updatedFeedback = { ...feedbacks[index], isPublished };
  const updatedFeedbacks = [...feedbacks];
  updatedFeedbacks[index] = updatedFeedback;
  
  saveData('feedback', updatedFeedbacks);
  toast.success(`Feedback ${isPublished ? 'published' : 'unpublished'} successfully`);
  
  return updatedFeedback;
};

export const deleteFeedback = (id: number): boolean => {
  const feedbacks = getFeedback();
  const filteredFeedbacks = feedbacks.filter(f => f.id !== id);
  
  if (filteredFeedbacks.length === feedbacks.length) {
    toast.error('Feedback not found');
    return false;
  }
  
  saveData('feedback', filteredFeedbacks);
  toast.success('Feedback deleted successfully');
  
  return true;
};

// Orders CRUD
export const getOrders = (): Order[] => {
  return loadData('orders', initialOrders);
};

export const getOrderById = (id: number): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === id);
};

export const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
  const orders = getOrders();
  const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const newOrder = { 
    ...orderData, 
    id: newId, 
    createdAt: new Date().toISOString(),
    status: 'pending' as const
  };
  
  const updatedOrders = [...orders, newOrder];
  saveData('orders', updatedOrders);
  toast.success('Order placed successfully!');
  
  return newOrder;
};

export const updateOrderStatus = (id: number, status: Order['status']): Order | undefined => {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === id);
  
  if (index === -1) {
    toast.error('Order not found');
    return undefined;
  }
  
  const updatedOrder = { ...orders[index], status };
  const updatedOrders = [...orders];
  updatedOrders[index] = updatedOrder;
  
  saveData('orders', updatedOrders);
  toast.success(`Order status updated to ${status}`);
  
  return updatedOrder;
};

// Categories
export const getMenuCategories = (): string[] => {
  const items = getMenuItems();
  const categories = [...new Set(items.map(item => item.category))];
  return categories;
};

// Initialize data in localStorage if it doesn't exist
export const initializeData = (): void => {
  if (!localStorage.getItem('menuItems')) {
    saveData('menuItems', initialMenuItems);
  }
  
  if (!localStorage.getItem('offers')) {
    saveData('offers', initialOffers);
  }
  
  if (!localStorage.getItem('feedback')) {
    saveData('feedback', initialFeedback);
  }
  
  if (!localStorage.getItem('orders')) {
    saveData('orders', initialOrders);
  }
};
