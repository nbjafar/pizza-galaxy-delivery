
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'sonner';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout;
