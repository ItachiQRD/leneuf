import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Gift, Percent, Pizza, ShoppingBag, Clock, Users } from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'menu' | 'combo';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  applicableProducts: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  image?: string;
}

interface MenuPromotionsProps {
  category?: string;
  limit?: number;
}

export function MenuPromotions({ category, limit = 6 }: MenuPromotionsProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (response.ok) {
          const data = await response.json();
          let filteredPromotions = data.promotions.filter((p: Promotion) => 
            p.isActive && 
            new Date(p.startDate) <= new Date() && 
            new Date(p.endDate) >= new Date()
          );

          // Filtrer par catégorie si spécifiée
          if (category && category !== 'all') {
            filteredPromotions = filteredPromotions.filter((p: Promotion) =>
              p.applicableProducts.includes(category) || p.applicableProducts.includes('all')
            );
          }

          setPromotions(filteredPromotions.slice(0, limit));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [category, limit]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-5 w-5" />;
      case 'fixed': return <Gift className="h-5 w-5" />;
      case 'menu': return <Pizza className="h-5 w-5" />;
      case 'combo': return <ShoppingBag className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fixed': return 'bg-green-100 text-green-800 border-green-200';
      case 'menu': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'combo': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return promotion.value === 0 ? 'Gratuit' : `${promotion.value}€`;
      case 'menu':
      case 'combo':
        return `${promotion.value}€`;
      default:
        return promotion.value.toString();
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j restant${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours}h restante${hours > 1 ? 's' : ''}`;
    return 'Bientôt expiré';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucune promotion disponible
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Revenez bientôt pour découvrir nos offres spéciales !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 Promotions du moment
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez nos offres spéciales et économisez sur vos commandes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {/* Badge de type */}
            <div className="absolute top-4 right-4 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(promotion.type)}`}>
                {getTypeIcon(promotion.type)}
                <span className="ml-1 capitalize">{promotion.type}</span>
              </span>
            </div>

            {/* Image de promotion */}
            <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🍕</div>
                <div className="text-2xl font-bold text-primary">
                  {formatValue(promotion)}
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {promotion.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {promotion.description}
                </p>
              </div>

              {/* Informations supplémentaires */}
              <div className="space-y-2 mb-4">
                {promotion.minOrder && (
                  <div className="flex items-center text-sm text-gray-500">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    <span>Commande min: {promotion.minOrder}€</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{getTimeRemaining(promotion.endDate)}</span>
                </div>
                {promotion.usageLimit && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{promotion.usedCount}/{promotion.usageLimit} utilisations</span>
                  </div>
                )}
              </div>

              {/* Barre de progression */}
              {promotion.usageLimit && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Utilisé</span>
                    <span>{Math.round((promotion.usedCount / promotion.usageLimit) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(promotion.usedCount / promotion.usageLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Bouton d'action */}
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium">
                Profiter de l'offre
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
