import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/login?returnUrl=${router.pathname}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return user ? <>{children}</> : null;
}