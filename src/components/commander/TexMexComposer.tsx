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
  { id: 'ingredients', title: 'Ingrédients', description: 'Choisissez vos ingrédients TexMex' },
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

interface TexMexIngredient {
  _id: string;
  name: string;
  image: string;
  type: string;
  price: number;
}

export default function TexMexComposer({ isOpen, onClose, onAddToCart, product }: TexMexComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [texMexIngredients, setTexMexIngredients] = useState<TexMexIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Configuration du produit
  const [config, setConfig] = useState({
    selectedIngredients: [] as TexMexIngredient[],
    selectedSauces: [] as Sauce[],
    selectedDrinks: [] as Drink[],
    drinkCounts: {} as Record<string, number>, // Pour compter les occurrences de chaque boisson
    quantity: 1
  });

  // Réinitialiser le formulaire quand il s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setConfig({
        selectedIngredients: [],
        selectedSauces: [],
        selectedDrinks: [],
        drinkCounts: {},
        quantity: 1
      });
      fetchTexMexIngredients();
      fetchDrinks();
      fetchSauces();
    }
  }, [isOpen]);

  const fetchTexMexIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients/texmex');
      const data = await response.json();
      if (data.success) {
        // Filtrer pour n'afficher que les ingrédients TexMex (nuggets, tenders, mozza sticks, hot wings)
        const filteredIngredients = data.ingredients.filter((ingredient: TexMexIngredient) => 
          ingredient.name.toLowerCase().includes('nuggets') || 
          ingredient.name.toLowerCase().includes('tenders') || 
          ingredient.name.toLowerCase().includes('mozza') || 
          ingredient.name.toLowerCase().includes('hot wings') ||
          ingredient.name.toLowerCase().includes('wings')
        );
        setTexMexIngredients(filteredIngredients);
      }
    } catch (error) {
      console.error('Error fetching TexMex ingredients:', error);
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

  const handleIngredientSelect = (ingredient: TexMexIngredient) => {
    setConfig(prev => {
      const isSelected = prev.selectedIngredients.some(ing => ing._id === ingredient._id);
      if (isSelected) {
        return {
          ...prev,
          selectedIngredients: prev.selectedIngredients.filter(ing => ing._id !== ingredient._id)
        };
      } else {
        return {
          ...prev,
          selectedIngredients: [...prev.selectedIngredients, ingredient]
        };
      }
    });
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

  const getMaxDrinks = () => {
    if (!product) return 0;
    const productName = product.name.toLowerCase();
    if (productName.includes('7 pièces')) return 1;
    if (productName.includes('14 pièces')) return 2;
    if (productName.includes('20 pièces')) return 1; // 1 boisson 1.5L
    return 0;
  };

  const handleDrinkToggle = (drink: Drink) => {
    setConfig(prev => {
      const maxDrinks = getMaxDrinks();
      const currentCount = prev.drinkCounts[drink._id] || 0;
      const totalSelected = Object.values(prev.drinkCounts).reduce((sum, count) => sum + count, 0);
      
      if (currentCount > 0) {
        // Retirer une occurrence de cette boisson
        const newCounts = { ...prev.drinkCounts };
        if (newCounts[drink._id] === 1) {
          delete newCounts[drink._id];
        } else {
          newCounts[drink._id] = newCounts[drink._id] - 1;
        }
        
        // Reconstruire la liste des boissons
        const newSelectedDrinks: Drink[] = [];
        Object.entries(newCounts).forEach(([drinkId, count]) => {
          const drinkObj = drinks.find(d => d._id === drinkId);
          if (drinkObj) {
            for (let i = 0; i < count; i++) {
              newSelectedDrinks.push(drinkObj);
            }
          }
        });
        
        return {
          ...prev,
          selectedDrinks: newSelectedDrinks,
          drinkCounts: newCounts
        };
      } else {
        // Ajouter une occurrence de cette boisson seulement si on n'a pas atteint la limite
        if (totalSelected < maxDrinks) {
          const newCounts = {
            ...prev.drinkCounts,
            [drink._id]: (prev.drinkCounts[drink._id] || 0) + 1
          };
          
          // Reconstruire la liste des boissons
          const newSelectedDrinks: Drink[] = [];
          Object.entries(newCounts).forEach(([drinkId, count]) => {
            const drinkObj = drinks.find(d => d._id === drinkId);
            if (drinkObj) {
              for (let i = 0; i < count; i++) {
                newSelectedDrinks.push(drinkObj);
              }
            }
          });
          
          return {
            ...prev,
            selectedDrinks: newSelectedDrinks,
            drinkCounts: newCounts
          };
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Défilement automatique vers le haut du contenu
      setTimeout(() => {
        const contentElement = document.querySelector('.tex-mex-content');
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
        const contentElement = document.querySelector('.tex-mex-content');
        if (contentElement) {
          contentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
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
        ingredients: config.selectedIngredients,
        sauces: config.selectedSauces,
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
        selectedIngredients: [],
        selectedSauces: [],
        selectedDrinks: [],
        drinkCounts: {},
        quantity: 1
      });
      onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.selectedIngredients.length > 0; // Au moins un ingrédient requis
      case 1: return true; // Les sauces sont optionnelles
      case 2: {
        const maxDrinks = getMaxDrinks();
        const totalSelected = Object.values(config.drinkCounts).reduce((sum, count) => sum + count, 0);
        return totalSelected <= maxDrinks; // Griser si on dépasse la limite
      }
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
          <div className="tex-mex-content p-4 lg:p-6 overflow-y-auto max-h-[50vh]">
            <AnimatePresence mode="wait">
              {/* Étape 1: Ingrédients TexMex */}
              {currentStep === 0 && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Choisissez vos ingrédients TexMex
                  </h3>
                  
                  <div className={`grid gap-3 ${
                    texMexIngredients.length <= 2 ? 'grid-cols-2' : 
                    texMexIngredients.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 
                    'grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {texMexIngredients.map((ingredient) => {
                      const isSelected = config.selectedIngredients.some(ing => ing._id === ingredient._id);
                      return (
                        <motion.button
                          key={ingredient._id}
                          onClick={() => handleIngredientSelect(ingredient)}
                          whileHover={{ scale: 1.08, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: isSelected ? 1 : 0.8, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex flex-col items-center p-3 transition-all duration-200 ${
                            isSelected
                              ? ''
                              : 'hover:opacity-100'
                          }`}
                        >
                          <motion.div 
                            className={`w-28 h-28 lg:w-32 lg:h-32 mb-2 lg:mb-3 flex items-center justify-center rounded-lg ${
                              isSelected ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200'
                            }`}
                            animate={isSelected ? { 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            } : {}}
                            transition={{ 
                              duration: 0.4,
                              ease: "easeInOut"
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Image
                              src={ingredient.image}
                              alt={ingredient.name}
                              width={128}
                              height={128}
                              className="object-contain"
                            />
                          </motion.div>
                          <span className="text-xs lg:text-sm text-center font-medium">{ingredient.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Étape 2: Sauce */}
              {currentStep === 1 && (
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
                      <motion.button
                        onClick={() => setConfig(prev => ({ ...prev, selectedSauces: [] }))}
                        whileHover={{ scale: 1.08, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: config.selectedSauces.length === 0 ? 1 : 0.8, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center p-3 transition-all duration-200 hover:opacity-100"
                      >
                        <motion.div 
                          className={`w-28 h-28 lg:w-32 lg:h-32 mb-2 lg:mb-3 flex items-center justify-center rounded-lg ${
                            config.selectedSauces.length === 0 ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200'
                          }`}
                          animate={config.selectedSauces.length === 0 ? { 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          } : {}}
                          transition={{ 
                            duration: 0.4,
                            ease: "easeInOut"
                          }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg className="w-12 h-12 lg:w-14 lg:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.div>
                        <span className="text-xs lg:text-sm text-center font-medium">Sans sauce</span>
                      </motion.button>
                      
                      {sauces.map((sauce) => {
                        const isSelected = config.selectedSauces.some(s => s._id === sauce._id);
                        const canSelect = !isSelected && config.selectedSauces.length < 2;
                        return (
                          <motion.button
                            key={sauce._id}
                            onClick={() => handleSauceSelect(sauce)}
                            disabled={!canSelect && !isSelected}
                            whileHover={canSelect || isSelected ? { scale: 1.08, y: -5 } : {}}
                            whileTap={canSelect || isSelected ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isSelected ? 1 : (canSelect ? 0.8 : 0.3), y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex flex-col items-center p-3 transition-all duration-200 ${
                              canSelect || isSelected ? 'hover:opacity-100' : ''
                            }`}
                          >
                            <motion.div 
                              className={`w-28 h-28 lg:w-32 lg:h-32 mb-2 lg:mb-3 flex items-center justify-center rounded-lg ${
                                isSelected ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200'
                              }`}
                              animate={isSelected ? { 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                              } : {}}
                              transition={{ 
                                duration: 0.4,
                                ease: "easeInOut"
                              }}
                              whileHover={canSelect || isSelected ? { scale: 1.1 } : {}}
                            >
                              <Image
                                src={sauce.image || '/images/placeholder-food.svg'}
                                alt={sauce.name}
                                width={128}
                                height={128}
                                className="object-contain"
                              />
                            </motion.div>
                            <span className="text-xs lg:text-sm text-center font-medium">{sauce.name}</span>
                          </motion.button>
                        );
                      })}
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
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
                    Boisson{getMaxDrinks() > 1 ? 's' : ''} (max {getMaxDrinks()})
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
                  <div className={`grid gap-3 ${
                    getDrinkOptions().length <= 2 ? 'grid-cols-2' : 
                    getDrinkOptions().length <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 
                    'grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {getDrinkOptions().map((drink) => {
                      const currentCount = config.drinkCounts[drink._id] || 0;
                      const maxDrinks = getMaxDrinks();
                      const totalSelected = Object.values(config.drinkCounts).reduce((sum, count) => sum + count, 0);
                      const canAdd = totalSelected < maxDrinks;
                      const isSelected = currentCount > 0;
                      
                      return (
                        <motion.button
                          key={drink._id}
                          onClick={() => handleDrinkToggle(drink)}
                          disabled={!canAdd && !isSelected}
                          whileHover={canAdd || isSelected ? { scale: 1.08, y: -5 } : {}}
                          whileTap={canAdd || isSelected ? { scale: 0.95 } : {}}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: isSelected ? 1 : (canAdd ? 0.8 : 0.3), y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex flex-col items-center p-3 transition-all duration-200 ${
                            canAdd || isSelected ? 'hover:opacity-100' : ''
                          }`}
                        >
                          <motion.div 
                            className={`w-28 h-28 lg:w-32 lg:h-32 mb-2 lg:mb-3 flex items-center justify-center rounded-lg overflow-hidden ${
                              isSelected ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200'
                            }`}
                            animate={isSelected ? { 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            } : {}}
                            transition={{ 
                              duration: 0.4,
                              ease: "easeInOut"
                            }}
                            whileHover={canAdd || isSelected ? { scale: 1.1 } : {}}
                          >
                            <div className="relative w-full h-full">
                              <Image
                                src={drink.image || '/images/placeholder-food.svg'}
                                alt={drink.name}
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 768px) 112px, 128px"
                              />
                            </div>
                          </motion.div>
                          <span className="text-xs lg:text-sm text-center font-medium">{drink.name}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {product?.name.toLowerCase().includes('20 pièces') ? '1.5L' : '33cl'}
                          </span>
                          {currentCount > 0 && (
                            <div className="mt-1 flex items-center justify-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Diminuer la quantité
                                  const newCounts = { ...config.drinkCounts };
                                  if (newCounts[drink._id] === 1) {
                                    delete newCounts[drink._id];
                                  } else {
                                    newCounts[drink._id] = newCounts[drink._id] - 1;
                                  }
                                  
                                  // Reconstruire la liste des boissons
                                  const newSelectedDrinks: Drink[] = [];
                                  Object.entries(newCounts).forEach(([drinkId, count]) => {
                                    const drinkObj = drinks.find(d => d._id === drinkId);
                                    if (drinkObj) {
                                      for (let i = 0; i < count; i++) {
                                        newSelectedDrinks.push(drinkObj);
                                      }
                                    }
                                  });
                                  
                                  setConfig(prev => ({
                                    ...prev,
                                    selectedDrinks: newSelectedDrinks,
                                    drinkCounts: newCounts
                                  }));
                                }}
                                className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                -
                              </button>
                              <span className="text-sm font-bold text-primary">{currentCount}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (canAdd) {
                                    // Augmenter la quantité
                                    const newCounts = {
                                      ...config.drinkCounts,
                                      [drink._id]: (config.drinkCounts[drink._id] || 0) + 1
                                    };
                                    
                                    // Reconstruire la liste des boissons
                                    const newSelectedDrinks: Drink[] = [];
                                    Object.entries(newCounts).forEach(([drinkId, count]) => {
                                      const drinkObj = drinks.find(d => d._id === drinkId);
                                      if (drinkObj) {
                                        for (let i = 0; i < count; i++) {
                                          newSelectedDrinks.push(drinkObj);
                                        }
                                      }
                                    });
                                    
                                    setConfig(prev => ({
                                      ...prev,
                                      selectedDrinks: newSelectedDrinks,
                                      drinkCounts: newCounts
                                    }));
                                  }
                                }}
                                disabled={!canAdd}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  canAdd 
                                    ? 'bg-primary text-white hover:bg-primary/80' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
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
                        <span>Ingrédients:</span>
                        <span>
                          {config.selectedIngredients.length > 0 
                            ? config.selectedIngredients.map(ing => ing.name).join(', ')
                            : 'Aucun'
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Sauce:</span>
                        <span>{config.selectedSauces.length > 0 ? config.selectedSauces.map(s => s.name).join(', ') : 'Aucune'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Boisson{Object.values(config.drinkCounts).reduce((sum, count) => sum + count, 0) > 1 ? 's' : ''}:</span>
                        <span>
                          {Object.keys(config.drinkCounts).length > 0 
                            ? Object.entries(config.drinkCounts)
                                .map(([drinkId, count]) => {
                                  const drink = drinks.find(d => d._id === drinkId);
                                  return drink ? `${count}x ${drink.name}` : '';
                                })
                                .filter(Boolean)
                                .join(', ')
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

            {currentStep === STEPS.length - 1 ? (
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

