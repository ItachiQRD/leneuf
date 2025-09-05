import { UseFormReturn } from 'react-hook-form';
import { SauceInput } from '@/types/sauce';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Buttons';

interface NutritionalInfoProps {
  form: UseFormReturn<SauceInput>;
}

const STANDARD_VALUES = {
  calories: 150,
  proteins: 1,
  carbs: 5,
  fats: 15,
  servingSize: '30g'
};

export default function NutritionalInfo({ form }: NutritionalInfoProps) {
  const { register, setValue, formState: { errors } } = form;

  const setStandardValues = () => {
    Object.entries(STANDARD_VALUES).forEach(([key, value]) => {
      setValue(`nutritionalInfo.${key}`, value, { 
        shouldValidate: true,
        shouldDirty: true 
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Informations nutritionnelles</h3>
        <Button
          type="button"
          variant="outline"
          onClick={setStandardValues}
        >
          Valeurs standards
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            {...register('nutritionalInfo.calories', {
              required: 'Les calories sont requises',
              min: { value: 0, message: 'Les calories doivent être positives' }
            })}
            error={errors.nutritionalInfo?.calories?.message}
          />
        </div>

        <div>
          <Label htmlFor="proteins">Protéines (g)</Label>
          <Input
            id="proteins"
            type="number"
            step="0.1"
            {...register('nutritionalInfo.proteins', {
              required: 'Les protéines sont requises',
              min: { value: 0, message: 'Les protéines doivent être positives' }
            })}
            error={errors.nutritionalInfo?.proteins?.message}
          />
        </div>

        <div>
          <Label htmlFor="carbs">Glucides (g)</Label>
          <Input
            id="carbs"
            type="number"
            step="0.1"
            {...register('nutritionalInfo.carbs', {
              required: 'Les glucides sont requis',
              min: { value: 0, message: 'Les glucides doivent être positifs' }
            })}
            error={errors.nutritionalInfo?.carbs?.message}
          />
        </div>

        <div>
          <Label htmlFor="fats">Lipides (g)</Label>
          <Input
            id="fats"
            type="number"
            step="0.1"
            {...register('nutritionalInfo.fats', {
              required: 'Les lipides sont requis',
              min: { value: 0, message: 'Les lipides doivent être positifs' }
            })}
            error={errors.nutritionalInfo?.fats?.message}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="servingSize">Portion</Label>
        <Input
          id="servingSize"
          {...register('nutritionalInfo.servingSize', {
            required: 'La taille de la portion est requise'
          })}
          error={errors.nutritionalInfo?.servingSize?.message}
        />
      </div>
    </div>
  );
}