import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI } from '@/types/food';
import { Input } from '@/components/ui/Input';

interface NutritionalInfoProps {
  form: UseFormReturn<FoodInputAPI>;
}

export default function NutritionalInfo({ form }: NutritionalInfoProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Valeurs nutritionnelles</h3>
      <p className="text-sm text-gray-600">
        Renseignez les informations nutritionnelles pour 100g de produit
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calories (kcal) *
          </label>
          <Input
            type="number"
            min="0"
            {...register('nutritionalInfo.calories', { 
              required: 'Les calories sont requises',
              min: { value: 0, message: 'Les calories doivent être positives' }
            })}
            placeholder="250"
            error={errors.nutritionalInfo?.calories?.message}
          />
        </div>

        {/* Protéines */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Protéines (g) *
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            {...register('nutritionalInfo.proteins', { 
              required: 'Les protéines sont requises',
              min: { value: 0, message: 'Les protéines doivent être positives' }
            })}
            placeholder="15.5"
            error={errors.nutritionalInfo?.proteins?.message}
          />
        </div>

        {/* Glucides */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Glucides (g) *
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            {...register('nutritionalInfo.carbs', { 
              required: 'Les glucides sont requis',
              min: { value: 0, message: 'Les glucides doivent être positifs' }
            })}
            placeholder="30.2"
            error={errors.nutritionalInfo?.carbs?.message}
          />
        </div>

        {/* Lipides */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lipides (g) *
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            {...register('nutritionalInfo.fats', { 
              required: 'Les lipides sont requis',
              min: { value: 0, message: 'Les lipides doivent être positifs' }
            })}
            placeholder="12.8"
            error={errors.nutritionalInfo?.fats?.message}
          />
        </div>

        {/* Taille de portion */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille de portion
          </label>
          <Input
            {...register('nutritionalInfo.servingSize')}
            placeholder="100g"
            error={errors.nutritionalInfo?.servingSize?.message}
          />
          <p className="text-sm text-gray-500 mt-1">
            Ex: 100g, 1 portion, 1 burger, etc.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Conseil</h4>
        <p className="text-sm text-blue-800">
          Ces informations nutritionnelles sont importantes pour vos clients. 
          Vous pouvez les obtenir en consultant les étiquettes des ingrédients 
          ou en utilisant des calculateurs nutritionnels en ligne.
        </p>
      </div>
    </div>
  );
}