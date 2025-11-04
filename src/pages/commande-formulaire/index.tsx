import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { CustomerData } from '@/hooks/useCustomerData';
import MainHeader from '@/components/layout/MainHeader';
import Cart from '@/components/cart/Cart';
import AccountCreationModal from '@/components/checkout/AccountCreationModal';
import { ShoppingCart, ArrowLeft, Clock, MapPin, User, Phone, CreditCard, Banknote, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';

export default function CommandeFormulairePage() {
  const router = useRouter();
  const { items, total, clearCart, promotionDiscount, promotionDescription } = useCart();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  
  // Calculer le total final avec promotion
  const finalTotal = total - promotionDiscount;

  // Charger les données client depuis localStorage
  useEffect(() => {
    const savedCustomerData = localStorage.getItem('customerData');
    if (savedCustomerData) {
      setCustomerData(JSON.parse(savedCustomerData));
    } else {
      // Rediriger vers checkout si pas de données client
      router.push('/checkout');
    }

    // Charger le type de commande depuis localStorage
    const savedOrderType = localStorage.getItem('orderType');
    if (savedOrderType === 'pickup' || savedOrderType === 'delivery') {
      setOrderType(savedOrderType);
    }
  }, [router]);

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

  const handleFinalizeOrder = async () => {
    if (!customerData) return;

    setIsLoading(true);
    
    try {
      // Préparer les données de la commande
      const orderData = {
        customer: customerData,
        items: items.map(item => ({
          productId: item._id || 'custom-product',
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          options: item.options || [],
          customIngredients: item.config || item.customIngredients || null
        })),
        total: finalTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Envoyer la commande à l'API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Sauvegarder le résumé de la commande
        localStorage.setItem('orderSummary', JSON.stringify({
          orderId: result._id,
          total: finalTotal,
          promotionDiscount,
          promotionDescription,
          items: items,
          customer: customerData,
          timestamp: new Date().toISOString()
        }));

        // Vider le panier
        clearCart();
        
        // Nettoyer les données temporaires
        localStorage.removeItem('customerData');
        
        // Rediriger vers la page de confirmation
        router.push('/commande-confirmee');
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la commande: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCustomerData = () => {
    router.push('/checkout');
  };

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

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
            Finaliser votre commande
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Vérifiez vos informations et confirmez votre commande
          </p>
        </div>

        {/* Bandeau d'incitation à créer un compte */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Informations de livraison confirmées
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vos données sont sauvegardées pour les prochaines commandes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAccountModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Créer un compte gratuit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de livraison */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Informations de livraison
                </h2>
                <button
                  onClick={handleEditCustomerData}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Modifier
                </button>
              </div>

              <div className="space-y-4">
                {/* Nom */}
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customerData.name}</p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customerData.phone}</p>
                  </div>
                </div>

                {/* Adresse ou mode de commande */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {orderType === 'pickup' ? 'Mode de commande' : 'Adresse'}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {orderType === 'pickup' ? 'À emporter' : customerData.address}
                    </p>
                  </div>
                </div>

                {/* Mode de paiement */}
                <div className="flex items-center">
                  {customerData.paymentMethod === 'card' ? (
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  ) : (
                    <Banknote className="w-5 h-5 text-gray-400 mr-3" />
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Paiement</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {customerData.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
                    </p>
                  </div>
                </div>

                {/* Instructions de livraison */}
                {customerData.deliveryInstructions && (
                  <div className="flex items-start">
                    <MessageSquare className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instructions</p>
                      <p className="font-medium text-gray-900 dark:text-white">{customerData.deliveryInstructions}</p>
                    </div>
                  </div>
                )}

                {/* Message de paiement selon le type de commande */}
                <div className={`mt-4 p-4 rounded-lg ${
                  orderType === 'pickup' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                    : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                }`}>
                  <div className="flex items-start">
                    <CreditCard className={`w-5 h-5 mr-3 mt-0.5 ${
                      orderType === 'pickup' ? 'text-blue-600' : 'text-amber-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        orderType === 'pickup' 
                          ? 'text-blue-900 dark:text-blue-100' 
                          : 'text-amber-900 dark:text-amber-100'
                      }`}>
                        {orderType === 'pickup' 
                          ? '💳 Paiement sur place' 
                          : '💳 Paiement auprès du livreur'}
                      </p>
                      <p className={`text-xs mt-1 ${
                        orderType === 'pickup' 
                          ? 'text-blue-700 dark:text-blue-200' 
                          : 'text-amber-700 dark:text-amber-200'
                      }`}>
                        {orderType === 'pickup' 
                          ? 'Le paiement se fera directement sur place lors de la récupération de votre commande.'
                          : 'Le paiement se fera directement auprès du livreur lors de la livraison.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24 max-h-[calc(100vh-6rem)] flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Résumé de la commande
              </h3>

              {/* Articles - Scrollable */}
              <div className="space-y-3 mb-6 overflow-y-auto flex-1 pr-2">
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
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 flex-shrink-0">
                {/* Total */}
                {/* Promotion */}
                {promotionDiscount > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-600 mb-2">
                      <span>Remise ({promotionDescription})</span>
                      <span>-{promotionDiscount.toFixed(2)}€</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)}€</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Livraison incluse
                </p>
                {/* Bouton de confirmation */}
                <div className="mt-6">
                <Button
                  onClick={handleFinalizeOrder}
                  fullWidth
                  className="bg-red-600 hover:bg-red-700 text-white"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Traitement en cours...' : 'Confirmer la commande'}
                </Button>
              </div>
              </div>
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
