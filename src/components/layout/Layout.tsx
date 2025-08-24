import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className={`flex ${isHomePage ? '' : 'pt-16'}`}>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 min-h-[calc(100vh-4rem-12rem)] pt-8 pb-16 px-4">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout; 