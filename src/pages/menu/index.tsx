import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  ChevronLeft,
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
    image: "/images/menu/sides.jpg",
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
    image: "/images/menu/sandwich.jpg",
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
    image: "/images/menu/dessert.jpg",
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

// Composant séparé pour chaque slide desktop : évite d'appeler des hooks dans une boucle (règles des Hooks).
function DesktopCarouselSlide({
  category,
  index,
  total,
  carouselScrollProgress,
}: {
  category: (typeof menuCategories)[0];
  index: number;
  total: number;
  carouselScrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const Icon = category.icon;
  const rel = useTransform(carouselScrollProgress, [0, 1], [index, index - (total - 1)]);
  const opacity = useTransform(rel, [-2, -1.2, -0.8, 0.8, 1.2, 2], [0, 0, 1, 1, 0, 0]);
  const visibility = useTransform(rel, [-2, -1.15, 1.15, 2], ['hidden', 'visible', 'visible', 'hidden']);
  const slideOffsetPx = 520;
  const x = useTransform(rel, [-1, 0, 1], [-slideOffsetPx, 0, slideOffsetPx]);
  const scale = useTransform(rel, [-1, 0, 1], [0.82, 1, 0.82]);
  const z = useTransform(rel, [-1, 0, 1], [-80, 0, -80]);
  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        x,
        z,
        scale,
        opacity,
        visibility,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className="w-[90vw] max-w-[520px] flex-shrink-0"
        style={{ pointerEvents: 'auto' }}
      >
        <Link href={category.href} className="block">
          <motion.div
            className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative aspect-[4/3] min-h-[300px] overflow-hidden">
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
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <motion.div
                  className={`inline-flex w-14 h-14 rounded-full ${category.bgColor} items-center justify-center mb-4 shadow-xl`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
                  {category.title}
                </h3>
                <p className="text-base md:text-xl text-white/90 font-light mb-3">
                  {category.subtitle}
                </p>
                <div className="flex items-center gap-3 text-white/90 text-sm md:text-base">
                  <span className="font-semibold">
                    {category.count} produit{category.count !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-2 font-semibold">
                    Découvrir <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function MenuPage() {
  const { foods, drinks, desserts, sides, sauces } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  const [isMobileCarousel, setIsMobileCarousel] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const { scrollYProgress: carouselScrollProgress } = useScroll({
    target: carouselRef,
    offset: ["start start", "end end"]
  });

  // Détection mobile pour le carousel (swipe/boutons au lieu du scroll)
  useEffect(() => {
    const check = () => setIsMobileCarousel(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
              className="object-cover object-[center_35%]"
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

        {/* Carousel des catégories — fond vidéo background.mp4 */}
        <section
          ref={carouselRef}
          className="relative overflow-hidden"
          style={{ height: isMobileCarousel ? 'auto' : `${menuCategories.length * 100}vh`, minHeight: isMobileCarousel ? '85vh' : undefined }}
        >
          {/* Vidéo de fond */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden
            >
              <source src="/images/carte/background.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
          </div>

          {/* Mobile : une slide à la fois, swipe + boutons (pas de scroll) */}
          {isMobileCarousel ? (
            <div className="relative z-10 py-12 px-4 min-h-[85vh] flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-white mb-1 tracking-tight">EXPLOREZ</h2>
                <p className="text-gray-400 text-sm">Glissez ou utilisez les flèches</p>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <motion.button
                  type="button"
                  aria-label="Précédent"
                  className="absolute left-2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white touch-none"
                  onClick={() => setMobileCarouselIndex((i) => (i === 0 ? menuCategories.length - 1 : i - 1))}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  type="button"
                  aria-label="Suivant"
                  className="absolute right-2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white touch-none"
                  onClick={() => setMobileCarouselIndex((i) => (i === menuCategories.length - 1 ? 0 : i + 1))}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
                <motion.div
                  className="w-full max-w-[340px] mx-auto overflow-hidden touch-pan-y"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 60) setMobileCarouselIndex((i) => (i === 0 ? menuCategories.length - 1 : i - 1));
                    if (info.offset.x < -60) setMobileCarouselIndex((i) => (i === menuCategories.length - 1 ? 0 : i + 1));
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {menuCategories.map((category, index) => {
                      if (index !== mobileCarouselIndex) return null;
                      const Icon = category.icon;
                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: 'tween', duration: 0.25 }}
                          className="w-full"
                        >
                          <Link href={category.href} className="block">
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                  src={category.image || '/images/menu/pizzas.jpg'}
                                  alt={category.title}
                                  fill
                                  className="object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent ${category.color} opacity-70`} />
                                <div className="absolute inset-0 flex flex-col justify-end p-5">
                                  <div className={`inline-flex w-12 h-12 rounded-full ${category.bgColor} items-center justify-center mb-2 shadow-xl`}>
                                    <Icon className="w-6 h-6 text-white" />
                                  </div>
                                  <h3 className="text-2xl font-black text-white tracking-tight">{category.title}</h3>
                                  <p className="text-sm text-white/90 font-light mb-2">{category.subtitle}</p>
                                  <div className="flex items-center gap-2 text-white/90 text-sm">
                                    <span className="font-semibold">{category.count} produit{category.count !== 1 ? 's' : ''}</span>
                                    <span className="flex items-center gap-1 font-semibold">Découvrir <ArrowRight className="w-4 h-4" /></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {menuCategories.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${i === mobileCarouselIndex ? 'bg-white w-6' : 'bg-white/40'}`}
                    onClick={() => setMobileCarouselIndex(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
            <div className="sticky top-0 z-10 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
              <div className="w-full flex-shrink-0 pt-8 pb-4 text-center">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                  EXPLOREZ
                </h2>
                <p className="text-lg md:text-xl text-gray-400 font-light">
                  Faites défiler pour découvrir les catégories
                </p>
              </div>

            {/* Desktop : 3 slides côte à côte, plus d'espace et cartes plus grandes */}
            <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
              {menuCategories.map((category, index) => (
                <DesktopCarouselSlide
                  key={category.id}
                  category={category}
                  index={index}
                  total={menuCategories.length}
                  carouselScrollProgress={carouselScrollProgress}
                />
              ))}
            </div>
          </div>
          </>
          )}
        </section>

        {/* Section Offres Spéciales / Promotions */}
        <MenuOffers />

        {/* Section CTA finale - compacte sur mobile */}
        <motion.section 
          className="relative py-12 sm:py-20 md:py-28 lg:py-32 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {/* Effets de particules */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full"
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
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-black text-white mb-4 md:mb-8 tracking-tight leading-tight"
              variants={scaleIn}
            >
              PRÊT À
              <br />
              COMMANDER ?
            </motion.h2>
            
            <motion.p
              className="text-base sm:text-lg md:text-2xl lg:text-4xl xl:text-5xl text-white/90 mb-6 md:mb-12 font-light max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              Découvrez nos spécialités et laissez-vous tenter
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/menu/pizzas"
                  className="inline-flex items-center px-6 py-3.5 sm:px-8 sm:py-4 md:px-12 md:py-6 bg-white text-orange-600 font-black text-sm sm:text-base md:text-xl lg:text-2xl rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all"
                >
                  <Pizza className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mr-2 sm:mr-3 shrink-0" />
                  VOIR LES PIZZAS
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/commander"
                  className="inline-flex items-center px-6 py-3.5 sm:px-8 sm:py-4 md:px-12 md:py-6 border-2 md:border-4 border-white text-white font-black text-sm sm:text-base md:text-xl lg:text-2xl rounded-full hover:bg-white hover:text-orange-600 transition-all"
                >
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mr-2 sm:mr-3 shrink-0" />
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
