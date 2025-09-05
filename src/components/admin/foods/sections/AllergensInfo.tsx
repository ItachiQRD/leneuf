import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI as FoodInput, COMMON_ALLERGENS } from '@/types/food';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';

interface AllergensInfoProps {
  form: UseFormReturn<FoodInput>;
}

export default function AllergensInfo({ form }: AllergensInfoProps) {
  const { watch, setValue } = form;
  const selectedAllergens = watch('allergens') || [];

  const handleAllergenToggle = (id: string) => {
    const isSelected = selectedAllergens.includes(id);
    if (isSelected) {
      setValue('allergens', selectedAllergens.filter(allergenId => allergenId !== id));
    } else {
      setValue('allergens', [...selectedAllergens, id]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Allergènes</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {COMMON_ALLERGENS.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-2">
            <Checkbox
              id={`allergen-${id}`}
              checked={selectedAllergens.includes(id)}
              onChange={() => handleAllergenToggle(id)}
            />
            <Label htmlFor={`allergen-${id}`}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
