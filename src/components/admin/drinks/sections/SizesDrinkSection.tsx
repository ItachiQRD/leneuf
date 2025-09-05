import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { DrinkInput, DrinkType, DrinkSize } from '@/types/drink';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Buttons';
import { Switch } from '@/components/ui/Switch';
import { Plus, Minus } from 'lucide-react';

interface SizesDrinkSectionProps {
  form: UseFormReturn<DrinkInput>;
}

type DefaultSizesType = {
  [K in Extract<DrinkType, 'soda' | 'coffee' | 'milkshake'>]: Array<{
    name: string;
    volume: number;
    price: number;
  }>;
};

const DEFAULT_SIZES: DefaultSizesType = {
  'soda': [
    { name: 'Petit', volume: 330, price: 2.5 },
    { name: 'Moyen', volume: 500, price: 3.5 },
    { name: 'Grand', volume: 750, price: 4.5 }
  ],
  'coffee': [
    { name: 'Expresso', volume: 300, price: 2.0 },
    { name: 'Normal', volume: 200, price: 3.0 },
    { name: 'Grand', volume: 300, price: 4.0 }
  ],
  'milkshake': [
    { name: 'Classic', volume: 400, price: 4.5 },
    { name: 'Large', volume: 600, price: 6.0 }
  ]
} as const;

export default function SizesDrinkSection({ form }: SizesDrinkSectionProps) {
  const { control, register, watch, formState: { errors } } = form;
  const drinkType = watch('type');

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'sizes'
  });

  const handleAddSize = () => {
    const newSize: DrinkSize = {
      name: '',
      price: 0,
      volume: 0,
      isDefault: fields.length === 0
    };
    append(newSize);
  };

  const handleDefaultSizes = () => {
    const defaultSizes = drinkType in DEFAULT_SIZES 
      ? DEFAULT_SIZES[drinkType as keyof DefaultSizesType]
      : [];

    // Supprimer les tailles existantes
    fields.forEach((_, index) => remove(index));
    
    // Ajouter les nouvelles tailles
    defaultSizes.forEach((size, index) => {
      append({
        ...size,
        isDefault: index === 0
      });
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tailles disponibles</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDefaultSizes}
          >
            Tailles standards
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSize}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une taille
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
            <Input
              label="Nom"
              {...register(`sizes.${index}.name`)}
              error={errors?.sizes?.[index]?.name?.message}
            />

            <Input
              label="Volume"
              type="number"
              {...register(`sizes.${index}.volume`, { 
                valueAsNumber: true,
                validate: value => !isNaN(value) || 'Le volume doit être un nombre'
              })}
              error={errors?.sizes?.[index]?.volume?.message}
            />

            <Input
              type="number"
              label="Prix"
              step="0.01"
              min={0}
              {...register(`sizes.${index}.price`, { 
                valueAsNumber: true, // Convertit automatiquement en nombre
                validate: value => !isNaN(value) || 'Le prix doit être un nombre'
              })}
              error={errors?.sizes?.[index]?.price?.message}
            />

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Switch
                  checked={field.isDefault}
                  onCheckedChange={(checked) => {
                    fields.forEach((_, i) => {
                      update(i, { ...fields[i], isDefault: i === index ? checked : false });
                    });
                  }}
                />
                <span className="ml-2">Par défaut</span>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                className="text-red-500"
                disabled={fields.length === 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {errors.sizes && (
        <p className="text-sm text-red-600 mt-2">
          {errors.sizes.message}
        </p>
      )}
    </div>
  );
}