
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMenuItemById } from '@/services/database';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Minus, ShoppingBag } from 'lucide-react';

const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const menuItem = getMenuItemById(Number(id));
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(menuItem?.availableSizes?.[1] || '');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  
  if (!menuItem) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Menu Item Not Found</h1>
          <p className="mb-8">The menu item you're looking for doesn't exist or has been removed.</p>
          <Link to="/menu">
            <Button>Back to Menu</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const toggleTopping = (topping: string) => {
    setSelectedToppings(prev => 
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };
  
  // Calculate price based on size and toppings
  const getBasePrice = () => {
    // For example, Medium is base price, Small is -2, Large is +3, Family is +6
    if (!selectedSize || selectedSize === 'Medium') return menuItem.price;
    if (selectedSize === 'Small') return menuItem.price - 2;
    if (selectedSize === 'Large') return menuItem.price + 3;
    if (selectedSize === 'Family') return menuItem.price + 6;
    return menuItem.price;
  };
  
  const getToppingsPrice = () => {
    // Each topping costs $1.50
    return selectedToppings.length * 1.5;
  };
  
  const finalPrice = getBasePrice() + getToppingsPrice();
  
  const handleAddToCart = () => {
    addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: finalPrice,
      quantity,
      image: menuItem.image,
      size: selectedSize,
      toppings: selectedToppings
    });
    navigate('/cart');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          className="mb-8 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img 
              src={menuItem.image || '/placeholder.svg'} 
              alt={menuItem.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2 font-playfair">{menuItem.name}</h1>
            <p className="text-gray-600 mb-6">{menuItem.description}</p>
            
            {/* Price */}
            <div className="mb-6">
              <p className="text-2xl font-bold text-pizza">${finalPrice.toFixed(2)}</p>
              {menuItem.discount && (
                <p className="text-sm text-gray-500 line-through">${(finalPrice / (1 - menuItem.discount / 100)).toFixed(2)}</p>
              )}
            </div>
            
            {/* Size Selection */}
            {menuItem.availableSizes && menuItem.availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Select Size</h3>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItem.availableSizes.map(size => (
                      <SelectItem key={size} value={size}>
                        {size}
                        {size === 'Small' && ' (-$2.00)'}
                        {size === 'Medium' && ' (Base price)'}
                        {size === 'Large' && ' (+$3.00)'}
                        {size === 'Family' && ' (+$6.00)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Toppings Selection */}
            {menuItem.availableToppings && menuItem.availableToppings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Add Extra Toppings ($1.50 each)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {menuItem.availableToppings.map(topping => (
                    <div key={topping} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`topping-${topping}`} 
                        checked={selectedToppings.includes(topping)}
                        onCheckedChange={() => toggleTopping(topping)}
                      />
                      <Label htmlFor={`topping-${topping}`}>{topping}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 text-lg font-medium w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-pizza hover:bg-pizza-light py-6 text-lg"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MenuItemDetail;
