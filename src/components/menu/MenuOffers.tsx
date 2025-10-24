import { motion } from 'framer-motion';
import { Star, Gift, Users, Clock, Pizza, Utensils, Coffee } from 'lucide-react';
import Image from 'next/image';

const menuOffers = [
  {
    id: 'menu-senior',
    title: 'MENU SENIOR',
    price: '25€',
    description: '2 pizzas séniors + 1 boisson 1,5L',
    icon: Pizza,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    promotion: '2 Pizzas Seniors achetées = 3ème Offerte',
    promotionColor: 'bg-yellow-400 text-yellow-900'
  },
  {
    id: 'menu-trio',
    title: 'MENU TRIO',
    price: '25€',
    description: '3 Juniors + 1 boisson 1,5L',
    icon: Pizza,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    promotion: null
  },
  {
    id: 'menu-couple',
    title: 'MENU COUPLE',
    price: '19€',
    description: '1 pizza sénior + 6 Nuggets ou Wings + 2 boissons 33cl + 2 Brownie',
    icon: Utensils,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    promotion: null
  },
  {
    id: 'menu-famille',
    title: 'MENU FAMILLE',
    price: '34€',
    description: '2 pizzas mégas + 1 boisson 1,5L',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    promotion: '2 Pizzas Mégas achetées = 3ème Offerte',
    promotionColor: 'bg-green-400 text-green-900'
  },
  {
    id: 'menu-le-neuf',
    title: 'MENU LE NEUF',
    price: '34€',
    description: '4 pizzas Junior + 1 boisson 1,5L',
    icon: Pizza,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    promotion: null
  },
  {
    id: 'menu-top',
    title: 'MENU TOP',
    price: '51€',
    description: '5 pizzas séniors + 2 boisson 1,5L',
    icon: Star,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    promotion: null
  }
];

export default function MenuOffers() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de la section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Offres Spéciales
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez nos menus complets à prix avantageux, parfaits pour partager en famille ou entre amis
          </p>
        </motion.div>

        {/* Grille des offres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Badge de promotion */}
              {offer.promotion && (
                <div className={`absolute -top-3 -right-3 z-10 px-3 py-1 rounded-full text-sm font-bold ${offer.promotionColor} shadow-lg`}>
                  {offer.promotion}
                </div>
              )}

              {/* Carte de l'offre */}
              <div className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 ${offer.bgColor} dark:bg-gray-800`}>
                {/* Header avec gradient */}
                <div className={`h-24 bg-gradient-to-r ${offer.color} relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <offer.icon className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl font-bold ${offer.textColor} dark:text-white`}>
                      {offer.title}
                    </h3>
                    <div className={`text-2xl font-bold ${offer.textColor} dark:text-white`}>
                      {offer.price}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {offer.description}
                  </p>

                  {/* Bouton d'action */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${offer.color} hover:shadow-lg transition-all duration-200`}
                  >
                    Commander maintenant
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Livraison gratuite
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Coffee className="w-6 h-6 text-primary" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Halal certifié
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Star className="w-6 h-6 text-primary" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Qualité garantie
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Téléphone:</strong> 03 26 40 79 67 | 
                <strong> Adresse:</strong> 9 Route de Bétheny - 51450
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
