import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import SideForm from '@/components/admin/sides/SideForm';
import { Side, SideCategory } from '@/types/side';

export default function AdminSidesPage() {
  const { sides, loading, error, createSide, updateSide, deleteSide } = useProducts();
  const [editingSide, setEditingSide] = useState<Side | null>(null);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Accompagnements</h1>
      
      {!isCreating && !editingSide && (
        <Button onClick={handleCreate} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un accompagnement
        </Button>
      )}

      {(isCreating || editingSide) && (
        <SideForm
          initialData={editingSide || undefined}
          category={'fries' as SideCategory}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isCreating && !editingSide && sides && sides.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sides.map((side) => (
            <div
              key={side._id?.toString() || ''}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              {typeof side.image === 'string' && (
                <div className="relative h-48 mb-4">
                  <img
                    src={side.image}
                    alt={side.name}
                    className="absolute w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold">{side.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{side.description}</p>
              <div className="mt-2">
                {side.sizes && side.sizes.length > 0 ? (
                  side.sizes.map((size, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{size.name}</span>
                      <span className="font-bold">{size.price}€</span>
                    </div>
                  ))
                ) : (
                  <p className="text-lg font-bold">{side.price}€</p>
                )}
              </div>
              {side.allergens && side.allergens.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  Allergènes: {side.allergens.join(', ')}
                </p>
              )}
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(side)}
                >
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
