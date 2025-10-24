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
  Moon,
  Sandwich
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ProductImage from '@/components/common/ProductImage';
import SmartImage from '@/components/common/SmartImage';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import OrderButton from '@/components/common/OrderButton';
import DarkModeToggle from '@/components/common/DarkModeToggle';

// Filtres spécifiques aux sandwichs
const sandwichFilters = [
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
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  }
};

export default function SandwichesPage() {
  const { foods, loading } = useProducts();
  const { addItem } = useCart();
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filtrer les sandwichs
  const sandwiches = foods.filter((food: any) => 
    food.type === 'sandwich' || 
    (food.category === 'food' && food.name.toLowerCase().includes('sandwich'))
  );

  // Filtrer par terme de recherche
  const filteredSandwiches = sandwiches.filter(sandwich =>
    sandwich.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sandwich.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer par catégorie
  const getFilteredSandwiches = () => {
    if (selectedFilter === 'all') return filteredSandwiches;
    
    return filteredSandwiches.filter(sandwich => {
      const name = sandwich.name.toLowerCase();
      const description = sandwich.description?.toLowerCase() || '';
      
      switch (selectedFilter) {
        case 'classic':
          return name.includes('classic') || name.includes('traditionnel');
        case 'signature':
          return name.includes('signature') || name.includes('spécial');
        case 'chicken':
          return name.includes('poulet') || name.includes('chicken') || description.includes('poulet');
        case 'veggie':
          return name.includes('végé') || name.includes('veggie') || description.includes('végétarien');
        case 'beef':
          return name.includes('bœuf') || name.includes('beef') || description.includes('bœuf');
        default:
          return true;
      }
    });
  };

  // Trier les sandwichs
  const getSortedSandwiches = () => {
    const filtered = getFilteredSandwiches();
    
    switch (sortBy) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const sortedSandwiches = getSortedSandwiches();

  const handleAddToCart = (sandwich: any) => {
    addItem({
      _id: sandwich._id || sandwich.id,
      name: sandwich.name,
      price: sandwich.price,
      image: sandwich.image,
      type: 'food',
      category: sandwich.category
    });
  };

  return (
    <>
      <Head>
        <title>Sandwichs - LE NEUF</title>
        <meta name="description" content="Découvrez nos délicieux sandwichs préparés avec des ingrédients frais et des pains artisanaux" />
      </Head>

      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header avec toggle dark mode */}
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>

        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Pattern décoratif */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative z-10 h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-light mb-4 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Sandwichs
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Pains frais, garnitures variées, sauces maison
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Barre de recherche et filtres */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un sandwich..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-400' 
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap gap-2">
                {sandwichFilters.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = selectedFilter === filter.id;
                  
                  return (
                    <motion.button
                      key={filter.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-lg'
                          : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{filter.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-900'
                }`}
              >
                <option value="name">Trier par nom</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Liste des sandwichs */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : sortedSandwiches.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedSandwiches.map((sandwich, index) => (
                <motion.div
                  key={sandwich._id || sandwich.id || index}
                  variants={itemVariants}
                  whileHover="hover"
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <SmartImage
                      src={sandwich.image || '/images/menu/default-sandwich.jpg'}
                      alt={sandwich.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge de popularité */}
                    {index < 3 && (
                      <motion.div
                        variants={pulseVariants}
                        animate="pulse"
                        className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center"
                      >
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Populaire
                      </motion.div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {sandwich.name}
                      </h3>
                      <div className="text-2xl font-bold text-orange-500">
                        {sandwich.price.toFixed(2)}€
                      </div>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {sandwich.description || 'Sandwich préparé avec des ingrédients frais et de qualité.'}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>5-10 min</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          <span>4.8</span>
                        </div>
                      </div>

                      <OrderButton
                        onClick={() => handleAddToCart(sandwich)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Commander</span>
                      </OrderButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Aucun sandwich trouvé
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
