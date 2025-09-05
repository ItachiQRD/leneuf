import { UseFormReturn } from 'react-hook-form';
import { Sauce } from '@/types/sauce';
import { Input } from '@/components/ui/Input';
import { Plus, Minus, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface IngredientsSectionProps {
  form: UseFormReturn<Sauce>;
}

const COMMON_INGREDIENTS = [
  "Huile végétale",
  "Vinaigre",
  "Mayonnaise",
  "Moutarde",
  "Jaune d'œuf",
  "Épices",
  "Sel",
  "Poivre",
  "Ail",
  "Oignon"
];

const COMMON_ALLERGENS = [
  "Œufs",
  "Moutarde",
  "Soja",
  "Gluten",
  "Sésame",
  "Fruits à coque"
];

export default function IngredientsSection({ form }: IngredientsSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const ingredients = watch('ingredients') || [];
  const allergens = watch('allergens') || [];

  const addIngredient = () => {
    setValue('ingredients', [...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setValue('ingredients', ingredients.filter((_, i) => i !== index));
  };

  const addCommonIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setValue('ingredients', [...ingredients, ingredient]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ingrédients */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ingrédients</h3>
        
        {/* Liste d'ingrédients communs */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingrédients communs
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_INGREDIENTS.map(ingredient => (
              <button
                key={ingredient}
                type="button"
                onClick={() => addCommonIngredient(ingredient)}
                className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>

        {/* Liste d'ingrédients */}
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3"
            >
              <div className="cursor-move text-gray-400">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-grow">
                <Input
                  value={ingredient}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = e.target.value;
                    setValue('ingredients', newIngredients);
                  }}
                  placeholder="Nom de l'ingrédient"
                  error={errors.ingredients?.[index]?.message}
                />
              </div>

              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 text-sm text-orange-600 hover:text-orange-700"
        >
          <Plus className="w-4 h-4 inline-block mr-1" />
          Ajouter un ingrédient
        </button>
      </div>

      {/* Allergènes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergènes
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COMMON_ALLERGENS.map((allergen) => (
            <label key={allergen} className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('allergens')}
                value={allergen}
                checked={allergens.includes(allergen)}
                onChange={(e) => {
                  const newAllergens = e.target.checked
                    ? [...allergens, allergen]
                    : allergens.filter(a => a !== allergen);
                  setValue('allergens', newAllergens);
                }}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{allergen}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}