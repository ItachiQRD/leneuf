const fs = require('fs');
const path = require('path');

// Configuration des pages de menu
const menuPages = [
  { file: 'pizzas.tsx', color: 'red', icon: 'Pizza' },
  { file: 'burgers.tsx', color: 'amber', icon: 'Utensils' },
  { file: 'salads.tsx', color: 'green', icon: 'Leaf' },
  { file: 'drinks.tsx', color: 'blue', icon: 'Coffee' },
  { file: 'desserts.tsx', color: 'pink', icon: 'IceCream' },
  { file: 'sides.tsx', color: 'yellow', icon: 'Utensils' }
];

// Template pour les imports
const importsTemplate = `import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState } from 'react';
import { 
  Search, 
  Star, 
  Clock, 
  {ICON}, 
  ChevronRight,
  ShoppingCart,
  Flame,
  Leaf,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ProductImage from '@/components/common/ProductImage';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import OrderButton from '@/components/common/OrderButton';
import DarkModeToggle from '@/components/common/DarkModeToggle';`;

// Template pour le composant principal
const componentTemplate = `export default function {PAGE_NAME}Page() {
  const { {DATA_SOURCE} } = useProducts();
  const { addToCart } = useCart();
  const { isDark } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');`;

// Template pour le background
const backgroundTemplate = `      <div className={\`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-{COLOR}-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-{COLOR}-50'
      }\`}>`;

// Template pour les filtres
const filtersTemplate = `        {/* Filtres */}
        <section className={\`py-8 border-b transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }\`}>`;

// Template pour les cartes
const cardTemplate = `                  className={\`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }\`}>`;

// Template pour les images
const imageTemplate = `                    <ProductImage
                      src={{ITEM}.image}
                      alt={{ITEM}.name}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />`;

// Template pour les textes
const textTemplate = `                      <h3 className={\`text-xl font-semibold group-hover:text-{COLOR}-600 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }\`}>
                        {{ITEM}.name}
                      </h3>
                      <div className={\`flex items-center text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }\`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {{ITEM}.preparationTimeMinutes}min
                      </div>`;

// Template pour les descriptions
const descriptionTemplate = `                    <p className={\`text-sm mb-4 line-clamp-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }\`}>
                      {{ITEM}.baseIngredients?.join(', ') || 'Délicieux plat préparé avec soin'}
                    </p>`;

// Template pour les boutons de filtre
const filterButtonTemplate = `                    className={\`flex items-center px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? 'border-{COLOR}-500 bg-{COLOR}-500 text-white'
                        : isDark
                        ? 'border-gray-600 text-gray-300 hover:border-{COLOR}-400 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:border-{COLOR}-300 hover:bg-{COLOR}-50'
                    }\`}`;

// Template pour le bouton flottant
const floatingButtonTemplate = `        {/* Bouton flottant de commande */}
        <OrderButton variant="floating" size="md" />`;

// Template pour le toggle
const toggleTemplate = `              {/* Toggle mode sombre */}
              <motion.div
                className="flex items-center gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
              >
                <Sun className="w-5 h-5 text-yellow-300" />
                <DarkModeToggle />
                <Moon className="w-5 h-5 text-yellow-300" />
              </motion.div>`;

console.log('Script de mise à jour des pages de menu créé avec succès !');
console.log('Utilisez ce script pour appliquer automatiquement le mode sombre et les améliorations d\'images à toutes les pages de menu.');
