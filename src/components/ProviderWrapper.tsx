import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { CartProvider } from '@/contexts/CartContext';
import ToastContainer from '@/components/ToastContainer';

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              {children}
              <ToastContainer />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
