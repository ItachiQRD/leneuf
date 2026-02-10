import { motion } from 'framer-motion';
import PageTransition from '@/components/common/PageTransition';
import Head from 'next/head';
import { useState } from 'react';
import { 
  Search, 
  Star, 
  Clock, 
  Leaf, 
  ChevronRight,
  ShoppingCart,
  Flame,
  Zap,
  Heart,
  Droplets
} from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/contexts/ProductContext';
import SmartImage from '@/components/common/SmartImage';

// Filtres spécifiques aux salades et assiettes
const saladFilters = [
  { id: 'all', name: 'Toutes', icon: Leaf },
  { id: 'salad', name: 'Salades', icon: Leaf },
  { id: 'plate', name: 'Assiettes', icon: Star },
  { id: 'classic', name: 'Classiques', icon: Star },
  { id: 'signature', name: 'Signatures', icon: Zap },
  { id: 'veggie', name: 'Végétariennes', icon: Heart },
  { id: 'protein', name: 'Avec protéines', icon: Droplets }
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

function SaladsPage() {
  const { foods } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filtrer les salades et assiettes
  const salads = foods.filter((food: any) => 
    food.type === 'salad' || 
    food.type === 'plate' ||
    food.type === 'plates' ||
    food.category === 'assiettes' ||
    food.name.toLowerCase().includes('assiette')
  );
  
  const filteredSalads = salads.filter((salad: any) => {
    const matchesSearch = salad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        salad.baseIngredients?.some((ingredient: string) => 
                          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                        );
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'salad' && salad.type === 'salad') ||
                         (selectedFilter === 'plate' && (salad.type === 'plate' || salad.name.toLowerCase().includes('assiette'))) ||
                         (selectedFilter === 'classic' && salad.category === 'regular') ||
                         (selectedFilter === 'signature' && salad.category === 'bestseller') ||
                         (selectedFilter === 'veggie' && salad.isVegetarian) ||
                         (selectedFilter === 'protein' && !salad.isVegetarian);
    
    return matchesSearch && matchesFilter;
  });

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
    <PageTransition>
    <>
      <Head>
        <title>Le 9 - Salades et Assiettes | Menu</title>
        <meta 
          name="description" 
          content="Découvrez nos salades fraîches et assiettes équilibrées, préparées avec des légumes de saison et des protéines de qualité." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        {/* Hero Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 overflow-hidden"
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
                <Leaf className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl font-light text-white mb-8 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Nos <span className="text-yellow-300">Salades</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-100 mb-12 font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Légumes frais, protéines de qualité, vinaigrettes maison
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
                    placeholder="Rechercher une salade..."
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
              {saladFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50'
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

        {/* Liste des salades */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredSalads.map((salad: any, index) => (
                <motion.div
                  key={salad._id || salad.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <SmartImage
                      src={salad.image}
                      alt={salad.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {salad.category === 'bestseller' && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Best-seller
                        </div>
                      )}
                      {salad.category === 'new' && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Nouveau
                        </div>
                      )}
                      {salad.isVegetarian && (
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Leaf className="w-4 h-4 mr-1" />
                          Végétarien
                        </div>
                      )}
                      {salad.isVegan && (
                        <div className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          Vegan
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4">
                      {getSpicyIcon(salad.spicyLevel)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {salad.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {salad.preparationTimeMinutes}min
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {salad.baseIngredients?.join(', ') || 'Délicieuse salade préparée avec soin'}
                    </p>

                    {getSpicyLevel(salad.spicyLevel) && (
                      <p className="text-orange-600 text-sm mb-4 flex items-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {getSpicyLevel(salad.spicyLevel)}
                      </p>
                    )}

                    {/* Informations nutritionnelles */}
                    {salad.nutritionalInfo && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Calories: {salad.nutritionalInfo.calories}</div>
                          <div>Protéines: {salad.nutritionalInfo.proteins}g</div>
                          <div>Glucides: {salad.nutritionalInfo.carbs}g</div>
                          <div>Lipides: {salad.nutritionalInfo.fats}g</div>
                        </div>
                      </div>
                    )}

                    {/* Allergènes */}
                    {salad.allergens && salad.allergens.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Allergènes :</p>
                        <div className="flex flex-wrap gap-1">
                          {salad.allergens.map((allergen: string, index: number) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">
                        {salad.price}€
                      </div>
                      <Link href="/commander?category=assiettes&open=1">
                        <motion.span
                          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Ajouter <ChevronRight className="w-5 h-5" />
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredSalads.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucune salade trouvée
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
    </PageTransition>
  );
}

export default motion(SaladsPage);
