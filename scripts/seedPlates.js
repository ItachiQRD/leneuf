// scripts/seedPlates.js - Script pour ajouter les assiettes du menu
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
  plateAccompaniments: {
    bread: { type: Boolean, default: false },
    fries: { type: Boolean, default: false },
    salad: { type: Boolean, default: false }
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

// Données des assiettes - Menu Pizza Le Neuf
const plates = [
  {
    name: "Kebab",
    price: 10.00,
    image: "/uploads/foods/assiette-kebab.webp",
    type: "plates",
    category: "bestseller",
    preparationTimeMinutes: 15,
    baseIngredients: ["Viande de kebab", "Salade", "Tomate", "Oignon", "Sauce blanche"],
    allergens: ["gluten"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 450,
      proteins: 25,
      carbs: 35,
      fats: 22,
      servingSize: "1 assiette"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    plateAccompaniments: {
      bread: true,
      fries: false,
      salad: false
    }
  },
  {
    name: "Poulet",
    price: 10.00,
    image: "/uploads/foods/assiette-poulet.webp",
    type: "plates",
    category: "bestseller",
    preparationTimeMinutes: 12,
    baseIngredients: ["Poulet grillé", "Salade", "Tomate", "Oignon", "Sauce"],
    allergens: [],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 380,
      proteins: 30,
      carbs: 20,
      fats: 18,
      servingSize: "1 assiette"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true,
    plateAccompaniments: {
      bread: true,
      fries: false,
      salad: false
    }
  },
  {
    name: "Mixte",
    price: 12.00,
    image: "/uploads/foods/assiette-mixte.webp",
    type: "plates",
    category: "bestseller",
    preparationTimeMinutes: 15,
    baseIngredients: ["Poulet", "Kebab", "Salade", "Tomate", "Oignon", "Sauce"],
    allergens: ["gluten"],
    spicyLevel: "mild",
    nutritionalInfo: {
      calories: 520,
      proteins: 35,
      carbs: 40,
      fats: 25,
      servingSize: "1 assiette"
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    plateAccompaniments: {
      bread: true,
      fries: false,
      salad: false
    }
  }
];

async function seedPlates() {
  try {
    console.log('🌱 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🍽️ Suppression des anciennes assiettes...');
    await Food.deleteMany({ type: 'plates' });
    console.log('✅ Anciennes assiettes supprimées');

    console.log('🍽️ Ajout des nouvelles assiettes...');
    const createdPlates = await Food.insertMany(plates);
    console.log(`✅ ${createdPlates.length} assiettes ajoutées avec succès`);

    console.log('📋 Liste des assiettes créées:');
    createdPlates.forEach(plate => {
      console.log(`   - ${plate.name} (${plate.price}€)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seed des assiettes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  seedPlates();
}

module.exports = { seedPlates };
