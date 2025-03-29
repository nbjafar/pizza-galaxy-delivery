
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">Pizza Galaxy</h3>
            <p className="mb-4 text-gray-300">Serving the most delicious pizzas in town since 2005. Made with love and the finest ingredients.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-white transition-colors">Our Menu</Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-300 hover:text-white transition-colors">Daily Offers</Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-white transition-colors">Customer Feedback</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Monday - Friday: 11am - 10pm</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Saturday - Sunday: 10am - 11pm</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>123 Pizza Street, Food City, FC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>info@pizzagalaxy.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pizza Galaxy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
