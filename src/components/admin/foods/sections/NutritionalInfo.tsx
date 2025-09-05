import { UseFormReturn } from 'react-hook-form';
import { FoodInput } from '@/types/food';
import { Input } from '@/components/ui/Input';

interface NutritionalInfoProps {
  form: UseFormReturn<FoodInput>;
}

export default function NutritionalInfo({ form }: NutritionalInfoProps) {
  const { register, formState: { errors }, watch } = form;
  const nutritionalInfo = watch('nutritionalInfo');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Informations nutritionnelles
        </h3>
        <p className="text-sm text-gray-500">
          Calculées automatiquement à partir des ingrédients sélectionnés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Calories"
          value={nutritionalInfo.calories}
          readOnly
          disabled
        />

        <Input
          type="number"
          label="Protéines (g)"
          value={nutritionalInfo.proteins}
          readOnly
          disabled
        />

        <Input
          type="number"
          label="Glucides (g)"
          value={nutritionalInfo.carbs}
          readOnly
          disabled
        />

        <Input
          type="number"
          label="Lipides (g)"
          value={nutritionalInfo.fats}
          readOnly
          disabled
        />
      </div>
    </div>
  );
}