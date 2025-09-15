import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RegisterData } from '@/types/auth';

interface RegisterFormInputs extends RegisterData {
  confirmPassword: string;
}

export default function RegisterForm() {
  const { register: registerUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const password = watch('password');

  const onSubmit = async (formData: RegisterFormInputs) => {
    try {
      setIsLoading(true);
      setError('');
      
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      console.log('Tentative d\'inscription avec:', formData.email);
      
      // On prépare les données pour l'API en retirant confirmPassword
      const { confirmPassword, ...registerData } = formData;
      await registerUser(registerData);

      // Redirection vers la page de connexion avec un message de succès
      router.push('/auth/login?message=registration-success');
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || authLoading;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inscription</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Le nom est requis',
              minLength: {
                value: 2,
                message: 'Le nom doit contenir au moins 2 caractères'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

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
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone', {
              required: 'Le numéro de téléphone est requis',
              pattern: {
                value: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
                message: 'Numéro de téléphone invalide'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="06XXXXXXXX"
            disabled={loading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            id="street"
            type="text"
            {...register('address', {
              required: 'L\'adresse est requise'
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Numéro et nom de rue"
            disabled={loading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Veuillez confirmer votre mot de passe',
              validate: value =>
                value === password || 'Les mots de passe ne correspondent pas'
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>

        <div className="text-sm text-center mt-4">
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}