import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShoppingCart,
  Sandwich
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ProductImage from '@/components/common/ProductImage';
import { useCart } from '@/contexts/CartContext';

interface PaniniModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configuration des ingrédients disponibles pour les paninis
const paniniIngredients = [
  { name: 'Thon', image: '/images/placeholder-ingredient.jpg', price: 1.50 },
  { name: 'Jambon', image: '/images/placeholder-ingredient.jpg', price: 1.20 },
  { name: 'Kebab', image: '/images/menu/meats/kebab.jpg', price: 2.00 },
  { name: 'Viande hachée', image: '/images/menu/meats/viande-hachee.jpg', price: 1.80 },
  { name: 'Saumon', image: '/images/placeholder-ingredient.jpg', price: 2.50 },
  { name: 'Poulet', image: '/images/menu/meats/poulet.jpg', price: 1.60 },
  { name: 'Chèvre miel', image: '/images/placeholder-ingredient.jpg', price: 1.40 },
  { name: 'Fromage', image: '/images/placeholder-ingredient.jpg', price: 1.00 }
];

// Configuration du panini
const paniniConfig = {
  name: 'Panini Personnalisé',
  basePrice: 6.50,
  image: '/images/menu/burgers.jpg',
  description: 'Composez votre panini selon vos envies'
};

export default function PaniniModal({ isOpen, onClose }: PaniniModalProps) {
  const { addItem } = useCart();
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const handleIngredientSelection = (ingredientName: string) => {
    setSelectedIngredient(ingredientName);
  };

  const handleAddToCart = () => {
    if (!selectedIngredient) return;
    
    const ingredient = paniniIngredients.find(ing => ing.name === selectedIngredient);
    if (!ingredient) return;

    addItem({
      _id: `panini-${selectedIngredient.toLowerCase().replace(' ', '-')}`,
      name: `Panini ${selectedIngredient}`,
      price: paniniConfig.basePrice + ingredient.price,
      image: paniniConfig.image,
      type: 'food'
    });

    onClose();
    setSelectedIngredient(null);
  };

  const resetSelection = () => {
    setSelectedIngredient(null);
  };

  // Fermer la modal avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Sandwich className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{paniniConfig.name}</h2>
                  <p className="text-orange-100">{paniniConfig.description}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Image du panini */}
              <div className="text-center mb-8">
                <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-lg">
                  <ProductImage
                    src={paniniConfig.image}
                    alt={paniniConfig.name}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Sélection d'ingrédient */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Choisissez votre ingrédient principal
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {paniniIngredients.map((ingredient, index) => (
                    <motion.button
                      key={ingredient.name}
                      onClick={() => handleIngredientSelection(ingredient.name)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedIngredient === ingredient.name
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                          <ProductImage
                            src={ingredient.image}
                            alt={ingredient.name}
                            className="w-full h-full"
                          />
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {ingredient.name}
                        </h4>
                        
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                          +{ingredient.price}€
                        </p>
                        
                        {selectedIngredient === ingredient.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Informations de prix */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-700 dark:text-gray-300">Prix de base :</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{paniniConfig.basePrice}€</span>
                </div>
                {selectedIngredient && (
                  <>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedIngredient} :
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        +{paniniIngredients.find(ing => ing.name === selectedIngredient)?.price}€
                      </span>
                    </div>
                    <hr className="my-2 border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-gray-900 dark:text-white">Total :</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        {paniniConfig.basePrice + (paniniIngredients.find(ing => ing.name === selectedIngredient)?.price || 0)}€
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={resetSelection}
                className="px-6 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                Réinitialiser
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={!selectedIngredient}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ajouter au panier
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
