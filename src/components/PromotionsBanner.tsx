import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Gift, Percent, Pizza, ShoppingBag } from 'lucide-react';

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

export function PromotionsBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (response.ok) {
          const data = await response.json();
          const activePromotions = data.promotions.filter((p: Promotion) => 
            p.isActive && 
            new Date(p.startDate) <= new Date() && 
            new Date(p.endDate) >= new Date()
          );
          setPromotions(activePromotions);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4" />;
      case 'fixed': return <Gift className="h-4 w-4" />;
      case 'menu': return <Pizza className="h-4 w-4" />;
      case 'combo': return <ShoppingBag className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-500';
      case 'fixed': return 'bg-green-500';
      case 'menu': return 'bg-orange-500';
      case 'combo': return 'bg-purple-500';
      default: return 'bg-gray-500';
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  if (!isVisible || isLoading || promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentIndex];

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Contenu de la promotion */}
          <div className="flex items-center space-x-4 flex-1">
            <div className={`p-2 rounded-full ${getTypeColor(currentPromotion.type)}`}>
              {getTypeIcon(currentPromotion.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{currentPromotion.name}</h3>
              <p className="text-sm opacity-90">{currentPromotion.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatValue(currentPromotion)}</div>
              {currentPromotion.minOrder && (
                <div className="text-xs opacity-75">Commande min: {currentPromotion.minOrder}€</div>
              )}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center space-x-2 ml-4">
            {promotions.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Indicateurs de pagination */}
        {promotions.length > 1 && (
          <div className="flex justify-center space-x-1 mt-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
