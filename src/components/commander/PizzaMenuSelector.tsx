import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  baseIngredients?: string[];
}

interface Drink {
  _id: string;
  name: string;
  price: number;
  image?: string;
  sizes?: Array<{
    name: string;
    price: number;
    volume: string;
  }>;
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
  const [currentStep, setCurrentStep] = useState<'pizzas' | 'drinks' | 'petite-faim' | 'summary'>('pizzas');
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

  const resetForm = () => {
    setSelectedPizzas([]);
    setSelectedDrinks([]);
    setSelectedPetiteFaim(null);
    setSelectedDesserts([]);
    setQuantity(1);
  };

  useEffect(() => {
    if (isOpen) {
      // Réinitialiser à la première étape quand on ouvre le modal
      setCurrentStep('pizzas');
      // Réinitialiser le formulaire
      resetForm();
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
      // Petite faim statique (images dans /images/ptite-faim)
      const petiteFaimItems = [
        {
          _id: 'nuggets-menu',
          name: 'Nuggets',
          price: 0,
          image: '/images/ptite-faim/3-nuggets.jpeg'
        },
        {
          _id: 'wings-menu',
          name: 'Hot Wings',
          price: 0,
          image: '/images/ptite-faim/3-hot-wings.jpeg'
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
    // Créer un objet de configuration détaillé pour le menu
    const config: any = {
      menuId: menu.id,
      menuName: menu.name,
      pizzas: selectedPizzas.map(({ pizza, quantity }) => ({
        _id: pizza._id,
        name: pizza.name,
        image: pizza.image,
        price: pizza.price,
        quantity
      })),
      drinks: selectedDrinks.map(({ drink, quantity }) => ({
        _id: drink._id,
        name: drink.name,
        image: drink.image,
        price: drink.price,
        quantity
      })),
      quantity
    };

    // Ajouter nuggets/wings si présents
    if (selectedPetiteFaim) {
      config.petiteFaim = {
        _id: selectedPetiteFaim._id,
        name: selectedPetiteFaim.name,
        image: selectedPetiteFaim.image,
        quantity: 6
      };
    }

    // Ajouter brownies si c'est le menu couple
    if (menu.id === 'menu-couple') {
      config.brownies = {
        name: 'Brownies',
        quantity: 2,
        included: true
      };
    }

    const cartItem = {
      _id: `pizza-menu-${menu.id}-${Date.now()}`,
      name: menu.name,
      price: calculatePrice(),
      image: '/images/menu/pizza-menu.jpeg',
      category: 'pizza-menu',
      type: 'food' as const,
      config
    };

    addItem(cartItem);
    onClose();
    resetForm();
  };

  const handleClose = () => {
    onClose();
  };

  const handlePizzaQuantity = (pizza: Pizza, delta: number) => {
    setSelectedPizzas(prev => {
      const existing = prev.find(p => p.pizza._id === pizza._id);
      const currentTotal = prev.reduce((sum, p) => sum + p.quantity, 0);
      const requiredPizzas = menu.pizzaCount || 1;
      
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta);
        // Si on augmente, vérifier qu'on ne dépasse pas le maximum total
        if (delta > 0 && currentTotal >= requiredPizzas) {
          return prev;
        }
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

  const handleDrinkQuantity = (drink: any, delta: number) => {
    setSelectedDrinks(prev => {
      const existing = prev.find(d => d.drink._id === drink._id);
      const currentTotal = prev.reduce((sum, d) => sum + d.quantity, 0);
      const requiredDrinks = menu.drinkCount || 0;
      
      if (existing) {
        const newQuantity = existing.quantity + delta;
        // Empêcher de dépasser le maximum
        if (newQuantity > 0 && currentTotal >= requiredDrinks && delta > 0) {
          return prev;
        }
        if (newQuantity <= 0) {
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

  // Filtrer les boissons selon la taille requise
  const getFilteredDrinks = () => {
    if (!menu.drinkSize || drinks.length === 0) return drinks;
    
    const size = menu.drinkSize.toLowerCase();
    const is15L = size.includes('1.5l') || size.includes('1,5l') || size.includes('1.5 l') || size.includes('1,5 l');
    
    if (is15L) {
      // Filtrer pour n'afficher que les boissons 1.5L
      return drinks.filter(drink => {
        // Vérifier si la boisson a une taille 1.5L dans le champ sizes
        if (drink.sizes && Array.isArray(drink.sizes)) {
          return drink.sizes.some((size: any) => {
            const volume = size.volume?.toLowerCase() || '';
            return volume.includes('1.5l') ||
                   volume.includes('1.5 l') ||
                   volume.includes('1,5l') ||
                   volume.includes('1,5 l') ||
                   volume.includes('1500ml') ||
                   volume.includes('1500 ml');
          });
        }
        
        // Fallback : vérifier dans le nom si pas de sizes
        const drinkName = drink.name.toLowerCase();
        return drinkName.includes('1.5l') ||
               drinkName.includes('1.5 l') ||
               drinkName.includes('1,5l') ||
               drinkName.includes('1,5 l') ||
               drinkName.includes('1500ml') ||
               drinkName.includes('1500 ml');
      });
    } else if (size.includes('33')) {
      // Filtrer pour n'afficher que les boissons 33cl/330ml (canettes)
      return drinks.filter(drink => {
        if (drink.sizes && Array.isArray(drink.sizes)) {
          return drink.sizes.some((size: any) => {
            const volume = size.volume?.toLowerCase() || '';
            return volume.includes('33cl') || 
                   volume.includes('33 cl') || 
                   volume.includes('330ml') || 
                   volume.includes('330 ml') ||
                   volume.includes('33ml') ||
                   volume.includes('33 ml');
          });
        }
        const drinkName = drink.name.toLowerCase();
        return drinkName.includes('33cl') || 
               drinkName.includes('33 cl') || 
               drinkName.includes('330ml') || 
               drinkName.includes('330 ml') ||
               drinkName.includes('33ml') ||
               drinkName.includes('33 ml') ||
               drinkName.includes('canette');
      });
    }
    
    return drinks;
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


  const isMobile = useIsMobile();

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] lg:max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b flex-shrink-0">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{menu.name}</h2>
              <p className="text-xs lg:text-sm text-gray-600 truncate">{menu.description}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-4 lg:p-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Étape 1: Pizzas */}
                {currentStep === 'pizzas' && (
                  <div>
                    <h3 className="text-base lg:text-xl font-bold text-gray-900 mb-3">
                      🍕 Choisissez vos pizzas
                    </h3>
                  <div className="space-y-2">
                    {pizzas.map((pizza: any) => {
                      const qty = getPizzaQuantity(pizza._id);
                      return (
                        <div
                          key={pizza._id}
                          className={`flex items-center gap-2 lg:gap-4 p-3 lg:p-4 rounded-xl border-2 transition-all ${
                            qty > 0
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
                            <Image
                              src={pizza.image || '/images/placeholder-food.jpg'}
                              alt={pizza.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm lg:text-base text-gray-900 truncate">{pizza.name}</h4>
                            {pizza.baseIngredients && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2 lg:line-clamp-1">
                                {pizza.baseIngredients.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                            <button
                              onClick={() => handlePizzaQuantity(pizza, -1)}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                            <span className="w-6 lg:w-8 text-center font-bold text-base lg:text-lg">{qty}</span>
                            <button
                              onClick={() => handlePizzaQuantity(pizza, 1)}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
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
                    <h3 className="text-base lg:text-xl font-bold text-gray-900 mb-3">
                      🥤 Choisissez vos boissons
                    </h3>
                    <div className="text-xs lg:text-sm text-gray-600 mb-4">
                      Choisissez {menu.drinkCount} boisson{menu.drinkCount > 1 ? 's' : ''} ({selectedDrinks.reduce((sum, d) => sum + d.quantity, 0)}/{menu.drinkCount} sélectionnées)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {getFilteredDrinks().length > 0 ? getFilteredDrinks().map((drink) => {
                        const qty = getDrinkQuantity(drink._id);
                        return (
                          <div
                            key={drink._id}
                            className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl border-2 transition-all ${
                              qty > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0">
                              <Image
                                src={drink.image || '/images/placeholder-drink.jpg'}
                                alt={drink.name}
                                fill
                                className="object-contain rounded"
                              />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-xs lg:text-sm truncate">{drink.name}</div>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleDrinkQuantity(drink, -1)}
                                className="w-7 h-7 lg:w-8 lg:h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                              <span className="w-5 lg:w-6 text-center font-bold text-sm lg:text-base">{qty}</span>
                              <button
                                onClick={() => handleDrinkQuantity(drink, 1)}
                                className="w-7 h-7 lg:w-8 lg:h-8 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="col-span-full text-center py-8 text-gray-500 text-sm lg:text-base">
                          Aucune boisson disponible pour ce menu
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Étape 3: Nuggets/Wings pour menu couple */}
                {currentStep === 'petite-faim' && menu.id === 'menu-couple' && (
                  <div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                      Choisissez 6 Nuggets ou Wings
                    </h3>
                    <div className="grid grid-cols-2 gap-3 lg:gap-6">
                      {petiteFaimItems
                        .filter(item => item.name.toLowerCase().includes('nugget') || item.name.toLowerCase().includes('hot wing') || item.name.toLowerCase().includes('wing'))
                        .map((item) => (
                          <button
                            key={item._id}
                            onClick={() => setSelectedPetiteFaim(item)}
                            className={`text-center cursor-pointer transition-transform duration-300 hover:scale-110 ${
                              selectedPetiteFaim?._id === item._id ? 'scale-105' : ''
                            }`}
                          >
                            <div className="relative w-20 h-20 lg:w-32 lg:h-32 mx-auto mb-2 lg:mb-3 transition-all duration-300">
                              <Image
                                src={item.image || '/images/placeholder-food.jpg'}
                                alt={item.name}
                                fill
                                className="object-cover rounded-full shadow-lg"
                              />
                            </div>
                            <div className={`font-medium text-xs lg:text-base ${selectedPetiteFaim?._id === item._id ? 'text-red-600' : 'text-gray-700'}`}>
                              {item.name}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Étape 4: Récapitulatif */}
            {currentStep === 'summary' && (
              <div className="space-y-4">
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">📋 Récapitulatif</h3>
                
                {/* Pizzas sélectionnées */}
                {selectedPizzas.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm lg:text-base text-gray-700">Pizzas</h4>
                    {selectedPizzas.map(({ pizza, quantity }) => (
                      <div key={pizza._id} className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <div className="relative w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                          <Image
                            src={pizza.image || '/images/placeholder-food.jpg'}
                            alt={pizza.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs lg:text-sm text-gray-900 truncate">{pizza.name}</div>
                          {pizza.baseIngredients && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {pizza.baseIngredients.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-base lg:text-lg font-bold text-red-600 flex-shrink-0">x{quantity}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">Aucune pizza sélectionnée</div>
                )}

                {/* Boissons sélectionnées */}
                {selectedDrinks.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm lg:text-base text-gray-700">Boissons</h4>
                    {selectedDrinks.map(({ drink, quantity }) => (
                      <div key={drink._id} className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <div className="relative w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                          <Image
                            src={drink.image || '/images/placeholder-drink.jpg'}
                            alt={drink.name}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs lg:text-sm text-gray-900 truncate">{drink.name}</div>
                        </div>
                        <div className="text-base lg:text-lg font-bold text-red-600 flex-shrink-0">x{quantity}</div>
                      </div>
                    ))}
                  </div>
                ) : menu.drinkCount > 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">Aucune boisson sélectionnée</div>
                )}

                {/* Nuggets/Wings pour menu couple */}
                {menu.id === 'menu-couple' && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm lg:text-base text-gray-700">6 Nuggets ou Wings</h4>
                    {selectedPetiteFaim ? (
                      <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <div className="relative w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                          <Image
                            src={selectedPetiteFaim.image || '/images/placeholder-food.jpg'}
                            alt={selectedPetiteFaim.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs lg:text-sm text-gray-900">{selectedPetiteFaim.name}</div>
                        </div>
                        <div className="text-base lg:text-lg font-bold text-red-600 flex-shrink-0">x6</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-2">Non sélectionné</div>
                    )}
                  </div>
                )}

                {/* Brownies inclus pour menu couple */}
                {menu.id === 'menu-couple' && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm lg:text-base text-gray-700">Brownies Inclus</h4>
                    <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                      <div className="relative w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                        {desserts.filter(dessert => dessert.name.toLowerCase().includes('brownie')).length > 0 ? (
                          <Image
                            src={desserts.find(d => d.name.toLowerCase().includes('brownie'))?.image || '/images/placeholder-food.jpg'}
                            alt="Brownie"
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs">🍫</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs lg:text-sm text-gray-900">2 Brownies Inclus</div>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 font-semibold flex-shrink-0">Inclus</div>
                    </div>
                  </div>
                )}

                {/* Quantité */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm lg:text-base text-gray-700 mb-3">Quantité</h4>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                    <span className="w-10 lg:w-12 text-center font-medium text-base lg:text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Always visible */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-t bg-gray-50 flex-shrink-0 gap-2 lg:gap-4">
            <button
              onClick={() => {
                if (currentStep === 'drinks') setCurrentStep('pizzas');
                else if (currentStep === 'petite-faim') setCurrentStep('drinks');
                else if (currentStep === 'summary') {
                  if (menu.id === 'menu-couple') setCurrentStep('petite-faim');
                  else setCurrentStep('drinks');
                }
              }}
              disabled={currentStep === 'pizzas'}
              className="px-4 lg:px-6 py-2 lg:py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
            >
              Précédent
            </button>
            
            <div className="text-center flex-shrink-0">
              <div className="text-xs lg:text-sm text-gray-600">Total</div>
              <div className="text-lg lg:text-2xl font-bold text-red-600">
                {calculatePrice().toFixed(2)} €
              </div>
            </div>
            
            {currentStep === 'summary' ? (
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className="px-4 lg:px-8 py-2 lg:py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
              >
                <span className="hidden lg:inline">Ajouter au panier</span>
                <span className="lg:hidden">Ajouter</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentStep === 'pizzas') setCurrentStep('drinks');
                  else if (currentStep === 'drinks') {
                    if (menu.id === 'menu-couple') setCurrentStep('petite-faim');
                    else setCurrentStep('summary');
                  }
                  else if (currentStep === 'petite-faim') setCurrentStep('summary');
                }}
                className="px-4 lg:px-6 py-2 lg:py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors text-sm lg:text-base"
              >
                Suivant
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

