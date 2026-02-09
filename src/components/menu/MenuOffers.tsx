import { motion } from 'framer-motion';
import { Star, Gift, Clock, Pizza, Coffee, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MenuOffers() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50/50 to-red-50 dark:from-gray-900 dark:to-gray-800" id="promotions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Promotion
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Une offre exceptionnelle sur nos pizzas
          </p>
        </motion.div>

        {/* Bloc principal : image + description 2 achetées 1 offerte */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px] md:min-h-[380px]">
            {/* Image */}
            <div className="relative h-64 md:h-80 lg:h-auto lg:min-h-[380px] order-2 lg:order-1">
              <Image
                src="/images/menu/promo.jpg"
                alt="Pizzas Le 9 - Promotion 2 achetées 1 offerte"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-amber-900/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 lg:left-4 lg:right-auto lg:top-1/2 lg:-translate-y-1/2">
                <span className="inline-block px-4 py-2 bg-amber-500 text-white font-bold text-sm md:text-base rounded-full shadow-lg">
                  2 achetées · 1 offerte
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12 order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                2 pizzas achetées, 1 offerte
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                Choisissez <strong className="text-amber-600 dark:text-amber-400">2 pizzas en taille Senior ou Méga</strong> :
                la 3<sup>e</sup> (une pizza Senior ou Méga au même prix) vous est offerte.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Prenez des pizzas <strong>Senior</strong> ou <strong>Méga</strong> pour en profiter.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>À l&apos;étape de <strong>confirmation de commande</strong>, un popup s&apos;affichera pour confirmer la promotion.</span>
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/commander"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  <Pizza className="w-5 h-5" />
                  Commander et en profiter
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Section d'informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Livraison gratuite
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Halal certifié
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Qualité garantie
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                <strong>Téléphone :</strong> 03 26 40 79 67 — <strong>Adresse :</strong> 9 Route de Bétheny, 51450 Reims
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
