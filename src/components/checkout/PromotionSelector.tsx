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
  maxQuantity?: number;
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
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [availableOffers, setAvailableOffers] = useState<Promotion[]>([]);
  const [appliedPromotions, setAppliedPromotions] = useState<Promotion[]>([]);
  const [promotionQuantities, setPromotionQuantities] = useState<Record<string, number>>({});

  // Vérifier les conditions des promotions
  useEffect(() => {
    const checkPromotions = () => {
      // Détecter les pizzas par leur prix (Senior: 13€, Méga: 17€)
      // Note: Margherita a des prix différents (Senior: 9€, Méga: 14€)
      const seniorPizzas = items.filter(item => 
        (item.price === 13 || item.price === 9) // Senior: 13€ normal, 9€ Margherita
      );
      
      const megaPizzas = items.filter(item => 
        (item.price === 17 || item.price === 14) // Méga: 17€ normal, 14€ Margherita
      );

      const available: Promotion[] = [];

      // Vérifier l'offre Senior (2+ pizzas Senior)
      const seniorQuantity = seniorPizzas.reduce((sum, item) => sum + item.quantity, 0);
      if (seniorQuantity >= 2) {
        const maxOffers = Math.floor(seniorQuantity / 2);
        available.push({
          ...availablePromotions[0],
          id: 'senior-offer',
          maxQuantity: maxOffers
        });
      }

      // Vérifier l'offre Méga (2+ pizzas Méga)
      const megaQuantity = megaPizzas.reduce((sum, item) => sum + item.quantity, 0);
      if (megaQuantity >= 2) {
        const maxOffers = Math.floor(megaQuantity / 2);
        available.push({
          ...availablePromotions[1],
          id: 'mega-offer',
          maxQuantity: maxOffers
        });
      }

      setAvailableOffers(available);
    };

    checkPromotions();
  }, [items]);

  const handlePromotionSelect = (promotionId: string) => {
    const promotion = availableOffers.find(p => p.id === promotionId);
    if (!promotion) return;

    if (!selectedPromotions.includes(promotionId)) {
      setSelectedPromotions(prev => [...prev, promotionId]);
      setPromotionQuantities(prev => ({
        ...prev,
        [promotionId]: 1
      }));
    }
  };

  const handlePromotionRemove = (promotionId: string) => {
    setSelectedPromotions(prev => prev.filter(id => id !== promotionId));
    setPromotionQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[promotionId];
      return newQuantities;
    });
  };

  const handleQuantityChange = (promotionId: string, quantity: number) => {
    const promotion = availableOffers.find(p => p.id === promotionId);
    if (!promotion || quantity < 1 || quantity > (promotion.maxQuantity || 1)) return;

    setPromotionQuantities(prev => ({
      ...prev,
      [promotionId]: quantity
    }));
  };

  const handleApplyPromotions = () => {
    let totalDiscount = 0;
    let description = '';

    selectedPromotions.forEach(promotionId => {
      const promotion = availableOffers.find(p => p.id === promotionId);
      const quantity = promotionQuantities[promotionId] || 1;
      
      if (promotion) {
        let pizzaPrice = 0;
        
        if (promotion.type === 'senior') {
          const seniorPizzas = items.filter(item => 
            (item.price === 13 || item.price === 9)
          );
          if (seniorPizzas.length > 0) {
            // Trouver la pizza Senior la moins chère
            pizzaPrice = Math.min(...seniorPizzas.map(pizza => pizza.price));
          }
        } else if (promotion.type === 'mega') {
          const megaPizzas = items.filter(item => 
            (item.price === 17 || item.price === 14)
          );
          if (megaPizzas.length > 0) {
            // Trouver la pizza Méga la moins chère
            pizzaPrice = Math.min(...megaPizzas.map(pizza => pizza.price));
          }
        }
        
        const discount = pizzaPrice * quantity;
        totalDiscount += discount;
        
        if (description) description += ' + ';
        description += `${quantity}x ${promotion.name}`;
      }
    });

    if (totalDiscount > 0) {
      onPromotionApplied(totalDiscount, description);
    }
  };

  const handleRemoveAllPromotions = () => {
    setSelectedPromotions([]);
    setPromotionQuantities({});
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
            
            {/* Debug info */}
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                🔍 Debug - Contenu du panier :
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                {items.length === 0 ? (
                  <p>Panier vide</p>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.price}€ x{item.quantity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">
                💡 Comment bénéficier des promotions ?
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ajoutez 2+ pizzas Senior (13€ ou 9€) pour obtenir une pizza Senior gratuite</li>
                <li>• Ajoutez 2+ pizzas Méga (17€ ou 14€) pour obtenir une pizza Méga gratuite</li>
              </ul>
            </div>
          </div>
        ) : (
          availableOffers.map((offer) => {
            const isSelected = selectedPromotions.includes(offer.id);
            const quantity = promotionQuantities[offer.id] || 1;
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Pizza className="w-5 h-5 text-orange-500 mr-2" />
                      <h4 className="font-semibold text-gray-900">{offer.name}</h4>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-2">{offer.description}</p>
                    <p className="text-sm text-gray-600 mb-2">{offer.condition}</p>
                    
                    <p className="text-sm text-green-600 font-medium mb-2">
                      💰 La pizza la moins chère de cette taille sera offerte
                    </p>
                    
                    {offer.maxQuantity && offer.maxQuantity > 1 && (
                      <p className="text-sm text-blue-600 font-medium">
                        💡 Cumulable ! Vous pouvez appliquer cette offre jusqu'à {offer.maxQuantity} fois
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col items-end space-y-2">
                    {isSelected ? (
                      <>
                        {/* Contrôle de quantité */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(offer.id, Math.max(1, quantity - 1))}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(offer.id, Math.min(offer.maxQuantity || 1, quantity + 1))}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                            disabled={quantity >= (offer.maxQuantity || 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePromotionRemove(offer.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium transition-colors flex items-center text-sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Retirer
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePromotionSelect(offer.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Sélectionner
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Boutons d'action pour les promotions sélectionnées */}
      {selectedPromotions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gift className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">
                {selectedPromotions.length} promotion{selectedPromotions.length > 1 ? 's' : ''} sélectionnée{selectedPromotions.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApplyPromotions}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Appliquer les promotions
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemoveAllPromotions}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tout retirer
              </motion.button>
            </div>
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