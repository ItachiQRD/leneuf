import React, { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Plus, Edit, Trash2, Clock, Star, Filter, ChefHat, Flame } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des plats...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <ChefHat className="mr-3 h-10 w-10" />
                Gestion des Plats
              </h1>
              <p className="text-blue-100">Gérez votre menu avec style</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-blue-100">
                <Star className="h-5 w-5" />
                <span className="text-lg font-semibold">{filteredFoods.length} plats</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contrôles */}
        {!isCreating && !editingFood && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleCreate} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un plat
              </Button>
              
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    options={typeFilterOptions}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        {(isCreating || editingFood) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <FoodForm
              initialData={editingFood || undefined}
              type={'burger' as FoodType}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Grille des plats */}
        {!isCreating && !editingFood && filteredFoods && filteredFoods.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFoods.map((food) => (
              <div
                key={food._id?.toString() || ''}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              >
                {/* Image avec overlay */}
                {typeof food.image === 'string' && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        food.category === 'bestseller' ? 'bg-yellow-400 text-yellow-900' :
                        food.category === 'new' ? 'bg-green-400 text-green-900' :
                        'bg-gray-400 text-gray-900'
                      }`}>
                        {food.category === 'bestseller' ? '⭐ Best-seller' :
                         food.category === 'new' ? '🆕 Nouveau' : 'Regular'}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Contenu de la card */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {food.name}
                  </h3>
                  
                  {/* Prix */}
                  <div className="mb-4">
                    {food.price ? (
                      <span className="text-2xl font-bold text-blue-600">{food.price}€</span>
                    ) : food.type === 'pizza' && food.pizzaSizes ? (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Prix par taille:</div>
                        {food.pizzaSizes.map((size, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">{size.name}</span>
                            <span className="font-bold text-blue-600">{size.price}€</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Prix selon taille</span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {food.preparationTimeMinutes}min
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                      {food.type}
                    </span>
                  </div>

                  {/* Ingrédients */}
                  {food.baseIngredients && food.baseIngredients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ingrédients:</p>
                      <div className="flex flex-wrap gap-1">
                        {food.baseIngredients.slice(0, 3).map((ingredient, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {food.baseIngredients.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{food.baseIngredients.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {food.isVegan && <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">🌱 Vegan</span>}
                    {food.isVegetarian && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">🥬 Végétarien</span>}
                    {food.isGlutenFree && <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full font-medium">🌾 Sans gluten</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(food)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
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
        {!isCreating && !editingFood && (!filteredFoods || filteredFoods.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {typeFilter === 'all' ? 'Aucun plat trouvé' : `Aucun plat de type "${typeFilterOptions.find(opt => opt.value === typeFilter)?.label}"`}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {typeFilter === 'all' ? 'Commencez par ajouter votre premier plat' : 'Essayez un autre filtre ou ajoutez un nouveau plat'}
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un plat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
