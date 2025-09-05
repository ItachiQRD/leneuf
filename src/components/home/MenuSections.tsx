import { useState } from 'react';
import { motion } from 'framer-motion';
import MenuItem from '../menu/MenuItem';

const FEATURED_ITEMS = [
  {
    id: '1',
    name: 'Le Burger Signature',
    description: 'Notre burger signature avec steak haché frais, fromage fondu, bacon croustillant et sauce secrète',
    price: 14.90,
    image: '/images/menu/burger-signature.jpg',
    category: 'Burgers',
    isPopular: true,
    rating: 4.8,
    preparationTime: 20
  },
  {
    id: '2',
    name: 'Pizza Truffe',
    description: 'Pizza artisanale avec crème de truffe, mozzarella di bufala, champignons et roquette',
    price: 18.90,
    image: '/images/menu/pizza-truffe.jpg',
    category: 'Pizzas',
    isNew: true,
    rating: 4.9,
    preparationTime: 25
  },
  {
    id: '3',
    name: 'Salade Buddha Bowl',
    description: 'Bowl frais et healthy avec quinoa, avocat, légumes croquants et sauce tahini',
    price: 16.90,
    image: '/images/menu/buddha-bowl.jpg',
    category: 'Salades',
    isVegetarian: true,
    rating: 4.7,
    preparationTime: 15
  }
];

export function MenuSection() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-playfair font-bold mb-4">
          Nos Spécialités
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Découvrez nos plats signatures, préparés avec passion par nos chefs 
          avec les meilleurs ingrédients.
        </p>
      </div>

      {/* Grille des plats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURED_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <MenuItem
              {...item}
              onViewDetails={() => setSelectedItem(item.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <a 
          href="/menu"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Voir tout le menu
        </a>
      </div>
    </div>
  );
}