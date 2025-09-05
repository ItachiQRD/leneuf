import { useState, useEffect } from 'react';
import { usePerformanceMonitoring } from '@/utils/performance';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import Cart from '@/components/cart/Cart';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { startMonitoring } = usePerformanceMonitoring();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Commencer le monitoring dès que le layout est monté
  useEffect(() => {
    startMonitoring();
  }, [startMonitoring]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <MainHeader 
        onOpenCart={() => setIsCartOpen(true)}
      />
      <main className="flex-grow">
        {children}
      </main>
      <MainFooter />
      
      {/* Cart Overlay */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}