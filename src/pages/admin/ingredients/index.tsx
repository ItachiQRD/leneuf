import React, { useState } from 'react';
import Head from 'next/head';
import { useProducts } from '@/contexts/ProductContext';
import { Ingredient } from '@/types/ingredient';
import { Button } from '@/components/ui/Buttons';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star, Leaf } from 'lucide-react';
import IngredientModal from '@/components/admin/ingredients/IngredientModal';

export default function IngredientsPage() {
  const { ingredients, loading, error, createIngredient, updateIngredient, deleteIngredient } = useProducts();
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des ingrédients...</p>
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
    setEditingIngredient(null);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsCreating(false);
  };

  const handleClose = () => {
    setEditingIngredient(null);
    setIsCreating(false);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingIngredient) {
        // Modification
        await updateIngredient(editingIngredient._id, data);
      } else {
        // Création
        await createIngredient(data);
      }
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // L'erreur est déjà gérée par le ProductContext
    }
  };

  const handleDelete = async (ingredient: Ingredient) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
      try {
        await deleteIngredient(ingredient._id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        // L'erreur est déjà gérée par le ProductContext
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Head>
        <title>Administration - Gestion des ingrédients | Le Neuf</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Leaf className="mr-3 h-10 w-10" />
                Gestion des Ingrédients
              </h1>
              <p className="text-green-100">Les bases de votre cuisine</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-green-100">
                <Star className="h-5 w-5" />
                <span className="text-lg font-semibold">{ingredients.length} ingrédients</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contrôles */}
        {!isCreating && !editingIngredient && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <Button 
              onClick={handleCreate} 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter un ingrédient
            </Button>
          </div>
        )}

        {/* Modal */}
        {(isCreating || editingIngredient) && (
          <IngredientModal
            isOpen={true}
            onClose={handleClose}
            ingredient={editingIngredient}
          />
        )}

        {/* Grille des ingrédients */}
        {!isCreating && !editingIngredient && ingredients && ingredients.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
              >
                {/* Image avec overlay */}
                {ingredient.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-400 text-green-900">
                        {ingredient.type}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Contenu de la card */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {ingredient.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {ingredient.description}
                  </p>
                  
                  {/* Prix */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      {ingredient.price.toFixed(2)}€
                    </span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ingredient.isAvailable && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        ✅ Disponible
                      </span>
                    )}
                    {ingredient.isSpicy && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        🌶️ Épicé
                      </span>
                    )}
                    {ingredient.isVegetarian && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        🥬 Végétarien
                      </span>
                    )}
                  </div>
                  
                  {/* Allergènes */}
                  {ingredient.allergens && ingredient.allergens.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allergènes:</p>
                      <div className="flex flex-wrap gap-1">
                        {ingredient.allergens.map((allergen, index) => (
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
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ingredient)}
                      className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(ingredient)}
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
        {!isCreating && !editingIngredient && (!ingredients || ingredients.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🥬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun ingrédient trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Commencez par ajouter votre premier ingrédient
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un ingrédient
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
