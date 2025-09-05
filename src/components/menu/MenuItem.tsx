import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Buttons';

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
  rating?: number;
  preparationTime?: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

export default function MenuItem({
  name,
  description,
  price,
  image,
  category,
  isNew,
  isPopular,
  rating,
  preparationTime,
  isVegetarian,
  isSpicy,
  allergens,
  onAddToCart,
  onViewDetails,
}: MenuItemProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden group">
        {/* Image du plat */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {isNew && (
              <Badge variant="success" size="sm">Nouveau</Badge>
            )}
            {isPopular && (
              <Badge variant="warning" size="sm">Populaire</Badge>
            )}
            {isVegetarian && (
              <Badge variant="success" size="sm">Végétarien</Badge>
            )}
            {isSpicy && (
              <Badge variant="error" size="sm">Épicé</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Catégorie */}
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-2">
            {category}
          </p>

          {/* Nom et description */}
          <h3 className="font-playfair text-lg font-semibold mb-2">{name}</h3>
          <p className="text-text-secondary text-sm line-clamp-2 mb-4">
            {description}
          </p>

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between mb-4">
            {rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="ml-1 text-sm">{rating}</span>
              </div>
            )}
            {preparationTime && (
              <span className="text-xs text-text-tertiary">
                {preparationTime} min
              </span>
            )}
          </div>

          {/* Prix et actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold">{price.toFixed(2)}€</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewDetails}
              >
                Détails
              </Button>
              <Button
                size="sm"
                onClick={onAddToCart}
                className="group"
              >
                <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Allergènes */}
          {allergens && allergens.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <p className="text-xs text-text-tertiary">
                Allergènes : {allergens.join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}