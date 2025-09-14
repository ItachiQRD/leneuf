// scripts/seedSalads.js - Script pour ajouter les salades du menu
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

// Données des salades - Menu Pizza Le Neuf
const salads = [
  {
    name: "Le Neuf",
    price: 7.00,
    image: "/uploads/foods/salade-le-neuf.webp",
    type: "salad",
    category: "bestseller",
    preparationTimeMinutes: 8,
    baseIngredients: ["Salade verte", "Tomate", "Olives", "Poulet"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 280,
      proteins: 22,
      carbs: 8,
      fats: 15,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true
  },
  {
    name: "Royale",
    price: 7.00,
    image: "/uploads/foods/salade-royale.webp",
    type: "salad",
    category: "bestseller",
    preparationTimeMinutes: 10,
    baseIngredients: ["Salade verte", "Tomate", "Avocat", "Crevettes"],
    allergens: ["fish"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 320,
      proteins: 25,
      carbs: 12,
      fats: 18,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true
  },
  {
    name: "Niçoise",
    price: 7.00,
    image: "/uploads/foods/salade-nicoise.webp",
    type: "salad",
    category: "regular",
    preparationTimeMinutes: 8,
    baseIngredients: ["Salade verte", "Tomate", "Thon", "Olives"],
    allergens: ["fish"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 290,
      proteins: 28,
      carbs: 10,
      fats: 16,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true
  },
  {
    name: "Norvégienne",
    price: 7.00,
    image: "/uploads/foods/salade-norvegienne.webp",
    type: "salad",
    category: "bestseller",
    preparationTimeMinutes: 12,
    baseIngredients: ["Salade verte", "Tomate", "Pomme de terre", "Saumon"],
    allergens: ["fish"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 350,
      proteins: 30,
      carbs: 20,
      fats: 18,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true
  },
  {
    name: "Chèvre Chaud",
    price: 7.00,
    image: "/uploads/foods/salade-chevre-chaud.webp",
    type: "salad",
    category: "bestseller",
    preparationTimeMinutes: 10,
    baseIngredients: ["Salade verte", "Tomate", "Poulet", "Chèvre sur toast"],
    allergens: ["dairy", "gluten"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 380,
      proteins: 26,
      carbs: 15,
      fats: 22,
      servingSize: "1 portion"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false
  }
];

async function seedSalads() {
  try {
    console.log('🌱 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🥗 Suppression des anciennes salades...');
    await Food.deleteMany({ type: 'salad' });
    console.log('✅ Anciennes salades supprimées');

    console.log('🥗 Ajout des nouvelles salades...');
    const createdSalads = await Food.insertMany(salads);
    console.log(`✅ ${createdSalads.length} salades ajoutées avec succès`);

    console.log('📋 Liste des salades créées:');
    createdSalads.forEach(salad => {
      console.log(`   - ${salad.name} (${salad.price}€)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seed des salades:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  seedSalads();
}

module.exports = { seedSalads };
