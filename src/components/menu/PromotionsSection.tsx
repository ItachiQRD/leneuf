import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';

interface Promotion {
  _id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_delivery';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  applicableCategories: string[];
  conditions: {
    minQuantity?: number;
    buyQuantity?: number;
    getQuantity?: number;
    freeProduct?: string;
  };
  startDate: string;
  endDate: string;
  image?: string;
}

export default function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions?active=true');
      const data = await response.json();
      if (data.success) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPromotionText = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}% de réduction`;
      case 'fixed':
        return `${promotion.value}€ de réduction`;
      case 'buy_x_get_y':
        return `Achetez ${promotion.conditions.buyQuantity}, obtenez ${promotion.conditions.getQuantity} gratuit`;
      case 'free_delivery':
        return 'Livraison gratuite';
      default:
        return promotion.description;
    }
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'percentage':
      case 'fixed':
        return <Gift className="w-6 h-6" />;
      case 'buy_x_get_y':
        return <Users className="w-6 h-6" />;
      case 'free_delivery':
        return <Clock className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPromotionColor = (type: string) => {
    switch (type) {
      case 'percentage':
      case 'fixed':
        return 'from-green-500 to-emerald-500';
      case 'buy_x_get_y':
        return 'from-purple-500 to-violet-500';
      case 'free_delivery':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-amber-500 to-yellow-500';
    }
  };

  const handleApplyPromotion = (promotion: Promotion) => {
    // Rediriger vers la page de commande avec les paramètres de la promotion
    const params = new URLSearchParams();
    params.set('promotion', promotion._id);
    params.set('type', promotion.type);
    
    if (promotion.applicableCategories.length > 0) {
      params.set('categories', promotion.applicableCategories.join(','));
    }
    
    if (promotion.conditions.buyQuantity) {
      params.set('buyQuantity', promotion.conditions.buyQuantity.toString());
    }
    
    if (promotion.conditions.getQuantity) {
      params.set('getQuantity', promotion.conditions.getQuantity.toString());
    }

    router.push(`/commander?${params.toString()}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des promotions...</p>
          </div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">
              Offres Spéciales
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profitez de nos promotions exclusives et économisez sur vos commandes
          </p>
        </motion.div>

        {/* Grille des promotions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promotion, index) => (
            <motion.div
              key={promotion._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Carte de promotion */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-white">
                {/* Header avec gradient */}
                <div className={`h-24 bg-gradient-to-r ${getPromotionColor(promotion.type)} relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative h-full flex items-center justify-center">
                    {getPromotionIcon(promotion.type)}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {promotion.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {promotion.description}
                    </p>
                  </div>

                  {/* Conditions */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="font-semibold text-gray-900">
                        {formatPromotionText(promotion)}
                      </span>
                    </div>
                    
                    {promotion.minOrder && promotion.minOrder > 0 && (
                      <p className="text-sm text-gray-600">
                        Commande minimum: {promotion.minOrder}€
                      </p>
                    )}
                    
                    {promotion.applicableCategories.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Catégories: {promotion.applicableCategories.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Dates de validité */}
                  <div className="mb-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        Valide du {new Date(promotion.startDate).toLocaleDateString('fr-FR')} 
                        au {new Date(promotion.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApplyPromotion(promotion)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${getPromotionColor(promotion.type)} hover:shadow-lg transition-all duration-200 flex items-center justify-center`}
                  >
                    <span>Appliquer l'offre</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </div>

                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section d'informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-gray-700 font-medium">
                  Offres limitées dans le temps
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Gift className="w-6 h-6 text-primary" />
                <span className="text-gray-700 font-medium">
                  Économies garanties
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Star className="w-6 h-6 text-primary" />
                <span className="text-gray-700 font-medium">
                  Qualité premium
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
