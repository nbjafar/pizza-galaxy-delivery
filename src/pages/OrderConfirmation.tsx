
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Check, Home } from 'lucide-react';

const OrderConfirmation = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-green-100">
            <Check className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 font-playfair">Order Placed Successfully!</h1>
        
        <div className="max-w-md mx-auto">
          <p className="text-gray-600 mb-8">
            Thank you for your order! We've received your order details and will begin preparing your delicious pizzas right away.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Next Steps</h2>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>
                  <strong>Delivery Orders:</strong> Our delivery driver will contact you when they are on their way. Please have cash or card ready for payment.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>
                  <strong>Takeaway Orders:</strong> We'll call you when your order is ready for pickup. Please bring cash or card for payment.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>
                  If you have any questions or need to modify your order, please call us at <strong>(555) 123-4567</strong>.
                </span>
              </li>
            </ul>
          </div>
          
          <Link to="/">
            <Button className="bg-pizza hover:bg-pizza-light">
              <Home className="mr-2 h-5 w-5" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmation;
