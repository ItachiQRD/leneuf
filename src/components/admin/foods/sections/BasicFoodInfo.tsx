import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI as FoodInput, FOOD_CATEGORIES, SPICY_LEVELS } from '@/types/food';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectOption } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { ImageUpload } from '@/components/common/ImageUpload';

interface BasicFoodInfoProps {
  form: UseFormReturn<FoodInput>;
  types: { value: string; label: string; }[];
}

export default function BasicFoodInfo({ form, types }: BasicFoodInfoProps) {
  const { register, formState: { errors }, setValue, watch } = form;

  const categoryOptions: SelectOption[] = [...FOOD_CATEGORIES];
  const spicyLevelOptions: SelectOption[] = [...SPICY_LEVELS];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register('description')}
          error={errors.description?.message}
        />
      </div>

      <div>
        <Label htmlFor="price">Prix (€)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          id="type"
          {...register('type')}
          error={errors.type?.message}
          options={types}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select
          id="category"
          {...register('category')}
          error={errors.category?.message}
          options={categoryOptions}
          required
        />
      </div>

      <div>
        <Label htmlFor="spicyLevel">Niveau de piquant</Label>
        <Select
          id="spicyLevel"
          {...register('spicyLevel')}
          error={errors.spicyLevel?.message}
          options={spicyLevelOptions}
          required
        />
      </div>

      <div>
        <Label htmlFor="preparationTimeMinutes">Temps de préparation (minutes)</Label>
        <Input
          id="preparationTimeMinutes"
          type="number"
          {...register('preparationTimeMinutes', { valueAsNumber: true })}
          error={errors.preparationTimeMinutes?.message}
        />
      </div>

      <div>
        <Label htmlFor="image">Image</Label>
        <ImageUpload
          value={watch('image')}
          onChange={(file) => setValue('image', file)}
          error={errors.image?.message}
        />
      </div>

      <div>
        <Label htmlFor="maxSauces">Nombre maximum de sauces</Label>
        <Input
          id="maxSauces"
          type="number"
          {...register('maxSauces', { valueAsNumber: true })}
          error={errors.maxSauces?.message}
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="available"
              {...register('available')}
            />
            <Label htmlFor="available">Disponible</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isVegan"
              {...register('isVegan')}
            />
            <Label htmlFor="isVegan">Vegan</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isVegetarian"
              {...register('isVegetarian')}
            />
            <Label htmlFor="isVegetarian">Végétarien</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isGlutenFree"
              {...register('isGlutenFree')}
            />
            <Label htmlFor="isGlutenFree">Sans gluten</Label>
          </div>
        </div>
      </div>
    </div>
  );
}