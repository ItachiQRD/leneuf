import { motion, AnimatePresence } from 'framer-motion';
import type { Food } from '@/types/food';

interface CategoryTransitionProps {
  category: string;
  children: React.ReactNode;
}

// Les différentes configurations d'animation par catégorie
const categoryAnimations = {
  burger: {
    initial: { x: '-100%', opacity: 0, rotate: -10 },
    animate: { x: 0, opacity: 1, rotate: 0 },
    exit: { x: '100%', opacity: 0, rotate: 10 }
  },
  pizza: {
    initial: { scale: 0, opacity: 0, rotate: -180 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0, opacity: 0, rotate: 180 }
  },
  sandwich_durum: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 }
  },
  salad: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' }
  }
};

export default function CategoryTransition({ category, children }: CategoryTransitionProps) {
  // Sélectionner l'animation appropriée ou utiliser une animation par défaut
  const animation = categoryAnimations[category as keyof typeof categoryAnimations] || {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animation}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}