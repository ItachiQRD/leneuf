import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState } from 'react';
import { 
  Search, 
  Star, 
  Coffee, 
  Droplets,
  ShoppingCart,
  Zap,
  Thermometer,
  Snowflake
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import SmartImage from '@/components/common/SmartImage';
import { useCart } from '@/contexts/CartContext';

// Filtres spécifiques aux boissons
const drinkFilters = [
  { id: 'all', name: 'Toutes', icon: Droplets },
  { id: 'soda', name: 'Sodas', icon: Zap },
  { id: 'juice', name: 'Jus', icon: Star },
  { id: 'hot', name: 'Chaudes', icon: Thermometer },
  { id: 'cold', name: 'Fraîches', icon: Snowflake }
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

export default function DrinksPage() {
  const { drinks } = useProducts();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filtrer les boissons
  const filteredDrinks = drinks.filter((drink: any) => {
    const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        drink.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'soda' && drink.name.toLowerCase().includes('coca')) ||
                         (selectedFilter === 'juice' && drink.name.toLowerCase().includes('jus')) ||
                         (selectedFilter === 'hot' && drink.name.toLowerCase().includes('café')) ||
                         (selectedFilter === 'cold' && !drink.name.toLowerCase().includes('café'));
    
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = (drink: any) => {
    addItem({
      _id: drink._id || drink.id,
      name: drink.name,
      price: drink.price,
      image: drink.image,
      type: 'drink'
    });
  };

  return (
    <>
      <Head>
        <title>Le 9 - Nos Boissons | Menu</title>
        <meta 
          name="description" 
          content="Découvrez notre sélection de boissons fraîches, jus naturels et boissons chaudes." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 overflow-hidden"
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
                <Coffee className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl font-light text-white mb-8 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Nos <span className="text-yellow-300">Boissons</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-100 mb-12 font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Boissons fraîches, jus naturels, boissons chaudes
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
                    placeholder="Rechercher une boisson..."
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
              {drinkFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
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

        {/* Liste des boissons */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredDrinks.map((drink: any, index) => (
                <motion.div
                  key={drink._id || drink.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <SmartImage
                      src={drink.image || '/images/placeholder-drink.jpg'}
                      alt={drink.name}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {drink.category === 'bestseller' && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Best-seller
                        </div>
                      )}
                      {drink.category === 'new' && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Nouveau
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {drink.name}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {drink.description || 'Boisson rafraîchissante'}
                    </p>

                    {/* Informations nutritionnelles */}
                    {drink.nutritionalInfo && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Calories: {drink.nutritionalInfo.calories}</div>
                          <div>Sucres: {drink.nutritionalInfo.sugars || 'N/A'}g</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {drink.price}€
                      </div>
                      <motion.button
                        onClick={() => handleAddToCart(drink)}
                        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors flex items-center"
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

            {filteredDrinks.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucune boisson trouvée
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
