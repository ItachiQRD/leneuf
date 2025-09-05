import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { DessertInput } from '@/types/dessert';
import { Button } from '@/components/ui/Buttons';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Plus, Trash2 } from 'lucide-react';

interface SizesDessertSectionProps {
  form: UseFormReturn<DessertInput>;
}

export default function SizesDessertSection({ form }: SizesDessertSectionProps) {
  const { control, register, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sizes'
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Tailles disponibles</Label>
        <Button
          type="button"
          onClick={() => append({ name: '', price: 0, isDefault: false })}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une taille
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex-1">
              <Label>Nom</Label>
              <Input
                {...register(`sizes.${index}.name` as const, {
                  required: 'Le nom est requis'
                })}
                error={errors.sizes?.[index]?.name?.message}
              />
            </div>

            <div className="flex-1">
              <Label>Prix</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`sizes.${index}.price` as const, {
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Le prix doit être positif' }
                })}
                error={errors.sizes?.[index]?.price?.message}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                {...register(`sizes.${index}.isDefault` as const)}
              />
              <Label>Par défaut</Label>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Aucune taille ajoutée
        </p>
      )}
    </div>
  );
}