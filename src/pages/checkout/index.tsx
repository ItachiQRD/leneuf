import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { useCustomerData, CustomerData } from '@/hooks/useCustomerData';
import MainHeader from '@/components/layout/MainHeader';
import Cart from '@/components/cart/Cart';
import DeliveryForm from '@/components/checkout/DeliveryForm';
import AccountCreationModal from '@/components/checkout/AccountCreationModal';
import PromotionSelector from '@/components/checkout/PromotionSelector';
import { ShoppingCart, ArrowLeft, Clock, MapPin, UserPlus, Gift, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, promotionDiscount, promotionDescription, applyPromotion, removePromotion } = useCart();
  const { customerData } = useCustomerData();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  // Charger le type de commande depuis localStorage
  useEffect(() => {
    const savedOrderType = localStorage.getItem('orderType');
    if (savedOrderType === 'pickup' || savedOrderType === 'delivery') {
      setOrderType(savedOrderType);
    }
  }, []);

  // Afficher le popup de confirmation de promotion quand une promotion est appliquée
  useEffect(() => {
    if (promotionDiscount > 0) {
      setShowPromotionModal(true);
    }
  }, [promotionDiscount]);

  // Rediriger si le panier est vide
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MainHeader onOpenCart={() => setIsCartOpen(true)} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Panier vide
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ajoutez des articles à votre panier avant de passer commande
            </p>
            <button
              onClick={() => router.push('/commander')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Voir le menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePromotionApplied = (discount: number, description: string) => {
    applyPromotion(discount, description);
  };

  const handlePromotionRemoved = () => {
    removePromotion();
  };

  const handleOrderSubmit = async (data: CustomerData) => {
    // Sauvegarder les données client et rediriger vers la page de formulaire
    localStorage.setItem('customerData', JSON.stringify(data));
    router.push('/commande-formulaire');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Popup plein écran : confirmation de la promotion */}
      <Transition show={showPromotionModal && promotionDiscount > 0} as={Fragment}>
        <Dialog onClose={() => setShowPromotionModal(false)} className="relative z-[100]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl transition-all border border-amber-200/50 dark:border-amber-500/30">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6"
                  >
                    <Gift className="w-10 h-10 text-white" />
                  </motion.div>
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Promotion appliquée
                  </Dialog.Title>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {promotionDescription}
                  </p>
                  <div className="w-full space-y-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4 mb-6">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Remise</span>
                      <span className="font-bold text-green-600 dark:text-green-400">-{promotionDiscount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-amber-200 dark:border-amber-700">
                      <span>Total après remise</span>
                      <span>{(total - promotionDiscount).toFixed(2)} €</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Cette remise sera bien déduite de votre commande.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPromotionModal(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all"
                  >
                    <CheckCircle className="w-5 h-5" />
                    J&apos;ai compris, continuer
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <MainHeader onOpenCart={() => setIsCartOpen(true)} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Finaliser la commande
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Vérifiez vos informations et confirmez votre commande
          </p>
        </div>

        {/* Bandeau d'incitation à créer un compte */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserPlus className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Créez un compte gratuitement
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Commandes plus rapides, offres exclusives et suivi en temps réel
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAccountModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Découvrir les avantages
            </button>
          </div>
        </div>

        {/* Sélecteur de promotions */}
        <PromotionSelector
          items={items}
          onPromotionApplied={handlePromotionApplied}
          onPromotionRemoved={handlePromotionRemoved}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de livraison */}
          <div className="lg:col-span-2">
            <DeliveryForm 
              onSubmit={handleOrderSubmit}
              isLoading={isLoading}
              onShowAccountModal={() => setShowAccountModal(true)}
              orderType={orderType}
            />
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Résumé de la commande
              </h3>

              {/* Articles */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <img
                        src={item.image || '/images/placeholder-food.svg'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      {/* Afficher les détails du menu pizza si config existe */}
                      {(item.config || item.customIngredients?.menuId) && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
                          {(() => {
                            const config = item.config || item.customIngredients;
                            if (!config) return null;
                            
                            const details: string[] = [];
                            
                            // Pizzas
                            if (config.pizzas && config.pizzas.length > 0) {
                              config.pizzas.forEach((pizza: any) => {
                                details.push(`${pizza.quantity}x ${pizza.name}`);
                              });
                            }
                            
                            // Boissons
                            if (config.drinks && config.drinks.length > 0) {
                              config.drinks.forEach((drink: any) => {
                                details.push(`${drink.quantity}x ${drink.name}`);
                              });
                            }
                            
                            // Nuggets/Wings
                            if (config.petiteFaim) {
                              details.push(`6x ${config.petiteFaim.name}`);
                            }
                            
                            // Brownies
                            if (config.brownies) {
                              details.push(`${config.brownies.quantity}x ${config.brownies.name} (inclus)`);
                            }
                            
                            return details.length > 0 ? (
                              details.map((detail, idx) => (
                                <div key={idx} className="text-xs">• {detail}</div>
                              ))
                            ) : null;
                          })()}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.quantity} × {item.price.toFixed(2)}€
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>

              {/* Promotion appliquée */}
              {promotionDiscount > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                    <span className="text-sm font-medium">{promotionDescription}</span>
                    <span className="text-sm font-bold">-{promotionDiscount.toFixed(2)}€</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{(total - promotionDiscount).toFixed(2)}€</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Livraison incluse
                </p>
              </div>

              {/* Informations de livraison */}
              {customerData.name && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {orderType === 'pickup' ? 'Mode de commande' : 'Livraison à :'}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {orderType === 'pickup' ? (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        À emporter
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {customerData.address}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {customerData.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Account Creation Modal */}
      <AccountCreationModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSkip={() => setShowAccountModal(false)}
      />
    </div>
  );
}
