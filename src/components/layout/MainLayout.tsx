
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { BugIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <Link to="/debug">
          <Button variant="outline" size="sm" className="bg-white bg-opacity-80 hover:bg-opacity-100">
            <BugIcon className="h-4 w-4 mr-1" /> Debug
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
