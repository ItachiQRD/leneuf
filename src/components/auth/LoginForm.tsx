import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (formData: LoginFormInputs) => {
    try {
      setIsLoading(true);
      setError('');
      
      const { email, password } = formData;
      console.log('Tentative de connexion pour:', email);
      await login(email, password);
      
      // La redirection est gérée dans le AuthContext
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || authLoading;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Le mot de passe est requis',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>

        <div className="text-sm text-center mt-4">
          <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-500">
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </form>
    </div>
  );
}