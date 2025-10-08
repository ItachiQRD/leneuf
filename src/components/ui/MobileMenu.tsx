import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu as MenuIcon } from 'lucide-react';
import { Button } from './Buttons';

interface MobileMenuProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

export default function MobileMenu({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  className = '' 
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Liste des catégories */}
              <div className="p-6">
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
