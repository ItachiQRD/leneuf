import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Desserts</h1>
      
      {!isCreating && !editingDessert && (
        <Button onClick={handleCreate} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un dessert
        </Button>
      )}

      {(isCreating || editingDessert) && (
        <DessertForm
          initialData={editingDessert || undefined}
          type="pastry"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isCreating && !editingDessert && desserts && desserts.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                {dessert.image && (
                  <div className="relative h-48 mb-4">
                    <img
                      src={dessert.image}
                      alt={dessert.name}
                      className="absolute w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold">{dessert.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{dessert.description}</p>
                <p className="text-lg font-bold mt-2">{dessert.price}€</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(dessert)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(dessertId)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
