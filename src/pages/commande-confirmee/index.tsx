import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CommandeConfirmeePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Commande confirmée !
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Votre commande a été prise en compte et sera préparée dans les plus brefs délais.
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Détails de votre commande
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Numéro de commande</span>
                <span className="font-bold text-gray-900 dark:text-white">#CMD-2024-001</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Heure de commande</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Temps de préparation</span>
                <span className="font-bold text-gray-900 dark:text-white">30-45 minutes</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-bold text-green-600 text-xl">25,90 €</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
              Informations de livraison
            </h3>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-800 dark:text-blue-200">
                  Livraison estimée : 30-45 minutes
                </span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-800 dark:text-blue-200">
                  Adresse de livraison : [Adresse du client]
                </span>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-800 dark:text-blue-200">
                  Contact : 01 23 45 67 89
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/menu"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Commander à nouveau
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <p>
              Vous recevrez un SMS de confirmation avec le numéro de suivi de votre commande.
            </p>
            <p className="mt-2">
              En cas de problème, contactez-nous au 01 23 45 67 89
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
