import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface PizzaMenuSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  menu: any;
  pizzas?: any[];
  drinks?: any[];
}

interface Pizza {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface Drink {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface PetiteFaimItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface Dessert {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export default function PizzaMenuSelector({ isOpen, onClose, menu, pizzas: pizzasProp = [], drinks: drinksProp = [] }: PizzaMenuSelectorProps) {
  const { addItem } = useCart();
  const [currentStep, setCurrentStep] = useState<'pizzas' | 'drinks' | 'petite-faim' | 'desserts'>('pizzas');
  const [selectedPizzas, setSelectedPizzas] = useState<{ pizza: Pizza; quantity: number }[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<{ drink: Drink; quantity: number }[]>([]);
  const [selectedPetiteFaim, setSelectedPetiteFaim] = useState<PetiteFaimItem | null>(null);
  const [selectedDesserts, setSelectedDesserts] = useState<{ dessert: Dessert; quantity: number }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [pizzas, setPizzas] = useState<Pizza[]>(pizzasProp);
  const [drinks, setDrinks] = useState<Drink[]>(drinksProp);
  const [petiteFaimItems, setPetiteFaimItems] = useState<PetiteFaimItem[]>([]);
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState(false);
  
  console.log('Pizzas prop:', pizzasProp);
  console.log('Drinks prop:', drinksProp);
  console.log('Current drinks state:', drinks);

  useEffect(() => {
    if (isOpen) {
      // Si pizzas et drinks sont passées en props, on les utilise directement
      if (pizzasProp.length > 0) {
        setPizzas(pizzasProp);
      }
      if (drinksProp.length > 0) {
        setDrinks(drinksProp);
      }
      fetchPetiteFaimAndDesserts();
    }
  }, [isOpen, pizzasProp, drinksProp]);

  const fetchPetiteFaimAndDesserts = () => {
    setLoading(true);
    try {
      // Petite faim statique (images dans /images/menu)
      const petiteFaimItems = [
        {
          _id: 'nuggets-menu',
          name: 'Nuggets',
          price: 0,
          image: '/images/menu/nuggets.jpg'
        },
        {
          _id: 'wings-menu',
          name: 'Hot Wings',
          price: 0,
          image: '/images/menu/wings.jpg'
        }
      ];
      setPetiteFaimItems(petiteFaimItems);

      // Récupérer les desserts (pour brownie)
      fetch('/api/products/by-category/desserts')
        .then(res => res.json())
        .then(dessertsData => {
          if (dessertsData.success) {
            setDesserts(dessertsData.products);
          }
        })
        .catch(error => console.error('Error fetching desserts:', error))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error('Error setting petite faim items:', error);
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    let totalPrice = menu.price;
    return totalPrice * quantity;
  };

  const handleAddToCart = () => {
    // Créer un objet de configuration pour le menu
    const config: any = {
      pizzas: selectedPizzas,
      quantity
    };

    if (selectedDrinks.length > 0) {
      config.drinks = selectedDrinks;
    }

    if (selectedPetiteFaim) {
      config.petiteFaim = selectedPetiteFaim;
    }

    if (selectedDesserts.length > 0) {
      config.desserts = selectedDesserts;
    }

    const cartItem = {
      _id: `pizza-menu-${menu.id}-${Date.now()}`,
      name: menu.name,
      price: calculatePrice(),
      image: menu.image,
      category: 'pizza-menu',
      type: 'food' as const,
      config
    };

    addItem(cartItem);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedPizzas([]);
    setSelectedDrinks([]);
    setSelectedPetiteFaim(null);
    setSelectedDesserts([]);
    setQuantity(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePizzaQuantity = (pizza: Pizza, delta: number) => {
    setSelectedPizzas(prev => {
      const existing = prev.find(p => p.pizza._id === pizza._id);
      const currentTotal = prev.reduce((sum, p) => sum + p.quantity, 0);
      const requiredPizzas = menu.pizzaCount || 1;
      
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta);
        if (newQuantity === 0) {
          return prev.filter(p => p.pizza._id !== pizza._id);
        }
        return prev.map(p => 
          p.pizza._id === pizza._id ? { ...p, quantity: newQuantity } : p
        );
      } else if (delta > 0) {
        // Empêcher d'ajouter une nouvelle pizza si on a déjà atteint le maximum
        if (currentTotal >= requiredPizzas) {
          return prev;
        }
        return [...prev, { pizza, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleDrinkQuantity = (drink: Drink, delta: number) => {
    setSelectedDrinks(prev => {
      const existing = prev.find(d => d.drink._id === drink._id);
      const currentTotal = prev.reduce((sum, d) => sum + d.quantity, 0);
      const requiredDrinks = menu.drinkCount || 0;
      
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta);
        if (newQuantity === 0) {
          return prev.filter(d => d.drink._id !== drink._id);
        }
        return prev.map(d => 
          d.drink._id === drink._id ? { ...d, quantity: newQuantity } : d
        );
      } else if (delta > 0) {
        // Empêcher d'ajouter une nouvelle boisson si on a déjà atteint le maximum
        if (currentTotal >= requiredDrinks) {
          return prev;
        }
        return [...prev, { drink, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleDessertQuantity = (dessert: Dessert, delta: number) => {
    setSelectedDesserts(prev => {
      const existing = prev.find(d => d.dessert._id === dessert._id);
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta);
        if (newQuantity === 0) {
          return prev.filter(d => d.dessert._id !== dessert._id);
        }
        return prev.map(d => 
          d.dessert._id === dessert._id ? { ...d, quantity: newQuantity } : d
        );
      } else if (delta > 0) {
        return [...prev, { dessert, quantity: 1 }];
      }
      return prev;
    });
  };

  const getPizzaQuantity = (pizzaId: string) => {
    const found = selectedPizzas.find(p => p.pizza._id === pizzaId);
    return found ? found.quantity : 0;
  };

  const getDrinkQuantity = (drinkId: string) => {
    const found = selectedDrinks.find(d => d.drink._id === drinkId);
    return found ? found.quantity : 0;
  };

  const getDessertQuantity = (dessertId: string) => {
    const found = selectedDesserts.find(d => d.dessert._id === dessertId);
    return found ? found.quantity : 0;
  };

  // Vérifier si tous les éléments requis sont sélectionnés
  const canAddToCart = () => {
    // Vérifier le nombre de pizzas selon le menu
    const totalPizzaQuantity = selectedPizzas.reduce((sum, p) => sum + p.quantity, 0);
    const requiredPizzas = menu.pizzaCount || 1;
    
    if (totalPizzaQuantity < requiredPizzas) return false;

    // Vérifier les boissons si nécessaire
    const totalDrinkQuantity = selectedDrinks.reduce((sum, d) => sum + d.quantity, 0);
    const requiredDrinks = menu.drinkCount || 0;
    
    if (requiredDrinks > 0 && totalDrinkQuantity < requiredDrinks) return false;

    // Vérifier nuggets/wings pour le menu couple
    if (menu.id === 'menu-couple' && !selectedPetiteFaim) return false;

    return true;
  };


  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isOpen) return null;

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
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

          {/* Content - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Étape 1: Pizzas */}
                {currentStep === 'pizzas' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      🍕 Choisissez vos pizzas
                    </h3>
                  <div className="space-y-2">
                    {pizzas.map((pizza: any) => {
                      const qty = getPizzaQuantity(pizza._id);
                      return (
                        <div
                          key={pizza._id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                            qty > 0
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={pizza.image || '/images/placeholder-food.jpg'}
                              alt={pizza.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900">{pizza.name}</h4>
                            {pizza.baseIngredients && (
                              <p className="text-xs text-gray-500 mt-1">
                                {pizza.baseIngredients.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handlePizzaQuantity(pizza, -1)}
                              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{qty}</span>
                            <button
                              onClick={() => handlePizzaQuantity(pizza, 1)}
                              className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                )}

                {/* Étape 2: Boissons */}
                {currentStep === 'drinks' && menu.drinkCount > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      🥤 Choisissez vos boissons
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {drinks.filter(drink => {
                        if (menu.drinkSize) {
                          const drinkName = drink.name.toLowerCase();
                          const size = menu.drinkSize.toLowerCase();
                          if (size.includes('1.5l') || size.includes('1,5l') || size.includes('1.5L') || size.includes('1,5L')) {
                            return drinkName.includes('1.5') || drinkName.includes('1,5');
                          } else if (size.includes('33cl')) {
                            return drinkName.includes('33cl');
                          }
                        }
                        return true;
                      }).map((drink) => {
                        const qty = getDrinkQuantity(drink._id);
                        return (
                          <button
                            key={drink._id}
                            onClick={() => handleDrinkQuantity(drink, 1)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                              qty > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="relative w-14 h-14 flex-shrink-0">
                              <Image
                                src={drink.image || '/images/placeholder-drink.jpg'}
                                alt={drink.name}
                                fill
                                className="object-contain rounded"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">{drink.name}</div>
                            </div>
                            {qty > 0 && (
                              <span className="w-8 text-center font-bold text-lg">{qty}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    </div>
                  </div>
                )}

                {/* Étape 3: Nuggets/Wings pour menu couple */}
                {currentStep === 'petite-faim' && menu.id === 'menu-couple' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choisissez 6 Nuggets ou Wings
                    </h3>
                    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
                      {petiteFaimItems
                        .filter(item => item.name.toLowerCase().includes('nugget') || item.name.toLowerCase().includes('hot wing') || item.name.toLowerCase().includes('wing'))
                        .map((item) => (
                          <button
                            key={item._id}
                            onClick={() => setSelectedPetiteFaim(item)}
                            className={`p-4 border-2 rounded-lg text-center ${
                              selectedPetiteFaim?._id === item._id
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="relative w-16 h-16 mx-auto mb-2">
                              <Image
                                src={item.image || '/images/placeholder-food.jpg'}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="font-medium text-sm">{item.name}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Affichage brownies inclus pour menu couple */}
                {menu.id === 'menu-couple' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      2 Brownies Inclus
                    </h3>
                    <div className="flex justify-center">
                      <div className="text-center">
                        {desserts.filter(dessert => dessert.name.toLowerCase().includes('brownie')).map((dessert) => (
                          <div key={dessert._id}>
                            <div className="relative w-24 h-24 mx-auto mb-2">
                              <Image
                                src={dessert.image || '/images/placeholder-food.jpg'}
                                alt={dessert.name}
                                width={96}
                                height={96}
                                className="object-cover"
                              />
                            </div>
                            <div className="text-gray-700 font-medium">{dessert.name}</div>
                            <div className="text-sm text-gray-500">Inclus</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantité */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantité</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Always visible */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
            <button
              onClick={() => {
                if (currentStep === 'drinks') setCurrentStep('pizzas');
                else if (currentStep === 'petite-faim') setCurrentStep('drinks');
              }}
              disabled={currentStep === 'pizzas'}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            
            <div>
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-red-600">
                {calculatePrice().toFixed(2)} €
              </div>
            </div>
            
            {currentStep === 'pizzas' || (currentStep === 'drinks' && menu.id === 'menu-couple') ? (
              <button
                onClick={() => {
                  if (currentStep === 'pizzas') setCurrentStep('drinks');
                  else if (currentStep === 'drinks' && menu.id === 'menu-couple') setCurrentStep('petite-faim');
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Ajouter au panier
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

