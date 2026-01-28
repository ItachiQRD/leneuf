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

        {/* Catégories - Scroll 3D avec effet de profondeur */}
        <section 
          className="relative py-40 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
          style={{ perspective: '2000px' }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tight">
                EXPLOREZ
              </h2>
              <p className="text-2xl md:text-4xl text-gray-400 font-light">
                Nos univers culinaires en 3D
              </p>
            </motion.div>

            {/* Container 3D pour les cartes */}
            <div 
              className="relative"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '2000px'
              }}
            >
              {menuCategories.map((category, index) => {
                const Icon = category.icon;
                
                return (
                  <motion.div
                    key={category.id}
                    className="relative mb-64"
                    initial={{ 
                      opacity: 0.3,
                      rotateY: index % 2 === 0 ? -45 : 45,
                      translateZ: -200,
                      scale: 0.8
                    }}
                    whileInView={{ 
                      opacity: 1,
                      rotateY: 0,
                      translateZ: 0,
                      scale: 1
                    }}
                    viewport={{ once: false, margin: "-200px" }}
                    transition={{ 
                      duration: 1,
                      ease: "easeOut"
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <Link href={category.href}>
                      <motion.div
                        className="relative group cursor-pointer overflow-hidden rounded-3xl"
                        whileHover={{ 
                          scale: 1.05,
                          rotateY: 5,
                          transition: { duration: 0.3 }
                        }}
                        style={{
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        {/* Image de fond avec effet 3D */}
                        <div className="relative h-[500px] md:h-[700px] overflow-hidden">
                          <motion.div
                            className="absolute inset-0"
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.6 }}
                            style={{
                              transformStyle: 'preserve-3d',
                            }}
                          >
                            <Image
                              src={category.image || '/images/menu/pizzas.jpg'}
                              alt={category.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-75 group-hover:opacity-60 transition-opacity duration-500`} />
                            
                            {/* Effet de lumière 3D */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>

                          {/* Contenu superposé avec effet 3D */}
                          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-12">
                            {/* Icône animée avec effet 3D */}
                            <motion.div
                              className={`w-32 h-32 ${category.bgColor} rounded-full flex items-center justify-center mb-8 shadow-2xl`}
                              whileHover={{ 
                                rotateY: 360, 
                                scale: 1.2,
                                transition: { duration: 0.8 }
                              }}
                              style={{
                                transformStyle: 'preserve-3d',
                              }}
                            >
                              <Icon className="w-16 h-16 text-white" />
                            </motion.div>

                            {/* Titre avec effet de profondeur */}
                            <motion.h3
                              className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight"
                              whileHover={{ 
                                scale: 1.05,
                                textShadow: '0 0 30px rgba(255,255,255,0.5)'
                              }}
                              style={{
                                textShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                transform: 'translateZ(50px)',
                              }}
                            >
                              {category.title}
                            </motion.h3>

                            {/* Sous-titre */}
                            <motion.p
                              className="text-2xl md:text-4xl text-white/90 mb-6 font-light"
                              whileHover={{ 
                                x: 10,
                                transform: 'translateZ(30px)'
                              }}
                            >
                              {category.subtitle}
                            </motion.p>

                            {/* Description */}
                            <motion.p
                              className="text-lg md:text-xl text-white/80 max-w-2xl mb-8"
                              whileHover={{ 
                                x: 10,
                                transform: 'translateZ(20px)'
                              }}
                            >
                              {category.description}
                            </motion.p>

                            {/* Compteur et bouton avec effet 3D */}
                            <motion.div 
                              className="flex items-center gap-6"
                              style={{
                                transform: 'translateZ(40px)',
                              }}
                            >
                              <motion.span
                                className="text-2xl md:text-3xl text-white font-bold"
                                whileHover={{ scale: 1.1 }}
                              >
                                {category.count} produit{category.count > 1 ? 's' : ''}
                              </motion.span>
                              
                              <motion.div
                                className="flex items-center gap-2 text-white text-xl font-bold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
                                whileHover={{ 
                                  x: 10,
                                  scale: 1.1,
                                  backgroundColor: 'rgba(255,255,255,0.2)'
                                }}
                              >
                                <span>Découvrir</span>
                                <ArrowRight className="w-6 h-6" />
                              </motion.div>
                            </motion.div>
                          </div>

                          {/* Effet de brillance 3D au survol */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: '-100%', rotateY: 90 }}
                            whileHover={{ 
                              x: '200%',
                              transition: { duration: 0.8 }
                            }}
                            style={{
                              transformStyle: 'preserve-3d',
                            }}
                          />
                        </div>

                        {/* Ombre portée 3D */}
                        <motion.div
                          className="absolute -inset-4 bg-black/50 blur-2xl -z-10"
                          style={{
                            transform: 'translateZ(-100px)',
                          }}
                        />
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
