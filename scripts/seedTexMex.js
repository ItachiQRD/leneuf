// scripts/seedTexMex.js - Script pour ajouter les plats tex-mex du menu
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
    enum: ['burger', 'pizza', 'salad', 'sandwich_durum', 'paninis', 'plates', 'tex_mex', 'kids_menu', 'small_hunger'],
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

// Données des plats tex-mex
const texMexDishes = [
  {
    name: "Burrito Poulet",
    price: 11.90,
    image: "/uploads/foods/burrito-poulet.webp",
    type: "tex_mex",
    category: "bestseller",
    preparationTimeMinutes: 15,
    baseIngredients: ["Tortilla", "Poulet", "Riz", "Haricots", "Fromage", "Sauce piquante"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "medium",
    nutritionalInfo: {
      calories: 580,
      proteins: 35,
      carbs: 55,
      fats: 22,
      servingSize: "1 burrito"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false
  },
  {
    name: "Quesadilla Végétarienne",
    price: 9.90,
    image: "/uploads/foods/quesadilla-vegetarienne.webp",
    type: "tex_mex",
    category: "regular",
    preparationTimeMinutes: 12,
    baseIngredients: ["Tortilla", "Fromage", "Poivrons", "Oignons", "Tomates", "Sauce guacamole"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 450,
      proteins: 20,
      carbs: 35,
      fats: 28,
      servingSize: "1 quesadilla"
    },
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false
  },
  {
    name: "Nachos Supreme",
    price: 8.90,
    image: "/uploads/foods/nachos-supreme.webp",
    type: "tex_mex",
    category: "bestseller",
    preparationTimeMinutes: 10,
    baseIngredients: ["Chips de maïs", "Fromage fondu", "Jalapeños", "Tomates", "Oignons", "Sauce salsa"],
    allergens: ["dairy"],
    spicyLevel: "hot",
    nutritionalInfo: {
      calories: 520,
      proteins: 18,
      carbs: 45,
      fats: 32,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    name: "Tacos de Bœuf",
    price: 10.50,
    image: "/uploads/foods/tacos-boeuf.webp",
    type: "tex_mex",
    category: "regular",
    preparationTimeMinutes: 12,
    baseIngredients: ["Tortillas", "Bœuf haché", "Laitue", "Tomates", "Fromage", "Sauce piquante"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "medium",
    nutritionalInfo: {
      calories: 420,
      proteins: 28,
      carbs: 35,
      fats: 20,
      servingSize: "3 tacos"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false
  },
  {
    name: "Bowl Tex-Mex",
    price: 12.90,
    image: "/uploads/foods/bowl-tex-mex.webp",
    type: "tex_mex",
    category: "new",
    preparationTimeMinutes: 15,
    baseIngredients: ["Riz", "Poulet grillé", "Haricots noirs", "Maïs", "Avocat", "Sauce chipotle"],
    allergens: [],
    spicyLevel: "medium",
    nutritionalInfo: {
      calories: 480,
      proteins: 32,
      carbs: 45,
      fats: 18,
      servingSize: "1 bowl"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true
  },
  {
    name: "Chili Con Carne",
    price: 9.90,
    image: "/uploads/foods/chili-con-carne.webp",
    type: "tex_mex",
    category: "bestseller",
    preparationTimeMinutes: 20,
    baseIngredients: ["Bœuf", "Haricots rouges", "Tomates", "Oignons", "Épices", "Fromage"],
    allergens: ["dairy"],
    spicyLevel: "hot",
    nutritionalInfo: {
      calories: 380,
      proteins: 25,
      carbs: 30,
      fats: 15,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true
  },
  {
    name: "Fajitas de Poulet",
    price: 13.90,
    image: "/uploads/foods/fajitas-poulet.webp",
    type: "tex_mex",
    category: "bestseller",
    preparationTimeMinutes: 18,
    baseIngredients: ["Poulet", "Poivrons", "Oignons", "Tortillas", "Sauce", "Guacamole"],
    allergens: ["gluten"],
    spicyLevel: "medium",
    nutritionalInfo: {
      calories: 450,
      proteins: 35,
      carbs: 40,
      fats: 18,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false
  },
  {
    name: "Enchiladas Végétariennes",
    price: 11.50,
    image: "/uploads/foods/enchiladas-vegetariennes.webp",
    type: "tex_mex",
    category: "regular",
    preparationTimeMinutes: 15,
    baseIngredients: ["Tortillas", "Fromage", "Épinards", "Tomates", "Sauce enchilada", "Crème"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "medium",
    nutritionalInfo: {
      calories: 420,
      proteins: 22,
      carbs: 38,
      fats: 20,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false
  }
];

async function seedTexMex() {
  try {
    console.log('🌱 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🌶️ Suppression des anciens plats tex-mex...');
    await Food.deleteMany({ type: 'tex_mex' });
    console.log('✅ Anciens plats tex-mex supprimés');

    console.log('🌶️ Ajout des nouveaux plats tex-mex...');
    const createdTexMex = await Food.insertMany(texMexDishes);
    console.log(`✅ ${createdTexMex.length} plats tex-mex ajoutés avec succès`);

    console.log('📋 Liste des plats tex-mex créés:');
    createdTexMex.forEach(dish => {
      console.log(`   - ${dish.name} (${dish.price}€)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seed des plats tex-mex:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  seedTexMex();
}

module.exports = { seedTexMex };
