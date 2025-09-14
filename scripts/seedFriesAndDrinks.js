// scripts/seedFriesAndDrinks.js - Script pour ajouter les frites et boissons du menu
const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fastfood';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  price: {
    type: Number,
    required: false,
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  type: {
    type: String,
    required: [true, 'Le type est requis'],
    enum: ['burger', 'pizza', 'salad', 'sandwich_durum', 'paninis', 'plates', 'tex_mex', 'kids_menu', 'small_hunger', 'fries', 'drinks'],
  },
  category: {
    type: String,
    enum: ['bestseller', 'new', 'regular'],
    default: 'regular',
  },
  active: {
    type: Boolean,
    default: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  preparationTimeMinutes: {
    type: Number,
    required: [true, 'Le temps de préparation est requis'],
    min: 1,
  },
  baseIngredients: {
    type: [String],
    default: [],
  },
  allergens: {
    type: [String],
    default: [],
  },
  spicyLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra_hot'],
    default: 'mild',
  },
  nutritionalInfo: {
    calories: { type: Number, default: 0 },
    proteins: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    servingSize: { type: String, default: '100g' }
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  isGlutenFree: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      ret._id = ret._id.toString();
      return ret;
    }
  }
});

const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);

// Données des frites et boissons - Menu Pizza Le Neuf
const friesAndDrinks = [
  // Frites
  {
    name: "Frites",
    price: 3.50,
    image: "/uploads/foods/frites.webp",
    type: "fries",
    category: "bestseller",
    preparationTimeMinutes: 8,
    baseIngredients: ["Pommes de terre", "Huile", "Sel"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 320,
      proteins: 4,
      carbs: 40,
      fats: 16,
      servingSize: "1 portion"
    },
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    name: "Frites Grande",
    price: 5.00,
    image: "/uploads/foods/frites-grande.webp",
    type: "fries",
    category: "regular",
    preparationTimeMinutes: 10,
    baseIngredients: ["Pommes de terre", "Huile", "Sel"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 480,
      proteins: 6,
      carbs: 60,
      fats: 24,
      servingSize: "1 grande portion"
    },
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true
  },
  
  // Boissons
  {
    name: "Coca-Cola 33cl",
    price: 2.50,
    image: "/uploads/foods/coca-cola-33cl.webp",
    type: "drinks",
    category: "bestseller",
    preparationTimeMinutes: 1,
    baseIngredients: ["Coca-Cola"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 140,
      proteins: 0,
      carbs: 35,
      fats: 0,
      servingSize: "33cl"
    },
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    name: "Coca-Cola 50cl",
    price: 3.50,
    image: "/uploads/foods/coca-cola-50cl.webp",
    type: "drinks",
    category: "regular",
    preparationTimeMinutes: 1,
    baseIngredients: ["Coca-Cola"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 210,
      proteins: 0,
      carbs: 53,
      fats: 0,
      servingSize: "50cl"
    },
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    name: "Eau 50cl",
    price: 2.00,
    image: "/uploads/foods/eau-50cl.webp",
    type: "drinks",
    category: "regular",
    preparationTimeMinutes: 1,
    baseIngredients: ["Eau"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      servingSize: "50cl"
    },
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    name: "Jus d'Orange 25cl",
    price: 2.80,
    image: "/uploads/foods/jus-orange-25cl.webp",
    type: "drinks",
    category: "regular",
    preparationTimeMinutes: 1,
    baseIngredients: ["Jus d'orange"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 110,
      proteins: 2,
      carbs: 26,
      fats: 0,
      servingSize: "25cl"
    },
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    name: "Jus de Pomme 25cl",
    price: 2.80,
    image: "/uploads/foods/jus-pomme-25cl.webp",
    type: "drinks",
    category: "regular",
    preparationTimeMinutes: 1,
    baseIngredients: ["Jus de pomme"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 120,
      proteins: 0,
      carbs: 30,
      fats: 0,
      servingSize: "25cl"
    },
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true
  }
];

async function seedFriesAndDrinks() {
  try {
    console.log('🌱 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🍟🥤 Suppression des anciennes frites et boissons...');
    await Food.deleteMany({ type: { $in: ['fries', 'drinks'] } });
    console.log('✅ Anciennes frites et boissons supprimées');

    console.log('🍟🥤 Ajout des nouvelles frites et boissons...');
    const createdItems = await Food.insertMany(friesAndDrinks);
    console.log(`✅ ${createdItems.length} frites et boissons ajoutées avec succès`);

    console.log('📋 Liste des frites et boissons créées:');
    createdItems.forEach(item => {
      console.log(`   - ${item.name} (${item.price}€)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seed des frites et boissons:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  seedFriesAndDrinks();
}

module.exports = { seedFriesAndDrinks };
