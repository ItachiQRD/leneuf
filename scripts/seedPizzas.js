// scripts/seedPizzas.js - Script pour ajouter les pizzas du menu
const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fastfood';

// Schéma pour les tailles de pizza (identique au modèle existant)
const pizzaSizeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['junior', 'senior', 'mega']
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  diameter: { 
    type: String, 
    required: true,
    enum: ['29cm', '33cm', '40cm']
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

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
  },
  pizzaBase: {
    type: String,
    enum: ['tomate', 'creme_fraiche'],
    default: 'tomate'
  },
  pizzaSizes: {
    type: [pizzaSizeSchema],
    default: []
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

const seedPizzas = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à la base de données établie');

    // Nettoyer les pizzas existantes
    await Food.deleteMany({ type: 'pizza' });
    console.log('Pizzas existantes supprimées');

    // Pizzas basées sur le menu
    const pizzas = [
      // PIZZAS BASE TOMATE
      {
        name: "Margherita",
        description: "Base tomate, fromage",
        price: 7.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "bestseller",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage"],
        allergens: ["gluten", "lactose"],
        isVegetarian: true,
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 7.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 9.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 14.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Reine",
        description: "Jambon, champignons",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "jambon", "champignons"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Kebab",
        description: "Kebab, viande hachée",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "kebab", "viande hachée"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Vegane",
        description: "Poivrons, olives, champignons, artichaut",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "poivrons", "olives", "champignons", "artichaut"],
        allergens: ["gluten", "lactose"],
        isVegan: true,
        isVegetarian: true,
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "3 Jambons",
        description: "Jambon, lardon, chorizo",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "jambon", "lardon", "chorizo"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Napolitaine",
        description: "Anchois, poivron, olives",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "anchois", "poivron", "olives"],
        allergens: ["gluten", "lactose", "poisson"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "4 Saisons",
        description: "Jambon, artichauts, champignons, olive",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "jambon", "artichauts", "champignons", "olives"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "4 Fromages",
        description: "Chèvre, Bleu, Reblochon, Mozzarella",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "chèvre", "bleu", "reblochon", "mozzarella"],
        allergens: ["gluten", "lactose"],
        isVegetarian: true,
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Fajitas",
        description: "Poulet, Viande hachée, poivrons",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "poulet", "viande hachée", "poivrons"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Orientale",
        description: "Merguez, poivron, olives, Œuf, oignon",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "merguez", "poivron", "olives", "œuf", "oignon"],
        allergens: ["gluten", "lactose", "œufs"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Parisienne",
        description: "Poulet, poivrons, mozzarella",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "poulet", "poivrons", "mozzarella"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Neptune",
        description: "Thon, oignons, olives, Œuf",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "thon", "oignons", "olives", "œuf"],
        allergens: ["gluten", "lactose", "poisson", "œufs"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Gourmande",
        description: "Poulet, merguez, chorizo, viande hachée",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "poulet", "merguez", "chorizo", "viande hachée"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "San Pietro",
        description: "Jambon, chèvre, champignons",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "jambon", "chèvre", "champignons"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Campione",
        description: "Viande hachée, oignons, champignons, oeuf",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "viande hachée", "oignons", "champignons", "œuf"],
        allergens: ["gluten", "lactose", "œufs"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Fruit de Mer",
        description: "Fruit de mer, fromage",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "fruits de mer"],
        allergens: ["gluten", "lactose", "crustacés", "mollusques"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Indienne",
        description: "Poulet, poivrons, oignons, sauce curry",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "poulet", "poivrons", "oignons", "sauce curry"],
        allergens: ["gluten", "lactose"],
        spicyLevel: "medium",
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Bolognaise",
        description: "Viande hachée, PDT, oignons",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "viande hachée", "pomme de terre", "oignons"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Mexicaine",
        description: "Merguez, poivrons, Œuf, oignons",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "merguez", "poivrons", "œuf", "oignons"],
        allergens: ["gluten", "lactose", "œufs"],
        spicyLevel: "medium",
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },

      // PIZZAS BASE CRÈME FRAÎCHE
      {
        name: "Tartiflette",
        description: "Lardon, PDT, reblochons",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "lardon", "pomme de terre", "reblochon"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Paysanne",
        description: "Jambon, lardon, Pomme de terre",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "jambon", "lardon", "pomme de terre"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Fermière",
        description: "Poulet, chèvre, Pomme de terre",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "poulet", "chèvre", "pomme de terre"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Miami",
        description: "Poulet, champignon, olives",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "poulet", "champignons", "olives"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Chèvre Miel",
        description: "Chèvre, miel, fromage",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "chèvre", "miel"],
        allergens: ["gluten", "lactose"],
        isVegetarian: true,
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Savoyarde",
        description: "Jambon, lardon, PDT, reblochons, oignons",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "jambon", "lardon", "pomme de terre", "reblochon", "oignons"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Pacífico",
        description: "Saumon, PDT",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "saumon", "pomme de terre"],
        allergens: ["gluten", "lactose", "poisson"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Fromagère",
        description: "Chèvre, raclette, reblochon",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "chèvre", "raclette", "reblochon"],
        allergens: ["gluten", "lactose"],
        isVegetarian: true,
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Buffalo",
        description: "Viande hachée, chorizo, oignon",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "viande hachée", "chorizo", "oignon"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Raclette",
        description: "Jambon, raclette, pomme de terre",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "jambon", "raclette", "pomme de terre"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Boursin",
        description: "Viande hachée, boursin, oignon",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "viande hachée", "boursin", "oignon"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Istanbul",
        description: "Kebab, oignon frit, sauce boisée",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "regular",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["crème fraîche", "fromage", "kebab", "oignon frit", "sauce boisée"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "creme_fraiche",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },

      // PIZZAS ORIGINALES
      {
        name: "Burger",
        description: "Viande hachée, cheddar, oignons frits, sauce Burger",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "new",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "viande hachée", "cheddar", "oignons frits", "sauce burger"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Chili Thai",
        description: "Crevettes, poivrons, oignons, PDT, sauce chili thaï",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "new",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "crevettes", "poivrons", "oignons", "pomme de terre", "sauce chili thaï"],
        allergens: ["gluten", "lactose", "crustacés"],
        spicyLevel: "hot",
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Dijonnaise",
        description: "Poulet-champignon, sauce Moutarde à l'ancienne",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "new",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "poulet", "champignons", "sauce moutarde à l'ancienne"],
        allergens: ["gluten", "lactose", "moutarde"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Vegas",
        description: "Tenders, poivrons, sauce algérienne",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "new",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "tenders", "poivrons", "sauce algérienne"],
        allergens: ["gluten", "lactose"],
        spicyLevel: "medium",
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      },
      {
        name: "Barbecue",
        description: "Viande hachée, poivrons, oignon frit, Sauce Barbecue",
        price: 9.00,
        image: "/images/menu/pizzas.jpg",
        type: "pizza",
        category: "new",
        available: true,
        active: true,
        preparationTimeMinutes: 15,
        baseIngredients: ["tomate", "fromage", "viande hachée", "poivrons", "oignon frit", "sauce barbecue"],
        allergens: ["gluten", "lactose"],
        pizzaBase: "tomate",
        pizzaSizes: [
          { name: "junior", price: 9.00, diameter: "29cm", isDefault: true },
          { name: "senior", price: 13.00, diameter: "33cm", isDefault: false },
          { name: "mega", price: 17.00, diameter: "40cm", isDefault: false }
        ]
      }
    ];

    await Food.insertMany(pizzas);
    console.log(`${pizzas.length} pizzas insérées avec succès !`);

    console.log('✅ Toutes les pizzas du menu ont été ajoutées !');
    console.log('📊 Résumé des pizzas :');
    pizzas.forEach(pizza => {
      console.log(`- ${pizza.name} (${pizza.pizzaBase}): ${pizza.price}€`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des pizzas :', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
};

// Exécuter le script
seedPizzas().catch(console.error);

module.exports = seedPizzas;
