import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: any;
}

interface OrderSummary {
  orderId: string;
  total: number;
  items: OrderItem[];
  timestamp: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    complement?: string;
  };
}

export default function CommandeConfirmeePage() {
  const [orderData, setOrderData] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données de la commande depuis localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        setOrderData(order);
        // Nettoyer le localStorage après utilisation
        localStorage.removeItem('lastOrder');
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des détails de la commande...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Aucune commande trouvée
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Il semble qu'aucune commande récente n'ait été trouvée.
          </p>
          <Link
            href="/commander"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Passer une commande
          </Link>
        </div>
      </div>
    );
  }
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
                <span className="font-bold text-gray-900 dark:text-white">
                  #{orderData.orderId.slice(-8)}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Heure de commande</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {new Date(orderData.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Nombre d'articles</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {orderData.items.length} article{orderData.items.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-bold text-green-600 text-xl">
                  {orderData.total.toFixed(2)} €
                </span>
              </div>
            </div>
          </motion.div>

          {/* Articles commandés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Articles commandés
            </h3>
            
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Quantité: {item.quantity} × {item.price.toFixed(2)} €
                    </div>
                    {item.options && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {item.options.customIngredients ? 'Produit personnalisé' : 'Avec options'}
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {(item.quantity * item.price).toFixed(2)} €
                  </div>
                </div>
              ))}
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
                  Adresse de livraison : {orderData.deliveryAddress.street}, {orderData.deliveryAddress.city} {orderData.deliveryAddress.postalCode}
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
