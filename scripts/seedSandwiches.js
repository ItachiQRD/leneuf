// scripts/seedSandwiches.js - Script pour ajouter les sandwichs du menu
const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fastfood';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  type: {
    type: String,
    required: [true, 'Le type est requis'],
    enum: ['burger', 'pizza', 'salad', 'sandwich_durum', 'tacos', 'bowls', 'paninis', 'plates', 'tex_mex'],
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
    servingSize: { type: String, default: '100g' },
  },
  extras: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    maxQuantity: { type: Number, required: true, min: 1 },
    category: { 
      type: String, 
      required: true,
      enum: ['protein', 'vegetable', 'cheese', 'other']
    }
  }],
  maxSauces: {
    type: Number,
    default: 2,
    min: 0,
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
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Modèle
const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);

const seedSandwiches = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à la base de données établie');

    // Nettoyer les sandwichs existants
    await Food.deleteMany({ type: 'sandwich_durum' });
    console.log('Sandwichs existants supprimés');

    // Sandwichs basés sur le menu
    const sandwiches = [
      {
        name: "Kebab",
        description: "Kebab crudités",
        price: 7.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "bestseller",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain", "kebab", "crudités", "sauce"],
        allergens: ["gluten"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Chicken",
        description: "Poulet, crudités, cheddar",
        price: 7.50,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain", "poulet", "crudités", "cheddar"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Durum",
        description: "Kebab/Poulet crudités",
        price: 7.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["galette", "kebab", "poulet", "crudités"],
        allergens: ["gluten"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Berliner",
        description: "Kebab, légumes grillés, feta, choux rouge",
        price: 8.50,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain", "kebab", "légumes grillés", "feta", "choux rouge"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Mixte",
        description: "Poulet, kebab, cheddar",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain", "poulet", "kebab", "cheddar"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Américain",
        description: "2 steaks 80gr, 2 cheddars",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain", "steak", "cheddar"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Boursin",
        description: "Steaks 80gr, œuf, cheddar - Boursin",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain", "steak", "œuf", "cheddar", "boursin"],
        allergens: ["gluten", "lactose", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Oriental",
        description: "Merguez, olives, poivrons, cheddar",
        price: 7.50,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain", "merguez", "olives", "poivrons", "cheddar"],
        allergens: ["gluten", "lactose"],
        spicyLevel: "medium",
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Suprême",
        description: "Steaks 80gr, cheddars, Galette PDT, Œuf",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain", "steak", "cheddar", "galette pomme de terre", "œuf"],
        allergens: ["gluten", "lactose", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Radical",
        description: "Steaks 80gr, Cordon bleu, cheddar",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain", "steak", "cordon bleu", "cheddar"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Crousty",
        description: "Tenders, cheddars, Boursin, Jambon",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain", "tenders", "cheddar", "boursin", "jambon"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Royal",
        description: "Steak 80gr, Poulet pané, Jambon, Œuf, Cheddar",
        price: 9.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "bestseller",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["pain", "steak", "poulet pané", "jambon", "œuf", "cheddar"],
        allergens: ["gluten", "lactose", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Spécial",
        description: "Poulet, crème fraîche, champignon, cheddar",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain", "poulet", "crème fraîche", "champignon", "cheddar"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Kapsalon",
        description: "Frites, kebab, crudité, sauce au choix",
        price: 8.00,
        image: "/images/menu/signature.jpg",
        type: "sandwich_durum",
        category: "new",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["frites", "kebab", "crudités", "sauce"],
        allergens: ["gluten"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      }
    ];

    await Food.insertMany(sandwiches);
    console.log(`${sandwiches.length} sandwichs insérés avec succès !`);

    console.log('✅ Tous les sandwichs du menu ont été ajoutés !');
    console.log('📊 Résumé des sandwichs :');
    sandwiches.forEach(sandwich => {
      console.log(`- ${sandwich.name}: ${sandwich.price}€`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des sandwichs :', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
};

// Exécuter le script
seedSandwiches().catch(console.error);

module.exports = seedSandwiches;
