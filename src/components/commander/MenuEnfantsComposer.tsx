import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Buttons';

interface MenuEnfantsComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  product: any;
}

interface Sauce {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface Vegetable {
  _id: string;
  name: string;
  image: string;
}

const STEPS = [
  { id: 'vegetables', title: 'Crudités', description: 'Salade, tomate, oignons ou rien' },
  { id: 'sauce', title: 'Sauce', description: 'Sélectionnez votre sauce' },
  { id: 'summary', title: 'Récapitulatif', description: 'Vérifiez votre commande' }
];

export default function MenuEnfantsComposer({ isOpen, onClose, onAddToCart, product }: MenuEnfantsComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState<Vegetable[]>([]);
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<Sauce | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Réinitialiser le formulaire quand il s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setSelectedVegetables([]);
      setSelectedSauce(null);
      setQuantity(1);
      fetchIngredients();
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

  const fetchSauces = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/tacos-options');
      const data = await response.json();
      if (data.success) {
        setSauces(data.data.sauces);
      }
    } catch (error) {
      console.error('Error fetching sauces:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    const saucePrice = selectedSauce ? selectedSauce.price : 0;
    return (product.price + saucePrice) * quantity;
  };

  const handleSauceSelect = (sauce: Sauce) => {
    setSelectedSauce(sauce);
  };

  const handleNoSauce = () => {
    setSelectedSauce(null);
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

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Les crudités sont optionnelles
      case 1: return true; // Les sauces sont optionnelles
      case 2: return true; // Le récapitulatif
      default: return true;
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      _id: `menu-enfants-${Date.now()}`,
      name: product.name,
      price: calculatePrice(),
      image: product.image,
      category: 'menu-enfants',
      type: 'menu',
      customIngredients: {
        vegetables: selectedVegetables,
        sauce: selectedSauce,
        quantity: quantity
      }
    };
    
    onAddToCart(cartItem);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedVegetables([]);
    setSelectedSauce(null);
    setQuantity(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
                className="object-cover rounded-lg w-15 h-15 lg:w-20 lg:h-20"
              />
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-sm lg:text-base text-gray-600">{product.description}</p>
                <p className="text-lg lg:text-xl font-bold text-primary">{product.price.toFixed(2)}€</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6 overflow-y-auto flex-1">
            <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-4">
              Sauce (optionnel)
            </h3>
            
            {/* Option "Aucune" */}
            <div
              onClick={handleNoSauce}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all mb-4 ${
                !selectedSauce
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <X className="w-6 h-6 lg:w-8 lg:h-8 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm lg:text-base">Sans sauce</h4>
                  <p className="text-xs lg:text-sm text-gray-600">Pas de sauce</p>
                </div>
                {!selectedSauce && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Sauces disponibles */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
              {loading ? (
                <div className="col-span-full text-center py-4">
                  <span className="text-gray-500">Chargement des sauces...</span>
                </div>
              ) : sauces.length === 0 ? (
                <div className="col-span-full text-center py-4">
                  <span className="text-gray-500">Aucune sauce disponible</span>
                </div>
              ) : (
                sauces.map((sauce) => (
                  <div
                    key={sauce._id}
                    onClick={() => handleSauceSelect(sauce)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedSauce?._id === sauce._id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                        <Image
                          src={sauce.image}
                          alt={sauce.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 text-xs lg:text-sm">{sauce.name}</h4>
                      {selectedSauce?._id === sauce._id && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-2">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quantité : uniquement sur desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <span className="text-sm lg:text-base font-medium text-gray-900">Quantité:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 bg-white border rounded-lg text-sm lg:text-base min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{calculatePrice().toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex items-center space-x-2"
            >
              <span>Annuler</span>
            </Button>

            <Button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              <span>Ajouter au panier</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}