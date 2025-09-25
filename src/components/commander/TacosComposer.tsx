import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check } from 'lucide-react';
import Image from 'next/image';

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

export default function TacosComposer({ isOpen, onClose, onAddToCart }: TacosComposerProps) {
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState<TacosOptions>({ meats: [], sauces: [], ingredients: [], sizes: [] });
  const [loading, setLoading] = useState(false);
  
  // Configuration du tacos
  const [config, setConfig] = useState({
    type: 'tacos', // 'tacos' ou 'bowl'
    size: 'M',
    meat: '',
    sauces: [] as string[],
    ingredients: [] as string[],
    quantity: 1
  });

  useEffect(() => {
    if (isOpen) {
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
        const meats = data.ingredients.filter((ing: any) => ing.type === 'meat');
        setOptions({
          meats,
          sauces: data.sauces,
          ingredients: data.ingredients.filter((ing: any) => ing.type === 'vegetable' || ing.type === 'extra'),
          sizes: [
            { name: 'M', price: 6.50, description: 'Tacos Moyen' },
            { name: 'L', price: 7.50, description: 'Tacos Large' },
            { name: 'XL', price: 8.50, description: 'Tacos Extra Large' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching tacos options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: 'tacos' | 'bowl') => {
    setConfig(prev => ({ ...prev, type }));
  };

  const handleSizeChange = (size: string) => {
    setConfig(prev => ({ ...prev, size }));
  };

  const handleMeatChange = (meat: string) => {
    setConfig(prev => ({ ...prev, meat }));
  };

  const handleSauceToggle = (sauceId: string) => {
    setConfig(prev => ({
      ...prev,
      sauces: prev.sauces.includes(sauceId)
        ? prev.sauces.filter(id => id !== sauceId)
        : [...prev.sauces, sauceId]
    }));
  };

  const handleIngredientToggle = (ingredientId: string) => {
    setConfig(prev => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredientId)
        ? prev.ingredients.filter(id => id !== ingredientId)
        : [...prev.ingredients, ingredientId]
    }));
  };

  const calculatePrice = () => {
    let basePrice = 6.50; // Prix de base
    
    // Ajouter le prix de la taille
    const selectedSize = options.sizes.find(s => s.id === config.size);
    if (selectedSize) {
      basePrice += selectedSize.price;
    }
    
    // Ajouter le prix de la viande
    const selectedMeat = options.meats.find(m => m.id === config.meat);
    if (selectedMeat) {
      basePrice += selectedMeat.price;
    }
    
    // Ajouter le prix des sauces
    config.sauces.forEach(sauceId => {
      const sauce = options.sauces.find(s => s._id === sauceId);
      if (sauce) {
        basePrice += sauce.price;
      }
    });
    
    // Ajouter le prix des ingrédients
    config.ingredients.forEach(ingredientId => {
      const ingredient = options.ingredients.find(i => i._id === ingredientId);
      if (ingredient) {
        basePrice += ingredient.price;
      }
    });
    
    return basePrice * config.quantity;
  };

  const handleAddToCart = () => {
    const selectedSize = options.sizes.find(s => s.id === config.size);
    const selectedMeat = options.meats.find(m => m.id === config.meat);
    const selectedSauces = options.sauces.filter(s => config.sauces.includes(s._id));
    const selectedIngredients = options.ingredients.filter(i => config.ingredients.includes(i._id));

    const tacosItem = {
      _id: `tacos-${Date.now()}`,
      name: `${config.type === 'tacos' ? 'Tacos' : 'Bowl'} ${selectedSize?.name} ${selectedMeat?.name}`,
      price: calculatePrice(),
      image: selectedMeat?.image || '/images/tacos-default.jpg',
      category: 'tacos',
      type: 'food',
      customizable: true,
      config: {
        type: config.type,
        size: selectedSize,
        meat: selectedMeat,
        sauces: selectedSauces,
        ingredients: selectedIngredients,
        quantity: config.quantity
      }
    };

    onAddToCart(tacosItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Composez votre {config.type === 'tacos' ? 'Tacos' : 'Bowl'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                  </div>
                  {stepNumber < 5 && (
                    <div
                      className={`w-12 h-1 ml-2 ${
                        step > stepNumber ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement des options...</p>
              </div>
            ) : (
              <>
                {/* Étape 1: Type */}
                {step === 1 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choisissez votre type</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleTypeChange('tacos')}
                        className={`p-4 border-2 rounded-lg text-center ${
                          config.type === 'tacos'
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-2">🌮</div>
                        <div className="font-medium">Tacos</div>
                      </button>
                      <button
                        onClick={() => handleTypeChange('bowl')}
                        className={`p-4 border-2 rounded-lg text-center ${
                          config.type === 'bowl'
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-2">🥗</div>
                        <div className="font-medium">Bowl</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 2: Taille */}
                {step === 2 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choisissez la taille</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {options.sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => handleSizeChange(size.id)}
                          className={`p-4 border-2 rounded-lg text-center ${
                            config.size === size.id
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-bold text-lg">{size.id}</div>
                          <div className="text-sm text-gray-600">{size.name}</div>
                          <div className="text-xs text-gray-500">{size.description}</div>
                          {size.price > 0 && (
                            <div className="text-sm font-medium text-red-600">+{size.price}€</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Étape 3: Viande */}
                {step === 3 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choisissez votre viande</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {options.meats.map((meat) => (
                        <button
                          key={meat.id}
                          onClick={() => handleMeatChange(meat.id)}
                          className={`p-4 border-2 rounded-lg text-left flex items-center space-x-3 ${
                            config.meat === meat.id
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={meat.image}
                              alt={meat.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{meat.name}</div>
                            {meat.price > 0 && (
                              <div className="text-sm text-red-600">+{meat.price}€</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Étape 4: Sauces */}
                {step === 4 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choisissez vos sauces</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {options.sauces.map((sauce) => (
                        <button
                          key={sauce._id}
                          onClick={() => handleSauceToggle(sauce._id)}
                          className={`p-4 border-2 rounded-lg text-left flex items-center space-x-3 ${
                            config.sauces.includes(sauce._id)
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={sauce.image || '/images/sauce-default.jpg'}
                              alt={sauce.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{sauce.name}</div>
                            <div className="text-sm text-gray-600">{sauce.spicyLevel}</div>
                            {sauce.price > 0 && (
                              <div className="text-sm text-red-600">+{sauce.price}€</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Étape 5: Suppléments */}
                {step === 5 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ajoutez des suppléments</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {options.ingredients.map((ingredient) => (
                        <button
                          key={ingredient._id}
                          onClick={() => handleIngredientToggle(ingredient._id)}
                          className={`p-4 border-2 rounded-lg text-left flex items-center space-x-3 ${
                            config.ingredients.includes(ingredient._id)
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={ingredient.image || '/images/ingredient-default.jpg'}
                              alt={ingredient.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{ingredient.name}</div>
                            {ingredient.price > 0 && (
                              <div className="text-sm text-red-600">+{ingredient.price}€</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Quantité:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{config.quantity}</span>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-xl font-bold text-red-600">{calculatePrice().toFixed(2)}€</div>
              </div>
              
              <div className="flex space-x-2">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                )}
                
                {step < 5 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 3 && !config.meat}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
