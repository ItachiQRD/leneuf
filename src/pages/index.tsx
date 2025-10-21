import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Utensils, Clock, Award, Star, MapPin, Phone, Navigation, Calendar, Users, Heart, ChefHat, Pizza, Wine, Coffee } from 'lucide-react';
import SmartImage from '@/components/common/SmartImage';
import { PromotionsBanner } from '@/components/PromotionsBanner';

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Bannière des promotions */}
      <PromotionsBanner />
      
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
            className="object-cover opacity-60"
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
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
        </div>
      </section>

      {/* Section Expertise Culinaire */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
        </div>
      </section>

      {/* Section Menu - Aperçu */}
      <section id="menu" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6 font-serif">
              Notre <span className="text-amber-600">Carte</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une sélection de nos plats les plus appréciés, préparés avec passion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menuHighlights.map((item, index) => (
              <motion.div
                key={item.id}
                className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                    {item.isNew && (
                      <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-medium">
                        Nouveau
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-light text-gray-900 group-hover:text-gray-700 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-lg font-medium text-gray-900">
                        {item.price}€
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-3 text-gray-900 border border-gray-300 hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              Voir la carte complète
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
        </div>
      </section>

      {/* Section Informations Pratiques */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2620.3!2d4.025!3d49.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e9744c5c1c5c1f%3A0x40c14484fb61e60!2s9%20Route%20de%20B%C3%A9theny%2C%2051100%20Reims%2C%20France!5e0!3m2!1sfr!2sfr!4v1640000000000!5m2!1sfr!2sfr"
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
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
        </div>
      </section>
    </div>
  );
}