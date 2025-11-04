import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '@/types/auth';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  // Gérer les redirections basées sur l'authentification
  useEffect(() => {
    if (loading) return;

    const path = router.pathname;
    
    // Routes publiques qui ne nécessitent pas d'authentification
    const publicRoutes = [
      '/',
      '/menu',
      '/commander',
      '/contact',
      '/a-propos',
      '/promos',
      '/checkout',
      '/commande-formulaire',
    ];
    
    // Vérifier si la route actuelle est publique
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
    
    // Rediriger vers login si non authentifié (sauf routes publiques)
    if (!user && !path.startsWith('/auth/') && !path.startsWith('/api/') && !isPublicRoute) {
      router.replace('/auth/login');
      return;
    }

    // Rediriger les non-admins hors des pages admin
    if (user && !user.isAdmin && path.startsWith('/admin')) {
      router.replace('/');
      return;
    }

    // Rediriger les utilisateurs connectés hors des pages auth
    if (user && path.startsWith('/auth/')) {
      router.replace(user.isAdmin ? '/admin' : '/');
      return;
    }
  }, [loading, user, router.pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      // Vérifier si la réponse est valide avant de parser le JSON
      if (!response.ok) {
        if (response.status === 401) {
          // C'est normal si l'utilisateur n'est pas connecté
          setUser(null);
          return;
        }
        console.error('Erreur checkAuth: HTTP', response.status);
        setUser(null);
        return;
      }

      // Récupérer le contenu de la réponse
      const text = await response.text();
      
      if (!text) {
        console.error('Erreur checkAuth: Réponse vide');
        setUser(null);
        return;
      }

      // Essayer de parser le JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Erreur checkAuth: JSON.parse:', parseError);
        console.error('Contenu reçu:', text);
        setUser(null);
        return;
      }
      
      if (!data || !data.user) {
        console.error('Erreur checkAuth: Données utilisateur manquantes');
        setUser(null);
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Erreur checkAuth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      // Récupérer le contenu de la réponse
      const text = await response.text();
      console.log('Login response text:', text);
      
      if (!text) {
        const errorMessage = 'Réponse vide du serveur';
        console.error('Erreur login: Réponse vide');
        setError(errorMessage);
        toast({
          title: 'Erreur de connexion',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      // Essayer de parser le JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Erreur login: JSON.parse:', parseError);
        console.error('Contenu reçu:', text);
        const errorMessage = 'Réponse invalide du serveur';
        setError(errorMessage);
        toast({
          title: 'Erreur de connexion',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      console.log('Login response:', { status: response.status, data });

      if (!response.ok || data.error) {
        const errorMessage = data?.message || 'Identifiants invalides';
        console.error('Erreur login:', { status: response.status, message: errorMessage });
        setError(errorMessage);
        toast({
          title: 'Erreur de connexion',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      if (!data?.user) {
        const errorMessage = 'Erreur lors de la connexion';
        console.error('Données utilisateur manquantes dans la réponse');
        setError(errorMessage);
        toast({
          title: 'Erreur de connexion',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      setUser(data.user);
      setError(null);
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue ${data.user.name}!`,
        variant: 'success',
      });
    } catch (err) {
      console.error('Erreur de connexion:', err);
      const errorMessage = 'Erreur lors de la connexion';
      setError(errorMessage);
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      // Récupérer le contenu de la réponse
      const text = await response.text();
      
      if (!text) {
        throw new Error('Réponse vide du serveur');
      }

      // Essayer de parser le JSON
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('Erreur register: JSON.parse:', parseError);
        console.error('Contenu reçu:', text);
        throw new Error('Réponse invalide du serveur');
      }

      if (!response.ok) {
        throw new Error(result.message || 'Erreur d\'inscription');
      }

      setUser(result.user);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.replace('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de déconnexion');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
