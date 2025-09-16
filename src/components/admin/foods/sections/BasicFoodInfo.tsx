import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI, FOOD_TYPES, FOOD_CATEGORIES, SPICY_LEVELS, COMMON_ALLERGENS } from '@/types/food';
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

  // Valeurs nutritionnelles par défaut selon le type de plat
  const getDefaultNutritionalInfo = (foodType: string) => {
    const defaults = {
      burger: { calories: 650, proteins: 35, carbs: 45, fats: 35, servingSize: '1 burger' },
      pizza: { calories: 280, proteins: 12, carbs: 35, fats: 10, servingSize: '100g' },
      salad: { calories: 120, proteins: 8, carbs: 15, fats: 4, servingSize: '1 portion' },
      sandwich_durum: { calories: 450, proteins: 25, carbs: 40, fats: 20, servingSize: '1 sandwich' },
      tacos: { calories: 380, proteins: 20, carbs: 35, fats: 18, servingSize: '1 taco' },
      bowls: { calories: 320, proteins: 18, carbs: 30, fats: 12, servingSize: '1 bowl' },
      paninis: { calories: 420, proteins: 22, carbs: 38, fats: 16, servingSize: '1 panini' },
      plates: { calories: 480, proteins: 28, carbs: 25, fats: 22, servingSize: '1 assiette' },
      kids_menu: { calories: 280, proteins: 15, carbs: 30, fats: 12, servingSize: '1 portion' },
      small_hunger: { calories: 180, proteins: 10, carbs: 20, fats: 8, servingSize: '1 portion' }
    };
    return defaults[foodType as keyof typeof defaults] || { calories: 0, proteins: 0, carbs: 0, fats: 0, servingSize: '100g' };
  };

  // Tailles de pizza par défaut
  const getDefaultPizzaSizes = () => [
    { name: 'Junior', price: 9, diameter: '26cm', isDefault: true },
    { name: 'Sénior', price: 13, diameter: '32cm', isDefault: false },
    { name: 'Méga', price: 17, diameter: '40cm', isDefault: false }
  ];

  // Mettre à jour les valeurs nutritionnelles et tailles de pizza quand le type change
  const handleTypeChange = (newType: string) => {
    const defaultNutrition = getDefaultNutritionalInfo(newType);
    setValue('nutritionalInfo', defaultNutrition);
    
    // Si c'est une pizza, initialiser les tailles par défaut
    if (newType === 'pizza') {
      setValue('pizzaSizes', getDefaultPizzaSizes());
    }
  };

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
              required: 'Le type est requis',
              onChange: (e) => handleTypeChange(e.target.value)
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
            Ingrédients de base
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