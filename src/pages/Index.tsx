
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPopularMenuItems, getPublishedFeedback, getActiveOffers } from '@/services/database';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  const popularItems = getPopularMenuItems();
  const testimonials = getPublishedFeedback();
  const activeOffers = getActiveOffers();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center bg-center bg-cover" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/hero-pizza.jpg")'
        }}>
        <div className="container mx-auto px-4 z-10 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-playfair">
            Delicious Pizza, Delivered to Your Door
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Handcrafted with the freshest ingredients and baked to perfection in our stone ovens
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/menu">
              <Button className="text-lg bg-pizza hover:bg-pizza-light px-8 py-6">View Our Menu</Button>
            </Link>
            <Link to="/order">
              <Button variant="outline" className="text-lg bg-transparent text-white border-white hover:bg-white hover:text-pizza px-8 py-6">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-pizza-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-pizza">Our Pizza Story</h2>
              <p className="text-lg mb-4">
                At Pizza Galaxy, we've been crafting delicious pizzas since 2005. Our secret? 
                Authentic recipes passed down through generations, combined with the freshest local ingredients.
              </p>
              <p className="text-lg mb-6">
                Every pizza is handmade with love and baked to perfection in our traditional stone ovens, 
                just as pizza should be.
              </p>
              <Link to="/contact">
                <Button className="bg-pizza hover:bg-pizza-light">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="/about-pizza.jpg" 
                alt="Chef preparing pizza" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-lg font-bold text-pizza">20+ Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-heading text-pizza">Our Most Popular Pizzas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularItems.slice(0, 3).map((item) => (
              <div key={item.id} className="pizza-card group">
                <div className="relative overflow-hidden h-60">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {item.discount && (
                    <div className="absolute top-0 right-0 bg-pizza text-white px-3 py-1 rounded-bl-lg">
                      {item.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-pizza">${item.price.toFixed(2)}</p>
                    <Link to={`/menu/${item.id}`} className="text-pizza hover:text-pizza-light flex items-center">
                      Order Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/menu">
              <Button className="bg-pizza hover:bg-pizza-light">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      {activeOffers.length > 0 && (
        <section className="py-16 bg-pizza bg-opacity-5">
          <div className="container mx-auto px-4">
            <h2 className="section-heading text-pizza">Special Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeOffers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={offer.imageUrl || '/offers/default-offer.jpg'}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-pizza">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    <Link to="/offers" className="pizza-button inline-block">
                      View Offer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/offers">
                <Button className="bg-pizza hover:bg-pizza-light">
                  View All Offers
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="section-heading text-pizza">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{item.message}"</p>
                <p className="font-bold">{item.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/feedback">
              <Button variant="outline" className="border-pizza text-pizza hover:bg-pizza hover:text-white">
                Leave Your Feedback
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-pizza text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">Ready to Order Your Perfect Pizza?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Delivery or takeaway, we've got you covered. Order now and enjoy a delicious meal from Pizza Galaxy!
          </p>
          <Link to="/order">
            <Button className="bg-white text-pizza hover:bg-gray-200 text-lg px-8 py-3">
              Order Now
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
