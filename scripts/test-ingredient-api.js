// Script de test pour l'API des ingrédients
const testIngredient = {
  name: "Test Saumon",
  description: "Saumon fumé de qualité",
  type: "meat",
  price: 2.50,
  isAvailable: true,
  isSpicy: false,
  isVegetarian: false,
  allergens: [],
  orderIndex: 0
};

console.log('Test de l\'API des ingrédients...');
console.log('Données à envoyer:', testIngredient);

// Simuler l'envoi de données
const formData = new FormData();
formData.append('data', JSON.stringify(testIngredient));

console.log('FormData créé avec succès');
console.log('Champs dans FormData:');
for (let [key, value] of formData.entries()) {
  console.log(`- ${key}:`, value);
}
