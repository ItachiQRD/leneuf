import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Buttons';

interface BurgerSandwichComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  product: any;
  type: 'burger' | 'sandwich';
}

interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Ingredient {
  _id: string;
  name: string;
  image: string;
  type: string;
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

interface Sauce {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const getSteps = (productType: 'burger' | 'sandwich') => {
  if (productType === 'burger') {
    return [
      { id: 'menu', title: 'Menu', description: 'Choisissez votre option menu' },
      { id: 'vegetables', title: 'Crudités', description: 'Salade, tomate, oignons ou rien' },
      { id: 'fries', title: 'Frites', description: 'Avec ou sans frites' },
      { id: 'sauce', title: 'Sauce', description: 'Sélectionnez votre sauce' },
      { id: 'drink', title: 'Boisson', description: 'Sélectionnez votre boisson' },
      { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre commande' }
    ];
  } else { // sandwich
    return [
      { id: 'menu', title: 'Menu', description: 'Choisissez votre option menu' },
      { id: 'bread', title: 'Pain', description: 'Durum ou pain pour sandwichs' },
      { id: 'vegetables', title: 'Crudités', description: 'Salade, tomate, oignons ou rien' },
      { id: 'fries', title: 'Frites', description: 'Avec ou sans frites' },
      { id: 'sauce', title: 'Sauce', description: 'Sélectionnez votre sauce' },
      { id: 'drink', title: 'Boisson', description: 'Sélectionnez votre boisson' },
      { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre commande' }
    ];
  }
};

const MENU_OPTIONS: MenuOption[] = [
  {
    id: 'avec-frites',
    name: 'Avec frites',
    price: 0,
    description: 'Produit + frites (inclus)'
  },
  {
    id: 'avec-frites-boisson',
    name: 'Avec frites + boisson',
    price: 0,
    description: 'Produit + frites + boisson (inclus)'
  }
];

const BREAD_OPTIONS = [
  { id: 'pain', name: 'Pain', price: 0 },
  { id: 'durum', name: 'Durum', price: 0 }
];

export default function BurgerSandwichComposer({ isOpen, onClose, onAddToCart, product, type }: BurgerSandwichComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Étapes dynamiques selon le type de produit
  const steps = getSteps(type);
  
  // Configuration du produit
  const [config, setConfig] = useState({
    menuOption: 'avec-frites' as string,
    breadType: 'pain' as string,
    selectedVegetables: [] as string[],
    withFries: true,
    selectedSauce: null as Sauce | null,
    selectedDrink: null as Drink | null,
    quantity: 1
  });

  // Réinitialiser le formulaire quand il s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setConfig({
        menuOption: 'avec-frites',
        breadType: 'pain',
        selectedVegetables: [],
        withFries: true,
        selectedSauce: null,
        selectedDrink: null,
        quantity: 1
      });
      fetchIngredients();
      fetchDrinks();
      fetchSauces();
    }
  }, [isOpen]);

  const fetchIngredients = async () => {
    try {
      const response = await fetch('/api/products/tacos-options');
      const data = await response.json();
      if (data.success) {
        // Filtrer pour avoir seulement salade, tomate, oignons
        const filteredIngredients = data.data.ingredients.filter((ing: Ingredient) => 
          ing.name.toLowerCase().includes('salade') || 
          ing.name.toLowerCase().includes('tomate') || 
          ing.name.toLowerCase().includes('oignon')
        );
        setIngredients(filteredIngredients);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

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

  const calculatePrice = () => {
    let price = product.price;
    
    // Si menu "avec frites" (sans boisson), réduire de 1€
    if (config.menuOption === 'avec-frites') {
      price -= 1;
    }
    
    return price * config.quantity;
  };

  const handleMenuSelect = (menuId: string) => {
    setConfig(prev => ({
      ...prev,
      menuOption: menuId,
      withFries: true, // Toujours avec frites maintenant
      selectedDrink: menuId === 'avec-frites-boisson' ? prev.selectedDrink : null
    }));
  };


  const handleSauceSelect = (sauce: Sauce) => {
    setConfig(prev => ({
      ...prev,
      selectedSauce: sauce
    }));
  };

  const handleDrinkSelect = (drink: Drink) => {
    setConfig(prev => ({
      ...prev,
      selectedDrink: drink
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    const productName = `${product.name}${menuOption ? ` (${menuOption.name})` : ''}`;
    
    const cartItem = {
      _id: `${type}-${Date.now()}`,
      name: productName,
      price: calculatePrice(),
      image: product.image,
      category: type === 'burger' ? 'burgers' : 'sandwichs',
      type: 'food',
      customIngredients: {
        menuOption: config.menuOption,
        breadType: config.breadType,
        vegetables: config.selectedVegetables,
        withFries: config.withFries,
        sauce: config.selectedSauce,
        drink: config.selectedDrink,
        quantity: config.quantity
      }
    };
    
    onAddToCart(cartItem);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setConfig({
      menuOption: 'avec-frites',
      breadType: 'pain',
      selectedVegetables: [],
      withFries: true,
      selectedSauce: null,
      selectedDrink: null,
      quantity: 1
    });
    onClose();
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData) return true;

    switch (currentStepData.id) {
      case 'menu': return config.menuOption !== '';
      case 'bread': return config.breadType !== ''; // Pain obligatoire pour sandwichs
      case 'vegetables': return true; // Les crudités sont optionnelles
      case 'fries': return true; // Les frites sont toujours incluses
      case 'sauce': return true; // Les sauces sont optionnelles
      case 'drink': return config.menuOption !== 'avec-frites-boisson' || config.selectedDrink !== null;
      case 'summary': return true; // Le récapitulatif
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
                Personnaliser votre {type === 'burger' ? 'Burger' : 'Sandwich'}
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
              {steps.map((step, index) => (
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
                  {index < steps.length - 1 && (
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
              {/* Étape Menu */}
              {steps[currentStep]?.id === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Choisissez votre option menu
                  </h3>
                  <div className="grid gap-3 lg:gap-4">
                    {MENU_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => handleMenuSelect(option.id)}
                        className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          config.menuOption === option.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm lg:text-base">{option.name}</h4>
                            <p className="text-xs lg:text-sm text-gray-600">{option.description}</p>
                            {option.id === 'avec-frites' && (
                              <div className="text-xs text-green-600 mt-1">-1€ sans boisson</div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm lg:text-lg font-semibold text-gray-900">
                              Inclus
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Étape Pain */}
              {steps[currentStep]?.id === 'bread' && (
                <motion.div
                  key="bread"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Choisissez votre pain
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {BREAD_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setConfig(prev => ({ ...prev, breadType: option.id }))}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          config.breadType === option.id
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{option.name}</h4>
                          </div>
                          {config.breadType === option.id && (
                            <Check className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Étape Crudités */}
              {steps[currentStep]?.id === 'vegetables' && (
                <motion.div
                  key="vegetables"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Crudités (optionnel)
                  </h3>
                  
                  <div className="space-y-2">
                    {['Salade', 'Tomate', 'Oignons'].map((vegetable) => (
                      <label key={vegetable} className="flex items-center p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300">
                        <input
                          type="checkbox"
                          checked={config.selectedVegetables.includes(vegetable)}
                          onChange={() => {
                            const isSelected = config.selectedVegetables.includes(vegetable);
                            if (isSelected) {
                              setConfig(prev => ({
                                ...prev,
                                selectedVegetables: prev.selectedVegetables.filter(v => v !== vegetable)
                              }));
                            } else {
                              setConfig(prev => ({
                                ...prev,
                                selectedVegetables: [...prev.selectedVegetables, vegetable]
                              }));
                            }
                          }}
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700 text-sm lg:text-base">{vegetable}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Étape Frites */}
              {steps[currentStep]?.id === 'fries' && (
                <motion.div
                  key="fries"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Frites (incluses)
                  </h3>
                  
                  <div className="p-3 lg:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-yellow-500 rounded-sm"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm lg:text-base">Avec frites</h4>
                        <p className="text-xs lg:text-sm text-gray-600">Portion de frites incluse</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Étape Sauce */}
              {steps[currentStep]?.id === 'sauce' && (
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

              {/* Étape Boisson */}
              {steps[currentStep]?.id === 'drink' && (
                <motion.div
                  key="drink"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    {config.menuOption === 'avec-frites-boisson' ? 'Choisissez votre boisson' : 'Boisson (optionnel)'}
                  </h3>
                  
                  {config.menuOption === 'avec-frites-boisson' ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                      {drinks.map((drink) => (
                        <div
                          key={drink._id}
                          onClick={() => handleDrinkSelect(drink)}
                          className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            config.selectedDrink?._id === drink._id
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
                            <p className="text-xs lg:text-sm text-gray-600">33cl</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3 lg:gap-4">
                      {/* Option "Aucune" */}
                      <div
                        onClick={() => setConfig(prev => ({ ...prev, selectedDrink: null }))}
                        className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          !config.selectedDrink
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
                        {drinks.map((drink) => (
                          <div
                            key={drink._id}
                            onClick={() => handleDrinkSelect(drink)}
                            className={`p-3 lg:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              config.selectedDrink?._id === drink._id
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
                              <p className="text-xs lg:text-sm text-gray-600">33cl</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Étape Récapitulatif */}
              {steps[currentStep]?.id === 'summary' && (
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
                        <span>Menu:</span>
                        <span>{MENU_OPTIONS.find(opt => opt.id === config.menuOption)?.name}</span>
                      </div>
                      
                      {type === 'sandwich' && (
                        <div className="flex justify-between">
                          <span>Pain:</span>
                          <span>{BREAD_OPTIONS.find(opt => opt.id === config.breadType)?.name}</span>
                        </div>
                      )}
                      
                      {config.selectedVegetables.length > 0 && (
                        <div className="flex justify-between">
                          <span>Crudités:</span>
                          <span>{config.selectedVegetables.join(', ')}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Frites:</span>
                        <span>Oui (incluses)</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Sauce:</span>
                        <span>{config.selectedSauce ? config.selectedSauce.name : 'Aucune'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Boisson:</span>
                        <span>{config.selectedDrink ? config.selectedDrink.name : 'Non'}</span>
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
              className="text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-2"
            >
              <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-2" />
              <span className="hidden lg:inline">Précédent</span>
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

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleAddToCart} disabled={!canProceed()} className="text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-2">
                <span className="hidden lg:inline">Ajouter au panier</span>
                <span className="lg:hidden">+</span>
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()} className="text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-2">
                <span className="hidden lg:inline">Suivant</span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 lg:ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
