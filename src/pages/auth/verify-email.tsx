// src/pages/auth/verify-email.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token as string);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Votre email a été vérifié avec succès !');
      } else {
        setStatus('error');
        setMessage(data.message || 'Une erreur est survenue lors de la vérification');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue lors de la vérification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Vérification de l'email
        </h2>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-sm text-gray-600">{message}</p>
              <Link
                href="/auth/login"
                className="mt-4 inline-block text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                Se connecter
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-4 text-sm text-gray-600">{message}</p>
              <Link
                href="/auth/login"
                className="mt-4 inline-block text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}