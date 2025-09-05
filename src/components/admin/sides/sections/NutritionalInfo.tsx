// components/admin/sides/sections/NutritionalInfo.tsx
import { UseFormReturn } from 'react-hook-form';
import { Side } from '@/types/side';
import { Input } from '@/components/ui/Input';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface NutritionalInfoProps {
  form: UseFormReturn<Side>;
}

interface NutritionField {
  key: keyof Side['nutritionalInfo'];
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
    info: 'Teneur en glucides totaux par portion'
  },
  {
    key: 'fats',
    label: 'Lipides',
    unit: 'g',
    min: 0,
    info: 'Teneur en matières grasses par portion'
  }
];

export default function NutritionalInfo({ form }: NutritionalInfoProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const nutritionalInfo = watch('nutritionalInfo');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Informations nutritionnelles
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Pour une portion standard
        </p>

        <Input
          label="Taille de la portion"
          {...register('nutritionalInfo.servingSize')}
          error={errors.nutritionalInfo?.servingSize?.message}
          placeholder="ex: 100g"
          className="mb-6"
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
                    <div className="absolute right-0 mt-1 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 w-48">
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
          onClick={() => {
            const category = form.watch('category');
            const defaultValues = getDefaultNutritionalValues(category);
            // Mettre à jour tout l'objet nutritionalInfo d'un coup
            form.setValue('nutritionalInfo', {
              ...form.watch('nutritionalInfo'),
              calories: defaultValues.calories,
              proteins: defaultValues.proteins,
              carbs: defaultValues.carbs,
              fats: defaultValues.fats
            });
          }}
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          Utiliser les valeurs nutritionnelles standards
        </button>
      </div>

      {/* Résumé nutritionnel */}
      {nutritionalInfo && Object.values(nutritionalInfo).some(value => value > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            Pour une portion de {nutritionalInfo.servingSize}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Valeurs nutritionnelles par défaut selon la catégorie
const DEFAULT_NUTRITIONAL_VALUES: Record<string, Record<string, number>> = {
  fries: {
    calories: 312,
    proteins: 3.4,
    carbs: 41,
    fats: 15
  },
  wings: {
    calories: 290,
    proteins: 27,
    carbs: 0,
    fats: 19
  },
  onion_rings: {
    calories: 411,
    proteins: 4,
    carbs: 49,
    fats: 23
  },
  salad: {
    calories: 125,
    proteins: 3,
    carbs: 7,
    fats: 10
  },
  coleslaw: {
    calories: 152,
    proteins: 1,
    carbs: 14,
    fats: 11
  }
};

function getDefaultNutritionalValues(category?: string): Record<string, number> {
  if (!category || !DEFAULT_NUTRITIONAL_VALUES[category]) {
    return {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0
    };
  }
  return DEFAULT_NUTRITIONAL_VALUES[category];
}