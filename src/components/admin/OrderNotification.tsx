import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Bell, X, ShoppingCart, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

interface OrderNotificationProps {
  isOpen: boolean;
  order: any;
  onClose: () => void;
  onViewOrder: () => void;
}

export default function OrderNotification({ isOpen, order, onClose, onViewOrder }: OrderNotificationProps) {
  const router = useRouter();

  // Jouer un son de notification
  useEffect(() => {
    if (isOpen && order) {
      try {
        const audio = new Audio('/meteor-samsung.mp3');
        audio.volume = 0.5;
        audio.play().catch(error => {
          console.error('Erreur lors de la lecture du son:', error);
        });
      } catch (error) {
        console.error('Erreur lors de la lecture du son:', error);
      }
    }
  }, [isOpen, order]);

  if (!order) return null;

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  const getOrderType = () => {
    // Vérifier si c'est une commande à emporter ou en livraison
    // On peut utiliser orderType si disponible ou checker l'adresse
    if (order.orderType === 'pickup') {
      return 'À emporter';
    }
    return 'En livraison';
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[100]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-4"
                >
                  <Bell className="w-8 h-8 text-white animate-pulse" />
                </motion.div>

                <div className="text-center mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Nouvelle commande !
                  </Dialog.Title>
                  <p className="text-gray-600 dark:text-gray-400">
                    Une nouvelle commande vient d'être passée
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
                  {/* Informations client */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.customer?.name || 'Client'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items?.length || 0} article{order.items?.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {formatPrice(order.total || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Type de commande */}
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {getOrderType()}
                    </span>
                  </div>

                  {/* Adresse si livraison */}
                  {order.customer?.address && order.orderType !== 'pickup' && (
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {order.customer.address}
                      </span>
                    </div>
                  )}

                  {/* Téléphone */}
                  {order.customer?.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {order.customer.phone}
                      </span>
                    </div>
                  )}

                  {/* Heure */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Plus tard
                  </button>
                  <button
                    onClick={() => {
                      onViewOrder();
                      onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center"
                  >
                    Voir la commande
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

