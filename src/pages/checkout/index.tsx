import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { useCustomerData, CustomerData } from '@/hooks/useCustomerData';
import MainHeader from '@/components/layout/MainHeader';
import Cart from '@/components/cart/Cart';
import DeliveryForm from '@/components/checkout/DeliveryForm';
import AccountCreationModal from '@/components/checkout/AccountCreationModal';
import PromotionSelector from '@/components/checkout/PromotionSelector';
import { ShoppingCart, ArrowLeft, Clock, MapPin, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, promotionDiscount, promotionDescription } = useCart();
  const { customerData } = useCustomerData();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

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


  const handleOrderSubmit = async (data: CustomerData) => {
    // Sauvegarder les données client et rediriger vers la page de formulaire
    localStorage.setItem('customerData', JSON.stringify(data));
    router.push('/commande-formulaire');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de livraison */}
          <div className="lg:col-span-2">
            <DeliveryForm 
              onSubmit={handleOrderSubmit}
              isLoading={isLoading}
              onShowAccountModal={() => setShowAccountModal(true)}
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
                        src={item.image || '/images/placeholder-food.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
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
                    Livraison à :
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {customerData.address}
                    </div>
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
