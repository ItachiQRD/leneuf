import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import ProviderWrapper from '@/components/ProviderWrapper';
import AdminLayout from '@/components/layout/AdminLayout';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/router';
import { Toaster } from '@/components/ui/Toaster';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  const Layout = isAdminRoute ? AdminLayout : MainLayout;

  // Corriger les erreurs de Performance Observer
  useEffect(() => {
    // Désactiver les warnings de Performance Observer pour layout-shift
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          // Ignorer les entrées layout-shift non supportées
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'layout-shift') {
              // Ne rien faire pour éviter les warnings
            }
          });
        });
        
        // Observer seulement les types supportés
        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
        
        return () => observer.disconnect();
      } catch (error) {
        // Ignorer les erreurs de Performance Observer
        console.warn('Performance Observer non supporté:', error);
      }
    }
  }, []);

  return (
    <ProviderWrapper>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </ProviderWrapper>
  );
}