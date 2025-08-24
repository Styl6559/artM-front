import React from 'react';
import Footer from './Footer';
import Header from './Header';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 pt-24 px-4">
        {children}
      </main>
      <div className="mt-24" />
      <Footer />
    </div>
  );
};

export default DashboardLayout; 