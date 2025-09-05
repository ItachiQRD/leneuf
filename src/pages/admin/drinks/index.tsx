import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import DrinkForm from '@/components/admin/drinks/DrinkForm';
import { Drink } from '@/types/drink';

export default function AdminDrinksPage() {
  const { drinks, loading, error, createDrink, updateDrink, deleteDrink } = useProducts();
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
    setEditingDrink(null);
  };

  const handleEdit = (drink: Drink) => {
    setEditingDrink(drink);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingDrink(null);
    setIsCreating(false);
  };

  const handleSubmit = async () => {
    // Le formulaire gère lui-même la soumission
    setEditingDrink(null);
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Boissons</h1>
      
      {!isCreating && !editingDrink && (
        <Button onClick={handleCreate} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une boisson
        </Button>
      )}

      {(isCreating || editingDrink) && (
        <DrinkForm
          initialData={editingDrink || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isCreating && !editingDrink && drinks && drinks.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {drinks.map((drink) => (
            <div
              key={drink._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              {drink.image && (
                <div className="relative h-48 mb-4">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="absolute w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold">{drink.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {drink.brand && `${drink.brand} - `}{drink.type}
              </p>
              <div className="mt-2">
                {drink.sizes.map((size, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{size.name} ({size.volume}ml)</span>
                    <span className="font-bold">{size.price}€</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(drink)}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette boisson ?')) {
                      const success = await deleteDrink(drink._id);
                      if (success) {
                        // La mise à jour de l'état est gérée dans le contexte
                      }
                    }
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
