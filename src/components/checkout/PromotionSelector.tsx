import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Pizza, Gift, AlertCircle } from 'lucide-react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

interface PromotionSelectorProps {
  items: CartItem[];
  onPromotionApplied: (discount: number, description: string) => void;
  onPromotionRemoved: () => void;
}

interface Promotion {
  id: string;
  name: string;
  description: string;
  condition: string;
  discount: number;
  type: 'senior' | 'mega';
}

const availablePromotions: Promotion[] = [
  {
    id: 'senior-offer',
    name: 'Offre Senior',
    description: '2 pizzas Senior achetées = 1 pizza Senior offerte',
    condition: 'Achetez 2 pizzas de taille Senior et obtenez une pizza Senior gratuite',
    discount: 0, // Gratuit
    type: 'senior'
  },
  {
    id: 'mega-offer',
    name: 'Offre Méga',
    description: '2 pizzas Méga achetées = 1 pizza Méga offerte',
    condition: 'Achetez 2 pizzas de taille Méga et obtenez une pizza Méga gratuite',
    discount: 0, // Gratuit
    type: 'mega'
  }
];

export default function PromotionSelector({ items, onPromotionApplied, onPromotionRemoved }: PromotionSelectorProps) {
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const [availableOffers, setAvailableOffers] = useState<Promotion[]>([]);
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);

  // Vérifier les conditions des promotions
  useEffect(() => {
    const checkPromotions = () => {
      const pizzaItems = items.filter(item => 
        item.name.toLowerCase().includes('pizza') && 
        (item.name.toLowerCase().includes('senior') || item.name.toLowerCase().includes('mega'))
      );

      const available: Promotion[] = [];

      // Vérifier l'offre Senior
      const seniorPizzas = pizzaItems.filter(item => 
        item.name.toLowerCase().includes('senior')
      );
      const seniorQuantity = seniorPizzas.reduce((sum, item) => sum + item.quantity, 0);
      
      if (seniorQuantity >= 2) {
        available.push(availablePromotions[0]);
      }

      // Vérifier l'offre Méga
      const megaPizzas = pizzaItems.filter(item => 
        item.name.toLowerCase().includes('mega')
      );
      const megaQuantity = megaPizzas.reduce((sum, item) => sum + item.quantity, 0);
      
      if (megaQuantity >= 2) {
        available.push(availablePromotions[1]);
      }

      setAvailableOffers(available);
    };

    checkPromotions();
  }, [items]);

  const handlePromotionSelect = (promotionId: string) => {
    const promotion = availablePromotions.find(p => p.id === promotionId);
    if (!promotion) return;

    setSelectedPromotion(promotionId);
    setAppliedPromotion(promotion);
    
    // Calculer la remise (prix de la pizza gratuite)
    const pizzaItems = items.filter(item => 
      item.name.toLowerCase().includes('pizza') && 
      item.name.toLowerCase().includes(promotion.type)
    );
    
    if (pizzaItems.length > 0) {
      const pizzaPrice = pizzaItems[0].price;
      onPromotionApplied(pizzaPrice, promotion.description);
    }
  };

  const handleRemovePromotion = () => {
    setSelectedPromotion(null);
    setAppliedPromotion(null);
    onPromotionRemoved();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center mb-4">
        <Gift className="w-6 h-6 text-yellow-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">
          🎉 Offres Spéciales Disponibles
        </h3>
      </div>

      <div className="space-y-4">
        {availableOffers.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Aucune promotion disponible pour votre panier actuel
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">
                💡 Comment bénéficier des promotions ?
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ajoutez 2+ pizzas Senior pour obtenir une pizza Senior gratuite</li>
                <li>• Ajoutez 2+ pizzas Méga pour obtenir une pizza Méga gratuite</li>
              </ul>
            </div>
          </div>
        ) : (
          availableOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                selectedPromotion === offer.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-yellow-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Pizza className="w-5 h-5 text-orange-500 mr-2" />
                    <h4 className="font-semibold text-gray-900">{offer.name}</h4>
                    {selectedPromotion === offer.id && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-2">{offer.description}</p>
                  <p className="text-sm text-gray-600">{offer.condition}</p>
                </div>

                <div className="ml-4">
                  {selectedPromotion === offer.id ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRemovePromotion}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Retirer
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePromotionSelect(offer.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Appliquer
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {appliedPromotion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Promotion "{appliedPromotion.name}" appliquée ! Une pizza {appliedPromotion.type} sera offerte.
            </span>
          </div>
        </motion.div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Note :</strong> Les promotions sont automatiquement appliquées selon les conditions de votre panier. 
            La pizza offerte sera ajoutée à votre commande.
          </p>
        </div>
      </div>
    </motion.div>
  );
}