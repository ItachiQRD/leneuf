import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Percent, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import MainHeader from '@/components/layout/MainHeader';
import Cart from '@/components/cart/Cart';
import { useCart } from '@/contexts/CartContext';

interface Promo {
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
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await fetch('/api/promos');
      const data = await response.json();
      if (data.success) {
        setPromos(data.data || []);
      } else {
        console.error('Error fetching promos:', data.error);
        setPromos([]);
      }
    } catch (error) {
      console.error('Error fetching promos:', error);
      setPromos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPromoStatus = (promo: Promo) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);

    if (!promo.isActive) return 'inactive';
    if (now < startDate) return 'scheduled';
    if (now > endDate) return 'expired';
    return 'active';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'inactive':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'scheduled':
        return 'Bientôt disponible';
      case 'expired':
        return 'Expirée';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Inconnu';
    }
  };

  const formatDiscount = (promo: Promo) => {
    if (promo.discountType === 'percentage') {
      return `${promo.discountValue}%`;
    } else {
      return `${promo.discountValue}€`;
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MainHeader onOpenCart={() => setIsCartOpen(true)} />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Promotions & Offres
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8">
              Découvrez nos meilleures offres et économisez sur vos commandes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader onOpenCart={() => setIsCartOpen(true)} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Promotions & Offres
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8">
            Découvrez nos meilleures offres et économisez sur vos commandes
          </p>
          {itemCount > 0 && (
            <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 text-sm">
              <span>Panier ({itemCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {promos.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Aucune promotion en cours
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Revenez bientôt pour découvrir nos nouvelles offres !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/commander"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Voir le menu
              </a>
              <a
                href="/menu"
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
              >
                Découvrir nos plats
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promos.map((promo, index) => {
              const status = getPromoStatus(promo);
              const timeRemaining = getTimeRemaining(promo.endDate);
              
              return (
                <motion.div
                  key={promo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600"
                >
                  {/* Image */}
                  {promo.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={promo.image}
                        alt={promo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Badge de statut */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center bg-white/90 rounded-full px-3 py-1">
                          {getStatusIcon(status)}
                          <span className="ml-1 text-sm font-semibold text-gray-900">
                            {getStatusText(status)}
                          </span>
                        </div>
                      </div>

                      {/* Badge de remise */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-red-600 text-white rounded-full px-4 py-2 font-bold text-lg">
                          -{formatDiscount(promo)}
                        </div>
                      </div>

                      {/* Compte à rebours */}
                      {status === 'active' && timeRemaining && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/50 text-white rounded-lg px-3 py-2 text-center">
                            <div className="flex items-center justify-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">
                                Fini dans {timeRemaining}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contenu */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {promo.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {promo.description}
                    </p>

                    {/* Période */}
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <div>Du {new Date(promo.startDate).toLocaleDateString('fr-FR')}</div>
                          <div>Au {new Date(promo.endDate).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Conditions */}
                    {promo.conditions && (
                      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        {promo.conditions.minOrderAmount && (
                          <div>Commande minimum: {promo.conditions.minOrderAmount}€</div>
                        )}
                        {promo.conditions.maxUses && (
                          <div>Utilisations restantes: {promo.conditions.maxUses - (promo.conditions.currentUses || 0)}</div>
                        )}
                      </div>
                    )}

                    {/* Bouton d'action */}
                    <div className="pt-4">
                      {status === 'active' ? (
                        <a
                          href="/commander"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
                        >
                          Commander maintenant
                        </a>
                      ) : status === 'scheduled' ? (
                        <div className="w-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold py-3 px-4 rounded-lg text-center">
                          Bientôt disponible
                        </div>
                      ) : (
                        <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold py-3 px-4 rounded-lg text-center">
                          Promotion expirée
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {promos.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Prêt à commander ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Profitez de nos promotions et commandez dès maintenant !
            </p>
            <a
              href="/commander"
              className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Voir le menu complet
            </a>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
