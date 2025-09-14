import { UseFormReturn } from 'react-hook-form';
import { Dessert } from '@/types/dessert';
import { Switch } from '@/components/ui/Switch';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

interface CharacteristicsSectionProps {
  form: UseFormReturn<Dessert>;
}

export default function CharacteristicsSection({ form }: CharacteristicsSectionProps) {
  const { watch, setValue } = form;
  const available = watch('available');
  const active = watch('active');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Statut du dessert
        </h3>
        <p className="text-sm text-gray-500">
          Gérez la disponibilité et l'état du dessert
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disponibilité */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            available 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-green-200'
          }`}
          onClick={() => setValue('available', !available)}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              available ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <CheckCircle className={`w-5 h-5 ${
                available ? 'text-green-600' : 'text-gray-500'
              }`} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Disponible</h4>
                <Switch
                  checked={available}
                  onCheckedChange={(checked) => setValue('available', checked)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Le dessert est disponible à la commande
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actif */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            active 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-200'
          }`}
          onClick={() => setValue('active', !active)}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              active ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Star className={`w-5 h-5 ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Actif</h4>
                <Switch
                  checked={active}
                  onCheckedChange={(checked) => setValue('active', checked)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Le dessert est actif dans le système
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Messages d'information */}
      {(!available || !active) && (
        <div className="mt-4">
          {!available && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-2">
              <div className="flex items-start">
                <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Dessert Indisponible</h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    Ce dessert n'apparaîtra pas dans la liste des produits disponibles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!active && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <Star className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Dessert Inactif</h4>
                  <p className="mt-1 text-sm text-red-700">
                    Ce dessert est désactivé et ne sera pas visible pour les clients.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}