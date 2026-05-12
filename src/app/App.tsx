import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from './components/ui/sonner';
import { initializeAutoUpdater } from '../lib/updater';
import { motion, AnimatePresence } from 'motion/react';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initializeAutoUpdater();
  }, []);

  return (
    <AppProvider>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <RouterProvider router={router} />
        </motion.div>
      )}
      
      <Toaster position="top-center" expand={true} richColors />
      <Analytics />
    </AppProvider>
  );
}
