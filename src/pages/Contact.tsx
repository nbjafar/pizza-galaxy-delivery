
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, MessageSquare, Facebook, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center text-center bg-center bg-cover" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/contact-hero.jpg")'
        }}>
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
            Contact Us
          </h1>
          <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out to us for any questions or to place an order
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8 font-playfair text-pizza">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-pizza text-white p-3 rounded-full">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Our Location</h3>
                    <p className="text-gray-600">123 Pizza Street, Food City, FC 12345</p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pizza hover:underline inline-block mt-1"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 bg-pizza text-white p-3 rounded-full">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 765-4321</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 bg-pizza text-white p-3 rounded-full">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Email</h3>
                    <p className="text-gray-600">info@pizzagalaxy.com</p>
                    <p className="text-gray-600">orders@pizzagalaxy.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 bg-pizza text-white p-3 rounded-full">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Opening Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 11am - 10pm</p>
                    <p className="text-gray-600">Saturday - Sunday: 10am - 11pm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="https://wa.me/+15551234567" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
              {/* Placeholder for Google Maps Embed */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Map Location</h3>
                  <p className="text-gray-600 mb-4">
                    This would be a Google Maps embed in a real implementation
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pizza hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Options Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center font-playfair">Ways to Order</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="bg-pizza text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Call Us</h3>
              <p className="text-gray-600 mb-6">
                Give us a call to place your order directly with our friendly staff.
              </p>
              <a href="tel:+15551234567" className="text-pizza font-bold text-lg hover:underline">
                +1 (555) 123-4567
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="bg-pizza text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">WhatsApp</h3>
              <p className="text-gray-600 mb-6">
                Send us your order details through WhatsApp for a quick response.
              </p>
              <a href="https://wa.me/+15551234567" target="_blank" rel="noopener noreferrer" className="text-pizza font-bold text-lg hover:underline">
                Message Us
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="bg-pizza text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Facebook</h3>
              <p className="text-gray-600 mb-6">
                Send us a message on Facebook to place your order through Messenger.
              </p>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-pizza font-bold text-lg hover:underline">
                Message Us
              </a>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-6">Prefer to Order Online?</h3>
            <Link to="/order">
              <Button className="bg-pizza hover:bg-pizza-light text-lg px-8 py-6">
                Order Now on Our Website
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="py-16 bg-pizza text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair">Need Assistance?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help with any questions, concerns, or special requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/feedback">
              <Button className="bg-white text-pizza hover:bg-gray-200">
                Leave Feedback
              </Button>
            </Link>
            <a href="mailto:support@pizzagalaxy.com">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-pizza">
                Email Support
              </Button>
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
