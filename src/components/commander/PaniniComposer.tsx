import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
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
  meat: Ingredient | null;
  cheese: Ingredient | null;
  supplements: Ingredient[];
}

const STEPS = [
  { id: 'meat', title: 'Choisissez votre viande', description: 'Sélectionnez la viande de votre panini' },
  { id: 'cheese', title: 'Choisissez votre fromage', description: 'Sélectionnez le fromage de votre panini' },
  { id: 'supplements', title: 'Suppléments (optionnel)', description: 'Ajoutez des suppléments pour 1€ chacun' },
  { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre composition' }
];

export default function PaniniComposer({ isOpen, onClose, onAddToCart }: PaniniComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredients>({
    meat: null,
    cheese: null,
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
        setIngredients([...data.ingredients, ...data.sauces]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ingrédients:', error);
    } finally {
      setLoading(false);
    }
  };

  const meats = ingredients.filter(ing => ing.type === 'meat' && 
    ['kebab', 'jambon', 'thon', 'saumon', 'poulet', 'viande hachée'].some(name => 
      ing.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  const cheeses = ingredients.filter(ing => ing.type === 'cheese' && 
    ['mozzarella', 'chèvre', 'miel'].some(name => 
      ing.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  const supplements = ingredients.filter(ing => ing.type === 'vegetable' || ing.type === 'extra');

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

  const handleMeatSelect = (meat: Ingredient) => {
    setSelectedIngredients(prev => ({ ...prev, meat }));
    handleNext();
  };

  const handleCheeseSelect = (cheese: Ingredient) => {
    setSelectedIngredients(prev => ({ ...prev, cheese }));
    handleNext();
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
    if (selectedIngredients.meat) price += selectedIngredients.meat.price;
    if (selectedIngredients.cheese) price += selectedIngredients.cheese.price;
    price += selectedIngredients.supplements.length; // 1€ par supplément
    return price;
  };

  const handleAddToCart = () => {
    const panini = {
      _id: `panini-${Date.now()}`,
      name: `Panini ${selectedIngredients.meat?.name} ${selectedIngredients.cheese?.name}`,
      price: calculatePrice(),
      image: selectedIngredients.meat?.image || '/images/panini-placeholder.jpg',
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
      meat: null,
      cheese: null,
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
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Composez votre Panini</h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* Step 1: Meat Selection */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choisissez votre viande</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {meats.map((meat) => (
                        <motion.button
                          key={meat._id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMeatSelect(meat)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
                        >
                          <div className="relative w-full h-32 mb-3">
                            <Image
                              src={meat.image}
                              alt={meat.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <h4 className="font-medium text-gray-900">{meat.name}</h4>
                          <p className="text-sm text-gray-600">{meat.price}€</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Cheese Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choisissez votre fromage</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {cheeses.map((cheese) => (
                        <motion.button
                          key={cheese._id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCheeseSelect(cheese)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
                        >
                          <div className="relative w-full h-32 mb-3">
                            <Image
                              src={cheese.image}
                              alt={cheese.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <h4 className="font-medium text-gray-900">{cheese.name}</h4>
                          <p className="text-sm text-gray-600">{cheese.price}€</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Supplements */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Suppléments (1€ chacun)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {supplements.map((supplement) => {
                        const isSelected = selectedIngredients.supplements.some(s => s._id === supplement._id);
                        return (
                          <motion.button
                            key={supplement._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSupplementToggle(supplement)}
                            className={`p-4 border rounded-lg transition-colors text-left ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="relative w-full h-24 mb-2">
                              <Image
                                src={supplement.image}
                                alt={supplement.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{supplement.name}</h4>
                            <p className="text-xs text-gray-600">+1€</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Summary */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif de votre panini</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Composition :</h4>
                      <div className="space-y-2">
                        {selectedIngredients.meat && (
                          <div className="flex justify-between">
                            <span>Viande : {selectedIngredients.meat.name}</span>
                            <span>{selectedIngredients.meat.price}€</span>
                          </div>
                        )}
                        {selectedIngredients.cheese && (
                          <div className="flex justify-between">
                            <span>Fromage : {selectedIngredients.cheese.name}</span>
                            <span>{selectedIngredients.cheese.price}€</span>
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
                  disabled={
                    (currentStep === 0 && !selectedIngredients.meat) ||
                    (currentStep === 1 && !selectedIngredients.cheese)
                  }
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
