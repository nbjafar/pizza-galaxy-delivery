import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMenuItems, getMenuCategories } from '@/services/database';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

const Menu = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [allItems, setAllItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [itemsData, categoriesData] = await Promise.all([
          getMenuItems(),
          getMenuCategories()
        ]);
        setAllItems(itemsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading menu data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <MainLayout>
      <section className="relative h-[40vh] flex items-center justify-center text-center bg-center bg-cover" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/menu-hero.jpg")'
        }}>
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
            Our Menu
          </h1>
          <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
            Explore our wide range of handcrafted pizzas and delicious sides
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Input
              type="text"
              placeholder="Search our menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-black"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Loading menu items...</p>
            </div>
          ) : (
            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
              <div className="overflow-x-auto pb-4">
                <TabsList className="mb-8">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="pizza-card overflow-hidden group">
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        {item.discount && (
                          <div className="absolute top-0 right-0 bg-pizza text-white px-3 py-1 rounded-bl-lg">
                            {item.discount}% OFF
                          </div>
                        )}
                        {item.popular && (
                          <div className="absolute top-0 left-0 bg-pizza-accent text-white px-3 py-1 rounded-br-lg">
                            Popular
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          <p className="text-lg font-bold text-pizza">${item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <Link to={`/menu/${item.id}`}>
                            <Button variant="outline" className="border-pizza text-pizza hover:bg-pizza hover:text-white">
                              View Details
                            </Button>
                          </Link>
                          <Button 
                            className="bg-pizza hover:bg-pizza-light"
                            onClick={() => handleAddToCart(item)}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No items found matching your search.</p>
                    <Button 
                      variant="link" 
                      className="text-pizza mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                    >
                      Clear search and filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="pizza-card overflow-hidden group">
                          <div className="relative h-60 overflow-hidden">
                            <img
                              src={item.image || '/placeholder.svg'}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                            {item.discount && (
                              <div className="absolute top-0 right-0 bg-pizza text-white px-3 py-1 rounded-bl-lg">
                                {item.discount}% OFF
                              </div>
                            )}
                            {item.popular && (
                              <div className="absolute top-0 left-0 bg-pizza-accent text-white px-3 py-1 rounded-br-lg">
                                Popular
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">{item.name}</h3>
                              <p className="text-lg font-bold text-pizza">${item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <Link to={`/menu/${item.id}`}>
                                <Button variant="outline" className="border-pizza text-pizza hover:bg-pizza hover:text-white">
                                  View Details
                                </Button>
                              </Link>
                              <Button 
                                className="bg-pizza hover:bg-pizza-light"
                                onClick={() => handleAddToCart(item)}
                              >
                                <Plus className="mr-2 h-4 w-4" /> Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  {filteredItems.filter(item => item.category === category).length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xl text-gray-500">No items found matching your search in this category.</p>
                      <Button 
                        variant="link" 
                        className="text-pizza mt-4"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      <section className="py-16 bg-pizza text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-playfair">Ready to Place Your Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Order online for delivery or takeaway and enjoy our delicious pizzas in the comfort of your home.
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

export default Menu;
