import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import ProviderWrapper from '@/components/ProviderWrapper';
import AdminLayout from '@/components/layout/AdminLayout';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/router';
import { Toaster } from '@/components/ui/Toaster';
import { ToastProvider } from "@/components/ui/Toast";
import { ProductProvider } from "@/contexts/ProductContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  const Layout = isAdminRoute ? AdminLayout : MainLayout;

  return (
    <ProviderWrapper>
      <ToastProvider>
        <ProductProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </ProductProvider>
      </ToastProvider>
    </ProviderWrapper>
  );
}