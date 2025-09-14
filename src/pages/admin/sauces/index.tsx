import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus, Edit, Trash2, Star, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import SauceForm from '@/components/admin/sauces/SauceForm';
import { Sauce, SauceCategory } from '@/types/sauce';

export default function AdminSaucesPage() {
  const { sauces, loading, error, createSauce, updateSauce, deleteSauce } = useProducts();
  const [editingSauce, setEditingSauce] = useState<Sauce | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des sauces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Erreur</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    setIsCreating(true);
    setEditingSauce(null);
  };

  const handleEdit = (sauce: Sauce) => {
    setEditingSauce(sauce);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingSauce(null);
    setIsCreating(false);
  };

  const handleSubmit = async () => {
    // Le formulaire gère lui-même la soumission
    setEditingSauce(null);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Droplets className="mr-3 h-10 w-10" />
                Gestion des Sauces
              </h1>
              <p className="text-purple-100">Relevez vos plats</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-purple-100">
                <Star className="h-5 w-5" />
                <span className="text-lg font-semibold">{sauces.length} sauces</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contrôles */}
        {!isCreating && !editingSauce && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <Button 
              onClick={handleCreate} 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter une sauce
            </Button>
          </div>
        )}

        {/* Formulaire */}
        {(isCreating || editingSauce) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <SauceForm
              initialData={editingSauce || undefined}
              type={'mayo' as SauceCategory}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Grille des sauces */}
        {!isCreating && !editingSauce && sauces && sauces.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sauces.map((sauce) => (
              <div
                key={sauce._id?.toString() || ''}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
              >
                {/* Image avec overlay */}
                {typeof sauce.image === 'string' && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={sauce.image}
                      alt={sauce.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                
                {/* Contenu de la card */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {sauce.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{sauce.description}</p>
                  
                  {/* Prix */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-purple-600">{sauce.price}€</span>
                  </div>
                  
                  {/* Allergènes */}
                  {sauce.allergens && sauce.allergens.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allergènes:</p>
                      <div className="flex flex-wrap gap-1">
                        {sauce.allergens.map((allergen, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Niveau de piquant */}
                  {sauce.spicyLevel && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Niveau de piquant:</p>
                      <span className="text-red-500 text-lg">
                        {'🌶️'.repeat(sauce.spicyLevel === 'hot' ? 3 : sauce.spicyLevel === 'medium' ? 2 : 1)}
                      </span>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(sauce)}
                      className="flex-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sauce ?')) {
                          sauce._id && deleteSauce(sauce._id.toString());
                        }
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* État vide */}
        {!isCreating && !editingSauce && (!sauces || sauces.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🌶️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucune sauce trouvée
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Commencez par ajouter votre première sauce
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter une sauce
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
