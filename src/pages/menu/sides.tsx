// pages/menu/sides.tsx
import CategoryPage from '@/components/menu/CategoryPage';

// Filtres pour les accompagnements
const sideFilters = [
  { id: 'frites', name: 'Frites' },
  { id: 'salades', name: 'Salades' },
  { id: 'sauces', name: 'Sauces' },
  { id: 'extras', name: 'Extras' }
];

export default function SidesPage() {
  return (
    <CategoryPage
      title="Nos Accompagnements"
      description="Complétez votre repas avec nos délicieux accompagnements. Des frites croustillantes aux salades fraîches, en passant par nos sauces maison."
      items={[]} // Sera implémenté plus tard
      filters={sideFilters}
      type="side"
    />
  );
}