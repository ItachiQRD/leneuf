import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Heart,
  Users,
  Award,
  ChefHat,
  Utensils,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';

// Images de démonstration (à remplacer par vos vraies images)
const scrollImages = [
  '/images/menu/pizza-menu.jpeg',
  '/images/menu/avecboisson.jpeg',
  '/images/menu/sansboisson.jpeg',
  '/images/menu/pizza-menu.jpeg',
];

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

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Références pour les sections avec scroll
  const heroRef = useRef(null);
  const historyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const specialtiesRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const historyInView = useInView(historyRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.3 });
  const specialtiesInView = useInView(specialtiesRef, { once: true, amount: 0.3 });

  // Transformations pour les animations parallax
  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const imageY = useTransform(smoothProgress, [0, 1], [0, -200]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Head>
        <title>À Propos - LE NEUF | Fast Food & Grill</title>
        <meta 
          name="description" 
          content="Découvrez l'histoire de LE NEUF, votre restaurant de fast-food préféré à Reims. Qualité, passion et service depuis 2024." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
        {/* Hero Section avec parallax */}
        <motion.section 
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Background animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-orange-600">
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                backgroundSize: '200% 200%',
              }}
            />
          </div>

          {/* Images flottantes en arrière-plan */}
          {scrollImages.map((img, index) => (
            <motion.div
              key={index}
              className="absolute opacity-20"
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 15}%`,
                width: '200px',
                height: '200px',
                y: imageY,
                scale: imageScale,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              <Image
                src={img}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover rounded-2xl blur-sm"
              />
            </motion.div>
          ))}

          {/* Contenu principal */}
          <motion.div 
            className="relative z-10 text-center text-white px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="mb-8"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <ChefHat className="w-24 h-24 mx-auto text-yellow-300" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 font-serif"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              À Propos de <span className="text-yellow-300 font-bold">LE NEUF</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-red-100 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Votre restaurant de fast-food préféré depuis 2024
            </motion.p>

            {/* Indicateur de scroll */}
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <ArrowRight className="w-8 h-8 rotate-90 text-white opacity-70" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Notre Histoire avec images scrollantes */}
        <motion.section 
          ref={historyRef}
          className="py-24 bg-white relative overflow-hidden"
        >
          {/* Images qui scrollent horizontalement */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              className="flex space-x-8"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {[...scrollImages, ...scrollImages].map((img, index) => (
                <div key={index} className="relative w-64 h-64 flex-shrink-0 opacity-10">
                  <Image
                    src={img}
                    alt={`Histoire ${index + 1}`}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={historyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="text-center mb-12"
                variants={itemVariants}
                initial="hidden"
                animate={historyInView ? "show" : "hidden"}
              >
                <motion.h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  Notre Histoire
                </motion.h2>
                <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-500 mx-auto mb-8" />
              </motion.div>

              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-6 text-justify">
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    animate={historyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Fondé en 2024, <strong className="text-red-600">LE NEUF</strong> est né de la passion pour la cuisine rapide de qualité. 
                    Notre équipe de chefs expérimentés a créé un menu unique qui combine 
                    tradition et innovation pour offrir une expérience culinaire exceptionnelle.
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, x: 50 }}
                    animate={historyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Nous croyons que la bonne nourriture ne doit pas prendre du temps à préparer. 
                    C'est pourquoi nous nous efforçons de servir des plats frais, savoureux et 
                    préparés avec amour, le tout dans un délai record. Chaque commande est 
                    préparée avec attention aux détails et avec des ingrédients de première qualité.
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    animate={historyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Aujourd'hui, <strong className="text-red-600">LE NEUF</strong> est devenu une référence dans le domaine de la restauration 
                    rapide à Reims, grâce à notre engagement envers la qualité, la rapidité et le service client. 
                    Nous sommes fiers de servir notre communauté avec des produits frais et une cuisine authentique.
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Nos Valeurs avec animations interactives */}
        <motion.section 
          ref={valuesRef}
          className="py-24 bg-gradient-to-br from-gray-50 to-red-50 relative overflow-hidden"
        >
          {/* Éléments décoratifs animés */}
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 bg-red-200 rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Nos Valeurs
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Les principes qui guident notre travail chaque jour
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Passion",
                  description: "Nous mettons notre cœur dans chaque plat que nous préparons",
                  color: "from-red-500 to-pink-500",
                  bgColor: "bg-red-50",
                  delay: 0
                },
                {
                  icon: Award,
                  title: "Qualité",
                  description: "Seuls les meilleurs ingrédients entrent dans nos recettes",
                  color: "from-yellow-500 to-amber-500",
                  bgColor: "bg-yellow-50",
                  delay: 0.2
                },
                {
                  icon: Clock,
                  title: "Rapidité",
                  description: "Service express sans compromis sur la qualité",
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "bg-blue-50",
                  delay: 0.4
                },
                {
                  icon: Users,
                  title: "Service",
                  description: "Nos clients sont au centre de tout ce que nous faisons",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "bg-green-50",
                  delay: 0.6
                }
              ].map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={valuesInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: value.delay }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-${value.color.split('-')[1]}-300 h-full flex flex-col`}>
                      <motion.div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 mx-auto`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-center flex-grow">
                        {value.description}
                      </p>
                      
                      {/* Effet de brillance au survol */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Notre Équipe avec images parallax */}
        <motion.section 
          ref={teamRef}
          className="py-24 bg-white relative"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Notre Équipe
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Des professionnels passionnés qui font la différence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Chef Principal",
                  role: "Direction Culinaire",
                  description: "15 ans d'expérience dans la restauration rapide de qualité",
                  image: '/images/a-propos/chef.png'
                },
                {
                  name: "Équipe de Service",
                  role: "Service Client",
                  description: "Formés pour vous offrir le meilleur accueil possible",
                  image: '/images/a-propos/team.png'
                },
                {
                  name: "Équipe de Cuisine",
                  role: "Préparation",
                  description: "Experts en préparation rapide et efficace",
                  image: '/images/a-propos/cuisine.png'
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  animate={teamInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.03, y: -10 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  
                  <div className="p-6 text-center">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 -mt-12 relative z-10 shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <ChefHat className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-red-600 font-semibold mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Nos Spécialités avec carrousel d'images */}
        <motion.section 
          ref={specialtiesRef}
          className="py-24 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden"
        >
          {/* Images qui flottent */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {scrollImages.map((img, index) => (
              <motion.div
                key={index}
                className="absolute opacity-10"
                style={{
                  left: `${index * 25}%`,
                  top: `${20 + index * 20}%`,
                  width: '300px',
                  height: '300px',
                }}
                animate={{
                  y: [0, -50, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 5 + index,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                <Image
                  src={img}
                  alt={`Spécialité ${index + 1}`}
                  fill
                  className="object-cover rounded-full blur-md"
                />
              </motion.div>
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={specialtiesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Nos Spécialités
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez ce qui fait notre réputation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Utensils,
                  title: "Tacos Authentiques",
                  description: "Préparés selon la tradition mexicaine avec des ingrédients frais et des sauces maison",
                  color: "from-red-500 to-orange-500",
                  image: scrollImages[0]
                },
                {
                  icon: ChefHat,
                  title: "Burgers Gourmets",
                  description: "Des burgers artisanaux avec des viandes de qualité supérieure et des pains frais",
                  color: "from-amber-500 to-yellow-500",
                  image: scrollImages[1]
                },
                {
                  icon: Star,
                  title: "Recettes Secrètes",
                  description: "Des sauces et marinades uniques créées par nos chefs pour une expérience inoubliable",
                  color: "from-yellow-500 to-orange-500",
                  image: scrollImages[2]
                }
              ].map((specialty, index) => {
                const Icon = specialty.icon;
                return (
                  <motion.div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 50, rotateX: -15 }}
                    animate={specialtiesInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={specialty.image}
                          alt={specialty.title}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <motion.div
                        className={`absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br ${specialty.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {specialty.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {specialty.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CTA Section avec animation */}
        <motion.section 
          className="py-24 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white relative overflow-hidden"
        >
          {/* Particules animées */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
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

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                Prêt à Découvrir LE NEUF ?
              </motion.h2>
              <p className="text-xl md:text-2xl text-red-100 mb-8">
                Commandez maintenant et savourez l'excellence de notre cuisine
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/commander"
                  className="inline-block bg-white text-red-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Commander Maintenant</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
