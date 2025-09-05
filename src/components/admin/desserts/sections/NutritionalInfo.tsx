import { UseFormReturn } from 'react-hook-form';
import { Dessert } from '@/types/dessert';
import { Input } from '@/components/ui/Input';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface NutritionalInfoProps {
  form: UseFormReturn<Dessert>;
}

interface NutritionField {
  key: keyof Dessert['nutritionalInfo'];
  label: string;
  unit: string;
  min: number;
  info?: string;
}

const NUTRITION_FIELDS: NutritionField[] = [
  {
    key: 'calories',
    label: 'Calories',
    unit: 'kcal',
    min: 0,
    info: 'Valeur énergétique par portion'
  },
  {
    key: 'proteins',
    label: 'Protéines',
    unit: 'g',
    min: 0,
    info: 'Teneur en protéines par portion'
  },
  {
    key: 'carbs',
    label: 'Glucides',
    unit: 'g',
    min: 0,
    info: 'Teneur en glucides totaux'
  },
  {
    key: 'fats',
    label: 'Lipides',
    unit: 'g',
    min: 0,
    info: 'Teneur en matières grasses'
  }
];

// Valeurs nutritionnelles par défaut selon le type
const DEFAULT_NUTRITIONAL_VALUES: Record<Dessert['type'], Record<string, number>> = {
  'cake': {
    calories: 350,
    proteins: 5,
    carbs: 45,
    fats: 18
  },
  'ice_cream': {
    calories: 250,
    proteins: 3,
    carbs: 25,
    fats: 15
  },
  'cookie': {
    calories: 180,
    proteins: 2,
    carbs: 24,
    fats: 9
  },
  'brownie': {
    calories: 400,
    proteins: 4,
    carbs: 48,
    fats: 22
  },
  'muffin': {
    calories: 280,
    proteins: 4,
    carbs: 36,
    fats: 12
  }
};

export default function NutritionalInfo({ form }: NutritionalInfoProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const nutritionalInfo = watch('nutritionalInfo');
  const type = watch('type');
  const isVegan = watch('isVegan');

  const updateAllNutritionalValues = () => {
    let defaultValues = DEFAULT_NUTRITIONAL_VALUES[type];

    // Ajuster légèrement les valeurs pour les versions véganes
    if (isVegan) {
      defaultValues = {
        ...defaultValues,
        proteins: defaultValues.proteins * 0.8,
        fats: defaultValues.fats * 0.9
      };
    }

    setValue('nutritionalInfo', {
      ...nutritionalInfo,
      ...defaultValues,
      servingSize: nutritionalInfo.servingSize || '100g'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Informations nutritionnelles
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Valeurs pour une portion standard
        </p>
      </div>

      <div>
        <Input
          label="Taille de la portion"
          {...register('nutritionalInfo.servingSize')}
          error={errors.nutritionalInfo?.servingSize?.message}
          placeholder="ex: 100g"
          className="max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {NUTRITION_FIELDS.map((field) => (
          <div
            key={field.key}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {field.info && (
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute right-0 mt-1 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 w-48 z-10">
                      {field.info}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Input
                  type="number"
                  min={field.min}
                  step="0.1"
                  value={nutritionalInfo[field.key]}
                  onChange={(e) => {
                    setValue('nutritionalInfo', {
                      ...nutritionalInfo,
                      [field.key]: Number(e.target.value)
                    });
                  }}
                  error={errors.nutritionalInfo?.[field.key]?.message}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{field.unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton pour remplir avec les valeurs par défaut */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={updateAllNutritionalValues}
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          Utiliser les valeurs standards
        </button>
      </div>

      {/* Résumé nutritionnel */}
      {nutritionalInfo && Object.values(nutritionalInfo).some(value => 
        typeof value === 'number' && value > 0
      ) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Résumé nutritionnel
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {NUTRITION_FIELDS.map((field) => (
              <div
                key={field.key}
                className="bg-white p-3 rounded-lg text-center"
              >
                <div className="text-xl font-semibold text-gray-900">
                  {nutritionalInfo[field.key]}{field.unit}
                </div>
                <div className="text-sm text-gray-500">{field.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Pour {nutritionalInfo.servingSize || '100g'}
          </p>
        </motion.div>
      )}
    </div>
  );
}