// Script de test pour créer un ingrédient
const testIngredient = {
  name: "Test Ingredient",
  description: "Description de test",
  type: "meat",
  price: 2.50,
  image: "/images/placeholder-ingredient.jpg",
  isAvailable: true,
  isSpicy: false,
  isVegetarian: false,
  allergens: [],
  orderIndex: 0
};

console.log('Données de test pour ingrédient:', testIngredient);

// Vérification des champs requis
const requiredFields = ['name', 'type', 'price', 'image'];
const missingFields = requiredFields.filter(field => !testIngredient[field]);

if (missingFields.length > 0) {
  console.error('Champs manquants:', missingFields);
} else {
  console.log('Tous les champs requis sont présents');
}

// Vérification des types
console.log('Types des champs:');
console.log('- name:', typeof testIngredient.name);
console.log('- type:', typeof testIngredient.type);
console.log('- price:', typeof testIngredient.price);
console.log('- image:', typeof testIngredient.image);
console.log('- isAvailable:', typeof testIngredient.isAvailable);
console.log('- isSpicy:', typeof testIngredient.isSpicy);
console.log('- isVegetarian:', typeof testIngredient.isVegetarian);
console.log('- allergens:', Array.isArray(testIngredient.allergens));
console.log('- orderIndex:', typeof testIngredient.orderIndex);
