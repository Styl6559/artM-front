import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { UiProvider } from './contexts/UiContext';
import { AuthProvider } from './contexts/AuthContext';
import { FundingProvider } from './contexts/FundingContext';
import ConfirmDialog from './components/ui/ConfirmDialog';
import { HelmetProvider } from 'react-helmet-async';
import DevLock, { isDevAccessGranted } from './components/DevLock';

function App() {
  const [unlocked, setUnlocked] = useState(() => isDevAccessGranted());

  if (!unlocked) {
    return <DevLock onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <HelmetProvider>
      <AuthProvider>
        <FundingProvider>
          <UiProvider>
            <div className="min-h-screen bg-gray-900">
              <RouterProvider router={router} />
              <ConfirmDialog />
            </div>
          </UiProvider>
        </FundingProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
