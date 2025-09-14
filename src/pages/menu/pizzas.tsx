import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Utensils, 
  Pizza, 
  ChevronRight,
  ShoppingCart,
  Flame,
  Leaf,
  Zap,
  Plus,
  Minus
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ProductImage from '@/components/common/ProductImage';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import Link from 'next/link';

// Filtres spécifiques aux pizzas
const pizzaFilters = [
  { id: 'all', name: 'Toutes', icon: Pizza },
  { id: 'classique', name: 'Classiques', icon: Star },
  { id: 'signature', name: 'Signatures', icon: Zap },
  { id: 'vegetarienne', name: 'Végétariennes', icon: Leaf },
  { id: 'epicee', name: 'Épicées', icon: Flame }
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

export default function PizzasPage() {
  const { foods } = useProducts();
  const { addToCart } = useCart();
  const { isDark } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({});

  // Filtrer les pizzas
  const pizzas = foods.filter((food: any) => food.type === 'pizza');
  
  const filteredPizzas = pizzas.filter((pizza: any) => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pizza.baseIngredients?.some((ingredient: string) => 
                          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                        );
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'classique' && pizza.category === 'regular') ||
                         (selectedFilter === 'signature' && pizza.category === 'bestseller') ||
                         (selectedFilter === 'vegetarienne' && pizza.isVegetarian) ||
                         (selectedFilter === 'epicee' && pizza.spicyLevel !== 'mild');
    
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = (pizza: any) => {
    const selectedPizzaSize = selectedSize[pizza._id || pizza.id] || 'M';
    const pizzaSize = pizza.pizzaSizes?.find((size: any) => size.name === selectedPizzaSize);
    
    if (pizzaSize) {
      addToCart({
        id: pizza._id || pizza.id,
        name: pizza.name,
        price: pizzaSize.price,
        image: pizza.image,
        quantity: 1,
        type: 'food',
        size: selectedPizzaSize
      });
    }
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
        <title>Le 9 - Nos Pizzas | Menu</title>
        <meta 
          name="description" 
          content="Découvrez nos délicieuses pizzas préparées avec une pâte fraîche et des ingrédients de qualité. De la classique Margherita aux créations originales." 
        />
      </Head>

      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-red-50'
      }`}>
        {/* Hero Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-r from-red-600 via-orange-500 to-red-700 overflow-hidden"
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
                <Pizza className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl font-light text-white mb-8 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Nos <span className="text-yellow-300">Pizzas</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-100 mb-12 font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Pâte maison, cuisson au feu de bois, ingrédients frais
              </motion.p>

              {/* Toggle mode sombre */}
              <motion.div
                className="flex items-center gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
              >
                <Sun className="w-5 h-5 text-yellow-300" />
                <DarkModeToggle />
                <Moon className="w-5 h-5 text-yellow-300" />
              </motion.div>

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
                    placeholder="Rechercher une pizza..."
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
        <section className={`py-8 border-b transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="container mx-auto px-4">
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {pizzaFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? 'border-red-500 bg-red-500 text-white'
                        : isDark
                        ? 'border-gray-600 text-gray-300 hover:border-red-400 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50'
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

        {/* Liste des pizzas */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredPizzas.map((pizza: any, index) => (
                <motion.div
                  key={pizza._id || pizza.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className={`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <ProductImage
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {pizza.category === 'bestseller' && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Best-seller
                        </div>
                      )}
                      {pizza.category === 'new' && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Nouveau
                        </div>
                      )}
                      {pizza.isVegetarian && (
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Leaf className="w-4 h-4 mr-1" />
                          Végétarien
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4">
                      {getSpicyIcon(pizza.spicyLevel)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-xl font-semibold group-hover:text-red-600 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {pizza.name}
                      </h3>
                      <div className={`flex items-center text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {pizza.preparationTimeMinutes}min
                      </div>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {pizza.baseIngredients?.join(', ') || 'Délicieuse pizza préparée avec soin'}
                    </p>

                    {getSpicyLevel(pizza.spicyLevel) && (
                      <p className="text-orange-600 text-sm mb-4 flex items-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {getSpicyLevel(pizza.spicyLevel)}
                      </p>
                    )}

                    {/* Tailles de pizza */}
                    {pizza.pizzaSizes && pizza.pizzaSizes.length > 0 && (
                      <div className="mb-4">
                        <p className={`text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>Tailles disponibles :</p>
                        <div className="flex gap-2">
                          {pizza.pizzaSizes.map((size: any) => (
                            <button
                              key={size.name}
                              onClick={() => setSelectedSize(prev => ({
                                ...prev,
                                [pizza._id || pizza.id]: size.name
                              }))}
                              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                selectedSize[pizza._id || pizza.id] === size.name
                                  ? 'border-red-500 bg-red-500 text-white'
                                  : isDark
                                  ? 'border-gray-600 text-gray-300 hover:border-red-400'
                                  : 'border-gray-300 text-gray-700 hover:border-red-300'
                              }`}
                            >
                              {size.name} - {size.price}€
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-red-600">
                        {pizza.price}€
                      </div>
                      <motion.button
                        onClick={() => handleAddToCart(pizza)}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors flex items-center"
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

            {filteredPizzas.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Pizza className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucune pizza trouvée
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Bouton flottant de commande */}
        <Link href="/commande">
          <motion.button
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart className="w-6 h-6" />
          </motion.button>
        </Link>
      </div>
    </>
  );
}