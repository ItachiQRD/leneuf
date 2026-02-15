import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function NouveauMotDePassePage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.isReady && !token) {
      setError('Lien invalide. Veuillez demander un nouveau lien depuis votre profil ou la page de connexion.');
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (!token || typeof token !== 'string') {
      setError('Lien invalide.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Une erreur est survenue.');
        return;
      }
      setSuccess(true);
      setTimeout(() => router.replace('/auth/login'), 2000);
    } catch {
      setError('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">
          Nouveau mot de passe
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {!token ? (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <Link href="/auth/login" className="mt-4 inline-block text-red-600 hover:underline">
                Retour à la connexion
              </Link>
            </div>
          ) : success ? (
            <div className="text-center text-green-600">
              <p className="font-medium">Mot de passe réinitialisé avec succès.</p>
              <p className="text-sm mt-2">Redirection vers la page de connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
              </button>
            </form>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/auth/login" className="text-red-600 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
