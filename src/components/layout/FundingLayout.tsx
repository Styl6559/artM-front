import React from 'react';
import FundingSidebar from './FundingSidebar';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const FundingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="flex flex-1 w-full">
        {/* Sidebar: hidden on mobile, visible on md+ */}
        <div className="hidden md:block">
          <FundingSidebar />
        </div>
        {/* Mobile sidebar drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute top-0 left-0 w-64 h-full bg-gray-800 border-r border-gray-700 shadow-lg">
              <FundingSidebar />
            </div>
          </div>
        )}
        <main className="flex-1 p-2 md:p-8 animate-fade-in z-10 w-full md:ml-64 pt-24 mt-8">
          <Outlet />
        </main>
      </div>
      <div className="mt-24" />
    </div>
  );
};

export default FundingLayout;
