import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { AppProviders } from './providers.jsx';
import { initStorage } from '../services/storageService.js';

export function App() {
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
