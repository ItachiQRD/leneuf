import { motion, useScroll, useTransform } from 'framer-motion';
import Head from 'next/head';
import { useState, useRef } from 'react';
import { 
  Search, 
  Star, 
  IceCream, 
  Heart,
  ShoppingCart,
  Zap,
  Leaf,
  Cake,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import SmartImage from '@/components/common/SmartImage';
import { useCart } from '@/contexts/CartContext';

// Filtres spécifiques aux desserts
const dessertFilters = [
  { id: 'all', name: 'Tous', icon: IceCream },
  { id: 'ice_cream', name: 'Glaces', icon: IceCream },
  { id: 'cake', name: 'Gâteaux', icon: Cake },
  { id: 'vegan', name: 'Vegan', icon: Leaf },
  { id: 'signature', name: 'Signatures', icon: Zap }
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

export default function DessertsPage() {
  const { desserts } = useProducts();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filtrer les desserts
  const filteredDesserts = desserts.filter((dessert: any) => {
    const matchesSearch = dessert.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'ice_cream' && dessert.name.toLowerCase().includes('glace')) ||
                         (selectedFilter === 'cake' && dessert.name.toLowerCase().includes('gâteau')) ||
                         (selectedFilter === 'vegan' && dessert.isVegan) ||
                         (selectedFilter === 'signature' && dessert.category === 'bestseller');
    
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = (dessert: any) => {
    addItem({
      _id: dessert._id || dessert.id,
      name: dessert.name,
      price: dessert.price,
      image: dessert.image,
      type: 'dessert'
    });
  };

  return (
    <>
      <Head>
        <title>Le 9 - Nos Desserts | Menu</title>
        <meta 
          name="description" 
          content="Découvrez nos délicieux desserts : pâtisseries maison, glaces artisanales et douceurs." 
        />
        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
        {/* Hero Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-r from-pink-600 via-purple-500 to-pink-700 overflow-hidden"
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
                <IceCream className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl font-light text-white mb-8 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Nos <span className="text-yellow-300">Desserts</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-100 mb-12 font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Pâtisseries maison, glaces artisanales, douceurs
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
                    placeholder="Rechercher un dessert..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Filtres avec scroll 3D */}
        <section className="py-12 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Explorez nos catégories
            </motion.h2>
            
            <div className="relative">
              {/* Scroll horizontal avec effet 3D */}
              <div 
                className="overflow-x-auto scrollbar-hide pb-8" 
                style={{ 
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="flex gap-8 px-4 py-4" style={{ width: 'max-content' }}>
                  {dessertFilters.map((filter, index) => {
                    const Icon = filter.icon;
                    const isActive = selectedFilter === filter.id;
                    
                    return (
                      <motion.div
                        key={filter.id}
                        className="flex-shrink-0"
                        style={{ scrollSnapAlign: 'center' }}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -45 }}
                        animate={{ 
                          opacity: 1, 
                          scale: isActive ? 1.1 : 1,
                          rotateY: 0,
                          z: isActive ? 50 : 0
                        }}
                        whileHover={{ 
                          scale: 1.15,
                          rotateY: 15,
                          z: 100,
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: index * 0.1
                        }}
                        onClick={() => setSelectedFilter(filter.id)}
                      >
                        <div
                          className={`relative w-64 h-80 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden ${
                            isActive 
                              ? 'shadow-2xl ring-4 ring-pink-500 ring-opacity-50' 
                              : 'shadow-lg hover:shadow-xl'
                          }`}
                          style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                            background: isActive
                              ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #ec4899 100%)'
                              : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                          }}
                        >
                          {/* Effet de brillance animé */}
                          <motion.div
                            className="absolute inset-0 opacity-20"
                            style={{
                              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                            }}
                            animate={{
                              x: ['-100%', '200%'],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 2,
                              ease: 'linear'
                            }}
                          />
                          
                          {/* Effet de profondeur 3D */}
                          <div 
                            className="absolute inset-0 rounded-3xl"
                            style={{
                              background: isActive
                                ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 250, 251, 0.8) 100%)',
                              backdropFilter: 'blur(10px)',
                              transform: 'translateZ(20px)',
                            }}
                          />
                          
                          {/* Contenu de la carte */}
                          <div className="relative h-full flex flex-col items-center justify-center p-6" style={{ transform: 'translateZ(30px)' }}>
                            {/* Icône avec effet 3D */}
                            <motion.div
                              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                                isActive 
                                  ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                                  : 'bg-gradient-to-br from-pink-100 to-purple-100 shadow-md'
                              }`}
                              whileHover={{ 
                                rotateY: 360,
                                scale: 1.1
                              }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                              <Icon className={`w-12 h-12 ${isActive ? 'text-white' : 'text-pink-600'}`} />
                            </motion.div>
                            
                            {/* Nom de la catégorie */}
                            <motion.h3 
                              className={`text-2xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900'}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {filter.name}
                            </motion.h3>
                            
                            {/* Ligne décorative */}
                            <motion.div 
                              className={`w-16 h-1 rounded-full mb-4 ${isActive ? 'bg-white/50' : 'bg-pink-500'}`}
                              whileHover={{ width: '80px' }}
                              transition={{ duration: 0.3 }}
                            />
                            
                            {/* Description */}
                            <p className={`text-sm text-center px-4 ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                              {filter.id === 'all' && 'Tous nos desserts'}
                              {filter.id === 'ice_cream' && 'Glaces artisanales'}
                              {filter.id === 'cake' && 'Gâteaux maison'}
                              {filter.id === 'vegan' && 'Options végétaliennes'}
                              {filter.id === 'signature' && 'Nos spécialités'}
                            </p>
                            
                            {/* Badge actif */}
                            {isActive && (
                              <motion.div
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <span className="text-white text-xs font-semibold">Actif</span>
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Ombre portée 3D animée */}
                          <motion.div 
                            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl"
                            style={{
                              background: isActive ? '#ec4899' : '#9ca3af',
                              transform: 'translateZ(-50px)',
                            }}
                            animate={{
                              opacity: isActive ? [0.3, 0.5, 0.3] : 0.3,
                              scale: isActive ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Indicateurs de scroll */}
              <div className="flex justify-center gap-2 mt-6">
                {dessertFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedFilter === filter.id 
                        ? 'bg-pink-500 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Liste des desserts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredDesserts.map((dessert: any, index) => (
                <motion.div
                  key={dessert._id || dessert.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <SmartImage
                      src={dessert.image || '/images/placeholder-food.svg'}
                      alt={dessert.name}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {dessert.category === 'bestseller' && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Best-seller
                        </div>
                      )}
                      {dessert.category === 'new' && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Nouveau
                        </div>
                      )}
                      {dessert.isVegan && (
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Leaf className="w-4 h-4 mr-1" />
                          Vegan
                        </div>
                      )}
                      {dessert.isVegetarian && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          Végétarien
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                        {dessert.name}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      Délicieux dessert préparé avec soin
                    </p>

                    {/* Informations nutritionnelles */}
                    {dessert.nutritionalInfo && (
                      <div className="mb-4 p-3 bg-pink-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Calories: {dessert.nutritionalInfo.calories}</div>
                          <div>Sucres: {dessert.nutritionalInfo.sugars || 'N/A'}g</div>
                        </div>
                      </div>
                    )}

                    {/* Allergènes */}
                    {dessert.allergens && dessert.allergens.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Allergènes :</p>
                        <div className="flex flex-wrap gap-1">
                          {dessert.allergens.map((allergen: string, index: number) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-pink-600">
                        {dessert.price}€
                      </div>
                      <motion.button
                        onClick={() => handleAddToCart(dessert)}
                        className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors flex items-center"
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

            {filteredDesserts.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <IceCream className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucun dessert trouvé
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
