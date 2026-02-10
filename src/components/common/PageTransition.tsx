'use client';

import { motion } from 'framer-motion';

export const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export const pageTransition = {
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
};

interface PageTransitionProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper à utiliser comme racine de chaque page pour les transitions
 * avec AnimatePresence. À combiner avec export default motion(Page).
 */
export default function PageTransition({ children, className, ...rest }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={className ?? 'min-h-full'}
      style={{ willChange: 'opacity, transform' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
