import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI as FoodInput, Extra, EXTRA_CATEGORIES } from '@/types/food';
import { Button } from '@/components/ui/Buttons';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectOption } from '@/components/ui/Select';

interface ExtrasInfoProps {
  form: UseFormReturn<FoodInput>;
}

export default function ExtrasInfo({ form }: ExtrasInfoProps) {
  const { register, watch, setValue } = form;
  const extras = watch('extras') || [];

  const handleAddExtra = () => {
    setValue('extras', [
      ...extras,
      {
        name: '',
        price: 0,
        available: true,
        category: 'other'
      }
    ]);
  };

  const handleRemoveExtra = (index: number) => {
    setValue(
      'extras',
      extras.filter((_, i: number) => i !== index)
    );
  };

  const handleExtraChange = (index: number, field: keyof Extra, value: string | number | boolean) => {
    setValue(`extras.${index}.${field}`, value);
  };

  const extraCategoryOptions: SelectOption[] = [...EXTRA_CATEGORIES];

  return (
    <div className="space-y-4">
      <Label>Extras</Label>
      {extras.map((_, index: number) => (
        <div key={index} className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor={`extras.${index}.name`}>Nom</Label>
            <Input
              id={`extras.${index}.name`}
              {...register(`extras.${index}.name`)}
            />
          </div>
          <div className="w-32">
            <Label htmlFor={`extras.${index}.price`}>Prix (€)</Label>
            <Input
              id={`extras.${index}.price`}
              type="number"
              step="0.01"
              {...register(`extras.${index}.price`, { valueAsNumber: true })}
            />
          </div>
          <div className="w-40">
            <Label htmlFor={`extras.${index}.category`}>Catégorie</Label>
            <Select
              id={`extras.${index}.category`}
              {...register(`extras.${index}.category`)}
              options={extraCategoryOptions}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRemoveExtra(index)}
          >
            Supprimer
          </Button>
        </div>
      ))}
      <Button type="button" onClick={handleAddExtra}>
        Ajouter un extra
      </Button>
    </div>
  );
}
