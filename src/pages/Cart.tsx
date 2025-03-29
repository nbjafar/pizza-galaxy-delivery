
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Trash, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { addOrder } from '@/services/database';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const handleCheckout = () => {
    if (!customerName || !customerPhone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    
    if (orderType === 'delivery' && !customerAddress) {
      toast.error('Please provide your delivery address');
      return;
    }
    
    const orderData = {
      customerName,
      customerPhone,
      customerAddress: orderType === 'delivery' ? customerAddress : undefined,
      orderType,
      orderItems: cartItems.map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        toppings: item.toppings
      })),
      totalAmount: getTotalPrice(),
      specialInstructions: specialInstructions || undefined
    };
    
    addOrder(orderData);
    clearCart();
    navigate('/order-confirmation');
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-playfair">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/menu">
            <Button className="bg-pizza hover:bg-pizza-light">
              Browse Our Menu
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 font-playfair">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.toppings?.join('')}`} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 last:border-0">
                  {/* Item Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden mr-0 sm:mr-4 mb-4 sm:mb-0">
                    <img 
                      src={item.image || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-grow mr-0 sm:mr-4 mb-4 sm:mb-0">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    {item.size && <p className="text-gray-600 text-sm">Size: {item.size}</p>}
                    {item.toppings && item.toppings.length > 0 && (
                      <p className="text-gray-600 text-sm">
                        Extra: {item.toppings.join(', ')}
                      </p>
                    )}
                    <p className="text-pizza font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  
                  {/* Quantity Control */}
                  <div className="flex items-center mb-4 sm:mb-0">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-3 w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Subtotal and Remove */}
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <span className="font-bold sm:mr-6 sm:w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  className="text-gray-600"
                  onClick={() => clearCart()}
                >
                  Clear Cart
                </Button>
                <Link to="/menu">
                  <Button variant="outline" className="border-pizza text-pizza hover:bg-pizza hover:text-white">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>{orderType === 'delivery' ? '$3.00' : 'Free'}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(getTotalPrice() + (orderType === 'delivery' ? 3 : 0)).toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Payment on delivery or pickup</p>
              </div>
              
              {/* Order Type Selection */}
              <div className="mb-6">
                <h3 className="font-bold mb-2">Order Type</h3>
                <RadioGroup 
                  value={orderType} 
                  onValueChange={(value) => setOrderType(value as 'delivery' | 'takeaway')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway">Takeaway</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Customer Information */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="name">Name*</Label>
                  <Input 
                    id="name" 
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone*</Label>
                  <Input 
                    id="phone" 
                    placeholder="Your Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
                {orderType === 'delivery' && (
                  <div>
                    <Label htmlFor="address">Delivery Address*</Label>
                    <Textarea 
                      id="address" 
                      placeholder="Your Address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    placeholder="Any special instructions for your order"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full bg-pizza hover:bg-pizza-light"
                onClick={handleCheckout}
              >
                Complete Order <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
