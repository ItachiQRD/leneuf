// pages/menu/index.tsx
import { motion } from 'framer-motion';
import Head from 'next/head';
import MenuCategoryCard from '@/components/menu/MenuCategoryCard';

// Configuration des catégories de menu
const menuCategories = [
  {
    title: "Nos Burgers",
    description: "Découvrez nos burgers gourmands préparés avec des ingrédients frais et des viandes sélectionnées avec soin.",
    image: "/images/menu/burgers.jpg",
    href: "/menu/burgers"
  },
  {
    title: "Nos Pizzas",
    description: "Des pizzas authentiques cuites au feu de bois, avec une pâte maison et des garnitures généreuses.",
    image: "/images/menu/pizzas.jpg",
    href: "/menu/pizzas"
  },
  {
    title: "Nos Tacos",
    description: "Savourez nos tacos français généreux, personnalisables selon vos envies avec nos sauces maison.",
    image: "/images/menu/tacos.jpg",
    href: "/menu/tacos"
  },
  {
    title: "Nos Accompagnements",
    description: "Complétez votre repas avec notre sélection de frites, salades et autres accompagnements savoureux.",
    image: "/images/menu/sides.jpg",
    href: "/menu/sides"
  }
];

// Animations pour la page
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function MenuPage() {
  return (
    <>
      <Head>
        <title>Le Neuf - Découvrez nos menus | Fast-food de qualité</title>
        <meta 
          name="description" 
          content="Explorez notre sélection de burgers, pizzas, tacos et accompagnements. Une cuisine rapide de qualité avec des produits frais." 
        />
      </Head>

      <div className="bg-surface min-h-screen py-12 mt-20">
        <div className="container mx-auto px-4">
          {/* En-tête de la page */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              Nos Menus
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              Une cuisine rapide qui ne fait pas de compromis sur la qualité. 
              Découvrez nos différentes spécialités préparées avec passion.
            </p>
          </motion.div>

          {/* Grille des catégories de menu */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {menuCategories.map((category, index) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                transition={{ duration: 0.3 }}
              >
                <MenuCategoryCard {...category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}