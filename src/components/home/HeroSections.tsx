import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

// Éviter les re-renders inutiles avec useMemo pour les données statiques
const sections = [
  {
    id: 'speed',
    title: "Rapidité",
    subtitle: "Prêt en 10min",
    description: "Une cuisine express mais travaillée",
  },
  {
    id: 'quality',
    title: "Qualité",
    subtitle: "Produits frais",
    description: "Des ingrédients sélectionnés",
  },
] as const;

// Composant optimisé et mémoïsé pour l'image de fond
const BackgroundImage = memo(function BackgroundImage({ src }: { src: string }) {
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt=""
        fill
        priority
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
    </div>
  );
});

// Composant de navigation optimisé
const Navigation = memo(function Navigation({ 
  active, 
  total, 
  onChange 
}: { 
  active: number; 
  total: number; 
  onChange: (index: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`h-2 transition-all ${
            i === active ? 'w-8 bg-primary-400' : 'w-2 bg-white/50'
          } rounded-full`}
        />
      ))}
    </div>
  );
});

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Optimisation des gestionnaires d'événements avec useCallback
  const handleNavigationChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const currentSection = sections[activeIndex];

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BackgroundImage src={`/images/${currentSection.id}.jpg`} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-white space-y-6"
            >
              <h1 className="text-5xl font-playfair">
                {currentSection.title}
              </h1>
              <p className="text-lg">{currentSection.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <Navigation
          active={activeIndex}
          total={sections.length}
          onChange={handleNavigationChange}
        />
      </div>
    </div>
  );
}