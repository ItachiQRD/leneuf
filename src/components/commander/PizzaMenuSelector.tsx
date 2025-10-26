import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface PizzaMenuSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  menu: any;
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

export default function PizzaMenuSelector({ isOpen, onClose, menu }: PizzaMenuSelectorProps) {
  const { addItem } = useCart();
  const [selectedPizzas, setSelectedPizzas] = useState<{ pizza: Pizza; quantity: number }[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<{ drink: Drink; quantity: number }[]>([]);
  const [selectedPetiteFaim, setSelectedPetiteFaim] = useState<PetiteFaimItem | null>(null);
  const [selectedDesserts, setSelectedDesserts] = useState<{ dessert: Dessert; quantity: number }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [petiteFaimItems, setPetiteFaimItems] = useState<PetiteFaimItem[]>([]);
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Récupérer les pizzas
      const pizzasResponse = await fetch('/api/products/by-category/pizzas');
      const pizzasData = await pizzasResponse.json();
      if (pizzasData.success) {
        setPizzas(pizzasData.products);
      }

      // Récupérer les boissons
      const drinksResponse = await fetch('/api/products/by-category/boissons');
      const drinksData = await drinksResponse.json();
      if (drinksData.success) {
        setDrinks(drinksData.products);
      }

      // Récupérer les petite faim (pour nuggets/wings)
      const petiteFaimResponse = await fetch('/api/products/by-category/ptite-faim');
      const petiteFaimData = await petiteFaimResponse.json();
      if (petiteFaimData.success) {
        setPetiteFaimItems(petiteFaimData.products);
      }

      // Récupérer les desserts (pour brownie)
      const dessertsResponse = await fetch('/api/products/by-category/desserts');
      const dessertsData = await dessertsResponse.json();
      if (dessertsData.success) {
        setDesserts(dessertsData.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
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
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta);
        if (newQuantity === 0) {
          return prev.filter(p => p.pizza._id !== pizza._id);
        }
        return prev.map(p => 
          p.pizza._id === pizza._id ? { ...p, quantity: newQuantity } : p
        );
      } else if (delta > 0) {
        return [...prev, { pizza, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleDrinkQuantity = (drink: Drink, delta: number) => {
    setSelectedDrinks(prev => {
      const existing = prev.find(d => d.drink._id === drink._id);
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta);
        if (newQuantity === 0) {
          return prev.filter(d => d.drink._id !== drink._id);
        }
        return prev.map(d => 
          d.drink._id === drink._id ? { ...d, quantity: newQuantity } : d
        );
      } else if (delta > 0) {
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

  // Filtrer les pizzas selon la taille requise
  const getFilteredPizzas = () => {
    if (!menu.pizzaSize) return pizzas;
    return pizzas.filter(pizza => {
      const name = pizza.name.toLowerCase();
      return name.includes(menu.pizzaSize.toLowerCase());
    });
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
                {/* Sélection des pizzas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Choisissez vos pizzas {menu.pizzaSize && `(${menu.pizzaSize})`}
                  </h3>
                  <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                    {getFilteredPizzas().map((pizza) => {
                      const quantity = getPizzaQuantity(pizza._id);
                      return (
                        <div
                          key={pizza._id}
                          className={`p-3 border-2 rounded-lg flex items-center space-x-3 ${
                            quantity > 0
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded flex items-center justify-center">
                            <Image
                              src={pizza.image || '/images/placeholder-food.jpg'}
                              alt={pizza.name}
                              width={64}
                              height={64}
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{pizza.name}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePizzaQuantity(pizza, -1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <button
                              onClick={() => handlePizzaQuantity(pizza, 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {menu.pizzaCount === 2 ? 'Choisissez 2 pizzas' : 
                     menu.pizzaCount === 3 ? 'Choisissez 3 pizzas' :
                     menu.pizzaCount === 4 ? 'Choisissez 4 pizzas' :
                     menu.pizzaCount === 5 ? 'Choisissez 5 pizzas' : 'Choisissez 1 pizza'}
                  </p>
                </div>

                {/* Sélection des boissons */}
                {menu.drinkCount > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choisissez vos boissons {menu.drinkSize && `(${menu.drinkSize})`}
                    </h3>
                    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
                      {drinks.filter(drink => {
                        if (menu.drinkSize) {
                          const sizes = ['1,5l', '1.5l', '1,5L', '1.5L', '33cl', '33cl'];
                          return sizes.some(size => drink.name.toLowerCase().includes(size));
                        }
                        return true;
                      }).map((drink) => {
                        const quantity = getDrinkQuantity(drink._id);
                        return (
                          <button
                            key={drink._id}
                            onClick={() => handleDrinkQuantity(drink, 1)}
                            className={`p-3 border-2 rounded-lg text-left flex items-center space-x-3 ${
                              quantity > 0
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded flex items-center justify-center">
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
                            {quantity > 0 && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDrinkQuantity(drink, -1);
                                  }}
                                  className="w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center font-medium text-sm">{quantity}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {menu.drinkCount === 2 ? 'Choisissez 2 boissons' : `Choisissez ${menu.drinkCount} boisson${menu.drinkCount > 1 ? 's' : ''}`}
                    </p>
                  </div>
                )}

                {/* Sélection nuggets/wings pour menu couple */}
                {menu.id === 'menu-couple' && (
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
                    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
                      {desserts
                        .filter(dessert => dessert.name.toLowerCase().includes('brownie'))
                        .map((dessert) => (
                          <div
                            key={dessert._id}
                            className="bg-gray-100 p-4 border-2 rounded-lg border-gray-300 opacity-60 cursor-not-allowed"
                          >
                            <div className="relative w-12 h-12 mx-auto mb-2 bg-gray-50 rounded flex items-center justify-center">
                              <Image
                                src={dessert.image || '/images/placeholder-food.jpg'}
                                alt={dessert.name}
                                width={48}
                                height={48}
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-sm text-gray-600">{dessert.name}</div>
                              <div className="text-xs text-gray-500 mt-1">Inclus</div>
                            </div>
                          </div>
                        ))}
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
            <div>
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-red-600">
                {calculatePrice().toFixed(2)} €
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart()}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Ajouter au panier
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

