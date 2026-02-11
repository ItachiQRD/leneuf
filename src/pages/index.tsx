import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Utensils, Clock, Award, Star, MapPin, Phone, Navigation, Calendar, Users, Heart, ChefHat, Pizza, Wine, Coffee, CheckCircle } from 'lucide-react';
import SmartImage from '@/components/common/SmartImage';
import MenuOffers from '@/components/menu/MenuOffers';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const router = useRouter();
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Vérifier si on vient d'une commande réussie
  useEffect(() => {
    if (router.query.orderSuccess === 'true') {
      setShowOrderSuccess(true);
      // Nettoyer l'URL
      router.replace('/', undefined, { shallow: true });
    }
  }, [router.query, router]);

  // Slogans proposés pour la section Hero
  const heroSlogans = [
    "L'art culinaire à son apogée",
    "Une tradition, une passion, une excellence",
    "Où chaque plat raconte une histoire",
    "L'essence du goût authentique",
    "Votre table d'exception à Reims"
  ];

  // CTA principaux proposés
  const ctaOptions = [
    { text: "Découvrir notre carte", href: "/menu", icon: <Utensils className="w-5 h-5" /> },
    { text: "Réserver une table", href: "tel:0326407967", icon: <Phone className="w-5 h-5" /> },
    { text: "Commander en ligne", href: "/menu", icon: <ChevronRight className="w-5 h-5" /> },
    { text: "Voir nos spécialités", href: "#specialites", icon: <Star className="w-5 h-5" /> }
  ];

  // Produits du menu (basés sur votre base de données)
  const menuHighlights = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Tomate, mozzarella, basilic frais',
      price: '12.90',
      image: '/images/menu/pizzas.jpg',
      category: 'Pizza',
      rating: 4.9,
      isNew: false
    },
    {
      id: 2,
      name: 'Burger Le 9 Signature',
      description: 'Double steak, cheddar, sauce secrète',
      price: '14.90',
      image: '/images/menu/signature.jpg',
      category: 'Burger',
      rating: 4.8,
      isNew: true
    },
    {
      id: 3,
      name: 'Tacos de Bœuf',
      description: 'Viande hachée, légumes frais, sauce maison',
      price: '10.50',
      image: '/images/menu/tacos.jpg',
      category: 'Tex-Mex',
      rating: 4.7,
      isNew: false
    },
    {
      id: 4,
      name: 'Salade Le Neuf',
      description: 'Salade verte, tomate, olives, poulet',
      price: '7.00',
      image: '/images/menu/leneuf.jpg',
      category: 'Salade',
      rating: 4.6,
      isNew: false
    }
  ];

  // Refs pour effet apparition / disparition au scroll
  const sectionAboutRef = useRef<HTMLElement>(null);
  const sectionExpertiseRef = useRef<HTMLElement>(null);
  const sectionTestimonialsRef = useRef<HTMLElement>(null);
  const sectionContactRef = useRef<HTMLElement>(null);
  const sectionCtaRef = useRef<HTMLElement>(null);

  const scrollOffset: ['start end', 'end start'] = ['start end', 'end start'];

  const { scrollYProgress: progressAbout } = useScroll({ target: sectionAboutRef, offset: scrollOffset });
  const opacityAbout = useTransform(progressAbout, [0, 0.15, 0.88, 1], [0, 1, 1, 0]);
  const { scrollYProgress: progressExpertise } = useScroll({ target: sectionExpertiseRef, offset: scrollOffset });
  const opacityExpertise = useTransform(progressExpertise, [0, 0.15, 0.88, 1], [0, 1, 1, 0]);
  const { scrollYProgress: progressTestimonials } = useScroll({ target: sectionTestimonialsRef, offset: scrollOffset });
  const opacityTestimonials = useTransform(progressTestimonials, [0, 0.15, 0.88, 1], [0, 1, 1, 0]);
  const { scrollYProgress: progressContact } = useScroll({ target: sectionContactRef, offset: scrollOffset });
  const opacityContact = useTransform(progressContact, [0, 0.15, 0.88, 1], [0, 1, 1, 0]);
  const { scrollYProgress: progressCta } = useScroll({ target: sectionCtaRef, offset: scrollOffset });
  const opacityCta = useTransform(progressCta, [0, 0.15, 0.88, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* Modal de succès de commande */}
      <Transition show={showOrderSuccess} as={Fragment}>
        <Dialog onClose={() => setShowOrderSuccess(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-xl transition-all">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>

                  <Dialog.Title className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Commande confirmée !
                  </Dialog.Title>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Votre commande a été prise en compte et sera préparée dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setShowOrderSuccess(false)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all font-medium"
                  >
                    Parfait
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Design Minimaliste Élégant */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        >
          <Image
            src="/images/bg-hero.webp"
            alt="Hero background"
            fill
            className="object-cover object-[center_35%] opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        </motion.div>

        <motion.div
          className="container mx-auto px-4 z-10 text-center max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >

          {/* Logo principal */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <Image
              src="/images/logo.png"
              alt="Le 9 Logo"
              width={200}
              height={200}
              className="mx-auto"
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </motion.div>

          {/* Slogan */}
          <motion.p 
            className="text-2xl md:text-3xl text-gray-300 mb-12 font-light tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Des saveurs authentiques qui vous transportent
          </motion.p>

          {/* CTA Principal */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/menu"
              className="inline-flex items-center px-12 py-4 text-lg font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {ctaOptions[0].icon}
              <span className="ml-3">{ctaOptions[0].text}</span>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="tel:0326407967"
              className="inline-flex items-center px-12 py-4 text-lg font-medium text-white border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
            >
              {ctaOptions[1].icon}
              <span className="ml-3">{ctaOptions[1].text}</span>
            </Link>
          </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator minimaliste */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-16 bg-white/60" />
        </motion.div>
      </section>

      {/* Section À Propos - Notre Histoire */}
      <section ref={sectionAboutRef} className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <motion.div className="container mx-auto px-4 max-w-6xl" style={{ opacity: opacityAbout }}>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div>
              <h2 className="text-5xl font-light text-gray-900 mb-8 font-serif">
                Notre <span className="text-amber-600">Histoire</span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Il y a cinq ans, Le 9 ouvrait ses portes dans un petit local de 30m², 
                  avec pour seul capital : une passion dévorante pour la cuisine et 
                  l'envie farouche de partager des saveurs authentiques.
                </p>
                <p className="text-lg">
                  Les premiers mois furent difficiles. Les clients se comptaient sur 
                  les doigts d'une main, les recettes suffisaient à peine à payer 
                  les factures. Mais chaque plat préparé avec amour, chaque sourire 
                  d'un client satisfait, nourrissait notre détermination.
                </p>
                <p className="text-lg">
                  Aujourd'hui, Le 9 rayonne dans le cœur de Reims. Notre équipe de 
                  passionnés, dirigée par deux pizzaiolos d'exception - dont l'un 
                  formé en Italie - perpétue cette tradition d'excellence qui nous 
                  anime depuis le premier jour.
                </p>
                <p className="text-lg font-medium text-gray-800">
                  L'avenir s'écrit maintenant en lettres d'or, avec l'ambition de 
                  devenir LA référence gastronomique de la région.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/restaurant.jpg"
                alt="Restaurant Le 9"
                width={600}
                height={400}
                className="object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">5+</div>
                  <div className="text-sm text-gray-600">Années d'expérience</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section Expertise Culinaire */}
      <section ref={sectionExpertiseRef} className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <motion.div className="container mx-auto px-4 max-w-6xl" style={{ opacity: opacityExpertise }}>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6 font-serif">
              Notre <span className="text-amber-600">Expertise</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une équipe de passionnés au service de l'excellence culinaire
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Pizzaiolos */}
            <motion.div
              className="text-center group"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Pizza className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Pizzaiolos d'Exception</h3>
              <p className="text-gray-600 leading-relaxed">
                Deux maîtres pizzaiolos avec 15 ans d'expérience, dont l'un formé 
                directement en Italie. Chaque pizza est pétrie, étalée et cuite 
                selon les traditions les plus authentiques.
              </p>
            </motion.div>

            {/* Techniques */}
            <motion.div
              className="text-center group"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Techniques Ancestrales</h3>
              <p className="text-gray-600 leading-relaxed">
                Pâte fermentée 48h, cuisson au feu de bois, ingrédients 
                sélectionnés chez les meilleurs producteurs locaux. 
                Chaque geste respecte l'art culinaire traditionnel.
              </p>
            </motion.div>

            {/* Innovation */}
            <motion.div
              className="text-center group"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Innovation Créative</h3>
              <p className="text-gray-600 leading-relaxed">
                Tradition et modernité se rencontrent dans nos créations. 
                Recettes originales, associations audacieuses, 
                toujours dans le respect des saveurs authentiques.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Section Notre Carte / Explorer - fond + bandeau de plats harmonisé */}
      <section id="menu" className="relative min-h-[70vh] md:min-h-[80vh] overflow-hidden flex flex-col items-center justify-center py-16 md:py-20">
        {/* Couche 1 : fond.png */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-gray-900/40">
          <div className="relative w-[85%] h-[85%] min-w-[280px] min-h-[200px] max-w-[90vw] max-h-[90vh]">
            <Image
              src="/images/carte/fond.png"
              alt=""
              fill
              className="object-contain object-center"
              sizes="90vw"
              priority={false}
            />
          </div>
        </div>
        {/* Couche 2 : fond1.png */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center">
          <div className="relative w-[82%] h-[82%] min-w-[280px] min-h-[200px] max-w-[88vw] max-h-[88vh]">
            <Image
              src="/images/carte/fond1.png"
              alt=""
              fill
              className="object-contain object-center"
              sizes="88vw"
              priority={false}
            />
          </div>
        </div>

        {/* Titre en haut */}
        <motion.h2
          className="relative z-20 text-3xl md:text-4xl font-light text-white mb-8 md:mb-10 font-serif drop-shadow-md text-center px-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Notre <span className="text-amber-300">Carte</span>
        </motion.h2>

        {/* Bandeau horizontal : 4 plats, même taille, disposition claire */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-8">
          {[
            { src: '/images/carte/pizza.png', alt: 'Pizza', label: 'Pizzas' },
            { src: '/images/carte/burger.png', alt: 'Burger', label: 'Burgers' },
            { src: '/images/carte/kebab.png', alt: 'Kebab', label: 'Kebabs' },
            { src: '/images/carte/kapsalon.png', alt: 'Kapsalon', label: 'Kapsalon' },
          ].map((item, index) => (
            <motion.div
              key={item.src + index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm shadow-xl ring-1 ring-white/20">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                />
              </div>
              <span className="mt-2 text-sm font-medium text-white/90 drop-shadow-sm">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="relative z-20 mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/menu">
            <motion.span
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-900 bg-white/95 hover:bg-white rounded-xl shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Découvrir la carte
              <ChevronRight className="w-5 h-5" />
            </motion.span>
          </Link>
        </motion.div>
      </section>

      {/* Section Offres Spéciales */}
      <MenuOffers />

      {/* Section Témoignages */}
      <section ref={sectionTestimonialsRef} className="py-24 bg-gray-50">
        <motion.div className="container mx-auto px-4 max-w-6xl" style={{ opacity: opacityTestimonials }}>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6 font-serif">
              Nos <span className="text-amber-600">Clients</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leurs témoignages sont notre plus belle récompense
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie L.",
                comment: "Une découverte exceptionnelle ! Les pizzas sont d'une authenticité rare. Le service est impeccable et l'ambiance chaleureuse.",
                rating: 5
              },
              {
                name: "Pierre M.",
                comment: "Le 9 est devenu notre restaurant de référence. Qualité constante, produits frais, et une équipe passionnée. À recommander sans hésitation.",
                rating: 5
              },
              {
                name: "Sophie D.",
                comment: "Un véritable bijou culinaire à Reims. Chaque plat est une surprise gustative. L'attention aux détails fait toute la différence.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, delay: index * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="text-sm font-medium text-gray-900">
                  — {testimonial.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section Informations Pratiques */}
      <section ref={sectionContactRef} className="py-24 bg-white">
        <motion.div className="container mx-auto px-4 max-w-6xl" style={{ opacity: opacityContact }}>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6 font-serif">
              Nous <span className="text-amber-600">Trouver</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rendez-nous visite pour une expérience culinaire inoubliable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">Adresse</h3>
                  <p className="text-gray-600">
                    9 route de Bétheny<br />
                    51100 Reims, France
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">Horaires</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Lun - Jeu : 11h - 14h30 & 18h - 23h</p>
                    <p>Ven - Dim : 18h - 23h</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600 mb-2">
                    <a href="tel:0326407967" className="hover:text-gray-900 transition-colors">
                      03 26 40 79 67
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <a href="mailto:contact@le9.fr" className="hover:text-gray-900 transition-colors">
                      contact@le9.fr
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative h-96 rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <iframe
                src="https://www.google.com/maps?q=9+Route+de+B%C3%A9theny,+51100+Reims,+France&output=embed&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                title="Localisation Le 9 Restaurant - 9 route de Bétheny, 51100 Reims"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-4 left-4 right-4">
                <Link
                  href="https://www.google.com/maps/search/9+route+de+Bétheny+51100+Reims"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg rounded-lg"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Itinéraire
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Final */}
      <section ref={sectionCtaRef} className="py-24 bg-gray-900">
        <motion.div className="container mx-auto px-4 text-center" style={{ opacity: opacityCta }}>
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <h2 className="text-4xl font-light text-white mb-6 font-serif">
              Prêt à nous rejoindre ?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Découvrez l'excellence culinaire qui nous anime depuis 5 ans
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/menu"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-900 bg-white hover:bg-gray-100 transition-all duration-300"
                >
                  <Utensils className="w-5 h-5 mr-3" />
                  Voir notre carte
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="tel:0326407967"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white border border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Réserver
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
    </>
  );
}