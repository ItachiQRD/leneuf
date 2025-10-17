import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Percent, 
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import PromoForm from '@/components/admin/PromoForm';
import { useToast } from '@/hooks/use-toast';

interface Promo {
  _id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image?: string;
  conditions?: {
    minOrderAmount?: number;
    applicableProducts?: string[];
    maxUses?: number;
    currentUses?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminPromosPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  // Rediriger si pas authentifié ou pas admin
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  // Charger les promotions
  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      fetchPromos();
    }
  }, [isAuthenticated, user]);

  const fetchPromos = async () => {
    try {
      const response = await fetch('/api/admin/promos');
      const data = await response.json();
      if (data.success) {
        setPromos(data.data);
      }
    } catch (error) {
      console.error('Error fetching promos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePromo = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/promos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPromos(promos.filter(promo => promo._id !== id));
        toast({
          title: 'Succès',
          description: 'Promotion supprimée avec succès',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la suppression',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting promo:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    }
  };

  const togglePromoStatus = async (promo: Promo) => {
    try {
      const response = await fetch(`/api/admin/promos/${promo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...promo,
          isActive: !promo.isActive
        }),
      });

      if (response.ok) {
        setPromos(promos.map(p => 
          p._id === promo._id ? { ...p, isActive: !p.isActive } : p
        ));
        toast({
          title: 'Succès',
          description: `Promotion ${promo.isActive ? 'désactivée' : 'activée'} avec succès`,
          variant: 'success',
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la mise à jour',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating promo:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour',
        variant: 'destructive',
      });
    }
  };

  const handleSavePromo = async (promoData: any) => {
    try {
      const url = editingPromo ? `/api/admin/promos/${editingPromo._id}` : '/api/admin/promos';
      const method = editingPromo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promoData),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingPromo) {
          setPromos(promos.map(p => p._id === editingPromo._id ? data.data : p));
        } else {
          setPromos([data.data, ...promos]);
        }
        setIsCreating(false);
        setEditingPromo(null);
        toast({
          title: 'Succès',
          description: editingPromo ? 'Promotion modifiée avec succès' : 'Promotion créée avec succès',
          variant: 'success',
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Erreur',
          description: errorData.error || 'Erreur lors de la sauvegarde',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving promo:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde',
        variant: 'destructive',
      });
    }
  };

  const getPromoStatus = (promo: Promo) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);

    if (!promo.isActive) return 'inactive';
    if (now < startDate) return 'scheduled';
    if (now > endDate) return 'expired';
    return 'active';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'scheduled':
        return 'Programmée';
      case 'expired':
        return 'Expirée';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Inconnu';
    }
  };

  const filteredPromos = promos.filter(promo => {
    const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const status = getPromoStatus(promo);
    return matchesSearch && status === filterStatus;
  });

  if (!isAuthenticated || !user?.isAdmin) {
    return <div>Chargement...</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Promotions
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gérez les promotions et offres spéciales
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Promotion
              </Button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom ou description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes</option>
                <option value="active">Actives</option>
                <option value="scheduled">Programmées</option>
                <option value="expired">Expirées</option>
                <option value="inactive">Inactives</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des promotions - Desktop */}
        {!isCreating && !editingPromo && filteredPromos.length > 0 && (
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Promotion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Remise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Utilisations
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPromos.map((promo) => {
                    const status = getPromoStatus(promo);
                    return (
                      <tr key={promo._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {promo.image && (
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={promo.image}
                                  alt={promo.name}
                                />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {promo.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {promo.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {promo.discountType === 'percentage' ? (
                              <Percent className="w-4 h-4 text-red-500 mr-1" />
                            ) : (
                              <Euro className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {promo.discountValue}
                              {promo.discountType === 'percentage' ? '%' : '€'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <div>
                              <div>Du {new Date(promo.startDate).toLocaleDateString()}</div>
                              <div>Au {new Date(promo.endDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(status)}
                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                              {getStatusText(status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {promo.conditions?.currentUses || 0} / {promo.conditions?.maxUses || '∞'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingPromo(promo)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => togglePromoStatus(promo)}
                              className={`${
                                promo.isActive 
                                  ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                              }`}
                            >
                              {promo.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              onClick={() => deletePromo(promo._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Liste des promotions - Mobile */}
        {!isCreating && !editingPromo && filteredPromos.length > 0 && (
          <div className="lg:hidden grid gap-4 grid-cols-1">
            {filteredPromos.map((promo) => {
              const status = getPromoStatus(promo);
              return (
                <div
                  key={promo._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600"
                >
                  {/* Image */}
                  {promo.image && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={promo.image}
                        alt={promo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                          {getStatusIcon(status)}
                          <span className="ml-1 text-xs font-semibold text-gray-900">
                            {getStatusText(status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Contenu */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {promo.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {promo.description}
                    </p>
                    
                    {/* Remise */}
                    <div className="mb-3">
                      <div className="flex items-center">
                        {promo.discountType === 'percentage' ? (
                          <Percent className="w-4 h-4 text-red-500 mr-1" />
                        ) : (
                          <Euro className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className="text-xl font-bold text-red-600">
                          {promo.discountValue}
                          {promo.discountType === 'percentage' ? '%' : '€'}
                        </span>
                      </div>
                    </div>

                    {/* Période */}
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        <div>
                          <div>Du {new Date(promo.startDate).toLocaleDateString()}</div>
                          <div>Au {new Date(promo.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Utilisations */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Utilisations: {promo.conditions?.currentUses || 0} / {promo.conditions?.maxUses || '∞'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPromo(promo)}
                        className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePromoStatus(promo)}
                        className={`flex-1 text-xs ${
                          promo.isActive 
                            ? 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
                            : 'bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                        }`}
                      >
                        {promo.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePromo(promo._id)}
                        className="flex-1 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Message si aucune promotion */}
        {!isCreating && !editingPromo && filteredPromos.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Aucune promotion trouvée
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Aucune promotion ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre première promotion.'
              }
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <div className="mt-6">
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer une promotion
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Formulaire de création/édition */}
        {(isCreating || editingPromo) && (
          <PromoForm
            promo={editingPromo}
            onClose={() => {
              setIsCreating(false);
              setEditingPromo(null);
            }}
            onSave={handleSavePromo}
          />
        )}
      </div>
    </div>
  );
}
