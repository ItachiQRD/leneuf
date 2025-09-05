// components/admin/drinks/sections/BasicDrinkInfo.tsx
import { UseFormReturn, FieldError } from 'react-hook-form';
import { DrinkInput } from '@/types/drink';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Switch } from '@/components/ui/Switch';

const DRINK_TYPES = [
  { value: 'soda', label: 'Soda' },
  { value: 'water', label: 'Eau' },
  { value: 'juice', label: 'Jus' },
  { value: 'coffee', label: 'Café' },
  { value: 'milkshake', label: 'Milkshake' }
];

interface BasicDrinkInfoProps {
  form: UseFormReturn<DrinkInput>;
}

export default function BasicDrinkInfo({ form }: BasicDrinkInfoProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const handleImageChange = (value: string | File) => {
    setValue('image', value);
  };

  // Helper function pour convertir l'erreur en string
  const getErrorMessage = (error: FieldError | undefined): string | undefined => {
    return error?.message;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nom"
          {...register('name', { required: 'Le nom est requis' })}
          error={getErrorMessage(errors.name)}
          placeholder="ex: Coca-Cola"
        />

        <Select
          label="Type"
          {...register('type', { required: 'Le type est requis' })}
          error={getErrorMessage(errors.type)}
          options={DRINK_TYPES}
        />

        <Input
          label="Marque"
          {...register('brand')}
          placeholder="ex: Coca-Cola Company"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-grow">
        <ImageUpload
          value={watch('image') || ''}
          onChange={handleImageChange}
          error={getErrorMessage(errors.image)}
          label="Image du produit"
        />
        </div>

        <div className="ml-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={watch('available')}
              onCheckedChange={(checked) => setValue('available', checked)}
            />
            <span className="text-sm text-gray-600">Disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}