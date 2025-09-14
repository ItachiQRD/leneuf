import { UseFormReturn } from 'react-hook-form';
import { FoodInputAPI, FoodType } from '@/types/food';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

interface SpecificOptionsProps {
  form: UseFormReturn<FoodInputAPI>;
  type: FoodType;
}

export default function SpecificOptions({ form, type }: SpecificOptionsProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  // Options spécifiques aux pizzas
  const renderPizzaOptions = () => (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900">Options Pizza</h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Base de pizza
        </label>
        <Select 
          {...register('pizzaBase')}
          options={[
            { value: 'tomate', label: 'Base tomate' },
            { value: 'creme_fraiche', label: 'Base crème fraîche' }
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tailles de pizza
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Ajoutez les différentes tailles disponibles pour cette pizza
        </p>
        <div className="space-y-3">
          <div className="text-sm text-gray-500 italic">
            Fonctionnalité à implémenter : gestion des tailles de pizza
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Pour les pizzas, le prix sera défini selon la taille sélectionnée par le client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Options spécifiques aux tacos
  const renderTacoOptions = () => (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900">Options Tacos</h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tailles de tacos
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Ajoutez les différentes tailles disponibles pour ces tacos
        </p>
        <div className="text-sm text-gray-500 italic">
          Fonctionnalité à implémenter : gestion des tailles de tacos
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options de viande
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Définissez les viandes disponibles pour ces tacos
        </p>
        <div className="text-sm text-gray-500 italic">
          Fonctionnalité à implémenter : gestion des options de viande
        </div>
      </div>
    </div>
  );


  // Options spécifiques aux paninis
  const renderPaniniOptions = () => (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900">Options Panini</h4>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <Checkbox {...register('paniniAccompaniments.fries')} />
          <span className="text-sm text-gray-700">Frites incluses</span>
        </label>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Boisson incluse
          </label>
          <Input
            {...register('paniniAccompaniments.drink')}
            placeholder="Ex: Coca-Cola 33cl"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix de la boisson (€)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...register('paniniAccompaniments.drinkPrice')}
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );

  // Options spécifiques aux assiettes
  const renderPlateOptions = () => (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900">Options Assiette</h4>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <Checkbox {...register('plateAccompaniments.bread')} />
          <span className="text-sm text-gray-700">Pain inclus</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox {...register('plateAccompaniments.fries')} />
          <span className="text-sm text-gray-700">Frites incluses</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox {...register('plateAccompaniments.salad')} />
          <span className="text-sm text-gray-700">Salade incluse</span>
        </label>
      </div>
    </div>
  );

  // Options spécifiques aux menus enfants
  const renderKidsMenuOptions = () => (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900">Options Menu Enfant</h4>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <Checkbox {...register('includesSurprise')} />
          <span className="text-sm text-gray-700">Surprise incluse</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox {...register('includesCaprisun')} />
          <span className="text-sm text-gray-700">Capri-Sun inclus</span>
        </label>
      </div>
    </div>
  );

  const renderSpecificOptions = () => {
    switch (type) {
      case 'pizza':
        return renderPizzaOptions();
      case 'paninis':
        return renderPaniniOptions();
      case 'plates':
        return renderPlateOptions();
      case 'kids_menu':
        return renderKidsMenuOptions();
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune option spécifique pour ce type de plat</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Options spécifiques</h3>
      <p className="text-sm text-gray-600">
        Configurez les options spécifiques au type de plat sélectionné
      </p>
      
      {renderSpecificOptions()}
    </div>
  );
}
