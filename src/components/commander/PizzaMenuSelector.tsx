import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface PizzaMenuSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  menu: any;
  pizzas?: any[];
  drinks?: any[];
}

export default function PizzaMenuSelector({ isOpen, onClose, menu, pizzas: pizzasProp = [], drinks: drinksProp = [] }: PizzaMenuSelectorProps) {
  const { addItem } = useCart();
  const [step, setStep] = useState(1);
  const [selectedPizzas, setSelectedPizzas] = useState<{ id: string; name: string; quantity: number }[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<{ id: string; name: string; quantity: number }[]>([]);
  const [selectedPetiteFaim, setSelectedPetiteFaim] = useState<string>('');
  const [menuQuantity, setMenuQuantity] = useState(1);
  const [pizzas, setPizzas] = useState<any[]>(pizzasProp);
  const [drinks, setDrinks] = useState<any[]>(drinksProp);

  const totalSteps = menu.id === 'menu-couple' ? 3 : 2;

  useEffect(() => {
    if (isOpen && pizzasProp.length > 0) {
      setPizzas(pizzasProp);
    }
    if (isOpen && drinksProp.length > 0) {
      setDrinks(drinksProp);
    }
  }, [isOpen, pizzasProp, drinksProp]);

  const resetForm = () => {
    setStep(1);
    setSelectedPizzas([]);
    setSelectedDrinks([]);
    setSelectedPetiteFaim('');
    setMenuQuantity(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addPizza = (pizza: any) => {
    const currentTotal = selectedPizzas.reduce((sum, p) => sum + p.quantity, 0);
    const maxPizzas = menu.pizzaCount || 1;

    if (currentTotal >= maxPizzas) {
      return; // Limite atteinte
    }

    setSelectedPizzas(prev => {
      const existing = prev.find(p => p.id === pizza._id);
      if (existing) {
        return prev.map(p => 
          p.id === pizza._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { id: pizza._id, name: pizza.name, quantity: 1 }];
    });
  };

  const removePizza = (pizzaId: string) => {
    setSelectedPizzas(prev => {
      const existing = prev.find(p => p.id === pizzaId);
      if (existing && existing.quantity > 1) {
        return prev.map(p => 
          p.id === pizzaId ? { ...p, quantity: p.quantity - 1 } : p
        );
      }
      return prev.filter(p => p.id !== pizzaId);
    });
  };

  const addDrink = (drink: any) => {
    const currentTotal = selectedDrinks.reduce((sum, d) => sum + d.quantity, 0);
    const maxDrinks = menu.drinkCount || 0;

    if (maxDrinks > 0 && currentTotal >= maxDrinks) {
      return;
    }

    setSelectedDrinks(prev => {
      const existing = prev.find(d => d.id === drink._id);
      if (existing) {
        return prev.map(d => 
          d.id === drink._id ? { ...d, quantity: d.quantity + 1 } : d
        );
      }
      return [...prev, { id: drink._id, name: drink.name, quantity: 1 }];
    });
  };

  const removeDrink = (drinkId: string) => {
    setSelectedDrinks(prev => {
      const existing = prev.find(d => d.id === drinkId);
      if (existing && existing.quantity > 1) {
        return prev.map(d => 
          d.id === drinkId ? { ...d, quantity: d.quantity - 1 } : d
        );
      }
      return prev.filter(d => d.id !== drinkId);
    });
  };

  const canGoNext = () => {
    if (step === 1) {
      const totalPizzas = selectedPizzas.reduce((sum, p) => sum + p.quantity, 0);
      return totalPizzas >= (menu.pizzaCount || 1);
    }
    if (step === 2) {
      const totalDrinks = selectedDrinks.reduce((sum, d) => sum + d.quantity, 0);
      return totalDrinks >= (menu.drinkCount || 0) || menu.drinkCount === 0;
    }
    return true;
  };

  const handleAddToCart = () => {
    const config: any = {
      pizzas: selectedPizzas,
      quantity: menuQuantity
    };

    if (selectedDrinks.length > 0) {
      config.drinks = selectedDrinks;
    }

    if (selectedPetiteFaim) {
      config.petiteFaim = selectedPetiteFaim;
    }

    const cartItem = {
      _id: `pizza-menu-${menu.id}-${Date.now()}`,
      name: menu.name,
      price: menu.price * menuQuantity,
      image: menu.image,
      category: 'pizza-menu',
      type: 'food' as const,
      config
    };

    addItem(cartItem);
    handleClose();
  };

  if (!isOpen) return null;

  const filteredDrinks = drinks.filter(drink => {
    if (!menu.drinkSize) return true;
    const drinkName = drink.name.toLowerCase();
    const size = menu.drinkSize.toLowerCase();
    if (size.includes('1.5')) {
      return drinkName.includes('1.5') || drinkName.includes('1,5');
    } else if (size.includes('33')) {
      return drinkName.includes('33cl');
    }
    return true;
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{menu.name}</h2>
                <p className="text-sm text-gray-600">{menu.description}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-red-600' : 'bg-gray-200'}`} />
                <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`} />
                {totalSteps === 3 && (
                  <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-red-600' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">
                Étape {step} sur {totalSteps}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Étape 1: Pizzas */}
            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Choisissez vos pizzas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pizzas.map((pizza: any) => {
                    const selected = selectedPizzas.find(p => p.id === pizza._id);
                    const totalSelected = selectedPizzas.reduce((sum, p) => sum + p.quantity, 0);
                    const isMaxReached = totalSelected >= (menu.pizzaCount || 1);
                    
                    return (
                      <button
                        key={pizza._id}
                        onClick={() => !isMaxReached && addPizza(pizza)}
                        disabled={isMaxReached && !selected}
                        className={`p-3 border-2 rounded-lg flex items-start space-x-3 text-left transition-all ${
                          selected
                            ? 'border-red-600 bg-red-50'
                            : isMaxReached
                            ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                            : 'border-gray-300 hover:border-red-300'
                        }`}
                      >
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={pizza.image || '/images/placeholder-food.jpg'}
                            alt={pizza.name}
                            width={80}
                            height={80}
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 mb-1">{pizza.name}</div>
                          {pizza.baseIngredients && (
                            <div className="text-xs text-gray-500">{pizza.baseIngredients.join(', ')}</div>
                          )}
                        </div>
                        {selected && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removePizza(pizza._id);
                              }}
                              className="w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-lg">{selected.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addPizza(pizza);
                              }}
                              className="w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    {selectedPizzas.reduce((sum, p) => sum + p.quantity, 0)} / {menu.pizzaCount} pizzas sélectionnées
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2: Boissons */}
            {step === 2 && menu.drinkCount > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Choisissez vos boissons
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredDrinks.map((drink) => {
                    const selected = selectedDrinks.find(d => d.id === drink._id);
                    const totalSelected = selectedDrinks.reduce((sum, d) => sum + d.quantity, 0);
                    const isMaxReached = totalSelected >= (menu.drinkCount || 0);
                    
                    return (
                      <button
                        key={drink._id}
                        onClick={() => !isMaxReached && addDrink(drink)}
                        disabled={isMaxReached && !selected}
                        className={`p-3 border-2 rounded-lg flex items-center space-x-2 text-left transition-all ${
                          selected
                            ? 'border-red-600 bg-red-50'
                            : isMaxReached
                            ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                            : 'border-gray-300 hover:border-red-300'
                        }`}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={drink.image || '/images/placeholder-drink.jpg'}
                            alt={drink.name}
                            width={48}
                            height={48}
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{drink.name}</div>
                        </div>
                        {selected && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDrink(drink._id);
                              }}
                              className="w-5 h-5 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
                            >
                              <Minus className="w-2 h-2" />
                            </button>
                            <span className="font-bold text-sm">{selected.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addDrink(drink);
                              }}
                              className="w-5 h-5 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
                            >
                              <Plus className="w-2 h-2" />
                            </button>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    {selectedDrinks.reduce((sum, d) => sum + d.quantity, 0)} / {menu.drinkCount} boisson(s) sélectionnée(s)
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3: Nuggets/Wings (menu couple) */}
            {step === 3 && menu.id === 'menu-couple' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Choisissez 6 Nuggets ou Wings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedPetiteFaim('nuggets')}
                    className={`p-6 border-2 rounded-lg text-center transition-all ${
                      selectedPetiteFaim === 'nuggets'
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    <div className="text-5xl mb-2">🍗</div>
                    <div className="font-semibold">Nuggets</div>
                  </button>
                  <button
                    onClick={() => setSelectedPetiteFaim('wings')}
                    className={`p-6 border-2 rounded-lg text-center transition-all ${
                      selectedPetiteFaim === 'wings'
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    <div className="text-5xl mb-2">🍗</div>
                    <div className="font-semibold">Hot Wings</div>
                  </button>
                </div>
                
                {/* Brownie inclus */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🍫</div>
                    <div className="font-semibold text-gray-700">2 Brownies Inclus</div>
                    <div className="text-sm text-gray-500">Offert dans ce menu</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold text-red-600">
                  {(menu.price * menuQuantity).toFixed(2)} €
                </div>
              </div>
              
              {step === totalSteps ? (
                <button
                  onClick={handleAddToCart}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <span>Ajouter au panier</span>
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Précédent</span>
                    </button>
                  )}
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canGoNext()}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Quantité */}
            {step === totalSteps && (
              <div className="flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-600">Quantité :</span>
                <button
                  onClick={() => setMenuQuantity(Math.max(1, menuQuantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{menuQuantity}</span>
                <button
                  onClick={() => setMenuQuantity(menuQuantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
