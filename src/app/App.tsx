import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Analytics />
    </AppProvider>
  );
}
