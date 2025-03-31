
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Menu from '@/pages/Menu';
import MenuItemDetail from '@/pages/MenuItemDetail';
import Offers from '@/pages/Offers';
import Cart from '@/pages/Cart';
import Feedback from '@/pages/Feedback';
import Contact from '@/pages/Contact';
import OrderConfirmation from '@/pages/OrderConfirmation';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard';
import MenuItems from '@/pages/admin/MenuItems';
import MenuItemForm from '@/pages/admin/MenuItemForm';
import Offers as AdminOffers from '@/pages/admin/Offers';
import OfferForm from '@/pages/admin/OfferForm';
import AdminFeedback from '@/pages/admin/Feedback';
import Orders from '@/pages/admin/Orders';
import { Toaster } from '@/components/ui/sonner';
import { initializeData } from '@/services/database';
import './App.css';
import Debug from '@/pages/Debug';

// Initialize data fetching
initializeData();

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuItemDetail />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        
        {/* Debug page */}
        <Route path="/debug" element={<Debug />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/menu-items" element={<MenuItems />} />
        <Route path="/admin/menu-items/new" element={<MenuItemForm />} />
        <Route path="/admin/menu-items/edit/:id" element={<MenuItemForm />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
        <Route path="/admin/offers/new" element={<OfferForm />} />
        <Route path="/admin/offers/edit/:id" element={<OfferForm />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/orders" element={<Orders />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
