import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex">
    <main className="flex-1 p-8">
      <Outlet />
    </main>
  </div>
);

export default AppLayout; 