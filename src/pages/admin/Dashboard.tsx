import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tag, MessageSquare, Package, TrendingUp, Users } from 'lucide-react';
import { getMenuItems, getOffers, getFeedback, getOrders } from '@/services/database';
import PizzaIcon from '@/components/icons/PizzaIcon';

const Dashboard = () => {
  const menuItems = getMenuItems();
  const offers = getOffers();
  const feedback = getFeedback();
  const orders = getOrders();
  
  // Calculate stats
  const activeOffers = offers.filter(offer => offer.isActive).length;
  const publishedFeedback = feedback.filter(fb => fb.isPublished).length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  
  // Mock data for chart
  const ordersByDate = [
    { date: 'Mon', count: 5 },
    { date: 'Tue', count: 7 },
    { date: 'Wed', count: 10 },
    { date: 'Thu', count: 8 },
    { date: 'Fri', count: 12 },
    { date: 'Sat', count: 15 },
    { date: 'Sun', count: 9 },
  ];
  
  const maxOrderCount = Math.max(...ordersByDate.map(day => day.count));

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-playfair">Admin Dashboard</h1>
          <Link to="/">
            <Button variant="outline">View Website</Button>
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{menuItems.length}</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <PizzaIcon className="h-6 w-6" />
                </div>
              </div>
              <Link to="/admin/menu-items">
                <Button variant="link" className="p-0 h-auto mt-2 text-blue-600">
                  Manage Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{activeOffers}</div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <Tag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <Link to="/admin/offers">
                <Button variant="link" className="p-0 h-auto mt-2 text-orange-600">
                  Manage Offers
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{feedback.length}</div>
                <div className="p-2 bg-green-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Link to="/admin/feedback">
                <Button variant="link" className="p-0 h-auto mt-2 text-green-600">
                  View Feedback
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{pendingOrders}</div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <Link to="/admin/orders">
                <Button variant="link" className="p-0 h-auto mt-2 text-purple-600">
                  Manage Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        {/* Weekly Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <div className="flex items-end h-full space-x-2">
                {ordersByDate.map((day) => (
                  <div key={day.date} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-pizza rounded-t-md transition-all duration-300 hover:opacity-80"
                      style={{ 
                        height: `${(day.count / maxOrderCount) * 150}px`,
                      }}
                    />
                    <div className="text-xs font-medium mt-2">{day.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/menu-items/new">
                <Button className="w-full bg-pizza hover:bg-pizza-light">Add Menu Item</Button>
              </Link>
              <Link to="/admin/offers/new">
                <Button className="w-full" variant="outline">Create Offer</Button>
              </Link>
              <Link to="/admin/feedback">
                <Button className="w-full" variant="outline">Review Feedback</Button>
              </Link>
              <Link to="/admin/orders">
                <Button className="w-full" variant="outline">Check Orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
