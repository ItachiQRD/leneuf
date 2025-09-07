import React, { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { Select } from '@/components/ui/Select';
import FoodForm from '@/components/admin/foods/FoodForm';
import { Food, FoodType, FOOD_TYPES } from '@/types/food';

export default function AdminFoodsPage() {
  const { foods, loading, error, createFood, updateFood, deleteFood } = useProducts();
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filtrer les plats par type
  const filteredFoods = useMemo(() => {
    if (typeFilter === 'all') return foods;
    return foods.filter(food => food.type === typeFilter);
  }, [foods, typeFilter]);

  // Options pour le filtre de type
  const typeFilterOptions = [
    { value: 'all', label: 'Tous les types' },
    ...FOOD_TYPES
  ];

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
    setEditingFood(food);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingFood(null);
    setIsCreating(false);
  };

  const handleSubmit = async () => {
    // Le formulaire gère lui-même la soumission
    setEditingFood(null);
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Plats</h1>
      
      {!isCreating && !editingFood && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un plat
          </Button>
          
          <div className="w-full sm:w-64">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={typeFilterOptions}
              placeholder="Filtrer par type"
            />
          </div>
        </div>
      )}

      {(isCreating || editingFood) && (
        <FoodForm
          initialData={editingFood || undefined}
          type={'burger' as FoodType}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isCreating && !editingFood && filteredFoods && filteredFoods.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFoods.map((food) => (
            <div
              key={food._id?.toString() || ''}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              {typeof food.image === 'string' && (
                <div className="relative h-48 mb-4">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="absolute w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold">{food.name}</h3>
              
              <div className="flex items-center justify-between mb-2">
                {food.price ? (
                  <span className="text-lg font-bold text-primary">{food.price}€</span>
                ) : food.type === 'pizza' && food.pizzaSizes ? (
                  <div className="text-sm">
                    <div className="font-semibold text-gray-700">Prix par taille:</div>
                    <div className="space-y-1">
                      {food.pizzaSizes.map((size, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{size.name}</span>
                          <span className="font-medium">{size.price}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Prix selon taille</span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  food.category === 'bestseller' ? 'bg-yellow-100 text-yellow-800' :
                  food.category === 'new' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {food.category === 'bestseller' ? 'Best-seller' :
                   food.category === 'new' ? 'Nouveau' : 'Regular'}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Type: {food.type}</span>
                <span className="text-sm text-gray-500">{food.preparationTimeMinutes}min</span>
              </div>

              {food.allergens && food.allergens.length > 0 && (
                <p className="text-sm text-amber-600 mb-2">
                  Allergènes: {food.allergens.join(', ')}
                </p>
              )}

              {food.baseIngredients && food.baseIngredients.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Ingrédients:</p>
                  <div className="flex flex-wrap gap-1">
                    {food.baseIngredients.map((ingredient, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-2">
                {food.isVegan && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Vegan</span>}
                {food.isVegetarian && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Végétarien</span>}
                {food.isGlutenFree && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Sans gluten</span>}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(food)}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
                      food._id && deleteFood(food._id.toString());
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

      {!isCreating && !editingFood && (!filteredFoods || filteredFoods.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {typeFilter === 'all' ? 'Aucun plat trouvé' : `Aucun plat de type "${typeFilterOptions.find(opt => opt.value === typeFilter)?.label}" trouvé`}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {typeFilter === 'all' ? 'Commencez par ajouter votre premier plat' : 'Essayez un autre filtre ou ajoutez un nouveau plat'}
          </p>
        </div>
      )}
    </div>
  );
}
