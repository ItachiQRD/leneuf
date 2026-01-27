import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, Trash2, UserPlus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import OrderTypeModal from '@/components/checkout/OrderTypeModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Fermer le panier d'abord
    onClose();
    // Afficher le modal pour choisir le type de commande après un court délai
    setTimeout(() => {
      setShowOrderTypeModal(true);
    }, 300);
  };

  const handleOrderTypeSelect = (type: 'delivery' | 'pickup') => {
    // Sauvegarder le type de commande dans localStorage
    localStorage.setItem('orderType', type);
    // Rediriger vers la page de checkout
    window.location.href = '/checkout';
  };

  return (
    <>
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Panier
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Fermer</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {!items || items.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                              Votre panier est vide
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {items.map((item) => (
                                <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image
                                      src={item.image || '/images/placeholder-food.svg'}
                                      alt={item.name}
                                      fill
                                      className="object-cover rounded"
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
                                            <div className="text-xs">
                                              {details.slice(0, 2).join(', ')}
                                              {details.length > 2 && ` +${details.length - 2} autres`}
                                            </div>
                                          ) : null;
                                        })()}
                                      </div>
                                    )}
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {(item.price * item.quantity).toFixed(2)} €
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => removeItem(item._id)}
                                      className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-400"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <p>Total ({itemCount} article{itemCount > 1 ? 's' : ''})</p>
                        <p>{total.toFixed(2)} €</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Livraison calculée à la commande.
                      </p>
                      {/* Message d'incitation à créer un compte */}
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start">
                          <UserPlus className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                              <strong>Créez un compte gratuit</strong> pour des commandes plus rapides et des offres exclusives !
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                <button
                  className="w-full rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 disabled:bg-gray-400"
                  onClick={handleCheckout}
                  disabled={!items || items.length === 0}
                >
                  Commander
                </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          ou{' '}
                          <Link
                            href="/commander"
                            className="font-medium text-red-600 hover:text-red-700"
                            onClick={onClose}
                          >
                            Continuer mes achats
                            <span aria-hidden="true"> &rarr;</span>
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>

    {/* Modal de sélection du type de commande - en dehors du Transition du panier */}
    <OrderTypeModal
      isOpen={showOrderTypeModal}
      onClose={() => setShowOrderTypeModal(false)}
      onSelect={handleOrderTypeSelect}
    />
  </>
  );
}
