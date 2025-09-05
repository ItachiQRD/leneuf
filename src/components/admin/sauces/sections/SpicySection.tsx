import { UseFormReturn } from 'react-hook-form';
import { Sauce } from '@/types/sauce';
import { Flame } from 'lucide-react'; // Changed from Fire to Flame

interface SpicySectionProps {
  form: UseFormReturn<Sauce>;
}

// Assurons-nous que les valeurs correspondent exactement au type Sauce
const SPICY_LEVELS: Array<{
  value: Sauce['spicyLevel'];
  label: string;
  description: string;
}> = [
  { 
    value: 'mild', 
    label: 'Doux', 
    description: 'Légèrement relevé' 
  },
  { 
    value: 'medium', 
    label: 'Moyen', 
    description: 'Modérément épicé' 
  },
  { 
    value: 'hot', 
    label: 'Fort', 
    description: 'Très épicé' 
  }
];

export default function SpicySection({ form }: SpicySectionProps) {
  const { watch, setValue } = form;
  const currentLevel = watch('spicyLevel');

  const handleSpicyLevelChange = (level: Sauce['spicyLevel']) => {
    setValue('spicyLevel', level);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Niveau de piquant</h3>
        <p className="text-sm text-gray-500">
          Sélectionnez le niveau de piquant de la sauce
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SPICY_LEVELS.map(level => (
          <button
            key={level.value}
            type="button"
            onClick={() => handleSpicyLevelChange(level.value)}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentLevel === level.value
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex space-x-1 ${
                level.value === 'hot' ? 'text-red-500' :
                level.value === 'medium' ? 'text-orange-500' :
                'text-yellow-500'
              }`}>
                <Flame className="w-5 h-5" />
                {level.value === 'hot' && <Flame className="w-5 h-5" />}
                {level.value === 'medium' && <Flame className="w-5 h-5" opacity={0.5} />}
              </div>
              <span className="font-medium">{level.label}</span>
            </div>
            <p className="text-sm text-gray-600 text-left">
              {level.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}