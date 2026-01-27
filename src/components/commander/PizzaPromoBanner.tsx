import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface PizzaPromoBannerProps {
  title: string;
  description: string;
  pizzaSize: 'senior' | 'mega';
  onClick?: () => void;
}

export default function PizzaPromoBanner({ title, description, pizzaSize, onClick }: PizzaPromoBannerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative w-full cursor-pointer overflow-hidden rounded-lg border-4 border-pink-500 bg-white shadow-xl"
      onClick={onClick}
    >
      {/* Fond avec texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-pink-50/30 to-white opacity-90" />
      
      {/* Contenu */}
      <div className="relative p-6 md:p-8">
        {/* Titre OFFRE */}
        <div className="mb-4">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-pink-500 uppercase tracking-tight"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            OFFRE
          </motion.h2>
          <div className="h-1 w-24 bg-pink-500 mt-1" />
        </div>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl font-bold text-black mb-6 leading-tight"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {description.split('=').map((part, index) => (
            <span key={index}>
              {index === 1 && (
                <span className="text-2xl md:text-3xl text-pink-600 font-black"> OFFERTE</span>
              )}
              {part}
            </span>
          ))}
        </motion.p>

        {/* Images de pizzas */}
        <div className="relative h-48 md:h-64 mb-6">
          {/* Pizza 1 - Gauche */}
          <motion.div
            className="absolute left-0 bottom-0 w-32 md:w-40 z-10"
            animate={isHovered ? { y: -10, rotate: -5 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative w-full aspect-square">
              <Image
                src="/images/menu/pizzas.jpg"
                alt="Pizza pepperoni"
                fill
                className="object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-black/20 blur-md rounded-full" />
          </motion.div>

          {/* Pizza 2 - Droite */}
          <motion.div
            className="absolute right-0 bottom-0 w-32 md:w-40 z-10"
            animate={isHovered ? { y: -10, rotate: 5 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative w-full aspect-square">
              <Image
                src="/images/menu/pizza-menu.jpeg"
                alt="Pizza végétarienne"
                fill
                className="object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-black/20 blur-md rounded-full" />
          </motion.div>

          {/* Pizza 3 - Arrière-plan */}
          <motion.div
            className="absolute left-1/2 top-0 transform -translate-x-1/2 w-28 md:w-36 z-0 opacity-80"
            animate={isHovered ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative w-full aspect-square">
              <Image
                src="/images/menu/royale.jpg"
                alt="Pizza mixte"
                fill
                className="object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-black/20 blur-md rounded-full" />
          </motion.div>
        </div>

        {/* Bouton */}
        <motion.div
          className="flex justify-end"
          animate={isHovered ? { x: -5 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.button
            className="bg-black text-white px-6 py-3 rounded-lg font-bold text-sm md:text-base uppercase tracking-wide shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CLIQUER ICI
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

