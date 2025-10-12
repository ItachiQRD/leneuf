import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import Image from 'next/image';

interface PaniniComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (panini: any) => void;
}

interface Ingredient {
  _id: string;
  name: string;
  image: string;
  price: number;
  type: 'meat' | 'cheese' | 'vegetable' | 'extra';
}

interface SelectedIngredients {
  baseIngredients: Ingredient[];
  sauce: Ingredient | null;
  supplements: Ingredient[];
}

const STEPS = [
  { id: 'ingredients', title: 'Choisissez votre ingrédient', description: 'Sélectionnez votre ingrédient de base' },
  { id: 'sauce', title: 'Choisissez votre sauce', description: 'Sélectionnez une sauce (1 maximum)' },
  { id: 'supplements', title: 'Suppléments (optionnel)', description: 'Ajoutez des suppléments pour 1€ chacun' },
  { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre composition' }
];

export default function PaniniComposer({ isOpen, onClose, onAddToCart }: PaniniComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [sauces, setSauces] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredients>({
    baseIngredients: [],
    sauce: null,
    supplements: []
  });

  // Récupérer les ingrédients depuis la base de données
  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    }
  }, [isOpen]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/tacos-options');
      const data = await response.json();
      
      if (data.success) {
        setIngredients(data.data.ingredients);
        setSauces(data.data.sauces);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ingrédients:', error);
    } finally {
      setLoading(false);
    }
  };

  const baseIngredients = ingredients.filter(ing => 
    (ing.type === 'meat' && ['kebab', 'jambon', 'thon', 'saumon', 'poulet', 'viande hachée'].some(name => 
      ing.name.toLowerCase().includes(name.toLowerCase())
    )) ||
    (ing.type === 'cheese' && ['mozzarella', 'chèvre', 'miel'].some(name => 
      ing.name.toLowerCase().includes(name.toLowerCase())
    ))
  );

  const supplements = ingredients.filter(ing => ing.type !== 'meat'); // Exclure seulement les viandes, garder fromages et légumes

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

  const handleBaseIngredientToggle = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => {
      const isSelected = prev.baseIngredients.some(i => i._id === ingredient._id);
      if (isSelected) {
        // Décocher l'ingrédient
        return {
          ...prev,
          baseIngredients: prev.baseIngredients.filter(i => i._id !== ingredient._id)
        };
      } else {
        // Remplacer l'ingrédient existant (un seul autorisé)
        return {
          ...prev,
          baseIngredients: [ingredient]
        };
      }
    });
  };

  const handleSauceToggle = (sauce: Ingredient) => {
    setSelectedIngredients(prev => {
      const isSelected = prev.sauce?._id === sauce._id;
      if (isSelected) {
        // Décocher la sauce
        return {
          ...prev,
          sauce: null
        };
      } else {
        // Remplacer la sauce existante (une seule autorisée)
        return {
          ...prev,
          sauce: sauce
        };
      }
    });
  };

  const handleSupplementToggle = (supplement: Ingredient) => {
    setSelectedIngredients(prev => {
      const isSelected = prev.supplements.some(s => s._id === supplement._id);
      if (isSelected) {
        return {
          ...prev,
          supplements: prev.supplements.filter(s => s._id !== supplement._id)
        };
      } else {
        return {
          ...prev,
          supplements: [...prev.supplements, supplement]
        };
      }
    });
  };

  const calculatePrice = () => {
    let price = 0;
    // Prix des ingrédients de base (viandes et fromages)
    price += selectedIngredients.baseIngredients.reduce((sum, ing) => sum + ing.price, 0);
    // Prix de la sauce (gratuite)
    // Prix des suppléments (1€ chacun)
    price += selectedIngredients.supplements.length;
    return price;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedIngredients.baseIngredients.length > 0;
      case 1: return true; // Les sauces sont optionnelles
      case 2: return true; // Les suppléments sont optionnels
      case 3: return true;
      default: return false;
    }
  };

  const handleAddToCart = () => {
    const panini = {
      _id: `panini-${Date.now()}`,
      name: `Panini ${selectedIngredients.baseIngredients.map(i => i.name).join(', ')}`,
      price: calculatePrice(),
      image: selectedIngredients.baseIngredients[0]?.image || '/images/panini-placeholder.jpg',
      category: 'paninis',
      type: 'food',
      customIngredients: selectedIngredients
    };
    
    onAddToCart(panini);
    onClose();
  };

  const resetComposer = () => {
    setCurrentStep(0);
    setSelectedIngredients({
      baseIngredients: [],
      sauce: null,
      supplements: []
    });
  };

  const handleClose = () => {
    resetComposer();
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
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">Composez votre Panini</h2>
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
                {/* Step 1: Base Ingredients Selection */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Choisissez vos ingrédients de base</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                      {baseIngredients.map((ingredient) => {
                        const isSelected = selectedIngredients.baseIngredients.some(i => i._id === ingredient._id);
                        return (
                          <motion.button
                            key={ingredient._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBaseIngredientToggle(ingredient)}
                            className={`p-3 lg:p-4 border-2 rounded-lg text-left transition-colors ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="relative w-full h-24 lg:h-32 mb-2 lg:mb-3">
                              <Image
                                src={ingredient.image}
                                alt={ingredient.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm lg:text-base">{ingredient.name}</h4>
                            <p className="text-xs lg:text-sm text-gray-600">{ingredient.price}€</p>
                            {isSelected && <Check className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500 absolute top-2 right-2" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Sauce */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Choisissez votre sauce (1 maximum)</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      {sauces.map((sauce) => {
                        const isSelected = selectedIngredients.sauce?._id === sauce._id;
                        return (
                          <motion.button
                            key={sauce._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSauceToggle(sauce)}
                            className={`p-3 lg:p-4 border-2 rounded-lg text-left transition-colors relative overflow-hidden ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="relative w-full h-24 lg:h-32 mb-2 lg:mb-3">
                              <Image
                                src={sauce.image}
                                alt={sauce.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm lg:text-base">{sauce.name}</h4>
                            <p className="text-xs lg:text-sm text-gray-600">Gratuit</p>
                            {isSelected && <Check className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500 absolute top-2 right-2" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Supplements */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Suppléments (1€ chacun)</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      {supplements.map((supplement) => {
                        const isSelected = selectedIngredients.supplements.some(s => s._id === supplement._id);
                        return (
                          <motion.button
                            key={supplement._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSupplementToggle(supplement)}
                            className={`p-3 lg:p-4 border rounded-lg transition-colors text-left ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="relative w-full h-20 lg:h-24 mb-2">
                              <Image
                                src={supplement.image}
                                alt={supplement.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-xs lg:text-sm">{supplement.name}</h4>
                            <p className="text-xs text-gray-600">+1€</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Summary */}
                {currentStep === 3 && (
                  <div className="space-y-4 lg:space-y-6">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Récapitulatif de votre panini</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Composition :</h4>
                      <div className="space-y-2">
                        {selectedIngredients.baseIngredients.map((ingredient, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{ingredient.name}</span>
                            <span>{ingredient.price}€</span>
                          </div>
                        ))}
                        {selectedIngredients.sauce && (
                          <div className="flex justify-between">
                            <span>Sauce : {selectedIngredients.sauce.name}</span>
                            <span>Gratuit</span>
                          </div>
                        )}
                        {selectedIngredients.supplements.map((supplement, index) => (
                          <div key={index} className="flex justify-between">
                            <span>Supplément : {supplement.name}</span>
                            <span>1€</span>
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
          <div className="flex items-center justify-between p-4 lg:p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? handleClose : handlePrevious}
              className="text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2"
            >
              <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              {currentStep === 0 ? 'Annuler' : 'Précédent'}
            </Button>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2"
                >
                  Suivant
                  <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
                </Button>
              ) : (
                <Button onClick={handleAddToCart} className="text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2">
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
