import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI as FoodInput } from '@/types/food';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';

interface IngredientsInfoProps {
  form: UseFormReturn<FoodInput>;
  ingredients: Array<{
    _id: string;
    name: string;
    type: string;
    nutritionalInfo?: {
      calories: number;
      proteins: number;
      carbs: number;
      fats: number;
    };
  }>;
  selectedIngredients: string[];
  onIngredientChange: (id: string, isChecked: boolean) => void;
}

export default function IngredientsInfo({
  form,
  ingredients,
  selectedIngredients,
  onIngredientChange
}: IngredientsInfoProps) {
  // Grouper les ingrédients par type
  const ingredientsByType = ingredients.reduce((acc, ingredient) => {
    const type = ingredient.type || 'Autre';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(ingredient);
    return acc;
  }, {} as Record<string, typeof ingredients>);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Ingrédients</h3>

      {Object.entries(ingredientsByType).map(([type, typeIngredients]) => (
        <div key={type} className="space-y-2">
          <h4 className="font-medium text-gray-700">{type}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {typeIngredients.map((ingredient) => (
              <div key={ingredient._id} className="flex items-center gap-2">
                <Checkbox
                  id={`ingredient-${ingredient._id}`}
                  checked={selectedIngredients.includes(ingredient._id)}
                  onChange={(e) => onIngredientChange(ingredient._id, e.target.checked)}
                />
                <Label htmlFor={`ingredient-${ingredient._id}`} className="cursor-pointer">
                  {ingredient.name}
                  {ingredient.nutritionalInfo && (
                    <span className="text-xs text-gray-500 block">
                      {ingredient.nutritionalInfo.calories} kcal
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {ingredients.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          Aucun ingrédient disponible
        </div>
      )}
    </div>
  );
}
