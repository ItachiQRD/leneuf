const mongoose = require('mongoose');

// Modèle simplifié pour les ingrédients
const ingredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  type: { 
    type: String, 
    enum: ['meat', 'cheese', 'vegetable', 'extra'],
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  allergens: {
    type: [String],
    default: []
  },
  orderIndex: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

// Données des ingrédients (version simplifiée)
const ingredientsData = [
  {
    name: "Cordon bleu",
    description: "Escalope de poulet panée avec jambon et fromage",
    type: "meat",
    price: 2.5,
    image: "/uploads/ingredients/cordon-bleu.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: ["gluten", "lait", "œufs"],
    orderIndex: 1
  },
  {
    name: "Nuggets",
    description: "Morceaux de poulet panés et frits",
    type: "meat",
    price: 2.0,
    image: "/uploads/ingredients/nuggets.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: ["gluten", "œufs"],
    orderIndex: 2
  },
  {
    name: "Fromage cheddar",
    description: "Fromage cheddar râpé",
    type: "cheese",
    price: 1.5,
    image: "/uploads/ingredients/cheddar.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: ["lait"],
    orderIndex: 3
  },
  {
    name: "Tomates",
    description: "Tomates fraîches en rondelles",
    type: "vegetable",
    price: 0.8,
    image: "/uploads/ingredients/tomates.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 4
  },
  {
    name: "Salade",
    description: "Salade verte fraîche",
    type: "vegetable",
    price: 0.5,
    image: "/uploads/ingredients/salade.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 5
  },
  {
    name: "Oignons",
    description: "Oignons frais en rondelles",
    type: "vegetable",
    price: 0.6,
    image: "/uploads/ingredients/oignons.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 6
  },
  {
    name: "Cornichons",
    description: "Cornichons marinés",
    type: "vegetable",
    price: 0.7,
    image: "/uploads/ingredients/cornichons.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 7
  },
  {
    name: "Bacon",
    description: "Bacon croustillant",
    type: "meat",
    price: 2.2,
    image: "/uploads/ingredients/bacon.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: [],
    orderIndex: 8
  },
  {
    name: "Champignons",
    description: "Champignons de Paris",
    type: "vegetable",
    price: 1.2,
    image: "/uploads/ingredients/champignons.jpg",
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 9
  },
  {
    name: "Piments jalapeños",
    description: "Piments jalapeños épicés",
    type: "vegetable",
    price: 1.0,
    image: "/uploads/ingredients/jalapenos.jpg",
    isAvailable: true,
    isSpicy: true,
    isVegetarian: true,
    allergens: [],
    orderIndex: 10
  }
];

async function seedIngredients() {
  try {
    // Connexion à MongoDB - utilisez votre URI de connexion
    const mongoUri = 'mongodb+srv://azizvapiano:azizvapiano@cluster0.8qjqj.mongodb.net/fastfood?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Supprimer tous les ingrédients existants
    await Ingredient.deleteMany({});
    console.log('🗑️ Anciens ingrédients supprimés');

    // Insérer les nouveaux ingrédients
    const ingredients = await Ingredient.insertMany(ingredientsData);
    console.log(`✅ ${ingredients.length} ingrédients créés avec succès`);

    // Afficher la liste des ingrédients créés
    console.log('\n📋 Ingrédients créés :');
    ingredients.forEach(ingredient => {
      console.log(`- ${ingredient.name} (${ingredient.type}) - ${ingredient.price}€`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le seed
seedIngredients();

