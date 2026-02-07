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
    image: "/images/menu/pizzas.jpg",
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
    image: "/images/menu/burgers.jpg",
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
    image: "/images/menu/bowl.jpeg",
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
    image: "/images/menu/signature.jpg",
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
    image: "/images/menu/frites.jpeg",
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const { scrollYProgress: carouselScrollProgress } = useScroll({
    target: carouselRef,
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

        {/* Carousel des catégories - scroll vertical 3D */}
        <section
          ref={carouselRef}
          className="relative bg-gradient-to-b from-black via-gray-900 to-black"
          style={{ height: `${menuCategories.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: '1200px' }}>
            <motion.div
              className="absolute inset-0 flex flex-col justify-center items-center pt-16 pb-8"
              style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight z-10">
                EXPLOREZ
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light mb-8 z-10">
                Faites défiler pour découvrir les catégories
              </p>
            </motion.div>

            {menuCategories.map((category, index) => {
              const Icon = category.icon;
              const n = menuCategories.length;
              const scale = useTransform(
                carouselScrollProgress,
                [(index - 0.5) / n, index / n, (index + 0.5) / n],
                [0.75, 1, 0.75]
              );
              const y = useTransform(
                carouselScrollProgress,
                [(index - 0.5) / n, index / n, (index + 0.5) / n],
                [120, 0, -120]
              );
              const z = useTransform(
                carouselScrollProgress,
                [(index - 0.5) / n, index / n, (index + 0.5) / n],
                [-200, 0, -200]
              );
              const opacity = useTransform(
                carouselScrollProgress,
                [(index - 0.3) / n, index / n, (index + 0.3) / n],
                [0.4, 1, 0.4]
              );
              const rotateX = useTransform(
                carouselScrollProgress,
                [(index - 0.5) / n, index / n, (index + 0.5) / n],
                [25, 0, -25]
              );

              return (
                <motion.div
                  key={category.id}
                  className="absolute inset-0 flex items-center justify-center px-4"
                  style={{
                    scale,
                    y,
                    z,
                    opacity,
                    rotateX,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <Link href={category.href} className="block w-full max-w-4xl">
                    <motion.div
                      className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="relative h-[55vh] min-h-[320px] overflow-hidden">
                        <Image
                          src={category.image || '/images/menu/pizzas.jpg'}
                          alt={category.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent ${category.color} opacity-70`} />
                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                          <motion.div
                            className={`inline-flex w-16 h-16 rounded-full ${category.bgColor} items-center justify-center mb-4 shadow-xl`}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </motion.div>
                          <h3 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                            {category.title}
                          </h3>
                          <p className="text-xl md:text-2xl text-white/90 font-light mb-4">
                            {category.subtitle}
                          </p>
                          <p className="text-base text-white/80 mb-6 max-w-xl">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-white font-bold">
                              {category.count} produit{category.count !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-2 text-white font-semibold">
                              Découvrir <ArrowRight className="w-5 h-5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
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
