// Mock database functions for local testing

import { MenuItem, OfferItem, Feedback, Order } from '@/models/types';
import { addMenuItem as apiAddMenuItem, updateMenuItem as apiUpdateMenuItem } from './api';
import { toast } from 'sonner';

// Initialize mock data
export const initializeData = () => {
  console.log('Initializing local data for testing...');
  // This function doesn't need to do anything else in our mock setup
  // In a real app, this might load initial data from local storage
};

// Menu Items
let menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil',
    price: 12.99,
    category: 'Classic Pizzas',
    image: '/imgs/margherita.jpg',
    popular: true,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Mushrooms', 'Olives']
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza topped with spicy pepperoni slices',
    price: 14.99,
    category: 'Classic Pizzas',
    image: '/imgs/pepperoni.jpg',
    popular: true,
    availableSizes: ['Small', 'Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Mushrooms', 'Onions', 'Bell Peppers']
  },
  {
    id: 3,
    name: 'Vegetarian Supreme',
    description: 'Loaded with fresh vegetables including bell peppers, onions, mushrooms, and olives',
    price: 15.99,
    category: 'Specialty Pizzas',
    image: '/imgs/vegetarian.jpg',
    popular: false,
    availableSizes: ['Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Jalapeños', 'Pineapple']
  },
  {
    id: 4,
    name: 'Meat Lovers',
    description: 'For the carnivores - pepperoni, sausage, bacon, and ham on a rich tomato base',
    price: 16.99,
    category: 'Specialty Pizzas',
    image: '/imgs/meat-lovers.jpg',
    popular: true,
    availableSizes: ['Medium', 'Large', 'Family'],
    availableToppings: ['Extra Cheese', 'Mushrooms', 'Onions']
  },
  {
    id: 5,
    name: 'Hawaiian Pizza',
    description: 'Sweet and savory combination of ham and pineapple',
    price: 14.99,
    category: 'Classic Pizzas',
    image: '/imgs/hawaiian.jpg',
    popular: false,
    availableSizes: ['Small', 'Medium', 'Large'],
    availableToppings: ['Extra Cheese', 'Bacon', 'Bell Peppers']
  },
  {
    id: 6,
    name: 'BBQ Chicken',
    description: 'Grilled chicken, red onions, and cilantro on a tangy BBQ sauce base',
    price: 16.99,
    category: 'Specialty Pizzas',
    image: '/imgs/bbq-chicken.jpg',
    popular: true,
    availableSizes: ['Medium', 'Large'],
    availableToppings: ['Extra Cheese', 'Bacon', 'Jalapeños']
  },
  {
    id: 7,
    name: 'Buffalo Wings',
    description: 'Spicy buffalo wings served with blue cheese dip',
    price: 9.99,
    category: 'Sides',
    image: '/imgs/buffalo-wings.jpg',
    popular: true
  },
  {
    id: 8,
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter and herbs',
    price: 4.99,
    category: 'Sides',
    image: '/imgs/garlic-bread.jpg',
    popular: false
  },
  {
    id: 9,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 7.99,
    category: 'Salads',
    image: '/imgs/caesar-salad.jpg',
    popular: false
  },
  {
    id: 10,
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie served with vanilla ice cream',
    price: 6.99,
    category: 'Desserts',
    image: '/imgs/chocolate-brownie.jpg',
    popular: true
  }
];

export const getMenuItems = (): MenuItem[] => {
  return menuItems;
};

export const getMenuItemById = (id: number): MenuItem | undefined => {
  return menuItems.find(item => item.id === id);
};

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};

export const getPopularMenuItems = (): MenuItem[] => {
  return menuItems.filter(item => item.popular);
};

export const addMenuItem = async (
  itemData: Omit<MenuItem, 'id'> | FormData
): Promise<MenuItem> => {
  try {
    // Use the API to add the menu item (for when API is connected)
    const newItem = await apiAddMenuItem(itemData);
    
    // Update local state (for testing without API)
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    
    let newMenuItem: MenuItem;
    
    if (itemData instanceof FormData) {
      const name = itemData.get('name') as string;
      const description = itemData.get('description') as string;
      const price = parseFloat(itemData.get('price') as string);
      const category = itemData.get('category') as string;
      const popular = itemData.get('popular') === 'true';
      
      let availableSizes: string[] = [];
      let availableToppings: string[] = [];
      
      const sizesString = itemData.get('availableSizes');
      if (sizesString) {
        availableSizes = JSON.parse(sizesString as string);
      }
      
      const toppingsString = itemData.get('availableToppings');
      if (toppingsString) {
        availableToppings = JSON.parse(toppingsString as string);
      }
      
      // Get image file name from the FormData - this would come from the server response
      // In testing, we're just using a placeholder
      const imageFile = itemData.get('image') as File;
      const image = imageFile ? `/uploads/${Date.now()}-${imageFile.name}` : '';
      
      newMenuItem = {
        id: newId,
        name,
        description,
        price,
        category,
        image,
        popular,
        availableSizes,
        availableToppings
      };
      
    } else {
      newMenuItem = {
        id: newId,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        category: itemData.category,
        image: itemData.image,
        popular: itemData.popular,
        availableSizes: itemData.availableSizes || [],
        availableToppings: itemData.availableToppings || []
      };
    }
    
    menuItems.push(newMenuItem);
    toast.success('Menu item added successfully');
    
    return newMenuItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    toast.error('Failed to add menu item');
    throw error;
  }
};

export const updateMenuItem = async (
  id: number, 
  updates: Partial<MenuItem> | FormData
): Promise<MenuItem | undefined> => {
  try {
    // Use the API to update the menu item (for when API is connected)
    await apiUpdateMenuItem(id, updates);
    
    // Update local state (for testing without API)
    const index = menuItems.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    if (updates instanceof FormData) {
      // Extract data from FormData
      const name = updates.get('name') as string;
      const description = updates.get('description') as string;
      const price = parseFloat(updates.get('price') as string);
      const category = updates.get('category') as string;
      const popular = updates.get('popular') === 'true';
      
      let availableSizes: string[] = [];
      let availableToppings: string[] = [];
      
      const sizesString = updates.get('availableSizes');
      if (sizesString) {
        availableSizes = JSON.parse(sizesString as string);
      }
      
      const toppingsString = updates.get('availableToppings');
      if (toppingsString) {
        availableToppings = JSON.parse(toppingsString as string);
      }
      
      // Get image file name from the FormData - this would come from the server response
      // In testing, we're just using a placeholder or keeping the old image
      const imageFile = updates.get('image') as File;
      const currentItem = menuItems[index];
      const image = imageFile ? `/uploads/${Date.now()}-${imageFile.name}` : currentItem.image;
      
      menuItems[index] = {
        ...menuItems[index],
        name,
        description,
        price,
        category,
        image,
        popular,
        availableSizes,
        availableToppings
      };
    } else {
      menuItems[index] = {
        ...menuItems[index],
        ...updates
      };
    }
    
    toast.success('Menu item updated successfully');
    return menuItems[index];
  } catch (error) {
    console.error('Error updating menu item:', error);
    toast.error('Failed to update menu item');
    return undefined;
  }
};

export const deleteMenuItem = (id: number): boolean => {
  const initialLength = menuItems.length;
  menuItems = menuItems.filter(item => item.id !== id);
  
  if (menuItems.length < initialLength) {
    toast.success('Menu item deleted successfully');
    return true;
  }
  
  toast.error('Menu item not found');
  return false;
};

// Offers
let offers: OfferItem[] = [
  {
    id: 1,
    title: 'Family Special',
    description: 'Get 20% off on all family-sized pizzas. Perfect for gatherings!',
    imageUrl: '/imgs/family-special.jpg',
    discount: 20,
    menuItemIds: [],
    startDate: '2023-05-01',
    endDate: '2023-12-31',
    isActive: true
  },
  {
    id: 2,
    title: 'Weekday Lunch Deal',
    description: 'Buy any medium pizza and get a free side Monday to Friday, 11am to 3pm.',
    imageUrl: '/imgs/lunch-deal.jpg',
    discount: 0,
    menuItemIds: [1, 2, 5],
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    isActive: true
  },
  {
    id: 3,
    title: 'Student Discount',
    description: 'Show your student ID and get 15% off your entire order!',
    imageUrl: '/imgs/student-discount.jpg',
    discount: 15,
    menuItemIds: [],
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    isActive: true
  }
];

export const getOffers = (): OfferItem[] => {
  return offers;
};

export const getOfferById = (id: number): OfferItem | undefined => {
  return offers.find(offer => offer.id === id);
};

export const getActiveOffers = (): OfferItem[] => {
  const today = new Date().toISOString().split('T')[0];
  return offers.filter(offer => 
    offer.isActive && 
    offer.startDate <= today && 
    offer.endDate >= today
  );
};

export const addOffer = (
  offerData: Omit<OfferItem, 'id'> | FormData
): OfferItem => {
  const newId = offers.length > 0 ? Math.max(...offers.map(offer => offer.id)) + 1 : 1;
  
  let newOffer: OfferItem;
  
  if (offerData instanceof FormData) {
    const title = offerData.get('title') as string;
    const description = offerData.get('description') as string;
    const discount = parseFloat(offerData.get('discount') as string) || 0;
    const startDate = offerData.get('startDate') as string;
    const endDate = offerData.get('endDate') as string;
    const isActive = offerData.get('isActive') === 'true';
    
    let menuItemIds: number[] = [];
    const menuItemsString = offerData.get('menuItemIds');
    if (menuItemsString) {
      menuItemIds = JSON.parse(menuItemsString as string);
    }
    
    // Get image file name from the FormData - this would come from the server response
    // In testing, we're just using a placeholder
    const imageFile = offerData.get('image') as File;
    const imageUrl = imageFile ? `/uploads/${Date.now()}-${imageFile.name}` : '';
    
    newOffer = {
      id: newId,
      title,
      description,
      imageUrl,
      discount,
      menuItemIds,
      startDate,
      endDate,
      isActive
    };
  } else {
    newOffer = {
      id: newId,
      title: offerData.title,
      description: offerData.description,
      imageUrl: offerData.imageUrl,
      discount: offerData.discount,
      menuItemIds: offerData.menuItemIds || [],
      startDate: offerData.startDate,
      endDate: offerData.endDate,
      isActive: offerData.isActive
    };
  }
  
  offers.push(newOffer);
  toast.success('Offer added successfully');
  
  return newOffer;
};

export const updateOffer = (
  id: number, 
  updates: Partial<OfferItem> | FormData
): OfferItem | undefined => {
  const index = offers.findIndex(offer => offer.id === id);
  if (index === -1) return undefined;
  
  if (updates instanceof FormData) {
    // Extract data from FormData
    const title = updates.get('title') as string;
    const description = updates.get('description') as string;
    const discount = parseFloat(updates.get('discount') as string) || 0;
    const startDate = updates.get('startDate') as string;
    const endDate = updates.get('endDate') as string;
    const isActive = updates.get('isActive') === 'true';
    
    let menuItemIds: number[] = [];
    const menuItemsString = updates.get('menuItemIds');
    if (menuItemsString) {
      menuItemIds = JSON.parse(menuItemsString as string);
    }
    
    // Get image file name from the FormData - this would come from the server response
    // In testing, we're just using a placeholder or keeping the old image
    const imageFile = updates.get('image') as File;
    const currentOffer = offers[index];
    const imageUrl = imageFile ? `/uploads/${Date.now()}-${imageFile.name}` : currentOffer.imageUrl;
    
    offers[index] = {
      ...offers[index],
      title,
      description,
      imageUrl,
      discount,
      menuItemIds,
      startDate,
      endDate,
      isActive
    };
  } else {
    offers[index] = {
      ...offers[index],
      ...updates
    };
  }
  
  toast.success('Offer updated successfully');
  return offers[index];
};

export const deleteOffer = (id: number): boolean => {
  const initialLength = offers.length;
  offers = offers.filter(offer => offer.id !== id);
  
  if (offers.length < initialLength) {
    toast.success('Offer deleted successfully');
    return true;
  }
  
  toast.error('Offer not found');
  return false;
};

// Categories
export const getMenuCategories = (): string[] => {
  return [...new Set(menuItems.map(item => item.category))];
};

// Feedback
let feedback: Feedback[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    rating: 5,
    message: 'Best pizza in town! The Meat Lovers is absolutely delicious.',
    isPublished: true,
    createdAt: '2023-05-15T14:30:00Z'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    rating: 4,
    message: 'Great service and tasty food. Delivery was prompt.',
    isPublished: true,
    createdAt: '2023-06-22T18:45:00Z'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    rating: 3,
    message: 'Pizza was good but arrived a bit cold. Would order again though.',
    isPublished: false,
    createdAt: '2023-07-10T20:15:00Z'
  }
];

export const getFeedback = (): Feedback[] => {
  return feedback;
};

export const getPublishedFeedback = (): Feedback[] => {
  return feedback.filter(f => f.isPublished);
};

export const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'isPublished'>): Feedback => {
  const newId = feedback.length > 0 ? Math.max(...feedback.map(f => f.id)) + 1 : 1;
  
  const newFeedback: Feedback = {
    id: newId,
    ...feedbackData,
    isPublished: false,
    createdAt: new Date().toISOString()
  };
  
  feedback.push(newFeedback);
  toast.success('Feedback submitted successfully! Thank you for your comments.');
  
  return newFeedback;
};

export const updateFeedbackPublication = (id: number, isPublished: boolean): Feedback | undefined => {
  const index = feedback.findIndex(f => f.id === id);
  if (index === -1) return undefined;
  
  feedback[index] = {
    ...feedback[index],
    isPublished
  };
  
  toast.success(`Feedback ${isPublished ? 'published' : 'unpublished'} successfully`);
  return feedback[index];
};

export const deleteFeedback = (id: number): boolean => {
  const initialLength = feedback.length;
  feedback = feedback.filter(f => f.id !== id);
  
  if (feedback.length < initialLength) {
    toast.success('Feedback deleted successfully');
    return true;
  }
  
  toast.error('Feedback not found');
  return false;
};

// Orders
let orders: Order[] = [
  {
    id: 1,
    customerName: 'David Wilson',
    customerPhone: '555-123-4567',
    customerAddress: '123 Main St, Anytown, USA',
    orderType: 'delivery',
    orderItems: [
      {
        menuItemId: 1,
        name: 'Margherita Pizza',
        price: 12.99,
        quantity: 1,
        size: 'Medium',
        toppings: ['Extra Cheese']
      },
      {
        menuItemId: 7,
        name: 'Buffalo Wings',
        price: 9.99,
        quantity: 1
      }
    ],
    totalAmount: 22.98,
    status: 'completed',
    createdAt: '2023-07-15T12:30:00Z'
  },
  {
    id: 2,
    customerName: 'Emily Davis',
    customerPhone: '555-987-6543',
    customerAddress: '',
    orderType: 'pickup' as const,
    orderItems: [
      {
        menuItemId: 4,
        name: 'Meat Lovers',
        price: 16.99,
        quantity: 2,
        size: 'Large',
        toppings: []
      }
    ],
    totalAmount: 33.98,
    status: 'completed',
    createdAt: '2023-07-16T18:45:00Z'
  },
  {
    id: 3,
    customerName: 'Robert Johnson',
    customerPhone: '555-456-7890',
    customerAddress: '456 Oak Ave, Anytown, USA',
    orderType: 'delivery',
    orderItems: [
      {
        menuItemId: 2,
        name: 'Pepperoni Pizza',
        price: 14.99,
        quantity: 1,
        size: 'Family',
        toppings: ['Mushrooms', 'Onions']
      },
      {
        menuItemId: 8,
        name: 'Garlic Bread',
        price: 4.99,
        quantity: 1
      },
      {
        menuItemId: 10,
        name: 'Chocolate Brownie',
        price: 6.99,
        quantity: 1
      }
    ],
    totalAmount: 26.97,
    status: 'preparing',
    createdAt: '2023-07-17T19:15:00Z'
  }
];

export const getOrders = (): Order[] => {
  return orders;
};

export const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
  const newId = orders.length > 0 ? Math.max(...orders.map(order => order.id)) + 1 : 1;
  
  const newOrder: Order = {
    id: newId,
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  toast.success('Order placed successfully!');
  
  return newOrder;
};

export const updateOrderStatus = (id: number, status: Order['status']): Order | undefined => {
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return undefined;
  
  orders[index] = {
    ...orders[index],
    status
  };
  
  toast.success(`Order status updated to ${status}`);
  return orders[index];
};

// Contact messages
export const sendContactMessage = (contactData: { name: string; email: string; subject: string; message: string }): boolean => {
  // In a real app, this would send the message to the server
  toast.success('Message sent successfully!');
  return true;
};
