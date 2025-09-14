import { UseFormReturn } from 'react-hook-form';
import { SauceInput, SAUCE_CATEGORIES } from '@/types/sauce';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUpload } from '@/components/common/ImageUpload';

interface BasicSauceInfoProps {
  form: UseFormReturn<SauceInput>;
}

export default function BasicSauceInfo({ form }: BasicSauceInfoProps) {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          {...register('name', { required: 'Le nom est requis' })}
          error={errors.name?.message}
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register('type', { required: 'Le type est requis' })}
        >
          {SAUCE_CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.type?.message && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { 
            required: 'La description est requise',
            minLength: {
              value: 10,
              message: 'La description doit contenir au moins 10 caractères'
            }
          })}
          error={errors.description?.message}
        />
      </div>

      <div>
        <Label htmlFor="price">Prix</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price', {
            required: 'Le prix est requis',
            min: { value: 0, message: 'Le prix doit être positif' }
          })}
          error={errors.price?.message}
        />
      </div>

      <div>
        <Label>Image</Label>
        <ImageUpload
          value={watch('image')}
          onChange={(value: string | File) => setValue('image', value as any)}
          error={errors.image?.message}
        />
      </div>

      <div>
        <Label htmlFor="maxQuantity">Quantité maximale par commande</Label>
        <Input
          id="maxQuantity"
          type="number"
          {...register('maxQuantity', {
            required: 'La quantité maximale est requise',
            min: { value: 1, message: 'La quantité doit être d\'au moins 1' }
          })}
          error={errors.maxQuantity?.message}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          {...register('available')}
        />
        <Label htmlFor="available">Disponible</Label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isVegan"
            {...register('isVegan')}
          />
          <Label htmlFor="isVegan">Végan</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isVegetarian"
            {...register('isVegetarian')}
          />
          <Label htmlFor="isVegetarian">Végétarien</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isGlutenFree"
            {...register('isGlutenFree')}
          />
          <Label htmlFor="isGlutenFree">Sans gluten</Label>
        </div>
      </div>
    </div>
  );
}