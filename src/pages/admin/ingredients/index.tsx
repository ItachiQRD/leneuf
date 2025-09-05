import React, { useState } from 'react';
import Head from 'next/head';
import { useProducts } from '@/contexts/ProductContext';
import { Ingredient } from '@/types/ingredient';
import { Button } from '@/components/ui/Buttons';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import IngredientModal from '@/components/admin/ingredients/IngredientModal';

export default function IngredientsPage() {
  const { ingredients, loading, error, deleteIngredient } = useProducts();
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Une erreur est survenue: {error}</div>
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

  const handleDelete = async (ingredient: Ingredient) => {
    try {
      await deleteIngredient(ingredient._id);
      toast({
        title: "Succès",
        description: "L'ingrédient a été supprimé avec succès",
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Administration - Gestion des ingrédients | Le Neuf</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Ingrédients
          </h1>
          
          {!isCreating && !editingIngredient && (
            <Button onClick={handleCreate} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Ajouter un ingrédient
            </Button>
          )}
        </div>

        {(isCreating || editingIngredient) && (
          <IngredientModal
            isOpen={true}
            onClose={handleClose}
            ingredient={editingIngredient}
          />
        )}

        {!isCreating && !editingIngredient && ingredients && ingredients.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {ingredient.image && (
                  <div className="relative h-56">
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="absolute w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {ingredient.name}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {ingredient.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {ingredient.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Prix</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {ingredient.price.toFixed(2)}€
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {ingredient.isAvailable && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Disponible
                        </span>
                      )}
                      {ingredient.isSpicy && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          🌶️ Épicé
                        </span>
                      )}
                      {ingredient.isVegetarian && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🥬 Végétarien
                        </span>
                      )}
                    </div>
                    
                    {ingredient.allergens && ingredient.allergens.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {ingredient.allergens.map((allergen, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(ingredient)}
                      className="flex items-center"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(ingredient)}
                      className="flex items-center"
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
      </div>
    </div>
  );
}
