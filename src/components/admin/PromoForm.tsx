import { useState, useEffect } from 'react';
import { X, Calendar, Percent, Euro, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';

interface PromoFormProps {
  promo?: {
    _id: string;
    name: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    image?: string;
    conditions?: {
      minOrderAmount?: number;
      applicableProducts?: string[];
      maxUses?: number;
      currentUses?: number;
    };
  } | null;
  onClose: () => void;
  onSave: (promoData: any) => void;
}

export default function PromoForm({ promo, onClose, onSave }: PromoFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    image: '',
    conditions: {
      minOrderAmount: 0,
      applicableProducts: [] as string[],
      maxUses: 0,
      currentUses: 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promo) {
      setFormData({
        name: promo.name,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        startDate: promo.startDate.split('T')[0], // Format YYYY-MM-DD
        endDate: promo.endDate.split('T')[0],
        isActive: promo.isActive,
        image: promo.image || '',
        conditions: {
          minOrderAmount: promo.conditions?.minOrderAmount || 0,
          applicableProducts: promo.conditions?.applicableProducts || [],
          maxUses: promo.conditions?.maxUses || 0,
          currentUses: promo.conditions?.currentUses || 0
        }
      });
    } else {
      // Valeurs par défaut pour une nouvelle promotion
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      setFormData({
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        startDate: today,
        endDate: nextWeekStr,
        isActive: true,
        image: '',
        conditions: {
          minOrderAmount: 0,
          applicableProducts: [],
          maxUses: 0,
          currentUses: 0
        }
      });
    }
  }, [promo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = 'La valeur de remise doit être positive';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Le pourcentage ne peut pas dépasser 100%';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }

    if (formData.conditions.minOrderAmount < 0) {
      newErrors.minOrderAmount = 'Le montant minimum ne peut pas être négatif';
    }

    if (formData.conditions.maxUses < 0) {
      newErrors.maxUses = 'Le nombre maximum d\'utilisations ne peut pas être négatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const promoData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      conditions: {
        ...formData.conditions,
        minOrderAmount: formData.conditions.minOrderAmount || undefined,
        maxUses: formData.conditions.maxUses || undefined
      }
    };

    onSave(promoData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleConditionsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));

    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {promo ? 'Modifier la promotion' : 'Nouvelle promotion'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de la promotion *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ex: Offre spéciale été"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image (URL)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Description de la promotion..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Configuration de la remise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de remise *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="percentage"
                      checked={formData.discountType === 'percentage'}
                      onChange={(e) => handleInputChange('discountType', e.target.value)}
                      className="mr-2"
                    />
                    <Percent className="w-4 h-4 mr-1" />
                    Pourcentage
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="fixed"
                      checked={formData.discountType === 'fixed'}
                      onChange={(e) => handleInputChange('discountType', e.target.value)}
                      className="mr-2"
                    />
                    <Euro className="w-4 h-4 mr-1" />
                    Montant fixe
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur de la remise *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                    min="0"
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                    step={formData.discountType === 'percentage' ? 1 : 0.01}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.discountValue ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={formData.discountType === 'percentage' ? '10' : '5.00'}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    {formData.discountType === 'percentage' ? '%' : '€'}
                  </span>
                </div>
                {errors.discountValue && <p className="mt-1 text-sm text-red-600">{errors.discountValue}</p>}
              </div>
            </div>

            {/* Période de validité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de début *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de fin *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>

            {/* Conditions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Conditions (optionnel)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Montant minimum de commande (€)
                  </label>
                  <input
                    type="number"
                    value={formData.conditions.minOrderAmount}
                    onChange={(e) => handleConditionsChange('minOrderAmount', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.minOrderAmount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.minOrderAmount && <p className="mt-1 text-sm text-red-600">{errors.minOrderAmount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre maximum d'utilisations
                  </label>
                  <input
                    type="number"
                    value={formData.conditions.maxUses}
                    onChange={(e) => handleConditionsChange('maxUses', parseInt(e.target.value) || 0)}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.maxUses ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0 = illimité"
                  />
                  {errors.maxUses && <p className="mt-1 text-sm text-red-600">{errors.maxUses}</p>}
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Promotion active
              </label>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {promo ? 'Mettre à jour' : 'Créer la promotion'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
