// pages/menu/burgers.tsx
import CategoryPage from '@/components/menu/CategoryPage';

// Filtres spécifiques aux burgers
const burgerFilters = [
  { id: 'classic', name: 'Classiques' },
  { id: 'signature', name: 'Signatures' },
  { id: 'chicken', name: 'Poulet' },
  { id: 'veggie', name: 'Végétariens' }
];

export default function BurgersPage() {
  return (
    <CategoryPage
      title="Nos Burgers"
      description="Découvrez notre sélection de burgers gourmands, préparés avec des ingrédients frais et des viandes sélectionnées avec soin. Du classique au plus original, il y en a pour tous les goûts."
      items={[]} // Sera implémenté plus tard
      filters={burgerFilters}
      type="burger"
    />
  );
}