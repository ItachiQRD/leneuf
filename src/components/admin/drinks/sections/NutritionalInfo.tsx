import { UseFormReturn } from 'react-hook-form';
import { DrinkInput } from '@/types/drink';
import { Input } from '@/components/ui/Input';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface NutritionalInfoProps {
  form: UseFormReturn<DrinkInput>;
}

interface NutritionField {
  key: keyof DrinkInput['nutritionalInfo'];
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
    info: 'Valeur énergétique pour 100ml'
  },
  {
    key: 'sugar',
    label: 'Sucres',
    unit: 'g',
    min: 0,
    info: 'Teneur en sucres pour 100ml'
  },
  {
    key: 'servingSize',
    label: 'Portion de référence',
    unit: 'ml',
    min: 1,
    info: 'Volume standard de la portion'
  }
];

const DEFAULT_VALUES = {
  soda: { calories: 42, sugar: 10.6, servingSize: 330 },
  water: { calories: 0, sugar: 0, servingSize: 330 },
  juice: { calories: 45, sugar: 10.5, servingSize: 330 },
  coffee: { calories: 1, sugar: 0, servingSize: 330 },
  milkshake: { calories: 112, sugar: 17, servingSize: 330 }
};

export default function NutritionalInfo({ form }: NutritionalInfoProps) {
  const { watch, setValue, formState: { errors } } = form;
  const type = watch('type');
  const nutritionalInfo = watch('nutritionalInfo') || DEFAULT_VALUES[type];

  const updateDefaults = () => {
    const defaultValues = DEFAULT_VALUES[type];
    setValue('nutritionalInfo', defaultValues);
  };

  // S'assurer que les valeurs nutritionnelles sont initialisées
  useEffect(() => {
    if (!watch('nutritionalInfo')) {
      updateDefaults();
    }
  }, [type]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Informations nutritionnelles
        </h3>
        <p className="text-sm text-gray-500">Pour une portion standard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  error={errors.nutritionalInfo?.[field.key]?.message as string}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{field.unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={updateDefaults}
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          Utiliser les valeurs standards
        </button>
      </div>

      {/* Résumé nutritionnel */}
      {nutritionalInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Résumé nutritionnel
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {NUTRITION_FIELDS.map((field) => (
              <div
                key={field.key}
                className="bg-white p-3 rounded-lg text-center"
              >
                <div className="text-xl font-semibold text-gray-900">
                  {nutritionalInfo[field.key]} {field.unit}
                </div>
                <div className="text-sm text-gray-500">
                  {field.label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Pour une portion de {nutritionalInfo.servingSize}ml
          </p>
        </motion.div>
      )}
    </div>
  );
}