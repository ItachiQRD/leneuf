import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState } from 'react';
import { 
  Search, 
  Star, 
  Clock, 
  Utensils, 
  ChevronRight,
  ShoppingCart,
  Flame,
  Leaf,
  Zap,
  Beef,
  Bird,
  Sun,
  Moon
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ProductImage from '@/components/common/ProductImage';
import SmartImage from '@/components/common/SmartImage';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import OrderButton from '@/components/common/OrderButton';
import DarkModeToggle from '@/components/common/DarkModeToggle';

// Filtres spécifiques aux burgers
const burgerFilters = [
  { id: 'all', name: 'Tous', icon: Utensils },
  { id: 'classic', name: 'Classiques', icon: Star },
  { id: 'signature', name: 'Signatures', icon: Zap },
  { id: 'chicken', name: 'Poulet', icon: Bird },
  { id: 'veggie', name: 'Végétariens', icon: Leaf },
  { id: 'beef', name: 'Bœuf', icon: Beef }
];

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const hoverVariants = {
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export default function BurgersPage() {
  const { foods } = useProducts();
  const { addItem } = useCart();
  const { isDark } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filtrer les burgers
  const burgers = foods.filter((food: any) => food.type === 'burger');
  
  const filteredBurgers = burgers.filter((burger: any) => {
    const matchesSearch = burger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        burger.baseIngredients?.some((ingredient: string) => 
                          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                        );
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'classic' && burger.category === 'regular') ||
                         (selectedFilter === 'signature' && burger.category === 'bestseller') ||
                         (selectedFilter === 'chicken' && burger.name.toLowerCase().includes('poulet')) ||
                         (selectedFilter === 'veggie' && burger.isVegetarian) ||
                         (selectedFilter === 'beef' && burger.name.toLowerCase().includes('bœuf'));
    
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = (burger: any) => {
    addItem({
      _id: burger._id || burger.id,
      name: burger.name,
      price: burger.price,
      image: burger.image,
      type: 'food'
    });
  };

  const getSpicyIcon = (level: string) => {
    switch (level) {
      case 'mild': return null;
      case 'medium': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'hot': return <Flame className="w-4 h-4 text-red-500" />;
      case 'extra_hot': return <Flame className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getSpicyLevel = (level: string) => {
    switch (level) {
      case 'mild': return '';
      case 'medium': return 'Moyennement épicé';
      case 'hot': return 'Épicé';
      case 'extra_hot': return 'Très épicé';
      default: return '';
    }
  };

  return (
    <>
      <Head>
        <title>Le 9 - Nos Burgers | Menu</title>
        <meta 
          name="description" 
          content="Découvrez notre sélection de burgers gourmands, préparés avec des ingrédients frais et des viandes sélectionnées avec soin." 
        />
      </Head>

      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-amber-50'
      }`}>
        {/* Hero Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-600 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Utensils className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl font-light text-white mb-8 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Nos <span className="text-yellow-300">Burgers</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-100 mb-12 font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Viandes sélectionnées, pains artisanaux, sauces maison
              </motion.p>

              {/* Barre de recherche */}
              <motion.div
                className="max-w-md mx-auto relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un burger..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Filtres */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {burgerFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {filter.name}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Liste des burgers */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredBurgers.map((burger: any, index) => (
                <motion.div
                  key={burger._id || burger.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <SmartImage
                      src={burger.image}
                      alt={burger.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {burger.category === 'bestseller' && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Best-seller
                        </div>
                      )}
                      {burger.category === 'new' && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Nouveau
                        </div>
                      )}
                      {burger.isVegetarian && (
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Leaf className="w-4 h-4 mr-1" />
                          Végétarien
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4">
                      {getSpicyIcon(burger.spicyLevel)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                        {burger.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {burger.preparationTimeMinutes}min
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {burger.baseIngredients?.join(', ') || 'Délicieux burger préparé avec soin'}
                    </p>

                    {getSpicyLevel(burger.spicyLevel) && (
                      <p className="text-orange-600 text-sm mb-4 flex items-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {getSpicyLevel(burger.spicyLevel)}
                      </p>
                    )}

                    {/* Informations nutritionnelles */}
                    {burger.nutritionalInfo && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Calories: {burger.nutritionalInfo.calories}</div>
                          <div>Protéines: {burger.nutritionalInfo.proteins}g</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-amber-600">
                        {burger.price}€
                      </div>
                      <motion.button
                        onClick={() => handleAddToCart(burger)}
                        className="bg-amber-500 text-white p-3 rounded-full hover:bg-amber-600 transition-colors flex items-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredBurgers.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucun burger trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}