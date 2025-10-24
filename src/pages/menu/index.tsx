import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Utensils, 
  Pizza, 
  Coffee, 
  IceCream, 
  ChevronRight,
  Heart,
  ShoppingCart,
  Flame,
  Leaf,
  Zap
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import MenuOffers from '@/components/menu/MenuOffers';

// Configuration des catégories de menu avec icônes et couleurs
const menuCategories = [
  {
    id: 'pizza',
    title: "Pizzas",
    description: "Pâte maison, cuisson au feu de bois, ingrédients frais",
    icon: Pizza,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    href: "/menu/pizzas",
    count: 0
  },
  {
    id: 'burger',
    title: "Burgers",
    description: "Viandes sélectionnées, pains artisanaux, sauces maison",
    icon: Utensils,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    href: "/menu/burgers",
    count: 0
  },
  {
    id: 'salad',
    title: "Salades",
    description: "Légumes frais, protéines de qualité, vinaigrettes maison",
    icon: Leaf,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    href: "/menu/salads",
    count: 0
  },
  {
    id: 'drink',
    title: "Boissons",
    description: "Boissons fraîches, jus naturels, boissons chaudes",
    icon: Coffee,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    href: "/menu/drinks",
    count: 0
  },
  {
    id: 'dessert',
    title: "Desserts",
    description: "Pâtisseries maison, glaces artisanales, douceurs",
    icon: IceCream,
    color: "from-pink-500 to-purple-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    href: "/menu/desserts",
    count: 0
  }
];

// Animations avancées
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
    scale: 1.05,
    y: -10,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function MenuPage() {
  const { foods, drinks, desserts, sides, sauces } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Calculer le nombre de produits par catégorie
  useEffect(() => {
    const categoriesWithCount = menuCategories.map(category => {
      let count = 0;
      switch (category.id) {
        case 'pizza':
        case 'burger':
        case 'salad':
          count = foods.filter((food: any) => food.type === category.id).length;
          break;
        case 'drink':
          count = drinks.length;
          break;
        case 'dessert':
          count = desserts.length;
          break;
      }
      return { ...category, count };
    });
    
    // Mettre à jour les catégories avec les comptes
    menuCategories.forEach((category, index) => {
      menuCategories[index].count = categoriesWithCount[index].count;
    });
    
    setIsLoading(false);
  }, [foods, drinks, desserts, sides, sauces]);

  // Produits en vedette (bestsellers)
  const featuredProducts = [
    ...foods.filter((food: any) => food.category === 'bestseller').slice(0, 3),
    ...drinks.filter((drink: any) => drink.category === 'bestseller').slice(0, 1),
    ...desserts.filter((dessert: any) => dessert.category === 'bestseller').slice(0, 1)
  ].slice(0, 5);

  return (
    <>
      <Head>
        <title>Le 9 - Notre Carte | Restaurant Fast-Food de Qualité à Reims</title>
        <meta 
          name="description" 
          content="Découvrez notre carte complète : pizzas au feu de bois, burgers gourmands, salades fraîches, spécialités tex-mex, boissons et desserts. Une cuisine rapide de qualité à Reims." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
        {/* Hero Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-r from-gray-900 via-black to-gray-800 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/bg-hero.webp"
              alt="Menu background"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-light text-white mb-8 font-serif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Notre <span className="text-amber-400">Carte</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-300 mb-12 font-light max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Une cuisine qui allie tradition et modernité, 
                préparée avec passion par nos chefs
              </motion.p>

              {/* Barre de recherche */}
              <motion.div
                className="max-w-md mx-auto relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un plat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section Offres Spéciales */}
        <MenuOffers />

        {/* Section Produits en Vedette */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl font-light text-gray-900 mb-6 font-serif">
                  Nos <span className="text-amber-600">Spécialités</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Les plats les plus appréciés de nos clients
            </p>
          </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {featuredProducts.map((product: any, index) => (
                  <motion.div
                    key={product._id || product.id || index}
                    variants={itemVariants}
                    whileHover="hover"
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.image || '/images/menu/default.jpg'}
                        alt={product.name || 'Produit'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <motion.div
                          variants={pulseVariants}
                          animate="pulse"
                          className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center"
                        >
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Bestseller
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description || product.baseIngredients?.join(', ') || 'Délicieux plat préparé avec soin'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amber-600">
                          {product.price}€
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Section Catégories */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-light text-gray-900 mb-6 font-serif">
                Explorez nos <span className="text-amber-600">Catégories</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Chaque catégorie regorge de saveurs uniques et authentiques
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {menuCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    whileHover="hover"
                    className="group cursor-pointer"
                  >
                    <Link href={category.href}>
                      <div className={`${category.bgColor} rounded-2xl p-8 h-full border border-gray-200 hover:border-gray-300 transition-all duration-300 group-hover:shadow-xl`}>
                        <div className="text-center">
                          <motion.div
                            className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-10 h-10 text-white" />
                          </motion.div>
                          
                          <h3 className={`text-2xl font-semibold ${category.textColor} mb-4 group-hover:text-gray-900 transition-colors`}>
                            {category.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {category.count} produit{category.count > 1 ? 's' : ''}
                            </span>
                            <motion.div
                              className={`${category.textColor} group-hover:text-gray-900 transition-colors`}
                              whileHover={{ x: 5 }}
                            >
                              <ChevronRight className="w-5 h-5" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-light text-white mb-6 font-serif">
                Prêt à commander ?
              </h2>
              <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
                Découvrez nos spécialités et laissez-vous tenter par nos créations culinaires
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/menu/pizzas"
                    className="inline-flex items-center px-8 py-4 bg-white text-amber-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Pizza className="w-5 h-5 mr-2" />
                    Voir les Pizzas
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="tel:0326407967"
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-amber-600 transition-colors"
                  >
                    <Utensils className="w-5 h-5 mr-2" />
                    Commander
                  </Link>
                </motion.div>
              </div>
          </motion.div>
        </div>
        </section>
      </div>
    </>
  );
}