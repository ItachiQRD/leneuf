// scripts/seedBurgers.js - Script pour ajouter les burgers du menu
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

const seedBurgers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à la base de données établie');

    // Nettoyer les burgers existants
    await Food.deleteMany({ type: 'burger' });
    console.log('Burgers existants supprimés');

    // Burgers basés sur le menu
    const burgers = [
      {
        name: "Simple",
        description: "Steak 80gr, cheddar",
        price: 6.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 8,
        baseIngredients: ["pain burger", "steak 80gr", "cheddar", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Double",
        description: "2 steaks 80gr, 2 cheddars",
        price: 8.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "bestseller",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain burger", "steak 80gr", "cheddar", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Triple",
        description: "3 steaks 80gr, 3 cheddar",
        price: 9.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain burger", "steak 80gr", "cheddar", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Chicken Burger",
        description: "Poulet pané, Cheddar",
        price: 7.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain burger", "poulet pané", "cheddar", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Le Neuf",
        description: "2 Steaks 80gr, Cheddar, œuf",
        price: 9.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "bestseller",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain burger", "steak 80gr", "cheddar", "œuf", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Country",
        description: "1 Steak 80gr, Galette PDT, cheddar, œuf",
        price: 9.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 12,
        baseIngredients: ["pain burger", "steak 80gr", "galette pomme de terre", "cheddar", "œuf", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Raclette",
        description: "Steak 80gr, jambon, Raclette",
        price: 7.50,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain burger", "steak 80gr", "jambon", "raclette", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Fish",
        description: "Poisson pané, Cheddar",
        price: 6.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain burger", "poisson pané", "cheddar", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose", "poisson", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Perfect",
        description: "2 Tenders, Cheddar",
        price: 7.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain burger", "tenders", "cheddar", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose", "œufs"],
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "Vegan",
        description: "Steak Végan, Cheddar",
        price: 7.00,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 8,
        baseIngredients: ["pain burger", "steak végan", "cheddar végan", "salade", "tomate", "oignon"],
        allergens: ["gluten"],
        isVegan: true,
        isVegetarian: true,
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      },
      {
        name: "BBQ",
        description: "Steak 80gr, Bacon, sauce BBQ, Cheddar",
        price: 7.50,
        image: "/images/menu/burgers.jpg",
        type: "burger",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 10,
        baseIngredients: ["pain burger", "steak 80gr", "bacon", "sauce BBQ", "cheddar", "salade", "tomate", "oignon"],
        allergens: ["gluten", "lactose"],
        spicyLevel: "medium",
        extras: [
          { name: "Coca-Cola", price: 1.00, maxQuantity: 1, category: "other" }
        ]
      }
    ];

    await Food.insertMany(burgers);
    console.log(`${burgers.length} burgers insérés avec succès !`);

    console.log('✅ Tous les burgers du menu ont été ajoutés !');
    console.log('📊 Résumé des burgers :');
    burgers.forEach(burger => {
      console.log(`- ${burger.name}: ${burger.price}€`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des burgers :', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
};

// Exécuter le script
seedBurgers().catch(console.error);

module.exports = seedBurgers;
