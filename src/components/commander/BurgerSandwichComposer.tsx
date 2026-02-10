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

interface Vegetable {
  _id: string;
  name: string;
  image: string;
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
      { id: 'sauce', title: 'Sauce', description: 'Sélectionnez votre sauce' },
      { id: 'drink', title: 'Boisson', description: 'Sélectionnez votre boisson' },
      { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre commande' }
    ];
  } else { // sandwich
    return [
      { id: 'menu', title: 'Menu', description: 'Choisissez votre option menu' },
      { id: 'bread', title: 'Classic', description: 'Durum ou pain pour sandwichs' },
      { id: 'vegetables', title: 'Crudités', description: 'Salade, tomate, oignons ou rien' },
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
  { id: 'pain', name: 'Classic', price: 0 },
  { id: 'durum', name: 'Durum', price: 0 }
];

export default function BurgerSandwichComposer({ isOpen, onClose, onAddToCart, product, type }: BurgerSandwichComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState<Vegetable[]>([]);
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
    selectedSauces: [] as Sauce[],
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
        selectedSauces: [],
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
      const response = await fetch('/api/ingredients/vegetables');
      const data = await response.json();
      if (data.success) {
        // Filtrer pour n'afficher que salade, tomate, oignons
        const filteredVegetables = data.vegetables.filter((vegetable: Vegetable) => 
          vegetable.name.toLowerCase().includes('salade') || 
          vegetable.name.toLowerCase().includes('tomate') || 
          vegetable.name.toLowerCase().includes('oignon')
        );
        setIngredients(filteredVegetables);
      }
    } catch (error) {
      console.error('Error fetching vegetables:', error);
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
    // Si menu "sans frites", prix normal
    else if (config.menuOption === 'sans-frites') {
      // Prix normal, pas de modification
    }
    // Si menu "avec frites + boisson", prix normal (frites + boisson incluses)
    
    return price * config.quantity;
  };

  const handleMenuSelect = (menuId: string) => {
    setConfig(prev => ({
      ...prev,
      menuOption: menuId,
      selectedDrink: menuId === 'avec-frites-boisson' ? prev.selectedDrink : null
    }));
  };



  const handleSauceSelect = (sauce: Sauce) => {
    setConfig(prev => {
      const isSelected = prev.selectedSauces.some(s => s._id === sauce._id);
      let newSauces = [...prev.selectedSauces];
      
      if (isSelected) {
        // Retirer la sauce
        newSauces = newSauces.filter(s => s._id !== sauce._id);
      } else {
        // Ajouter la sauce si moins de 2
        if (newSauces.length < 2) {
          newSauces.push(sauce);
        }
      }
      
      return {
        ...prev,
        selectedSauces: newSauces
      };
    });
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
      // Défilement automatique vers le haut du contenu
      setTimeout(() => {
        const contentElement = document.querySelector('.burger-sandwich-content');
        if (contentElement) {
          contentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Défilement automatique vers le haut du contenu
      setTimeout(() => {
        const contentElement = document.querySelector('.burger-sandwich-content');
        if (contentElement) {
          contentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
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
        sauces: config.selectedSauces,
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
        selectedSauces: [],
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
          <div className="burger-sandwich-content p-4 lg:p-6 overflow-y-auto max-h-[50vh]">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Menu avec frites (sans boisson) */}
                    <div
                      onClick={() => handleMenuSelect('avec-frites')}
                      className={`p-4 lg:p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        config.menuOption === 'avec-frites'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src="/images/menu/sansboisson.jpeg"
                            alt="Sans boisson"
                            width={160}
                            height={160}
                            className="object-contain"
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">Avec frites</h4>
                        <p className="text-sm lg:text-base text-gray-600 mb-2">Produit + frites (inclus)</p>
                        <div className="text-sm font-semibold text-green-600 mb-2">Inclus</div>
                        <div className="text-lg lg:text-xl font-bold text-gray-900">
                          {(product.price - 1).toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    {/* Menu avec frites + boisson */}
                    <div
                      onClick={() => handleMenuSelect('avec-frites-boisson')}
                      className={`p-4 lg:p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        config.menuOption === 'avec-frites-boisson'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src="/images/menu/avecboisson.jpeg"
                            alt="Avec boisson"
                            width={160}
                            height={160}
                            className="object-contain"
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-base lg:text-lg mb-2">Avec frites + boisson</h4>
                        <p className="text-sm lg:text-base text-gray-600 mb-2">Produit + frites + boisson (inclus)</p>
                        <div className="text-sm font-semibold text-green-600 mb-2">Inclus</div>
                        <div className="text-lg lg:text-xl font-bold text-gray-900">
                          {product.price.toFixed(2)}€
                        </div>
                      </div>
                    </div>
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
                  <div className="grid grid-cols-2 gap-3">
                    {BREAD_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setConfig(prev => ({ ...prev, breadType: option.id }))}
                        className={`p-3 lg:p-4 rounded-lg border-2 text-center transition-all ${
                          config.breadType === option.id
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
                            <Image
                              src={option.id === 'pain' ? '/images/menu/pain.jpeg' : '/images/menu/durum.avif'}
                              alt={option.name}
                              width={64}
                              height={64}
                              className="object-contain"
                            />
                          </div>
                          <h4 className="font-medium text-sm lg:text-base">{option.name}</h4>
                          {config.breadType === option.id && (
                            <Check className="w-4 h-4 text-red-500 mt-1" />
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
                  className="space-y-6"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Crudités (optionnel)
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Grille responsive des crudités avec images - S'adapte au nombre d'éléments */}
                    <div className={`grid gap-3 ${
                      ingredients.length <= 2 ? 'grid-cols-2' : 
                      ingredients.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 
                      'grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {/* Option "Aucun crudités" - Alignée à gauche sur desktop */}
                      <button
                        onClick={() => {
                          if (config.selectedVegetables.length > 0) {
                            setConfig(prev => ({
                              ...prev,
                              selectedVegetables: []
                            }));
                          }
                        }}
                        className={`flex flex-col items-center p-3 lg:p-4 border-2 rounded-xl transition-all duration-200 ${
                          config.selectedVegetables.length === 0
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs lg:text-sm text-center font-medium">Sans crudités</span>
                      </button>
                      {ingredients.map((vegetable) => {
                        const isSelected = config.selectedVegetables.includes(vegetable.name);
                        return (
                          <button
                            key={vegetable._id}
                            onClick={() => {
                              if (isSelected) {
                                setConfig(prev => ({
                                  ...prev,
                                  selectedVegetables: prev.selectedVegetables.filter(v => v !== vegetable.name)
                                }));
                              } else {
                                setConfig(prev => ({
                                  ...prev,
                                  selectedVegetables: [...prev.selectedVegetables, vegetable.name]
                                }));
                              }
                            }}
                            className={`flex flex-col items-center p-3 lg:p-4 border-2 rounded-xl transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div className="w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
                              <Image
                                src={vegetable.image}
                                alt={vegetable.name}
                                width={64}
                                height={64}
                                className="object-contain"
                              />
                            </div>
                            <span className="text-xs lg:text-sm text-center font-medium">{vegetable.name}</span>
                          </button>
                        );
                      })}
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
                    Sauce (optionnel, maximum 2)
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Grille responsive des sauces - S'adapte au nombre d'éléments */}
                    <div className={`grid gap-3 ${
                      sauces.length <= 2 ? 'grid-cols-2' : 
                      sauces.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 
                      'grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {/* Option "Sans sauce" - Alignée comme les crudités */}
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, selectedSauces: [] }))}
                        className={`flex flex-col items-center p-3 lg:p-4 border-2 rounded-xl transition-all duration-200 ${
                          config.selectedSauces.length === 0
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs lg:text-sm text-center font-medium">Sans sauce</span>
                      </button>
                      
                      {sauces.map((sauce) => {
                        const isSelected = config.selectedSauces.some(s => s._id === sauce._id);
                        const canSelect = !isSelected && config.selectedSauces.length < 2;
                        return (
                          <button
                            key={sauce._id}
                            onClick={() => handleSauceSelect(sauce)}
                            disabled={!canSelect && !isSelected}
                            className={`flex flex-col items-center p-3 lg:p-4 border-2 rounded-xl transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : canSelect
                                  ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
                              <Image
                                src={sauce.image || '/images/placeholder-food.svg'}
                                alt={sauce.name}
                                width={64}
                                height={64}
                                className="object-contain rounded-lg"
                              />
                            </div>
                            <span className="text-xs lg:text-sm text-center font-medium">{sauce.name}</span>
                          </button>
                        );
                      })}
                    </div>
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
                    <div className={`grid gap-3 ${
                      drinks.length <= 2 ? 'grid-cols-2' : 
                      drinks.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 
                      'grid-cols-2 lg:grid-cols-3'
                    }`}>
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
                            <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <Image
                                src={drink.image || '/images/placeholder-food.svg'}
                                alt={drink.name}
                                width={48}
                                height={48}
                                className="max-w-full max-h-full object-contain"
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
                      <div className={`grid gap-3 ${
                        drinks.length <= 2 ? 'grid-cols-2' : 
                        drinks.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 
                        'grid-cols-2 lg:grid-cols-3'
                      }`}>
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
                              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                <Image
                                  src={drink.image || '/images/placeholder-food.svg'}
                                  alt={drink.name}
                                  width={48}
                                  height={48}
                                  className="max-w-full max-h-full object-contain"
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
                          <span>Classic:</span>
                          <span>{BREAD_OPTIONS.find(opt => opt.id === config.breadType)?.name}</span>
                        </div>
                      )}
                      
                      {config.selectedVegetables.length > 0 ? (
                        <div className="flex justify-between">
                          <span>Crudités:</span>
                          <span>{config.selectedVegetables.join(', ')}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span>Crudités:</span>
                          <span>Sans crudités</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Frites:</span>
                        <span>Oui (inclus)</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Sauce:</span>
                        <span>{config.selectedSauces.length > 0 ? config.selectedSauces.map(s => s.name).join(', ') : 'Aucune'}</span>
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
          <div className="flex items-center justify-between gap-2 p-4 lg:p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1 md:flex-none min-h-[48px] md:min-h-0 text-base md:text-sm px-4 md:px-4 py-3 md:py-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4 md:w-4 md:h-4 md:mr-2" />
              <span className="md:inline">Préc.</span>
            </Button>

            {/* Quantité uniquement sur desktop (modification depuis le panier sur mobile) */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setConfig(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                disabled={config.quantity <= 1}
                className="p-2"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 bg-white border rounded-lg text-base">
                {config.quantity}
              </span>
              <Button
                variant="outline"
                onClick={() => setConfig(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                className="p-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleAddToCart} disabled={!canProceed()} className="flex-1 md:flex-none min-h-[48px] md:min-h-0 text-base md:text-sm px-4 md:px-4 py-3 md:py-2 font-medium">
                <span className="md:inline">Ajouter au panier</span>
                <span className="md:hidden">Ajouter</span>
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-1 md:flex-none min-h-[48px] md:min-h-0 text-base md:text-sm px-4 md:px-4 py-3 md:py-2 font-medium">
                <span className="md:inline">Suivant</span>
                <span className="md:hidden">Suiv.</span>
                <ArrowRight className="w-4 h-4 md:w-4 md:h-4 md:ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
