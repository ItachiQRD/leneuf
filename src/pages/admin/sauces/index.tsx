import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import SauceForm from '@/components/admin/sauces/SauceForm';
import { Sauce, SauceCategory } from '@/types/sauce';

export default function AdminSaucesPage() {
  const { sauces, loading, error, createSauce, updateSauce, deleteSauce } = useProducts();
  const [editingSauce, setEditingSauce] = useState<Sauce | null>(null);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Sauces</h1>
      
      {!isCreating && !editingSauce && (
        <Button onClick={handleCreate} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une sauce
        </Button>
      )}

      {(isCreating || editingSauce) && (
        <SauceForm
          initialData={editingSauce || undefined}
          type={'mayo' as SauceCategory}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isCreating && !editingSauce && sauces && sauces.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sauces.map((sauce) => (
            <div
              key={sauce._id?.toString() || ''}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              {typeof sauce.image === 'string' && (
                <div className="relative h-48 mb-4">
                  <img
                    src={sauce.image}
                    alt={sauce.name}
                    className="absolute w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold">{sauce.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{sauce.description}</p>
              <p className="text-lg font-bold mt-2">{sauce.price}€</p>
              <div className="mt-2">
                {sauce.allergens && sauce.allergens.length > 0 && (
                  <p className="text-sm text-amber-600">
                    Allergènes: {sauce.allergens.join(', ')}
                  </p>
                )}
                {sauce.spicyLevel && (
                  <p className="text-sm text-red-500">
                    Niveau de piquant: {'🌶️'.repeat(sauce.spicyLevel === 'hot' ? 3 : sauce.spicyLevel === 'medium' ? 2 : 1)}
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(sauce)}
                >
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
