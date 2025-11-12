import { motion, useScroll, useTransform } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  Pizza, 
  Utensils, 
  Leaf, 
  IceCream,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Flame
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import MenuOffers from '@/components/menu/MenuOffers';

// Configuration des catégories de menu
const menuCategories = [
  {
    id: 'pizza',
    title: "PIZZAS",
    subtitle: "Au feu de bois",
    description: "Pâte maison, cuisson traditionnelle, ingrédients frais",
    icon: Pizza,
    color: "from-red-500 via-orange-500 to-red-600",
    bgColor: "bg-red-500",
    textColor: "text-red-600",
    href: "/menu/pizzas",
    image: "/images/menu/pizza-hero.jpg",
    count: 0
  },
  {
    id: 'burger',
    title: "BURGERS",
    subtitle: "Gourmands & savoureux",
    description: "Viandes sélectionnées, pains artisanaux, sauces maison",
    icon: Utensils,
    color: "from-amber-500 via-yellow-500 to-orange-500",
    bgColor: "bg-amber-500",
    textColor: "text-amber-600",
    href: "/menu/burgers",
    image: "/images/menu/burger-hero.jpg",
    count: 0
  },
  {
    id: 'salad',
    title: "SALADES & ASSIETTES",
    subtitle: "Fraîches & équilibrées",
    description: "Légumes frais, protéines de qualité, vinaigrettes maison",
    icon: Leaf,
    color: "from-green-500 via-emerald-500 to-teal-500",
    bgColor: "bg-green-500",
    textColor: "text-green-600",
    href: "/menu/salads",
    image: "/images/menu/salad-hero.jpg",
    count: 0
  },
  {
    id: 'sandwich',
    title: "SANDWICHS",
    subtitle: "Garnis & généreux",
    description: "Pains frais, garnitures variées, sauces maison",
    icon: Utensils,
    color: "from-orange-500 via-amber-500 to-yellow-500",
    bgColor: "bg-orange-500",
    textColor: "text-orange-600",
    href: "/menu/sandwiches",
    image: "/images/menu/sandwich-hero.jpg",
    count: 0
  },
  {
    id: 'dessert',
    title: "DESSERTS",
    subtitle: "Douceurs & gourmandises",
    description: "Pâtisseries maison, glaces artisanales, douceurs",
    icon: IceCream,
    color: "from-pink-500 via-purple-500 to-indigo-500",
    bgColor: "bg-pink-500",
    textColor: "text-pink-600",
    href: "/menu/desserts",
    image: "/images/menu/dessert-hero.jpg",
    count: 0
  }
];

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function MenuPage() {
  const { foods, drinks, desserts, sides, sauces } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculer le nombre de produits par catégorie
  useEffect(() => {
    const categoriesWithCount = menuCategories.map(category => {
      let count = 0;
      switch (category.id) {
        case 'pizza':
          count = foods.filter((food: any) => food.type === 'pizza').length;
          break;
        case 'burger':
          count = foods.filter((food: any) => food.type === 'burger').length;
          break;
        case 'salad':
          count = foods.filter((food: any) => 
            food.type === 'salad' || 
            food.type === 'plate' ||
            food.type === 'plates' ||
            food.category === 'assiettes' ||
            food.name?.toLowerCase().includes('assiette')
          ).length;
          break;
        case 'sandwich':
          count = foods.filter((food: any) => 
            food.type === 'sandwich' || 
            food.type === 'sandwich_durum' ||
            food.category === 'sandwichs' ||
            (food.category === 'food' && food.name?.toLowerCase().includes('sandwich'))
          ).length;
          break;
        case 'dessert':
          count = desserts.length;
          break;
      }
      return { ...category, count };
    });
    
    menuCategories.forEach((category, index) => {
      menuCategories[index].count = categoriesWithCount[index].count;
    });
    
    setIsLoading(false);
  }, [foods, drinks, desserts, sides, sauces]);

  // Animation de parallaxe pour les images
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  return (
    <>
      <Head>
        <title>Le 9 - Notre Carte | Restaurant Fast-Food de Qualité à Reims</title>
        <meta 
          name="description" 
          content="Découvrez notre carte complète : pizzas au feu de bois, burgers gourmands, salades fraîches, spécialités tex-mex, boissons et desserts. Une cuisine rapide de qualité à Reims." 
        />
      </Head>

      <div ref={containerRef} className="min-h-screen bg-black">
        {/* Hero Section - Immense et impactant */}
        <motion.section 
          className="relative h-screen flex items-center justify-center overflow-hidden"
          initial="hidden"
          animate="visible"
        >
          {/* Image de fond avec parallaxe */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: y1, opacity }}
          >
            <Image
              src="/images/bg-hero.webp"
              alt="Menu background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
          </motion.div>

          {/* Contenu principal */}
          <motion.div
            className="relative z-10 text-center px-4"
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-8xl md:text-[12rem] font-black text-white mb-8 tracking-tight leading-none"
              variants={scaleIn}
            >
              NOTRE
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                CARTE
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-3xl md:text-5xl text-gray-300 mb-12 font-light max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              Une expérience culinaire
              <br />
              <span className="text-white font-medium">exceptionnelle</span>
            </motion.p>

            {/* Effet de particules animées */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-amber-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-8 h-8 text-white rotate-90" />
          </motion.div>
        </motion.section>

        {/* Section Offres Spéciales */}
        <section className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-black">
          <MenuOffers />
        </section>

        {/* Catégories - Immenses cartes avec images */}
        <section className="relative py-20 bg-black">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tight">
                EXPLOREZ
              </h2>
              <p className="text-2xl md:text-4xl text-gray-400 font-light">
                Nos univers culinaires
              </p>
            </motion.div>

            <div className="space-y-32">
              {menuCategories.map((category, index) => {
                const Icon = category.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={category.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={isEven ? slideInLeft : slideInRight}
                    className="relative"
                  >
                    <Link href={category.href}>
                      <motion.div
                        className="relative group cursor-pointer overflow-hidden rounded-3xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {/* Image de fond - Immense */}
                        <div className="relative h-[600px] md:h-[800px] overflow-hidden">
                          <motion.div
                            className="absolute inset-0"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Image
                              src={category.image || '/images/menu/default.jpg'}
                              alt={category.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                              }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-80 group-hover:opacity-70 transition-opacity duration-500`} />
                          </motion.div>

                          {/* Contenu superposé */}
                          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-12">
                            {/* Icône animée */}
                            <motion.div
                              className={`w-32 h-32 ${category.bgColor} rounded-full flex items-center justify-center mb-8 shadow-2xl`}
                              whileHover={{ rotate: 360, scale: 1.2 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Icon className="w-16 h-16 text-white" />
                            </motion.div>

                            {/* Titre - ÉNORME */}
                            <motion.h3
                              className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight"
                              whileHover={{ scale: 1.05 }}
                            >
                              {category.title}
                            </motion.h3>

                            {/* Sous-titre */}
                            <motion.p
                              className="text-2xl md:text-4xl text-white/90 mb-6 font-light"
                              whileHover={{ x: 10 }}
                            >
                              {category.subtitle}
                            </motion.p>

                            {/* Description */}
                            <motion.p
                              className="text-lg md:text-xl text-white/80 max-w-2xl mb-8"
                              whileHover={{ x: 10 }}
                            >
                              {category.description}
                            </motion.p>

                            {/* Compteur et bouton */}
                            <div className="flex items-center gap-6">
                              <motion.span
                                className="text-2xl md:text-3xl text-white font-bold"
                                whileHover={{ scale: 1.1 }}
                              >
                                {category.count} produit{category.count > 1 ? 's' : ''}
                              </motion.span>
                              
                              <motion.div
                                className="flex items-center gap-2 text-white text-xl font-bold"
                                whileHover={{ x: 10 }}
                              >
                                <span>Découvrir</span>
                                <ArrowRight className="w-6 h-6" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Effet de brillance au survol */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            style={{ width: '200%' }}
                          />
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section CTA finale - Immense */}
        <motion.section 
          className="relative py-32 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {/* Effets de particules */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2
              className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tight"
              variants={scaleIn}
            >
              PRÊT À
              <br />
              COMMANDER ?
            </motion.h2>
            
            <motion.p
              className="text-3xl md:text-5xl text-white/90 mb-12 font-light max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              Découvrez nos spécialités et laissez-vous tenter
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/menu/pizzas"
                  className="inline-flex items-center px-12 py-6 bg-white text-orange-600 font-black text-2xl rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all"
                >
                  <Pizza className="w-8 h-8 mr-3" />
                  VOIR LES PIZZAS
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/commander"
                  className="inline-flex items-center px-12 py-6 border-4 border-white text-white font-black text-2xl rounded-full hover:bg-white hover:text-orange-600 transition-all"
                >
                  <Utensils className="w-8 h-8 mr-3" />
                  COMMANDER
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
