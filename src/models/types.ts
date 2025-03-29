
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
  availableSizes?: string[];
  availableToppings?: string[];
  discount?: number;
};

export type OfferItem = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  discount: number;
  menuItemIds?: number[];
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type Feedback = {
  id: number;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
  isPublished: boolean;
};

export type OrderType = 'delivery' | 'takeaway';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  orderType: OrderType;
  orderItems: {
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    toppings?: string[];
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  specialInstructions?: string;
};
