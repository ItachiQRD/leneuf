import { UseFormReturn } from 'react-hook-form';
import { Dessert } from '@/types/dessert';
import { Input } from '@/components/ui/Input';
import { Plus, Minus, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface IngredientsSectionProps {
  form: UseFormReturn<Dessert>;
}

// Ingrédients communs selon le type
const COMMON_INGREDIENTS: Record<Dessert['type'], string[]> = {
  'cake': [
    'Farine', 'Sucre', 'Œufs', 'Lait', 'Beurre', 'Levure chimique', 'Sel', 'Vanille'
  ],
  'ice_cream': [
    'Crème', 'Lait', 'Sucre', 'Jaunes d\'œuf', 'Vanille'
  ],
  'cookie': [
    'Farine', 'Sucre', 'Beurre', 'Œufs', 'Pépites de chocolat', 'Levure chimique', 'Sel'
  ],
  'brownie': [
    'Chocolat noir', 'Beurre', 'Œufs', 'Sucre', 'Farine', 'Sel'
  ],
  'muffin': [
    'Farine', 'Sucre', 'Œufs', 'Lait', 'Beurre', 'Levure chimique', 'Sel'
  ]
};

const COMMON_ALLERGENS = [
  { id: 'gluten', label: 'Gluten', info: 'Présent dans la farine de blé' },
  { id: 'eggs', label: 'Œufs', info: 'Utilisé comme liant' },
  { id: 'milk', label: 'Lait', info: 'Produits laitiers' },
  { id: 'nuts', label: 'Fruits à coque', info: 'Noix, amandes, etc.' },
  { id: 'soy', label: 'Soja', info: 'Peut être présent dans certains ingrédients' },
  { id: 'peanuts', label: 'Arachides', info: 'Attention aux contaminations croisées' }
];

export default function IngredientsSection({ form }: IngredientsSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const ingredients = watch('ingredients') || [];
  const allergens = watch('allergens') || [];
  const type = watch('type');

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
      {/* Ingrédients communs */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Ingrédients communs</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {COMMON_INGREDIENTS[type]?.map(ingredient => (
            <button
              key={ingredient}
              type="button"
              onClick={() => addCommonIngredient(ingredient)}
              className={`px-3 py-1 rounded-full text-sm ${
                ingredients.includes(ingredient)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des ingrédients */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Liste des ingrédients
          </h3>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </button>
        </div>

        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Allergènes */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Allergènes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COMMON_ALLERGENS.map((allergen) => (
            <div key={allergen.id} className="relative group">
              <label className="flex items-center space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('allergens')}
                  value={allergen.id}
                  checked={allergens.includes(allergen.id)}
                  onChange={(e) => {
                    const newAllergens = e.target.checked
                      ? [...allergens, allergen.id]
                      : allergens.filter(a => a !== allergen.id);
                    setValue('allergens', newAllergens);
                  }}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{allergen.label}</span>
              </label>
              {/* Info-bulle */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 w-48">
                  {allergen.info}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}