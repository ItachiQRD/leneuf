import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';

interface MenuSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  product: any;
}

interface Side {
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
  sizes?: Array<{
    name: string;
    price: number;
    isDefault: boolean;
  }>;
}

export default function MenuSelector({ isOpen, onClose, onAddToCart, product }: MenuSelectorProps) {
  const [isMenu, setIsMenu] = useState(false);
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sides, setSides] = useState<Side[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSidesAndDrinks();
    }
  }, [isOpen]);

  const fetchSidesAndDrinks = async () => {
    setLoading(true);
    try {
      // Récupérer les accompagnements
      const sidesResponse = await fetch('/api/products/by-category/accompagnements');
      const sidesData = await sidesResponse.json();
      if (sidesData.success) {
        setSides(sidesData.products);
      }

      // Récupérer les boissons
      const drinksResponse = await fetch('/api/products/by-category/boissons');
      const drinksData = await drinksResponse.json();
      if (drinksData.success) {
        setDrinks(drinksData.products);
      }
    } catch (error) {
      console.error('Error fetching sides and drinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    let totalPrice = product.price;
    
    if (isMenu) {
      // Menu complet : produit + accompagnement + boisson
      if (selectedSide) {
        // Frites gratuites, autres accompagnements : prix - 2€
        if (selectedSide.name.toLowerCase().includes('frite')) {
          totalPrice += 0; // Frites gratuites
        } else {
          totalPrice += Math.max(0, selectedSide.price - 2); // Prix - 2€ (minimum 0)
        }
      }
      
      if (selectedDrink) {
        // Boissons à 1,50€ gratuites, autres : prix - 1,50€
        const drinkPrice = selectedDrink.price || 
          (selectedDrink.sizes && selectedDrink.sizes.length > 0 ? 
           (selectedDrink.sizes.find(s => s.isDefault) || selectedDrink.sizes[0]).price : 0);
        
        if (drinkPrice <= 1.50) {
          totalPrice += 0; // Boissons à 1,50€ gratuites
        } else {
          totalPrice += Math.max(0, drinkPrice - 1.50); // Prix - 1,50€ (minimum 0)
        }
      }
    } else {
      // Produit seul + accompagnement (même logique de prix)
      if (selectedSide) {
        if (selectedSide.name.toLowerCase().includes('frite')) {
          totalPrice += 0; // Frites gratuites
        } else {
          totalPrice += Math.max(0, selectedSide.price - 2); // Prix - 2€ (minimum 0)
        }
      }
    }
    
    return totalPrice * quantity;
  };

  const handleAddToCart = () => {
    let cartItem;

    if (isMenu) {
      // Menu complet : produit + accompagnement + boisson
      cartItem = {
        _id: `menu-${product._id}-${Date.now()}`,
        name: `Menu ${product.name}`,
        price: calculatePrice(),
        image: product.image,
        category: product.category,
        type: 'food',
        isMenu: true,
        config: {
          mainProduct: product,
          side: selectedSide,
          drink: selectedDrink,
          quantity
        }
      };
    } else {
      // Produit seul + accompagnement (si sélectionné)
      let name = product.name;
      if (selectedSide) {
        name += ` + ${selectedSide.name}`;
      }
      
      cartItem = {
        _id: `${product._id}${selectedSide ? `-${selectedSide._id}` : ''}`,
        name: name,
        price: calculatePrice(),
        image: product.image,
        category: product.category,
        type: 'food',
        quantity,
        config: {
          mainProduct: product,
          side: selectedSide,
          quantity
        }
      };
    }

    onAddToCart(cartItem);
    onClose();
  };

  const resetForm = () => {
    setIsMenu(false);
    setSelectedSide(null);
    setSelectedDrink(null);
    setQuantity(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {/* Image et description */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={product.image || '/images/placeholder-food.svg'}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {product.description || 'Délicieux plat préparé avec soin'}
                </p>
                <p className="text-lg font-bold text-red-600">
                  {product.price.toFixed(2)} €
                </p>
              </div>
            </div>

            {/* Choix du type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choisissez votre option
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsMenu(false)}
                  className={`p-4 border-2 rounded-lg text-center ${
                    !isMenu
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🍽️</div>
                  <div className="font-medium">Produit seul</div>
                  <div className="text-sm text-gray-600">
                    {product.price.toFixed(2)} €
                  </div>
                </button>
                <button
                  onClick={() => setIsMenu(true)}
                  className={`p-4 border-2 rounded-lg text-center ${
                    isMenu
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🍽️🥤</div>
                  <div className="font-medium">Menu</div>
                  <div className="text-sm text-gray-600">
                    {(product.price + 1.50).toFixed(2)} €
                  </div>
                  <div className="text-xs text-green-600">
                    + Accompagnement + Boisson
                  </div>
                </button>
              </div>
            </div>

            {/* Options d'accompagnement */}
            <div className="space-y-6">
              {/* Sélection accompagnement */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choisissez votre accompagnement {!isMenu && '(optionnel)'}
                </h3>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {sides.map((side) => (
                        <button
                          key={side._id}
                          onClick={() => setSelectedSide(side)}
                          className={`p-3 border-2 rounded-lg text-left flex items-center space-x-3 ${
                            selectedSide?._id === side._id
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={side.image || '/images/placeholder-food.svg'}
                              alt={side.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{side.name}</div>
                            <div className="text-xs text-red-600">
                              {side.price > 0 ? `+${side.price.toFixed(2)} €` : 'Inclus'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sélection boisson - seulement pour les menus */}
                {isMenu && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choisissez votre boisson
                    </h3>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {drinks.map((drink) => (
                        <button
                          key={drink._id}
                          onClick={() => setSelectedDrink(drink)}
                          className={`p-3 border-2 rounded-lg text-left flex items-center space-x-3 ${
                            selectedDrink?._id === drink._id
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="relative w-10 h-10 flex-shrink-0 bg-gray-50 rounded flex items-center justify-center">
                            <Image
                              src={drink.image || '/images/placeholder-food.svg'}
                              alt={drink.name}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{drink.name}</div>
                            <div className="text-xs text-red-600">
                              {drink.price > 0 ? `+${drink.price.toFixed(2)} €` : 
                               drink.sizes && drink.sizes.length > 0 ? 
                               `À partir de ${Math.min(...drink.sizes.map(s => s.price)).toFixed(2)} €` : 
                               'Inclus'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  </div>
                )}

            {/* Quantité */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quantité
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-red-600">
                {calculatePrice().toFixed(2)} €
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isMenu && (!selectedSide || !selectedDrink)}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isMenu ? 'Ajouter le menu' : 'Ajouter au panier'}
            </button>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
