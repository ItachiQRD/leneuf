// components/admin/sides/sections/BasicSideInfo.tsx
import { UseFormReturn } from 'react-hook-form';
import { Side, SideCategory } from '@/types/side';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { ImageUpload } from '@/components/common/ImageUpload';

interface BasicSideInfoProps {
  form: UseFormReturn<Side>;
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

      <Textarea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Décrivez l'accompagnement..."
      />

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
            onChange={(value) => setValue('image', value)}
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

          <div className="flex items-center gap-2">
            <Switch
              checked={watch('vegetarian')}
              onCheckedChange={(checked) => setValue('vegetarian', checked)}
            />
            <span className="text-sm text-gray-600">Végétarien</span>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={watch('vegan')}
              onCheckedChange={(checked) => setValue('vegan', checked)}
            />
            <span className="text-sm text-gray-600">Vegan</span>
          </div>
        </div>
      </div>

      {/* Allergènes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allergènes
        </label>
        <div className="flex flex-wrap gap-2">
          {['Gluten', 'Lactose', 'Œufs', 'Soja', 'Fruits à coque', 'Sésame'].map((allergen) => (
            <label key={allergen} className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('allergens')}
                value={allergen}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600">{allergen}</span>
            </label>
          ))}
        </div>
        {errors.allergens?.message && (
          <p className="mt-1 text-sm text-red-600">
            {errors.allergens.message}
          </p>
        )}
      </div>
    </div>
  );
}