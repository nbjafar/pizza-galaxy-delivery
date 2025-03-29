
import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  PizzaIcon,
  Tag,
  MessageSquare,
  Package,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const PizzaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M12 2a10 10 0 1 0 10 10H2A10 10 0 0 0 12 2z" />
    <path d="M12 12v10" />
    <path d="M8 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
    <path d="M16 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
    <path d="M8 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
  </svg>
);

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Menu Items', href: '/admin/menu-items', icon: PizzaIcon },
    { name: 'Offers', href: '/admin/offers', icon: Tag },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    { name: 'Orders', href: '/admin/orders', icon: Package },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center px-4 py-6 border-b border-gray-200">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-pizza font-playfair">Pizza Admin</span>
            </Link>
          </div>
          
          <nav className="flex-grow px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-pizza text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center px-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-pizza text-white flex items-center justify-center">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default AdminLayout;
