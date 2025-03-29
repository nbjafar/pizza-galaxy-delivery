
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Daily Offers', href: '/offers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Feedback', href: '/feedback' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-pizza font-playfair">Pizza Galaxy</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors hover:text-pizza ${
                  isActive(item.href) ? 'text-pizza border-b-2 border-pizza' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-pizza transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pizza text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link to="/order" className="hidden md:block">
              <Button className="bg-pizza hover:bg-pizza-light">Order Now</Button>
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-pizza transition-colors"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors hover:text-pizza px-2 py-1 ${
                    isActive(item.href) ? 'text-pizza bg-gray-100 rounded' : 'text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/order" 
                className="mt-2"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full bg-pizza hover:bg-pizza-light">Order Now</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
