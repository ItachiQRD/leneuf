// components/menu/MenuCategoryCard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

// Types pour les props du composant
interface MenuCategoryCardProps {
  title: string;         // Titre de la catégorie
  description: string;   // Description courte de la catégorie
  image: string;         // URL de l'image de la catégorie
  href: string;         // Lien vers la page de la catégorie
  itemCount?: number;    // Nombre optionnel d'items dans la catégorie
}

export default function MenuCategoryCard({ 
  title, 
  description, 
  image, 
  href,
  itemCount 
}: MenuCategoryCardProps) {
  // État pour gérer le hover
  const [isHovered, setIsHovered] = useState(false);

  // Animation pour le texte et les éléments interactifs
  const textVariants = {
    hover: { 
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    initial: { 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // Animation pour l'icône
  const iconVariants = {
    hover: { 
      x: 4,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    initial: { 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <Link 
      href={href}
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <motion.div
        className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image de fond avec effet de zoom */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Overlay avec dégradé */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Contenu */}
        <div className="relative h-full flex flex-col justify-end p-8 text-white">
          <motion.div variants={textVariants}>
            {/* En-tête avec titre et compteur */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-3xl font-playfair font-bold">{title}</h2>
              {itemCount && (
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {itemCount} choix
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-200 max-w-md mb-6">
              {description}
            </p>

            {/* Bouton "Découvrir" */}
            <div className="inline-flex items-center text-primary">
              <span className="font-medium">Découvrir</span>
              <motion.div variants={iconVariants} className="ml-2">
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Effet de bordure au hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}