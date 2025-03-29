
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  toppings?: string[];
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('pizzaCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pizzaCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already in cart
      const existingItemIndex = prevItems.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.size === item.size && 
        JSON.stringify(cartItem.toppings) === JSON.stringify(item.toppings)
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast.success('Item quantity updated in cart');
        return updatedItems;
      } else {
        // Add new item
        toast.success('Item added to cart');
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      toast.success('Item removed from cart');
      return newItems;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
