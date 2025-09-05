import { UseFormReturn } from 'react-hook-form';
import { DrinkFormData } from '@/types/drink';
import { Input } from '@/components/ui/Input';

interface BrandSectionProps {
  form: UseFormReturn<DrinkFormData>;
}

const COMMON_BRANDS = [
  'Coca-Cola',
  'Pepsi',
  'Fanta',
  'Sprite',
  'RedBull',
  'Evian',
  'Vittel',
  'Minute Maid',
  'Tropicana',
  'Nespresso'
];

export default function BrandSection({ form }: BrandSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const currentBrand = watch('brand');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marque
        </label>
        <Input
          {...register('brand')}
          error={errors.brand?.message}
          placeholder="ex: Coca-Cola"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marques communes
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_BRANDS.map(brand => (
            <button
              key={brand}
              type="button"
              onClick={() => setValue('brand', brand)}
              className={`px-3 py-1 rounded-full text-sm ${
                currentBrand === brand
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}