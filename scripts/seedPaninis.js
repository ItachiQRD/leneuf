// scripts/seedPaninis.js - Script pour ajouter les paninis du menu
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
  },
  paniniAccompaniments: {
    fries: { type: Boolean, default: false },
    drink: { type: String },
    drinkPrice: { type: Number, default: 0 }
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

// Données des paninis - Menu Pizza Le Neuf (FRITE + BOISSON 33CL inclus)
const paninis = [
  {
    name: "Kebab",
    price: 6.50,
    image: "/uploads/foods/panini-kebab.webp",
    type: "paninis",
    category: "bestseller",
    preparationTimeMinutes: 10,
    baseIngredients: ["Pain panini", "Viande de kebab", "Salade", "Tomate", "Oignon", "Sauce blanche"],
    allergens: ["gluten"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 520,
      proteins: 28,
      carbs: 45,
      fats: 22,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  },
  {
    name: "Fromage",
    price: 6.50,
    image: "/uploads/foods/panini-fromage.webp",
    type: "paninis",
    category: "regular",
    preparationTimeMinutes: 8,
    baseIngredients: ["Pain panini", "Fromage", "Tomate", "Salade"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 420,
      proteins: 20,
      carbs: 40,
      fats: 18,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  },
  {
    name: "Chèvre Miel",
    price: 6.50,
    image: "/uploads/foods/panini-chevre-miel.webp",
    type: "paninis",
    category: "bestseller",
    preparationTimeMinutes: 8,
    baseIngredients: ["Pain panini", "Chèvre", "Miel", "Salade"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 450,
      proteins: 22,
      carbs: 42,
      fats: 20,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  },
  {
    name: "Jambon",
    price: 6.50,
    image: "/uploads/foods/panini-jambon.webp",
    type: "paninis",
    category: "regular",
    preparationTimeMinutes: 8,
    baseIngredients: ["Pain panini", "Jambon", "Fromage", "Tomate", "Salade"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 440,
      proteins: 25,
      carbs: 38,
      fats: 19,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  },
  {
    name: "Poulet",
    price: 6.50,
    image: "/uploads/foods/panini-poulet.webp",
    type: "paninis",
    category: "bestseller",
    preparationTimeMinutes: 10,
    baseIngredients: ["Pain panini", "Poulet grillé", "Salade", "Tomate", "Oignon", "Sauce"],
    allergens: ["gluten"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 480,
      proteins: 32,
      carbs: 40,
      fats: 20,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  },
  {
    name: "Viande Hachée",
    price: 6.50,
    image: "/uploads/foods/panini-viande-hachee.webp",
    type: "paninis",
    category: "regular",
    preparationTimeMinutes: 12,
    baseIngredients: ["Pain panini", "Viande hachée", "Fromage", "Tomate", "Salade", "Sauce"],
    allergens: ["gluten", "dairy"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 500,
      proteins: 30,
      carbs: 42,
      fats: 22,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  },
  {
    name: "Saumon",
    price: 6.50,
    image: "/uploads/foods/panini-saumon.webp",
    type: "paninis",
    category: "bestseller",
    preparationTimeMinutes: 10,
    baseIngredients: ["Pain panini", "Saumon", "Salade", "Tomate", "Sauce"],
    allergens: ["gluten", "fish"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 460,
      proteins: 28,
      carbs: 38,
      fats: 21,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  },
  {
    name: "Thon",
    price: 6.50,
    image: "/uploads/foods/panini-thon.webp",
    type: "paninis",
    category: "regular",
    preparationTimeMinutes: 8,
    baseIngredients: ["Pain panini", "Thon", "Tomate", "Salade", "Sauce"],
    allergens: ["gluten", "fish"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 420,
      proteins: 26,
      carbs: 36,
      fats: 18,
      servingSize: "1 panini"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    paniniAccompaniments: {
      fries: true,
      drink: "Coca-Cola 33cl",
      drinkPrice: 0
    }
  }
];

async function seedPaninis() {
  try {
    console.log('🌱 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🥪 Suppression des anciens paninis...');
    await Food.deleteMany({ type: 'paninis' });
    console.log('✅ Anciens paninis supprimés');

    console.log('🥪 Ajout des nouveaux paninis...');
    const createdPaninis = await Food.insertMany(paninis);
    console.log(`✅ ${createdPaninis.length} paninis ajoutés avec succès`);

    console.log('📋 Liste des paninis créés:');
    createdPaninis.forEach(panini => {
      console.log(`   - ${panini.name} (${panini.price}€)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seed des paninis:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  seedPaninis();
}

module.exports = { seedPaninis };
