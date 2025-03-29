
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from '@/hooks/use-cart';
import { AuthProvider } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { initializeData } from '@/services/database';

// Public Pages
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import MenuItemDetail from "./pages/MenuItemDetail";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import MenuItems from "./pages/admin/MenuItems";
import MenuItemForm from "./pages/admin/MenuItemForm";
import OffersAdmin from "./pages/admin/Offers";
import OfferForm from "./pages/admin/OfferForm";
import FeedbackAdmin from "./pages/admin/Feedback";
import Orders from "./pages/admin/Orders";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize local data
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu/:id" element={<MenuItemDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Cart />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/feedback" element={<Feedback />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/menu-items" element={<MenuItems />} />
                <Route path="/admin/menu-items/new" element={<MenuItemForm />} />
                <Route path="/admin/menu-items/edit/:id" element={<MenuItemForm />} />
                <Route path="/admin/offers" element={<OffersAdmin />} />
                <Route path="/admin/offers/new" element={<OfferForm />} />
                <Route path="/admin/offers/edit/:id" element={<OfferForm />} />
                <Route path="/admin/feedback" element={<FeedbackAdmin />} />
                <Route path="/admin/orders" element={<Orders />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
