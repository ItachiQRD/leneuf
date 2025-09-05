import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <LoadingScreen />;
  
  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <p className="mt-1 text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <p className="mt-1 text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>

          {user.address && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
              <div className="space-y-2">
                <p className="text-gray-900">{user.address.street}</p>
                <p className="text-gray-900">
                  {user.address.postalCode} {user.address.city}
                </p>
                {user.address.complement && (
                  <p className="text-gray-700">{user.address.complement}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              Modifier mes informations
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}