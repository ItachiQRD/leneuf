import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Utensils, Clock, Award, Star, MapPin, Phone } from 'lucide-react';

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
  const features = [
    {
      icon: <Utensils className="w-8 h-8 text-primary" />,
      title: 'Cuisine Raffinée',
      description: 'Des ingrédients frais sélectionnés avec soin pour une qualité exceptionnelle'
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: 'Service Rapide',
      description: 'Commandez en ligne et récupérez votre commande en quelques minutes'
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: 'Qualité Garantie',
      description: 'La satisfaction de nos clients est notre priorité absolue'
    }
  ];

  const bestSellers = [
    {
      id: 1,
      name: 'Le 9 Signature',
      description: 'Notre burger signature avec double steak, cheddar fondu et sauce secrète',
      price: '14.90',
      image: '/images/menu/signature.jpg',
      category: 'Burger',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Mega Tacos',
      description: 'Tacos XXL avec 3 viandes au choix et sauce maison',
      price: '12.90',
      image: '/images/menu/mega.jpg',
      category: 'Tacos',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Pizza Royale',
      description: 'Pizza généreuse aux 4 fromages et garnitures premium',
      price: '16.90',
      image: '/images/menu/royale.jpg',
      category: 'Pizza',
      rating: 4.7
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section avec Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Image
            src="/images/bg-hero.webp"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </motion.div>

        <motion.div
          className="container mx-auto px-4 z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/images/logo.png"
              alt="Le 9 Logo"
              width={150}
              height={150}
              className="mx-auto"
            />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-playfair">
            Découvrez le Goût de
            <span className="text-primary block mt-2">l'Excellence</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Une expérience culinaire unique où tradition et innovation se rencontrent
            pour créer des saveurs inoubliables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-primary hover:bg-primary-600 rounded-full transition-all transform hover:scale-105"
            >
              Commander Maintenant
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#bestsellers"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white border-2 border-white hover:bg-white hover:text-black rounded-full transition-all transform hover:scale-105"
            >
              Nos Bestsellers
              <Star className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-1 h-16 rounded-full bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Features Section avec Cards Modernes */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 font-playfair">
              Pourquoi Choisir <span className="text-primary">Le 9</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous nous engageons à vous offrir une expérience culinaire exceptionnelle,
              avec des produits de qualité et un service irréprochable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section avec Cards Animées */}
      <section id="bestsellers" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 font-playfair">
              Nos <span className="text-primary">Bestsellers</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos plats les plus populaires, préparés avec passion
              et des ingrédients de première qualité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestSellers.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-60">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">{item.price}€</span>
                    <Link
                      href="/menu"
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      Commander
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section avec Map */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 font-playfair">
              Nous <span className="text-primary">Trouver</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rendez-nous visite ou commandez en ligne pour déguster nos délicieux plats
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Notre Adresse</h3>
                    <p className="text-gray-600">123 Rue de la Gastronomie<br />75000 Paris, France</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Horaires d'Ouverture</h3>
                    <p className="text-gray-600">
                      Lun - Jeu: 11h00 - 22h00<br />
                      Ven - Sam: 11h00 - 23h00<br />
                      Dimanche: 12h00 - 22h00
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Contact</h3>
                    <p className="text-gray-600">
                      Tél: 01 23 45 67 89<br />
                      Email: contact@le9.fr
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/images/map.jpg"
                alt="Map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Link
                  href="https://maps.google.com"
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Ouvrir dans Google Maps
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}