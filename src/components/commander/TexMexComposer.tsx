import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Buttons';

interface TexMexComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  product: any;
}

interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
  maxDrinks: number;
  drinkSize: string;
}

interface Drink {
  _id: string;
  name: string;
  price: number;
  image: string;
  sizes: Array<{
    name: string;
    price: number;
    volume: string;
  }>;
}

const STEPS = [
  { id: 'menu', title: 'Menu', description: 'Choisissez votre option menu' },
  { id: 'fries', title: 'Frites', description: 'Avec ou sans frites' },
  { id: 'drink', title: 'Boisson', description: 'Sélectionnez vos boissons' },
  { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre commande' }
];

const MENU_OPTIONS: MenuOption[] = [
  {
    id: '7-pieces',
    name: '7 pièces + Frite + boisson',
    price: 0,
    description: '7 pièces de poulet + frites + 1 boisson au choix',
    maxDrinks: 1,
    drinkSize: 'any'
  },
  {
    id: '14-pieces',
    name: '14 pièces + 2 frites + 2 boissons',
    price: 0,
    description: '14 pièces de poulet + 2 frites + 2 boissons 33cl',
    maxDrinks: 2,
    drinkSize: '33cl'
  },
  {
    id: '20-pieces',
    name: '20 pièces + boisson',
    price: 0,
    description: '20 pièces de poulet + 1 boisson 1.5L',
    maxDrinks: 1,
    drinkSize: '1.5L'
  }
];

export default function TexMexComposer({ isOpen, onClose, onAddToCart, product }: TexMexComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Configuration du produit
  const [config, setConfig] = useState({
    menuOption: '7-pieces' as string,
    withFries: true,
    selectedDrinks: [] as Drink[],
    quantity: 1
  });

  // Réinitialiser le formulaire quand il s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setConfig({
        menuOption: '7-pieces',
        withFries: true,
        selectedDrinks: [],
        quantity: 1
      });
      fetchDrinks();
    }
  }, [isOpen]);

  const fetchDrinks = async () => {
    try {
      const response = await fetch('/api/products/boissons');
      const data = await response.json();
      if (data.success) {
        setDrinks(data.data);
      }
    } catch (error) {
      console.error('Error fetching drinks:', error);
    }
  };

  const getDrinkOptions = () => {
    const menuOption = MENU_OPTIONS.find(opt => opt.id === config.menuOption);
    if (!menuOption) return [];

    if (menuOption.drinkSize === 'any') {
      return drinks; // Toutes les boissons
    } else if (menuOption.drinkSize === '33cl') {
      return drinks.filter(drink => 
        drink.sizes.some(size => 
          size.volume.toLowerCase().includes('33cl') || 
          size.volume.toLowerCase().includes('33 cl')
        )
      );
    } else if (menuOption.drinkSize === '1.5L') {
      return drinks.filter(drink => 
        drink.sizes.some(size => 
          size.volume.toLowerCase().includes('1.5l') || 
          size.volume.toLowerCase().includes('1.5 l') ||
          size.volume.toLowerCase().includes('1,5l') ||
          size.volume.toLowerCase().includes('1,5 l')
        )
      );
    }
    
    return drinks;
  };

  const calculatePrice = () => {
    let price = product.price;
    return price * config.quantity;
  };

  const handleMenuSelect = (menuId: string) => {
    const menuOption = MENU_OPTIONS.find(opt => opt.id === menuId);
    setConfig(prev => ({
      ...prev,
      menuOption: menuId,
      withFries: menuId !== '20-pieces', // 20 pièces n'a pas de frites
      selectedDrinks: [] // Reset drinks when changing menu
    }));
  };

  const handleDrinkToggle = (drink: Drink) => {
    const menuOption = MENU_OPTIONS.find(opt => opt.id === config.menuOption);
    if (!menuOption) return;

    setConfig(prev => {
      const isSelected = prev.selectedDrinks.some(d => d._id === drink._id);
      
      if (isSelected) {
        // Retirer la boisson
        return {
          ...prev,
          selectedDrinks: prev.selectedDrinks.filter(d => d._id !== drink._id)
        };
      } else {
        // Ajouter la boisson si on n'a pas atteint la limite
        if (prev.selectedDrinks.length < menuOption.maxDrinks) {
          return {
            ...prev,
            selectedDrinks: [...prev.selectedDrinks, drink]
          };
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddToCart = () => {
    const menuOption = MENU_OPTIONS.find(opt => opt.id === config.menuOption);
    const productName = `${product.name} (${menuOption?.name})`;
    
    const cartItem = {
      _id: `tex-mex-${Date.now()}`,
      name: productName,
      price: calculatePrice(),
      image: product.image,
      category: 'tex-mex',
      type: 'food',
      customIngredients: {
        menuOption: config.menuOption,
        withFries: config.withFries,
        drinks: config.selectedDrinks,
        quantity: config.quantity
      }
    };
    
    onAddToCart(cartItem);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setConfig({
      menuOption: '7-pieces',
      withFries: true,
      selectedDrinks: [],
      quantity: 1
    });
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.menuOption !== '';
      case 1: return true; // Les frites sont optionnelles
      case 2: 
        const menuOption = MENU_OPTIONS.find(opt => opt.id === config.menuOption);
        return !menuOption || config.selectedDrinks.length === menuOption.maxDrinks;
      default: return true;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Personnaliser votre Tex-Mex
              </h2>
              <p className="text-gray-600">{product.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {/* Étape 1: Menu */}
              {currentStep === 0 && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Choisissez votre option menu
                  </h3>
                  <div className="grid gap-4">
                    {MENU_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => handleMenuSelect(option.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          config.menuOption === option.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{option.name}</h4>
                            <p className="text-sm text-gray-600">{option.description}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {option.maxDrinks} boisson{option.maxDrinks > 1 ? 's' : ''} {option.drinkSize !== 'any' ? `(${option.drinkSize})` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              Inclus
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Étape 2: Frites */}
              {currentStep === 1 && (
                <motion.div
                  key="fries"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Frites
                  </h3>
                  
                  <div className="grid gap-4">
                    {/* Option "Aucune" */}
                    <div
                      onClick={() => setConfig(prev => ({ ...prev, withFries: false }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        !config.withFries
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          <X className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Sans frites</h4>
                          <p className="text-sm text-gray-600">Pas de frites</p>
                        </div>
                      </div>
                    </div>

                    {/* Option "Avec frites" */}
                    <div
                      onClick={() => setConfig(prev => ({ ...prev, withFries: true }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        config.withFries
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="w-6 h-6 bg-yellow-500 rounded-sm"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Avec frites</h4>
                          <p className="text-sm text-gray-600">Portion de frites</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Étape 3: Boisson */}
              {currentStep === 2 && (
                <motion.div
                  key="drink"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Sélectionnez vos boissons
                  </h3>
                  
                  {(() => {
                    const menuOption = MENU_OPTIONS.find(opt => opt.id === config.menuOption);
                    return (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>{menuOption?.name}</strong><br />
                          Sélectionnez {menuOption?.maxDrinks} boisson{menuOption?.maxDrinks && menuOption.maxDrinks > 1 ? 's' : ''} 
                          {menuOption?.drinkSize !== 'any' && ` (${menuOption.drinkSize})`}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {config.selectedDrinks.length} / {menuOption?.maxDrinks} sélectionnée{menuOption?.maxDrinks && menuOption.maxDrinks > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getDrinkOptions().map((drink) => (
                      <div
                        key={drink._id}
                        onClick={() => handleDrinkToggle(drink)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          config.selectedDrinks.some(d => d._id === drink._id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image
                              src={drink.image || '/images/placeholder-drink.jpg'}
                              alt={drink.name}
                              width={48}
                              height={48}
                              className="object-contain rounded-lg"
                            />
                          </div>
                          <h4 className="font-medium text-gray-900">{drink.name}</h4>
                          <p className="text-sm text-gray-600">
                            {config.menuOption === '20-pieces' ? '1.5L' : '33cl'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Étape 4: Récapitulatif */}
              {currentStep === 3 && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Récapitulatif de votre commande
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-gray-600">{product.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Menu:</span>
                        <span>{MENU_OPTIONS.find(opt => opt.id === config.menuOption)?.name}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Frites:</span>
                        <span>{config.withFries ? 'Oui' : 'Non'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Boisson{config.selectedDrinks.length > 1 ? 's' : ''}:</span>
                        <span>
                          {config.selectedDrinks.length > 0 
                            ? config.selectedDrinks.map(drink => drink.name).join(', ')
                            : 'Aucune'
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Quantité:</span>
                        <span>{config.quantity}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>{calculatePrice().toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setConfig(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                disabled={config.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 bg-white border rounded-lg">
                {config.quantity}
              </span>
              <Button
                variant="outline"
                onClick={() => setConfig(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {currentStep === STEPS.length - 1 ? (
              <Button onClick={handleAddToCart} disabled={!canProceed()}>
                Ajouter au panier
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
