import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus, Edit, Trash2, Clock, Star, Cake } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import DessertForm from '@/components/admin/desserts/DessertForm';
import { Dessert } from '@/types/dessert';
import { useToast } from '@/hooks/use-toast';

export default function AdminDessertsPage() {
  const { desserts, loading, error, createDessert, updateDessert, deleteDessert } = useProducts();
  const [editingDessert, setEditingDessert] = useState<Dessert | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des desserts...</p>
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
    setEditingDessert(null);
  };

  const handleEdit = (dessert: Dessert) => {
    setEditingDessert(dessert);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingDessert(null);
    setIsCreating(false);
  };

  const handleSubmit = () => {
    setEditingDessert(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('❌ [AdminDesserts] Tentative de suppression avec un ID invalide');
      toast({
        title: 'Erreur',
        description: 'ID du dessert invalide',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dessert ?')) {
      try {
        console.log('🗑️ [AdminDesserts] Suppression du dessert:', id);
        await deleteDessert(id);
        toast({
          title: 'Succès',
          description: 'Dessert supprimé avec succès',
        });
      } catch (error) {
        console.error('❌ [AdminDesserts] Erreur lors de la suppression:', error);
        toast({
          title: 'Erreur',
          description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Cake className="mr-3 h-10 w-10" />
                Gestion des Desserts
              </h1>
              <p className="text-pink-100">Terminez en beauté</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-pink-100">
                <Star className="h-5 w-5" />
                <span className="text-lg font-semibold">{desserts.length} desserts</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contrôles */}
        {!isCreating && !editingDessert && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <Button 
              onClick={handleCreate} 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter un dessert
            </Button>
          </div>
        )}

        {/* Formulaire */}
        {(isCreating || editingDessert) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <DessertForm
              initialData={editingDessert || undefined}
              type="pastry"
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Grille des desserts */}
        {!isCreating && !editingDessert && desserts && desserts.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {desserts.map((dessert) => {
              // Utiliser soit _id soit id
              const dessertId = dessert._id || dessert.id;
              if (!dessertId) {
                console.error('❌ [AdminDesserts] Dessert sans ID:', dessert);
                return null;
              }

              return (
                <div
                  key={dessertId}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600"
                >
                  {/* Image avec overlay */}
                  {dessert.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dessert.image}
                        alt={dessert.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  {/* Contenu de la card */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {dessert.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{dessert.description}</p>
                    
                    {/* Prix */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-pink-600">{dessert.price}€</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(dessert)}
                        className="flex-1 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900 dark:hover:bg-pink-800 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(dessertId)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
              </div>
            );
          })}
        </div>
        )}

        {/* État vide */}
        {!isCreating && !editingDessert && (!desserts || desserts.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🍰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun dessert trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Commencez par ajouter votre premier dessert
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un dessert
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
