// components/admin/sides/sections/BasicSideInfo.tsx
import { UseFormReturn } from 'react-hook-form';
import { SideInput, SideCategory } from '@/types/side';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { ImageUpload } from '@/components/common/ImageUpload';

interface BasicSideInfoProps {
  form: UseFormReturn<SideInput>;
  category: SideCategory;
}

export default function BasicSideInfo({ form, category }: BasicSideInfoProps) {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nom"
          {...register('name')}
          error={errors.name?.message}
          placeholder={
            category === 'fries' ? 'Frites maison' :
            category === 'wings' ? 'Wings BBQ' :
            category === 'onion_rings' ? 'Oignons rings croustillants' :
            'Salade fraîche'
          }
        />

        <Input
          type="number"
          label="Prix de base"
          step="0.10"
          min="0"
          {...register('price')}
          error={errors.price?.message}
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Temps de préparation (minutes)"
          {...register('preparationTime')}
          error={errors.preparationTime?.message}
          min="1"
        />

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingrédients
          </label>
          <div className="space-y-2">
            {watch('ingredients')?.map((_, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  {...register(`ingredients.${index}`)}
                  placeholder="Nom de l'ingrédient"
                  error={errors.ingredients?.[index]?.message}
                />
                <button
                  type="button"
                  onClick={() => {
                    const ingredients = watch('ingredients').filter((_, i) => i !== index);
                    setValue('ingredients', ingredients);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const ingredients = watch('ingredients') || [];
                setValue('ingredients', [...ingredients, '']);
              }}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              + Ajouter un ingrédient
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image du produit
          </label>
          <ImageUpload
            value={watch('image')}
            onChange={(value: string | File) => setValue('image', value as any)}
            error={errors.image?.message}
          />
        </div>

        <div className="ml-6 space-y-4">
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