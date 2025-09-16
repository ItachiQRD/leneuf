import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI, FOOD_TYPES, FOOD_CATEGORIES } from '@/types/food';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { ImageUpload } from '@/components/common/ImageUpload';

interface BasicFoodInfoProps {
  form: UseFormReturn<FoodInputAPI>;
  type: string;
}

export default function BasicFoodInfo({ form, type }: BasicFoodInfoProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const watchedImage = watch('image');
  const watchedType = watch('type');



  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informations de base</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du plat *
          </label>
          <Input
            {...register('name', { required: 'Le nom est requis' })}
            placeholder="Ex: Burger Le 9"
            error={errors.name?.message}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de plat *
          </label>
          <Select
            {...register('type', { 
              required: 'Le type est requis'
            })}
            error={errors.type?.message}
            options={[...FOOD_TYPES]}
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix (€) {watch('type') !== 'pizza' && '*'}
          </label>
          {watch('type') === 'pizza' ? (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-2">Prix par taille de pizza :</p>
              <ul className="space-y-1">
                <li>• Junior : 9€ (26cm)</li>
                <li>• Sénior : 13€ (32cm)</li>
                <li>• Méga : 17€ (40cm)</li>
              </ul>
              <p className="mt-2 text-xs text-gray-400">
                Le prix principal n'est pas utilisé pour les pizzas
              </p>
            </div>
          ) : (
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('price', { 
                required: watch('type') !== 'pizza' ? 'Le prix est requis' : false,
                min: { value: 0, message: 'Le prix doit être positif' }
              })}
              placeholder="0.00"
              error={errors.price?.message}
            />
          )}
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <Select
            {...register('category')}
            error={errors.category?.message}
            options={[...FOOD_CATEGORIES]}
          />
        </div>

        {/* Temps de préparation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temps de préparation (minutes)
          </label>
          <Input
            type="number"
            min="1"
            {...register('preparationTimeMinutes', {
              required: 'Le temps de préparation est requis',
              min: { value: 1, message: 'Le temps doit être d\'au moins 1 minute' }
            })}
            placeholder="15"
            error={errors.preparationTimeMinutes?.message}
          />
        </div>

        {/* Ingrédients de base */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingrédients de base <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ajouter un ingrédient et appuyer sur Entrée"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  const currentIngredients = watch('baseIngredients') || [];
                  setValue('baseIngredients', [...currentIngredients, value]);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-1">
            Ex: Pain brioche, Steak haché, Salade, Tomate, Oignon
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {watch('baseIngredients')?.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-sm flex items-center gap-2 group"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => {
                    const currentIngredients = watch('baseIngredients') || [];
                    setValue(
                      'baseIngredients',
                      currentIngredients.filter((_, i) => i !== index)
                    );
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {errors.baseIngredients?.message && (
            <p className="text-sm text-red-500">{errors.baseIngredients.message}</p>
          )}
          {(!watch('baseIngredients') || watch('baseIngredients').length === 0) && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Vous devez ajouter au moins un ingrédient de base
            </p>
          )}
        </div>


      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image *
        </label>
        <ImageUpload
          value={watchedImage}
          onChange={(file: string | File) => setValue('image', file as any)}
          error={errors.image?.message}
        />
      </div>

      {/* Note sur les extras */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Information</h4>
        <p className="text-sm text-blue-800">
          Les extras et options seront gérés lors de la commande par le client. 
          Vous pouvez définir les ingrédients de base et les informations nutritionnelles ici.
        </p>
      </div>

      {/* Statut */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statut
        </label>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <Checkbox
              {...register('active')}
            />
            <span className="text-sm text-gray-700">Actif</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              {...register('available')}
            />
            <span className="text-sm text-gray-700">Disponible</span>
          </label>
        </div>
      </div>
    </div>
  );
}