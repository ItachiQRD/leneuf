import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu as MenuIcon, Home, Package, ShoppingBag, ChefHat, Droplets, Cake, Settings, Users } from 'lucide-react';
import { Button } from './Buttons';
import Link from 'next/link';

const adminMenuItems = [
  { id: '/admin', name: 'Dashboard', icon: Home },
  { id: '/admin/foods', name: 'Plats', icon: ChefHat },
  { id: '/admin/drinks', name: 'Boissons', icon: Droplets },
  { id: '/admin/desserts', name: 'Desserts', icon: Cake },
  { id: '/admin/ingredients', name: 'Ingrédients', icon: Package },
  { id: '/admin/sauces', name: 'Sauces', icon: Settings },
  { id: '/admin/sides', name: 'Accompagnements', icon: Package },
  { id: '/admin/orders', name: 'Commandes', icon: ShoppingBag },
];

interface AdminMobileMenuProps {
  currentPath: string;
  className?: string;
}

export default function AdminMobileMenu({ 
  currentPath, 
  className = '' 
}: AdminMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton hamburger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={`lg:hidden ${className}`}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      {/* Menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 h-full bg-white dark:bg-gray-800 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header du menu */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Liste des pages admin */}
              <div className="p-6">
                <nav className="space-y-2">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.id;
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.id}
                        onClick={handleItemClick}
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
