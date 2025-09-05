// utils/orderCalculations.ts
import { formatOptions, meatOptions, sauceOptions, extraOptions } from '@/components/menu/tacos/TacosOrderOptions';

type Selections = {
  [key: string]: string[];
};

// Obtenir le nombre maximum de viandes selon la taille
export function getMaxMeatSelections(size: string): number {
  switch (size) {
    case 'M': return 1;
    case 'L': return 2;
    case 'XL': return 3;
    default: return 1;
  }
}

// Calculer le prix total de la commande
export function calculateTotalPrice(selections: Selections): number {
  let total = 0;

  // Prix de base selon la taille
  if (selections.size.length > 0) {
    const sizePrice = {
      'M': 7.90,
      'L': 9.90,
      'XL': 11.90
    }[selections.size[0]] || 0;
    total += sizePrice;
  }

  // Ajouter le prix des extras
  selections.extras.forEach(extraId => {
    const extra = extraOptions.find(opt => opt.id === extraId);
    if (extra?.price) {
      total += extra.price;
    }
  });

  return total;
}