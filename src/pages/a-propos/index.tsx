import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Utensils
} from 'lucide-react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            À Propos de Le9
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Votre restaurant de fast-food préféré depuis 2024
          </motion.p>
        </div>
      </motion.section>

      {/* Notre Histoire */}
      <motion.section 
        className="py-16 bg-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Notre Histoire
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed space-y-6">
              <p>
                Fondé en 2024, Le9 est né de la passion pour la cuisine rapide de qualité. 
                Notre équipe de chefs expérimentés a créé un menu unique qui combine 
                tradition et innovation pour offrir une expérience culinaire exceptionnelle.
              </p>
              <p>
                Nous croyons que la bonne nourriture ne doit pas prendre du temps à préparer. 
                C'est pourquoi nous nous efforçons de servir des plats frais, savoureux et 
                préparés avec amour, le tout dans un délai record.
              </p>
              <p>
                Aujourd'hui, Le9 est devenu une référence dans le domaine de la restauration 
                rapide, grâce à notre engagement envers la qualité, la rapidité et le service client.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Nos Valeurs */}
      <motion.section 
        className="py-16 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre travail chaque jour
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8 text-red-600" />,
                title: "Passion",
                description: "Nous mettons notre cœur dans chaque plat que nous préparons"
              },
              {
                icon: <Award className="w-8 h-8 text-yellow-600" />,
                title: "Qualité",
                description: "Seuls les meilleurs ingrédients entrent dans nos recettes"
              },
              {
                icon: <Clock className="w-8 h-8 text-blue-600" />,
                title: "Rapidité",
                description: "Service express sans compromis sur la qualité"
              },
              {
                icon: <Users className="w-8 h-8 text-green-600" />,
                title: "Service",
                description: "Nos clients sont au centre de tout ce que nous faisons"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Notre Équipe */}
      <motion.section 
        className="py-16 bg-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des professionnels passionnés qui font la différence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Chef Principal",
                role: "Direction Culinaire",
                description: "15 ans d'expérience dans la restauration rapide de qualité"
              },
              {
                name: "Équipe de Service",
                role: "Service Client",
                description: "Formés pour vous offrir le meilleur accueil possible"
              },
              {
                name: "Équipe de Cuisine",
                role: "Préparation",
                description: "Experts en préparation rapide et efficace"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-red-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Nos Spécialités */}
      <motion.section 
        className="py-16 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Spécialités
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez ce qui fait notre réputation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Utensils className="w-8 h-8 text-red-600" />,
                title: "Tacos Authentiques",
                description: "Préparés selon la tradition mexicaine avec des ingrédients frais"
              },
              {
                icon: <ChefHat className="w-8 h-8 text-orange-600" />,
                title: "Burgers Gourmets",
                description: "Des burgers artisanaux avec des viandes de qualité supérieure"
              },
              {
                icon: <Star className="w-8 h-8 text-yellow-600" />,
                title: "Recettes Secrètes",
                description: "Des sauces et marinades uniques créées par nos chefs"
              }
            ].map((specialty, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-4">
                  {specialty.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {specialty.title}
                </h3>
                <p className="text-gray-600">
                  {specialty.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-red-600 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-3xl mx-auto"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Découvrir Le9 ?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Commandez maintenant et savourez l'excellence de notre cuisine
            </p>
            <motion.a
              href="/commander"
              className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commander Maintenant
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
