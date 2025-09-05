// pages/menu/pizzas.tsx
import CategoryPage from '@/components/menu/CategoryPage';

// Filtres spécifiques aux pizzas
const pizzaFilters = [
  { id: 'classique', name: 'Classiques' },
  { id: 'signature', name: 'Signatures' },
  { id: 'vegetarienne', name: 'Végétariennes' },
  { id: 'epicee', name: 'Épicées' }
];

export default function PizzasPage() {
  return (
    <CategoryPage
      title="Nos Pizzas"
      description="Découvrez nos délicieuses pizzas préparées avec une pâte fraîche et des ingrédients de qualité. De la classique Margherita aux créations originales."
      items={[]} // Sera implémenté plus tard
      filters={pizzaFilters}
      type="pizza"
    />
  );
}