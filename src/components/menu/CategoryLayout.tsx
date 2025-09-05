import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Food, FoodType } from '@/types/food';

interface CategoryLayoutProps {
  type: FoodType;
  items: Food[];
}

const layoutConfigs = {
  burger: {
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    spacing: 'gap-6',
    itemSize: 'h-72'
  },
  pizza: {
    gridCols: 'grid-cols-1 md:grid-cols-2',
    spacing: 'gap-8',
    itemSize: 'h-96'
  },
  sandwich_durum: {
    gridCols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    spacing: 'gap-4',
    itemSize: 'h-64'
  },
  salad: {
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
    spacing: 'gap-6',
    itemSize: 'h-80'
  }
} as const;

export default function CategoryLayout({ type, items }: CategoryLayoutProps) {
  const config = layoutConfigs[type] || layoutConfigs.burger;

  return (
    <div className={`grid ${config.gridCols} ${config.spacing}`}>
      {items.map((item) => (
        <motion.div
          key={item._id.toString()}
          className={`${config.itemSize} relative overflow-hidden rounded-lg`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Image d'arrière-plan */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          
          {/* Overlay avec dégradé */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Contenu */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
            <p className="text-sm text-gray-200 line-clamp-2">
              {item.description}
            </p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-lg font-bold">
                {item.price.toFixed(2)}€
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-500 px-4 py-1 rounded-full text-sm"
              >
                Commander
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}