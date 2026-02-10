import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Buttons';

interface TacosComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
}

interface TacosOptions {
  meats: any[];
  sauces: any[];
  ingredients: any[];
  sizes: any[];
}

interface SelectedMeat {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SelectedSauce {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SelectedIngredient {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
}

const STEPS = [
  { id: 'type', title: 'Type', description: 'Choisissez entre tacos ou bowl' },
  { id: 'size', title: 'Taille', description: 'Sélectionnez la taille' },
  { id: 'meat', title: 'Viandes', description: 'Choisissez vos viandes' },
  { id: 'sauces', title: 'Sauces', description: 'Sélectionnez vos sauces' },
  { id: 'ingredients', title: 'Suppléments', description: 'Ajoutez des suppléments' },
  { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre commande' }
];

export default function TacosComposer({ isOpen, onClose, onAddToCart }: TacosComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [options, setOptions] = useState<TacosOptions>({ meats: [], sauces: [], ingredients: [], sizes: [] });
  const [loading, setLoading] = useState(false);
  
  // Configuration du tacos
  const [config, setConfig] = useState({
    type: 'tacos' as 'tacos' | 'bowl',
    size: 'M',
    meats: [] as SelectedMeat[],
    meatCounts: {} as Record<string, number>, // Pour compter les occurrences de chaque viande
    sauces: [] as SelectedSauce[],
    noSauce: false, // Indicateur pour "Sans sauce"
    ingredients: [] as SelectedIngredient[],
    quantity: 1
  });

  // Réinitialiser le formulaire quand il s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setConfig({
        type: 'tacos',
        size: 'M',
        meats: [],
        meatCounts: {},
        sauces: [],
        noSauce: false,
        ingredients: [],
        quantity: 1
      });
      fetchTacosOptions();
    }
  }, [isOpen]);

  const fetchTacosOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/tacos-options');
      const data = await response.json();
      if (data.success) {
        // Filtrer les viandes disponibles dans les ingrédients
        const meats = data.data.ingredients.filter((ing: any) => ing.type === 'meat');
        
        setOptions({
          meats,
          sauces: data.data.sauces,
          ingredients: data.data.ingredients, // Tous les ingrédients
          sizes: [
            { name: 'M', price: 6.50, description: '1 tortilla - 1 viande', tortillas: 1, maxMeats: 1 },
            { name: 'L', price: 7.50, description: '1 tortilla - 2 viandes', tortillas: 1, maxMeats: 2 },
            { name: 'XL', price: 8.50, description: '2 tortillas - 3 viandes', tortillas: 2, maxMeats: 3 }
          ]
        });

        // Ajouter fromagère par défaut
        const fromagereSauce = data.data.sauces.find((sauce: any) => 
          sauce.name.toLowerCase().includes('fromagère')
        );
        if (fromagereSauce) {
          setConfig(prev => ({
            ...prev,
            sauces: [{
              id: fromagereSauce._id,
              name: fromagereSauce.name,
              price: 0,
              image: fromagereSauce.image
            }]
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching tacos options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: 'tacos' | 'bowl') => {
    setConfig(prev => ({ ...prev, type }));
    if (type === 'bowl') {
      // Pour bowl, passer directement aux viandes (pas de taille)
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  };

  const handleSizeChange = (size: string) => {
    setConfig(prev => ({ ...prev, size }));
    setCurrentStep(2);
  };

  const getMaxMeats = () => {
    const selectedSize = options.sizes.find(s => s.name === config.size);
    return selectedSize ? selectedSize.maxMeats : 1;
  };

  const handleMeatToggle = (meat: any) => {
    setConfig(prev => {
      const maxMeats = getMaxMeats();
      const currentCount = prev.meatCounts[meat._id] || 0;
      const totalSelected = Object.values(prev.meatCounts).reduce((sum, count) => sum + count, 0);
      
      if (currentCount > 0 && totalSelected > 0) { // Allow removing if already selected and total > 0
        const newCounts = { ...prev.meatCounts };
        if (newCounts[meat._id] === 1) {
          delete newCounts[meat._id];
        } else {
          newCounts[meat._id] = newCounts[meat._id] - 1;
        }
        
        // Rebuild meats array
        const newMeats: SelectedMeat[] = [];
        Object.entries(newCounts).forEach(([meatId, count]) => {
          const meatData = options.meats.find(m => m._id === meatId);
          if (meatData) {
            for (let i = 0; i < (count as number); i++) {
              newMeats.push({
                id: meatData._id,
                name: meatData.name,
                price: 0,
                image: meatData.image
              });
            }
          }
        });
        
        return { ...prev, meats: newMeats, meatCounts: newCounts };
      } else if (totalSelected < maxMeats) {
        const newCounts = {
          ...prev.meatCounts,
          [meat._id]: (prev.meatCounts[meat._id] || 0) + 1
        };
        
        // Rebuild meats array
        const newMeats: SelectedMeat[] = [];
        Object.entries(newCounts).forEach(([meatId, count]) => {
          const meatData = options.meats.find(m => m._id === meatId);
          if (meatData) {
            for (let i = 0; i < (count as number); i++) {
              newMeats.push({
                id: meatData._id,
                name: meatData.name,
                price: 0,
                image: meatData.image
              });
            }
          }
        });
        
        return { ...prev, meats: newMeats, meatCounts: newCounts };
      }
      return prev;
    });
  };

  const handleSauceToggle = (sauce: any) => {
    setConfig(prev => {
      // Si "Sans sauce" est activé, on ne peut pas sélectionner de sauces
      if (prev.noSauce) {
        return prev;
      }
      
      const isSelected = prev.sauces.some(s => s.id === sauce._id);
      let newSauces = [...prev.sauces];
      
      if (isSelected) {
        // Ne pas permettre de décocher fromagère
        if (sauce.name.toLowerCase().includes('fromagère')) {
          return prev;
        }
        // Permettre de décocher les autres sauces
        newSauces = newSauces.filter(s => s.id !== sauce._id);
      } else {
        // Maximum 3 sauces (plus fromagère par défaut)
        const nonFromagereCount = newSauces.filter(s => !s.name.toLowerCase().includes('fromagère')).length;
        if (nonFromagereCount < 2) { // 2 sauces max + fromagère
          newSauces.push({
            id: sauce._id,
            name: sauce.name,
            price: 0, // Les sauces sont gratuites
            image: sauce.image
          });
        }
      }
      
      return { ...prev, sauces: newSauces };
    });
  };
  
  const handleNoSauceToggle = () => {
    setConfig(prev => ({
      ...prev,
      noSauce: !prev.noSauce,
      sauces: prev.noSauce ? prev.sauces : [] // Vider les sauces si on active "Sans sauce"
    }));
  };

  const handleIngredientToggle = (ingredient: any) => {
    setConfig(prev => {
      const isSelected = prev.ingredients.some(i => i.id === ingredient._id);
      let newIngredients = [...prev.ingredients];
      
      if (isSelected) {
        // Décocher l'ingrédient
        newIngredients = newIngredients.filter(i => i.id !== ingredient._id);
      } else {
        // Ajouter l'ingrédient
        newIngredients.push({
          id: ingredient._id,
          name: ingredient.name,
          price: ingredient.type === 'meat' ? 1.50 : 0.50, // Prix selon le type
          image: ingredient.image,
          type: ingredient.type
        });
      }
      
      return { ...prev, ingredients: newIngredients };
    });
  };

  const calculatePrice = () => {
    const sizePrice = config.type === 'bowl' ? 7.50 : 
      config.size === 'M' ? 6.50 : 
      config.size === 'L' ? 7.50 : 8.50;
    
    const meatsPrice = config.meats.reduce((sum, meat) => sum + meat.price, 0);
    const ingredientsPrice = config.ingredients.reduce((sum, ing) => sum + ing.price, 0);
    
    return sizePrice + meatsPrice + ingredientsPrice;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.type === 'tacos' || config.type === 'bowl';
      case 1: return config.type === 'bowl' || config.size !== '';
      case 2: {
        const maxMeats = getMaxMeats();
        const totalSelected = Object.values(config.meatCounts).reduce((sum, count) => sum + count, 0);
        return totalSelected > 0 && totalSelected <= maxMeats;
      }
      case 3: return config.sauces.length >= 1; // Minimum 1 sauce
      case 4: return true; // Les suppléments sont optionnels
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddToCart = () => {
    const tacos = {
      _id: `tacos-${Date.now()}`,
      name: `${config.type === 'bowl' ? 'Bowl' : `Tacos ${config.size}`} ${config.meats.map(m => m.name).join(', ')}`,
      price: calculatePrice(),
      image: config.type === 'bowl' ? '/images/menu/format-bowl.jpg' : '/images/menu/format-tacos.jpg',
      category: 'tacos',
      type: 'food',
      customIngredients: {
        type: config.type,
        size: config.size,
        meats: config.meats,
        sauces: config.sauces,
        ingredients: config.ingredients
      }
    };
    
    onAddToCart(tacos);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setConfig({
      type: 'tacos',
      size: 'M',
      meats: [],
      meatCounts: {},
      sauces: [],
      noSauce: false,
      ingredients: [],
      quantity: 1
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col lg:max-w-5xl lg:max-h-[95vh] lg:rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">Composez votre {config.type === 'bowl' ? 'Bowl' : 'Tacos'}</h2>
              <p className="text-sm lg:text-base text-gray-600 truncate">{STEPS[currentStep].description}</p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs lg:text-sm text-gray-500">Prix total</p>
                <p className="text-lg lg:text-2xl font-bold text-orange-600">{calculatePrice()}€</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50">
            <div className="flex items-center justify-between overflow-x-auto">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-1 lg:ml-2 text-xs lg:text-sm whitespace-nowrap ${
                    index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < STEPS.length - 1 && (
                    <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 mx-2 lg:mx-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* Step 1: Type Selection */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Choisissez votre type</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTypeChange('tacos')}
                        className={`overflow-hidden border-2 rounded-lg text-center transition-colors ${
                          config.type === 'tacos' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            src="/images/menu/format-tacos.jpg"
                            alt="Tacos"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 lg:p-4">
                          <h4 className="font-semibold text-base lg:text-lg">Tacos</h4>
                          <p className="text-xs lg:text-sm text-gray-600">À partir de 6.50€</p>
                        </div>
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTypeChange('bowl')}
                        className={`overflow-hidden border-2 rounded-lg text-center transition-colors ${
                          config.type === 'bowl' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            src="/images/menu/format-bowl.jpg"
                            alt="Bowl"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 lg:p-4">
                          <h4 className="font-semibold text-base lg:text-lg">Bowl</h4>
                          <p className="text-xs lg:text-sm text-gray-600">7.50€ - 1 viande, 2 sauces max</p>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 2: Size Selection (only for tacos) */}
                {currentStep === 1 && config.type === 'tacos' && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Choisissez la taille</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                      {options.sizes.map((size) => (
                        <motion.button
                          key={size.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSizeChange(size.name)}
                          className={`p-3 lg:p-4 border-2 rounded-lg text-center transition-colors ${
                            config.size === size.name 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <h4 className="font-semibold text-base lg:text-lg">{size.name}</h4>
                          <p className="text-xs lg:text-sm text-gray-600">{size.description}</p>
                          <p className="font-semibold text-orange-600 text-sm lg:text-base">{size.price}€</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Meat Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                      Choisissez vos viandes
                      {config.type === 'bowl' && <span className="text-xs lg:text-sm text-gray-600 ml-2">(1 maximum)</span>}
                      {config.type === 'tacos' && <span className="text-xs lg:text-sm text-gray-600 ml-2">({config.size === 'M' ? '1' : config.size === 'L' ? '2' : '3'} maximum)</span>}
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                      {options.meats.map((meat) => {
                        const currentCount = config.meatCounts[meat._id] || 0;
                        const maxMeats = getMaxMeats();
                        const totalSelected = Object.values(config.meatCounts).reduce((sum, count) => sum + count, 0);
                        const canAdd = totalSelected < maxMeats;
                        const isSelected = currentCount > 0;
                        
                        return (
                          <motion.button
                            key={meat._id}
                            whileHover={{ scale: (canAdd || isSelected) ? 1.02 : 1 }}
                            whileTap={{ scale: (canAdd || isSelected) ? 0.98 : 1 }}
                            onClick={() => (canAdd || isSelected) && handleMeatToggle(meat)}
                            disabled={!canAdd && !isSelected}
                            className={`p-3 lg:p-4 border-2 rounded-lg text-left transition-colors relative overflow-hidden ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : canAdd
                                  ? 'border-gray-200 hover:border-orange-300'
                                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="relative w-full h-16 lg:h-24 mb-2">
                              <Image
                                src={meat.image}
                                alt={meat.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-xs lg:text-base">{meat.name}</h4>
                            <p className="text-xs text-gray-600">Inclus</p>
                            {currentCount > 0 && (
                              <div className="mt-1 flex items-center justify-center space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMeatToggle(meat);
                                  }}
                                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  -
                                </button>
                                <span className="text-sm font-bold text-orange-600">{currentCount}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (canAdd) {
                                      handleMeatToggle(meat);
                                    }
                                  }}
                                  disabled={!canAdd}
                                  className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  +
                                </button>
                              </div>
                            )}
                            {isSelected && <Check className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500 absolute top-2 right-2" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Sauce Selection */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                      Choisissez vos sauces (3 maximum)
                    </h3>
                    <div className="space-y-4">
                      {/* Grille responsive des sauces */}
                      <div className={`grid gap-3 ${
                        options.sauces.length <= 2 ? 'grid-cols-2' : 
                        options.sauces.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 
                        'grid-cols-2 lg:grid-cols-3'
                      }`}>
                        {/* Option "Sans sauce" - Alignée comme les crudités */}
                        <button
                          onClick={handleNoSauceToggle}
                          className={`flex flex-col items-center p-3 lg:p-4 border-2 rounded-xl transition-all duration-200 ${
                            config.noSauce
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
                        
                        {options.sauces.map((sauce) => {
                          const isSelected = config.sauces.some(s => s.id === sauce._id);
                          const canSelect = !isSelected && !config.noSauce && config.sauces.length < 3;
                          const canDeselect = isSelected && !config.noSauce && !sauce.name.toLowerCase().includes('fromagère');
                          
                          return (
                            <motion.button
                              key={sauce._id}
                              whileHover={{ scale: (canSelect || canDeselect) ? 1.02 : 1 }}
                              whileTap={{ scale: (canSelect || canDeselect) ? 0.98 : 1 }}
                              onClick={() => (canSelect || canDeselect) && handleSauceToggle(sauce)}
                              disabled={!canSelect && !canDeselect}
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
                                  src={sauce.image}
                                  alt={sauce.name}
                                  width={64}
                                  height={64}
                                  className="object-contain rounded-lg"
                                />
                              </div>
                              <span className="text-xs lg:text-sm text-center font-medium">{sauce.name}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Supplements */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Suppléments (optionnel)</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      {options.ingredients.map((ingredient) => {
                        const isSelected = config.ingredients.some(i => i.id === ingredient._id);
                        
                        return (
                          <motion.button
                            key={ingredient._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleIngredientToggle(ingredient)}
                            className={`p-3 lg:p-4 border-2 rounded-lg text-left transition-colors ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="relative w-full h-16 lg:h-20 mb-2">
                              <Image
                                src={ingredient.image}
                                alt={ingredient.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-xs lg:text-sm">{ingredient.name}</h4>
                            <p className="text-xs text-gray-600">
                              +{ingredient.type === 'meat' ? '1.50€' : '0.50€'}
                            </p>
                            {isSelected && <Check className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500 absolute top-2 right-2" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 6: Summary */}
                {currentStep === 5 && (
                  <div className="space-y-4 lg:space-y-6">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Récapitulatif de votre commande</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Composition :</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{config.type === 'bowl' ? 'Bowl' : `Tacos ${config.size}`}</span>
                          <span>{config.type === 'bowl' ? '7.50€' : config.size === 'M' ? '6.50€' : config.size === 'L' ? '7.50€' : '8.50€'}</span>
                        </div>
                        
                        {Object.entries(config.meatCounts).map(([meatId, count]) => {
                          const meat = options.meats.find(m => m._id === meatId);
                          return meat ? (
                            <div key={meatId} className="flex justify-between">
                              <span>Viande : {meat.name} {count > 1 ? `(x${count})` : ''}</span>
                              <span>Inclus</span>
                            </div>
                          ) : null;
                        })}
                        
                        {config.sauces.map((sauce, index) => (
                          <div key={index} className="flex justify-between">
                            <span>Sauce : {sauce.name}</span>
                            <span>Gratuit</span>
                          </div>
                        ))}
                        
                        {config.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex justify-between">
                            <span>Supplément : {ingredient.name}</span>
                            <span>+{ingredient.price}€</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total :</span>
                          <span>{calculatePrice()}€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 p-4 lg:p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? handleClose : handlePrevious}
              className="min-h-[48px] lg:min-h-0 px-4 py-3 lg:py-2 text-base font-medium"
            >
              <ArrowLeft className="w-5 h-5 lg:w-4 lg:h-4 lg:mr-2 shrink-0" />
              <span className="lg:hidden">{currentStep === 0 ? 'Annuler' : 'Prec'}</span>
              <span className="hidden lg:inline">{currentStep === 0 ? 'Annuler' : 'Précédent'}</span>
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="min-h-[48px] lg:min-h-0 px-4 py-3 lg:py-2 text-base font-medium"
              >
                <span className="lg:hidden">Suiv</span>
                <span className="hidden lg:inline">Suivant</span>
                <ArrowRight className="w-5 h-5 lg:w-4 lg:h-4 lg:ml-2 shrink-0" />
              </Button>
            ) : (
              <Button onClick={handleAddToCart} className="min-h-[48px] lg:min-h-0 px-4 py-3 lg:py-2 text-base font-medium">
                <span className="hidden lg:inline">Ajouter au panier ({calculatePrice()}€)</span>
                <span className="lg:hidden">+ {calculatePrice()}€</span>
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}