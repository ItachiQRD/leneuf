import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Zap } from 'lucide-react';

interface OrderButtonProps {
  variant?: 'primary' | 'secondary' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function OrderButton({ 
  variant = 'primary', 
  size = 'md',
  className = ''
}: OrderButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700",
    floating: "fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl hover:shadow-3xl"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href="/commande"
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        <Zap className="w-5 h-5 mr-2" />
        <span>Composer ma commande</span>
        <ShoppingCart className="w-5 h-5 ml-2" />
      </Link>
    </motion.div>
  );
}
