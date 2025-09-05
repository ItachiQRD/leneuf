import { UseFormReturn } from 'react-hook-form';
import { Dessert } from '@/types/dessert';
import { Switch } from '@/components/ui/Switch';
import { motion } from 'framer-motion';
import { Leaf, Wheat, Star } from 'lucide-react';

interface CharacteristicsSectionProps {
  form: UseFormReturn<Dessert>;
}

export default function CharacteristicsSection({ form }: CharacteristicsSectionProps) {
  const { watch, setValue } = form;
  const isVegan = watch('isVegan');
  const isGlutenFree = watch('isGlutenFree');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Caractéristiques spéciales
        </h3>
        <p className="text-sm text-gray-500">
          Définissez les caractéristiques particulières de ce dessert
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option Végan */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            isVegan 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-green-200'
          }`}
          onClick={() => setValue('isVegan', !isVegan)}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              isVegan ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Leaf className={`w-5 h-5 ${
                isVegan ? 'text-green-600' : 'text-gray-500'
              }`} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Végan</h4>
                <Switch
                  checked={isVegan}
                  onCheckedChange={(checked) => setValue('isVegan', checked)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Ne contient aucun produit d'origine animale
              </p>
            </div>
          </div>
        </motion.div>

        {/* Option Sans Gluten */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            isGlutenFree 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-200'
          }`}
          onClick={() => setValue('isGlutenFree', !isGlutenFree)}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              isGlutenFree ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Wheat className={`w-5 h-5 ${
                isGlutenFree ? 'text-blue-600' : 'text-gray-500'
              }`} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Sans Gluten</h4>
                <Switch
                  checked={isGlutenFree}
                  onCheckedChange={(checked) => setValue('isGlutenFree', checked)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Adapté aux personnes intolérantes au gluten
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Messages d'information */}
      {(isVegan || isGlutenFree) && (
        <div className="mt-4">
          {isVegan && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-2">
              <div className="flex items-start">
                <Star className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">Dessert Végan</h4>
                  <p className="mt-1 text-sm text-green-700">
                    Assurez-vous que tous les ingrédients et le processus de préparation 
                    respectent les standards végans.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isGlutenFree && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Star className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Dessert Sans Gluten</h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Vérifiez que tous les ingrédients sont certifiés sans gluten et qu'il n'y a 
                    pas de contamination croisée lors de la préparation.
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