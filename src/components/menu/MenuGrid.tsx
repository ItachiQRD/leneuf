import { useState } from 'react';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';

interface MenuGridProps {
  items: any[];
  category?: string;
  onItemClick?: (item: any) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function MenuGrid({ items, category, onItemClick }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <div className="space-y-8">
      {/* En-tête avec filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-playfair font-bold text-text-primary">
            {selectedCategory || 'Notre Menu'}
          </h2>
          <span className="text-text-tertiary">
            {filteredItems.length} plats
          </span>
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          {['Tous', 'Entrées', 'Plats', 'Desserts'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Tous' ? undefined : cat)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                (cat === 'Tous' && !selectedCategory) || cat === selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-text-secondary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de plats */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item) => (
          <motion.div key={item.id} variants={item}>
            <MenuItem
              {...item}
              onViewDetails={() => onItemClick?.(item)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Message si aucun résultat */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            Aucun plat trouvé dans cette catégorie.
          </p>
        </div>
      )}
    </div>
  );
}