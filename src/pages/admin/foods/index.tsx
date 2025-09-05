import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import FoodForm from '@/components/admin/foods/FoodForm';
import { Food, FoodInputAPI as FoodInput } from '@/types/food';
import { useToast } from '@/contexts/ToastContext';

export default function AdminFoodsPage() {
  const { foods, loading, error, deleteFood, updateFood, createFood, mutate } = useProducts();
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setEditingFood(null);
  };

  const handleEdit = (food: Food) => {
    const { createdAt, updatedAt, _id, ...foodInput } = food;
    setSelectedFood(foodInput as FoodInput);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditingFood(null);
    setIsCreating(false);
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  const handleDelete = async (food: Food) => {
    try {
      await deleteFood(food._id);
      toast({
        title: 'Succès',
        description: 'Produit supprimé avec succès',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (data: FoodInput) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      
      // Gérer l'image
      if (data.image) {
        if (typeof data.image !== 'string' && data.image instanceof File) {
          formData.append('file', data.image);
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Erreur lors de l\'upload de l\'image');
          }
          
          const { url } = await uploadResponse.json();
          formData.delete('file');
          formData.append('image', url);
        } else {
          formData.append('image', data.image);
        }
      }

      // Ajouter les autres champs
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'image' && value !== undefined) {
          formData.append(key, JSON.stringify(value));
        }
      });

      if (selectedFood?._id) {
        await updateFood(selectedFood._id, formData);
        toast({
          description: "Le plat a été modifié avec succès",
          variant: "success"
        });
      } else {
        await createFood(formData);
        toast({
          description: "Le plat a été créé avec succès",
          variant: "success"
        });
      }

      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error('Error:', error);
      toast({
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {(isCreating || editingFood) ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FoodForm
            initialData={editingFood || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div key={food._id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{food.name}</h2>
                  <p className="text-gray-600">{food.description}</p>
                </div>
                {food.image && (
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <p><span className="font-medium">Prix:</span> {food.price}€</p>
                <p><span className="font-medium">Catégorie:</span> {food.category}</p>
                <p><span className="font-medium">Type:</span> {food.type}</p>
                <p><span className="font-medium">Temps de préparation:</span> {food.preparationTimeMinutes} min</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {food.isVegan && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Vegan</span>
                )}
                {food.isVegetarian && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Végétarien</span>
                )}
                {food.isGlutenFree && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Sans gluten</span>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => handleEdit(food)}>
                  Modifier
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(food)}>
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
