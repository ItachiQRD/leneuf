import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus, Edit, Trash2, Clock, Star, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import SideForm from '@/components/admin/sides/SideForm';
import { Side, SideCategory } from '@/types/side';

export default function AdminSidesPage() {
  const { sides, loading, error, createSide, updateSide, deleteSide } = useProducts();
  const [editingSide, setEditingSide] = useState<Side | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des accompagnements...</p>
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
    setEditingSide(null);
  };

  const handleEdit = (side: Side) => {
    setEditingSide(side);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingSide(null);
    setIsCreating(false);
  };

  const handleSubmit = async () => {
    // Le formulaire gère lui-même la soumission
    setEditingSide(null);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Utensils className="mr-3 h-10 w-10" />
                Gestion des Accompagnements
              </h1>
              <p className="text-orange-100">Complétez votre menu</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-orange-100">
                <Star className="h-5 w-5" />
                <span className="text-lg font-semibold">{sides.length} accompagnements</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contrôles */}
        {!isCreating && !editingSide && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <Button 
              onClick={handleCreate} 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter un accompagnement
            </Button>
          </div>
        )}

        {/* Formulaire */}
        {(isCreating || editingSide) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <SideForm
              initialData={editingSide || undefined}
              category={'fries' as SideCategory}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Grille des accompagnements */}
        {!isCreating && !editingSide && sides && sides.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sides.map((side) => (
              <div
                key={side._id?.toString() || ''}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
              >
                {/* Image avec overlay */}
                {typeof side.image === 'string' && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={side.image}
                      alt={side.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                
                {/* Contenu de la card */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {side.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{side.description}</p>
                  
                  {/* Prix */}
                  <div className="mb-4">
                    {side.sizes && side.sizes.length > 0 ? (
                      <div className="space-y-2">
                        {side.sizes.map((size, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{size.name}</span>
                            <span className="font-bold text-orange-600">{size.price}€</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-orange-600">{side.price}€</span>
                    )}
                  </div>


                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(side)}
                      className="flex-1 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet accompagnement ?')) {
                          side._id && deleteSide(side._id.toString());
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
        {!isCreating && !editingSide && (!sides || sides.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🍟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun accompagnement trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Commencez par ajouter votre premier accompagnement
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un accompagnement
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
