
import React from 'react';
import { Link } from 'react-router-dom';
import { getActiveOffers, getMenuItemById } from '@/services/database';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Tag } from 'lucide-react';

const Offers = () => {
  const activeOffers = getActiveOffers();

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get menu items for an offer
  const getOfferItems = (menuItemIds: number[] = []) => {
    return menuItemIds.map(id => getMenuItemById(id)).filter(Boolean);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center text-center bg-center bg-cover" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/offers-hero.jpg")'
        }}>
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
            Special Offers
          </h1>
          <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
            Check out our latest deals and promotions to save on your favorite pizzas
          </p>
        </div>
      </section>

      {/* Offers List Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {activeOffers.length > 0 ? (
            <div className="space-y-8">
              {activeOffers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Offer Image */}
                    <div className="md:col-span-1 h-64 md:h-auto">
                      <img
                        src={offer.imageUrl || '/offers/default-offer.jpg'}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Offer Details */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {offer.discount > 0 && (
                          <span className="bg-pizza text-white text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <Tag className="w-4 h-4 mr-1" /> {offer.discount}% OFF
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                          <Calendar className="w-4 h-4 mr-1" /> Valid until {formatDate(offer.endDate)}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-2 font-playfair">{offer.title}</h2>
                      <p className="text-gray-600 mb-4">{offer.description}</p>
                      
                      {offer.menuItemIds && offer.menuItemIds.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Applicable Items:</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {getOfferItems(offer.menuItemIds).map((item) => (
                              <Link 
                                key={item.id} 
                                to={`/menu/${item.id}`}
                                className="text-pizza hover:underline flex items-center"
                              >
                                <span className="w-2 h-2 bg-pizza rounded-full mr-2"></span>
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-4 mt-6">
                        <Link to="/menu">
                          <Button className="bg-pizza hover:bg-pizza-light">
                            Order Now
                          </Button>
                        </Link>
                        {offer.menuItemIds && offer.menuItemIds.length > 0 && (
                          <Link to={`/menu/${offer.menuItemIds[0]}`}>
                            <Button variant="outline" className="border-pizza text-pizza hover:bg-pizza hover:text-white">
                              View Featured Item
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">No Active Offers</h2>
              <p className="text-gray-600 mb-8">Check back soon for new deals and promotions!</p>
              <Link to="/menu">
                <Button className="bg-pizza hover:bg-pizza-light">
                  Browse Our Menu
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Join Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair">Never Miss a Deal</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow us on social media or visit our location to stay updated with our latest offers and promotions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-pizza hover:bg-pizza-light">
                Contact Us
              </Button>
            </Link>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-pizza text-pizza hover:bg-pizza hover:text-white">
                Follow on Facebook
              </Button>
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Offers;
