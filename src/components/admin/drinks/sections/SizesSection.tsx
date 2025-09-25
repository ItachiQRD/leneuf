// components/admin/drinks/sections/SizesSection.tsx
import { UseFormReturn } from 'react-hook-form';
import { DrinkInput } from '@/types/drink';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Buttons';
import { Switch } from '@/components/ui/Switch';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface SizesSectionProps {
  form: UseFormReturn<DrinkInput>;
}

const DEFAULT_SIZES: Array<{ name: string; volume: string; price: number }> = [
  { name: 'Petite', volume: '250ml', price: 1.50 },
  { name: 'Moyenne', volume: '330ml', price: 2.50 },
  { name: 'Grande', volume: '500ml', price: 3.50 }
];

export default function SizesSection({ form }: SizesSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const sizes = watch('sizes') || [];

  const addSize = () => {
    setValue('sizes', [...sizes, {
      name: '',
      price: 0,
      volume: '',
      isDefault: sizes.length === 0
    }]);
  };

  const removeSize = (index: number) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    // Si on supprime la taille par défaut, définir la première comme défaut
    if (sizes[index].isDefault && newSizes.length > 0) {
      newSizes[0].isDefault = true;
    }
    setValue('sizes', newSizes);
  };

  const addDefaultSizes = () => {
    const defaultSizes = DEFAULT_SIZES.map((size, index) => ({
      name: size.name,
      price: size.price,
      volume: size.volume,
      isDefault: index === 0
    }));
    setValue('sizes', defaultSizes);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Tailles disponibles</h3>
          <p className="text-sm text-gray-500">
            Configurez les différentes tailles et leurs prix
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addDefaultSizes}
            variant="outline"
            size="sm"
          >
            Utiliser les tailles standards
          </Button>
          <Button
            type="button"
            onClick={addSize}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une taille
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {sizes.map((size, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Input
                  label="Nom de la taille"
                  {...register(`sizes.${index}.name`)}
                  error={errors.sizes?.[index]?.name?.message}
                  placeholder="ex: Moyenne"
                />
              </div>

              <div>
                <Input
                  type="number"
                  label="Prix"
                  step="0.10"
                  min="0"
                  {...register(`sizes.${index}.price`)}
                  error={errors.sizes?.[index]?.price?.message}
                />
              </div>

              <div>
                <Input
                  label="Volume"
                  {...register(`sizes.${index}.volume`)}
                  error={errors.sizes?.[index]?.volume?.message}
                  placeholder="ex: 330ml"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={size.isDefault}
                    onCheckedChange={(checked) => {
                      const newSizes = sizes.map((s, i) => ({
                        ...s,
                        isDefault: i === index ? checked : false
                      }));
                      setValue('sizes', newSizes);
                    }}
                  />
                  <span className="text-sm text-gray-600">Taille par défaut</span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSize(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={sizes.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sizes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed"
        >
          <p className="text-gray-500">Aucune taille configurée</p>
          <div className="flex justify-center gap-2 mt-2">
            <Button
              type="button"
              variant="link"
              onClick={addDefaultSizes}
            >
              Utiliser les tailles standards
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={addSize}
            >
              Ajouter une taille personnalisée
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
