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
  { id: 'sauce', title: 'Sauce', description: 'Sélectionnez votre sauce' },
  { id: 'drink', title: 'Boisson', description: 'Sélectionnez vos boissons' },
  { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre commande' }
];

interface Sauce {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function TexMexComposer({ isOpen, onClose, onAddToCart, product }: TexMexComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Configuration du produit
  const [config, setConfig] = useState({
    selectedSauce: null as Sauce | null,
    selectedDrinks: [] as Drink[],
    quantity: 1
  });

  // Réinitialiser le formulaire quand il s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setConfig({
        selectedSauce: null,
        selectedDrinks: [],
        quantity: 1
      });
      fetchDrinks();
      fetchSauces();
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

  const fetchSauces = async () => {
    try {
      const response = await fetch('/api/products/tacos-options');
      const data = await response.json();
      if (data.success) {
        setSauces(data.data.sauces);
      }
    } catch (error) {
      console.error('Error fetching sauces:', error);
    }
  };

  const getDrinkOptions = () => {
    // Pour Tex-Mex, on filtre selon le nom du produit
    const productName = product?.name.toLowerCase() || '';
    
    if (productName.includes('7 pièces') || productName.includes('14 pièces')) {
      return drinks; // Toutes les boissons
    } else if (productName.includes('20 pièces')) {
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

  const handleSauceSelect = (sauce: Sauce) => {
    setConfig(prev => ({
      ...prev,
      selectedSauce: sauce
    }));
  };

  const handleDrinkToggle = (drink: Drink) => {
    setConfig(prev => {
      const isSelected = prev.selectedDrinks.some(d => d._id === drink._id);
      
      if (isSelected) {
        // Retirer la boisson
        return {
          ...prev,
          selectedDrinks: prev.selectedDrinks.filter(d => d._id !== drink._id)
        };
      } else {
        // Ajouter la boisson
        return {
          ...prev,
          selectedDrinks: [...prev.selectedDrinks, drink]
        };
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
    const cartItem = {
      _id: `tex-mex-${Date.now()}`,
      name: product.name,
      price: calculatePrice(),
      image: product.image,
      category: 'tex-mex',
      type: 'food',
      customIngredients: {
        sauce: config.selectedSauce,
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
      selectedSauce: null,
      selectedDrinks: [],
      quantity: 1
    });
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Les sauces sont optionnelles
      case 1: return true; // Les boissons sont optionnelles
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
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden lg:max-w-4xl lg:max-h-[90vh] lg:rounded-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                Personnaliser votre Tex-Mex
              </h2>
              <p className="text-sm lg:text-base text-gray-600 truncate">{product.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 lg:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50">
            <div className="flex items-center justify-between overflow-x-auto">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? <Check className="w-3 h-3 lg:w-4 lg:h-4" /> : index + 1}
                  </div>
                  <div className="ml-1 lg:ml-2 hidden sm:block">
                    <div className="text-xs lg:text-sm font-medium text-gray-900 whitespace-nowrap">{step.title}</div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">{step.description}</div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-4 lg:w-8 h-0.5 mx-2 lg:mx-4 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6 overflow-y-auto max-h-[50vh]">
            <AnimatePresence mode="wait">
              {/* Étape 1: Sauce */}
              {currentStep === 0 && (
                <motion.div
                  key="sauce"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Sauce (optionnel)
                  </h3>
                  
                  {/* Option "Aucune" */}
                  <div
                    onClick={() => setConfig(prev => ({ ...prev, selectedSauce: null }))}
                    className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      !config.selectedSauce
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                        <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm lg:text-base">Sans sauce</h4>
                        <p className="text-xs lg:text-sm text-gray-600">Pas de sauce</p>
                      </div>
                    </div>
                  </div>

                  {/* Sauces disponibles */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                    {sauces.map((sauce) => (
                      <div
                        key={sauce._id}
                        onClick={() => handleSauceSelect(sauce)}
                        className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          config.selectedSauce?._id === sauce._id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image
                              src={sauce.image || '/images/placeholder-sauce.jpg'}
                              alt={sauce.name}
                              width={48}
                              height={48}
                              className="object-contain rounded-lg"
                            />
                          </div>
                          <h4 className="font-medium text-gray-900 text-xs lg:text-sm">{sauce.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Étape 2: Boisson */}
              {currentStep === 1 && (
                <motion.div
                  key="drink"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Boisson (optionnel)
                  </h3>
                  
                  {/* Option "Aucune" */}
                  <div
                    onClick={() => setConfig(prev => ({ ...prev, selectedDrinks: [] }))}
                    className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      config.selectedDrinks.length === 0
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                        <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm lg:text-base">Sans boisson</h4>
                        <p className="text-xs lg:text-sm text-gray-600">Pas de boisson</p>
                      </div>
                    </div>
                  </div>

                  {/* Boissons disponibles */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                    {getDrinkOptions().map((drink) => (
                      <div
                        key={drink._id}
                        onClick={() => handleDrinkToggle(drink)}
                        className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          config.selectedDrinks.some(d => d._id === drink._id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image
                              src={drink.image || '/images/placeholder-drink.jpg'}
                              alt={drink.name}
                              width={48}
                              height={48}
                              className="object-contain rounded-lg"
                            />
                          </div>
                          <h4 className="font-medium text-gray-900 text-xs lg:text-sm">{drink.name}</h4>
                          <p className="text-xs lg:text-sm text-gray-600">
                            {product?.name.toLowerCase().includes('20 pièces') ? '1.5L' : '33cl'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Étape 3: Récapitulatif */}
              {currentStep === 2 && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Récapitulatif de votre commande
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 lg:p-6 space-y-3 lg:space-y-4">
                    <div className="flex items-center">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded-lg mr-3 lg:mr-4 w-15 h-15 lg:w-20 lg:h-20"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{product.name}</h4>
                        <p className="text-xs lg:text-sm text-gray-600">{product.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sauce:</span>
                        <span>{config.selectedSauce ? config.selectedSauce.name : 'Aucune'}</span>
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
          <div className="flex items-center justify-between p-4 lg:p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2"
            >
              <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Précédent
            </Button>

            <div className="flex items-center space-x-1 lg:space-x-2">
              <Button
                variant="outline"
                onClick={() => setConfig(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                disabled={config.quantity <= 1}
                className="p-2 lg:p-2"
              >
                <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
              <span className="px-3 lg:px-4 py-2 bg-white border rounded-lg text-sm lg:text-base">
                {config.quantity}
              </span>
              <Button
                variant="outline"
                onClick={() => setConfig(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                className="p-2 lg:p-2"
              >
                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>

            {currentStep === STEPS.length - 1 ? (
              <Button onClick={handleAddToCart} disabled={!canProceed()} className="text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2">
                Ajouter au panier
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()} className="text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2">
                Suivant
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
