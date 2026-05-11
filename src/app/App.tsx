import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from './components/ui/sonner';
import { initializeAutoUpdater } from '../lib/updater';

export default function App() {
  useEffect(() => {
    initializeAutoUpdater();
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" expand={true} richColors />
      <Analytics />
    </AppProvider>
  );
}
