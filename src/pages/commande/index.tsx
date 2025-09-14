import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState } from 'react';
import { 
  Pizza, 
  Utensils, 
  Sandwich, 
  Flame, 
  ShoppingCart,
  ChevronRight,
  Star,
  Clock,
  Zap
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ProductImage from '@/components/common/ProductImage';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import PaniniModal from '@/components/common/PaniniModal';
import Link from 'next/link';

// Configuration des onglets de commande
const orderTabs = [
  {
    id: 'pizzas',
    name: 'Pizzas',
    icon: Pizza,
    color: 'red',
    description: 'Pâte maison, cuisson au feu de bois'
  },
  {
    id: 'sandwiches-burgers',
    name: 'Sandwichs & Burgers',
    icon: Utensils,
    color: 'amber',
    description: 'Viandes sélectionnées, pains artisanaux'
  },
  {
    id: 'paninis',
    name: 'Paninis',
    icon: Sandwich,
    color: 'orange',
    description: 'Composables selon vos envies'
  },
  {
    id: 'tex-mex',
    name: 'Tex-Mex',
    icon: Flame,
    color: 'red',
    description: 'Wings, tenders et spécialités épicées'
  }
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

export default function CommandePage() {
  const { foods, drinks, desserts, sides } = useProducts();
  const { addToCart } = useCart();
  const { isDark } = useDarkMode();
  const [activeTab, setActiveTab] = useState('pizzas');
  const [isPaniniModalOpen, setIsPaniniModalOpen] = useState(false);

  // Filtrer les produits par catégorie
  const getProductsByCategory = (category: string) => {
    switch (category) {
      case 'pizzas':
        return foods.filter((food: any) => food.type === 'pizza');
      case 'sandwiches-burgers':
        return foods.filter((food: any) => food.type === 'burger' || food.type === 'sandwich_durum');
      case 'paninis':
        return foods.filter((food: any) => food.type === 'paninis');
      case 'tex-mex':
        return foods.filter((food: any) => food.type === 'plates' && 
          (food.name.toLowerCase().includes('wing') || 
           food.name.toLowerCase().includes('tender') ||
           food.name.toLowerCase().includes('tex')));
      default:
        return [];
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      type: 'food'
    });
  };

  const getTabColor = (color: string) => {
    const colors = {
      red: {
        bg: 'from-red-500 to-red-600',
        text: 'text-red-600',
        border: 'border-red-500',
        hover: 'hover:bg-red-50 dark:hover:bg-red-900/20'
      },
      amber: {
        bg: 'from-amber-500 to-orange-500',
        text: 'text-amber-600',
        border: 'border-amber-500',
        hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/20'
      },
      orange: {
        bg: 'from-orange-500 to-red-500',
        text: 'text-orange-600',
        border: 'border-orange-500',
        hover: 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
      }
    };
    return colors[color as keyof typeof colors] || colors.red;
  };

  const currentProducts = getProductsByCategory(activeTab);
  const currentTab = orderTabs.find(tab => tab.id === activeTab);
  const tabColors = currentTab ? getTabColor(currentTab.color) : getTabColor('red');

  return (
    <>
      <Head>
        <title>Le 9 - Commandez en ligne | Menu</title>
        <meta 
          name="description" 
          content="Commandez en ligne vos plats préférés : pizzas, burgers, paninis et spécialités tex-mex." 
        />
      </Head>

      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-orange-50'
      }`}>
        {/* Hero Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 overflow-hidden"
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
                <ShoppingCart className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl font-light text-white mb-8 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Commandez <span className="text-yellow-300">en ligne</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-100 mb-12 font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Choisissez votre catégorie et composez votre commande
              </motion.p>

              {/* Toggle mode sombre */}
              <motion.div
                className="flex items-center gap-4 justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <DarkModeToggle />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Onglets de navigation */}
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
              {orderTabs.map((tab) => {
                const Icon = tab.icon;
                const colors = getTabColor(tab.color);
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? `${colors.border} ${colors.bg} text-white shadow-lg`
                        : isDark
                        ? `border-gray-600 text-gray-300 ${colors.hover}`
                        : `border-gray-300 text-gray-700 ${colors.hover}`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">{tab.name}</div>
                      <div className="text-sm opacity-80">{tab.description}</div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Section spéciale pour les tacos */}
        {activeTab === 'tex-mex' && (
          <section className="py-8 bg-gradient-to-r from-orange-500 to-red-500">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Composez votre tacos personnalisé
                </h2>
                <p className="text-orange-100 mb-6">
                  Créez votre tacos ou bowl sur mesure avec nos ingrédients frais
                </p>
                <Link
                  href="/commande-tacos"
                  className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Composer mon tacos
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Section spéciale pour les paninis */}
        {activeTab === 'paninis' && (
          <section className="py-8 bg-gradient-to-r from-orange-500 to-red-500">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Composez votre panini personnalisé
                </h2>
                <p className="text-orange-100 mb-6">
                  Choisissez votre viande et personnalisez votre panini selon vos envies
                </p>
                <button
                  onClick={() => setIsPaniniModalOpen(true)}
                  className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors"
                >
                  <Sandwich className="w-5 h-5 mr-2" />
                  Composer mon panini
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Liste des produits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {currentProducts.map((product: any, index) => (
                <motion.div
                  key={product._id || product.id}
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
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.category === 'bestseller' && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Best-seller
                        </div>
                      )}
                      {product.category === 'new' && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Nouveau
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-xl font-semibold group-hover:${tabColors.text} transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {product.name}
                      </h3>
                      <div className={`flex items-center text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {product.preparationTimeMinutes || 15}min
                      </div>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {product.baseIngredients?.join(', ') || 'Délicieux plat préparé avec soin'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className={`text-2xl font-bold ${tabColors.text}`}>
                        {product.price}€
                      </div>
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        className={`${tabColors.bg} text-white p-3 rounded-full hover:opacity-90 transition-opacity flex items-center`}
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

            {currentProducts.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className={`text-xl font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Aucun produit trouvé
                </h3>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Cette catégorie sera bientôt disponible
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Modal Panini */}
        <PaniniModal 
          isOpen={isPaniniModalOpen} 
          onClose={() => setIsPaniniModalOpen(false)} 
        />
      </div>
    </>
  );
}
