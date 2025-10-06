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
    sauces: [] as SelectedSauce[],
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
        sauces: [],
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

  const handleMeatToggle = (meat: any) => {
    setConfig(prev => {
      const isSelected = prev.meats.some(m => m.id === meat._id);
      let newMeats = [...prev.meats];
      
      if (isSelected) {
        // Décocher la viande
        newMeats = newMeats.filter(m => m.id !== meat._id);
      } else {
        // Vérifier la limite selon le type et la taille
        const maxMeats = prev.type === 'bowl' ? 1 : 
          prev.size === 'M' ? 1 : 
          prev.size === 'L' ? 2 : 3;
        
        if (newMeats.length < maxMeats) {
          newMeats.push({
            id: meat._id,
            name: meat.name,
            price: 0, // Les viandes sont gratuites
            image: meat.image
          });
        }
      }
      
      return { ...prev, meats: newMeats };
    });
  };

  const handleSauceToggle = (sauce: any) => {
    setConfig(prev => {
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
      case 2: return config.meats.length > 0;
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
      image: config.meats[0]?.image || '/images/tacos-placeholder.jpg',
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
      sauces: [],
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
          className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Composez votre {config.type === 'bowl' ? 'Bowl' : 'Tacos'}</h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Prix total</p>
                <p className="text-2xl font-bold text-orange-600">{calculatePrice()}€</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${
                    index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 mx-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* Step 1: Type Selection */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choisissez votre type</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTypeChange('tacos')}
                        className={`p-6 border-2 rounded-lg text-center transition-colors ${
                          config.type === 'tacos' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-4xl mb-2">🌮</div>
                        <h4 className="font-semibold text-lg">Tacos</h4>
                        <p className="text-sm text-gray-600">À partir de 6.50€</p>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTypeChange('bowl')}
                        className={`p-6 border-2 rounded-lg text-center transition-colors ${
                          config.type === 'bowl' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-4xl mb-2">🥗</div>
                        <h4 className="font-semibold text-lg">Bowl</h4>
                        <p className="text-sm text-gray-600">7.50€ - 1 viande, 2 sauces max</p>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 2: Size Selection (only for tacos) */}
                {currentStep === 1 && config.type === 'tacos' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choisissez la taille</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {options.sizes.map((size) => (
                        <motion.button
                          key={size.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSizeChange(size.name)}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            config.size === size.name 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <h4 className="font-semibold text-lg">{size.name}</h4>
                          <p className="text-sm text-gray-600">{size.description}</p>
                          <p className="font-semibold text-orange-600">{size.price}€</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Meat Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choisissez vos viandes
                      {config.type === 'bowl' && <span className="text-sm text-gray-600 ml-2">(1 maximum)</span>}
                      {config.type === 'tacos' && <span className="text-sm text-gray-600 ml-2">({config.size === 'M' ? '1' : config.size === 'L' ? '2' : '3'} maximum)</span>}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {options.meats.map((meat) => {
                        const isSelected = config.meats.some(m => m.id === meat._id);
                        const maxMeats = config.type === 'bowl' ? 1 : 
                          config.size === 'M' ? 1 : 
                          config.size === 'L' ? 2 : 3;
                        const canSelect = !isSelected && config.meats.length < maxMeats;
                        const canDeselect = isSelected;
                        
                        return (
                          <motion.button
                            key={meat._id}
                            whileHover={{ scale: (canSelect || canDeselect) ? 1.02 : 1 }}
                            whileTap={{ scale: (canSelect || canDeselect) ? 0.98 : 1 }}
                            onClick={() => (canSelect || canDeselect) && handleMeatToggle(meat)}
                            disabled={!canSelect && !canDeselect}
                            className={`p-4 border-2 rounded-lg text-left transition-colors relative overflow-hidden ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : canSelect
                                  ? 'border-gray-200 hover:border-orange-300'
                                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="relative w-full h-24 mb-2">
                              <Image
                                src={meat.image}
                                alt={meat.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900">{meat.name}</h4>
                            <p className="text-sm text-gray-600">Gratuit</p>
                            {isSelected && <Check className="w-5 h-5 text-orange-500 absolute top-2 right-2" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Sauce Selection */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Choisissez vos sauces (1 minimum, 3 maximum)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {options.sauces.map((sauce) => {
                        const isSelected = config.sauces.some(s => s.id === sauce._id);
                        const canSelect = !isSelected && config.sauces.length < 3;
                        const canDeselect = isSelected && !sauce.name.toLowerCase().includes('fromagère');
                        
                        return (
                          <motion.button
                            key={sauce._id}
                            whileHover={{ scale: (canSelect || canDeselect) ? 1.02 : 1 }}
                            whileTap={{ scale: (canSelect || canDeselect) ? 0.98 : 1 }}
                            onClick={() => (canSelect || canDeselect) && handleSauceToggle(sauce)}
                            disabled={!canSelect && !canDeselect}
                            className={`p-4 border-2 rounded-lg text-left transition-colors ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : canSelect
                                  ? 'border-gray-200 hover:border-orange-300'
                                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="relative w-full h-20 mb-2">
                              <Image
                                src={sauce.image}
                                alt={sauce.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{sauce.name}</h4>
                            <p className="text-xs text-gray-600">Gratuit</p>
                            {isSelected && <Check className="w-4 h-4 text-orange-500 absolute top-2 right-2" />}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {/* Option sans sauces */}
                    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <p className="text-gray-600">Pas de sauces ?</p>
                      <p className="text-sm text-gray-500">Vous devez sélectionner au moins une sauce</p>
                    </div>
                  </div>
                )}

                {/* Step 5: Supplements */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Suppléments (optionnel)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {options.ingredients.map((ingredient) => {
                        const isSelected = config.ingredients.some(i => i.id === ingredient._id);
                        
                        return (
                          <motion.button
                            key={ingredient._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleIngredientToggle(ingredient)}
                            className={`p-4 border-2 rounded-lg text-left transition-colors ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="relative w-full h-20 mb-2">
                              <Image
                                src={ingredient.image}
                                alt={ingredient.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{ingredient.name}</h4>
                            <p className="text-xs text-gray-600">
                              +{ingredient.type === 'meat' ? '1.50€' : '0.50€'}
                            </p>
                            {isSelected && <Check className="w-4 h-4 text-orange-500 absolute top-2 right-2" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 6: Summary */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif de votre commande</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Composition :</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{config.type === 'bowl' ? 'Bowl' : `Tacos ${config.size}`}</span>
                          <span>{config.type === 'bowl' ? '7.50€' : config.size === 'M' ? '6.50€' : config.size === 'L' ? '7.50€' : '8.50€'}</span>
                        </div>
                        
                        {config.meats.map((meat, index) => (
                          <div key={index} className="flex justify-between">
                            <span>Viande : {meat.name}</span>
                            <span>+1.50€</span>
                          </div>
                        ))}
                        
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
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? handleClose : handlePrevious}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 0 ? 'Annuler' : 'Précédent'}
            </Button>

            <div className="flex items-center space-x-4">
              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleAddToCart}>
                  Ajouter au panier ({calculatePrice()}€)
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}