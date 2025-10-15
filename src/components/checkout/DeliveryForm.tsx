import { useState, useEffect } from 'react';
import { useCustomerData, CustomerData } from '@/hooks/useCustomerData';
import { User, Phone, MapPin, CreditCard, Banknote, MessageSquare, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';

interface DeliveryFormProps {
  onSubmit: (data: CustomerData) => void;
  isLoading?: boolean;
  onShowAccountModal?: () => void;
}

export default function DeliveryForm({ onSubmit, isLoading = false, onShowAccountModal }: DeliveryFormProps) {
  const { customerData, updateCustomerData } = useCustomerData();
  const [formData, setFormData] = useState<CustomerData>(customerData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mettre à jour le formulaire quand les données des cookies changent
  useEffect(() => {
    setFormData(customerData);
  }, [customerData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Le numéro de téléphone n\'est pas valide';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Sauvegarder dans les cookies
    updateCustomerData(formData);
    
    // Soumettre le formulaire
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Informations de livraison
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nom complet *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Votre nom complet"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Numéro de téléphone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="0123456789"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Adresse de livraison *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="123 Rue de la Paix, 75001 Paris"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* Mode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Mode de paiement *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.paymentMethod === 'card' 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'card' | 'cash')}
                className="sr-only"
              />
              <CreditCard className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Carte bancaire</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Paiement sécurisé</div>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.paymentMethod === 'cash' 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'card' | 'cash')}
                className="sr-only"
              />
              <Banknote className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Espèces</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Paiement à la livraison</div>
              </div>
            </label>
          </div>
        </div>

        {/* Instructions de livraison */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Instructions de livraison (optionnel)
          </label>
          <textarea
            value={formData.deliveryInstructions || ''}
            onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Sonner fort, laisser devant la porte, etc."
          />
        </div>

        {/* Message d'incitation à créer un compte */}
        {onShowAccountModal && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <UserPlus className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Gagnez du temps pour vos prochaines commandes !
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-200 mb-2">
                    Créez un compte gratuit pour sauvegarder vos informations et profiter d'offres exclusives.
                  </p>
                  <button
                    type="button"
                    onClick={onShowAccountModal}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 font-medium underline"
                  >
                    Découvrir les avantages →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="pt-4">
          <Button
            type="submit"
            fullWidth
            className="bg-red-600 hover:bg-red-700 text-white"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Traitement en cours...' : 'Confirmer la commande'}
          </Button>
        </div>
      </form>
    </div>
  );
}
