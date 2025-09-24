import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Percent, Gift, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Promo {
  id: string;
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed' | 'free';
  validUntil: string;
  image: string;
  category: string;
  isActive: boolean;
}

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des promos
    const mockPromos: Promo[] = [
      {
        id: '1',
        title: 'Menu Burger + Boisson',
        description: 'Burger au choix + Boisson + Frites moyennes',
        discount: 20,
        type: 'percentage',
        validUntil: '2024-12-31',
        image: '/images/promo-burger.jpg',
        category: 'Menu',
        isActive: true
      },
      {
        id: '2',
        title: 'Pizza Margherita',
        description: 'Pizza Margherita classique 30cm',
        discount: 5,
        type: 'fixed',
        validUntil: '2024-12-25',
        image: '/images/promo-pizza.jpg',
        category: 'Pizza',
        isActive: true
      },
      {
        id: '3',
        title: 'Dessert Gratuit',
        description: 'Dessert offert pour toute commande supérieure à 25€',
        discount: 0,
        type: 'free',
        validUntil: '2024-12-20',
        image: '/images/promo-dessert.jpg',
        category: 'Dessert',
        isActive: true
      },
      {
        id: '4',
        title: 'Happy Hour Boissons',
        description: 'Toutes les boissons à -30% de 14h à 16h',
        discount: 30,
        type: 'percentage',
        validUntil: '2024-12-31',
        image: '/images/promo-drinks.jpg',
        category: 'Boissons',
        isActive: true
      }
    ];

    setTimeout(() => {
      setPromos(mockPromos);
      setLoading(false);
    }, 1000);
  }, []);

  const getDiscountText = (promo: Promo) => {
    switch (promo.type) {
      case 'percentage':
        return `-${promo.discount}%`;
      case 'fixed':
        return `-${promo.discount}€`;
      case 'free':
        return 'GRATUIT';
      default:
        return '';
    }
  };

  const getDiscountIcon = (promo: Promo) => {
    switch (promo.type) {
      case 'percentage':
        return <Percent className="w-5 h-5" />;
      case 'fixed':
        return <Gift className="w-5 h-5" />;
      case 'free':
        return <Zap className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des promos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🎉 Promotions & Offres
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Découvrez nos meilleures offres et économisez sur vos commandes
            </p>
          </div>

          {/* Promos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promos.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                      {getDiscountIcon(promo)}
                      <span>{getDiscountText(promo)}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      {promo.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {promo.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Valide jusqu'au {new Date(promo.validUntil).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <Link
                    href="/commander"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center block"
                  >
                    Commander maintenant
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Vous ne trouvez pas votre bonheur ?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Découvrez notre menu complet avec plus de 50 plats délicieux
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Voir le menu complet
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
