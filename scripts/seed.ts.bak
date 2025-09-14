// scripts/seed.ts
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Définir les schémas
const ingredientSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'ingrédient est requis'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Le type d\'ingrédient est requis'],
    enum: ['meat', 'cheese', 'vegetable', 'extra'],
  },
  usage: {
    type: String,
    required: [true, 'L\'utilisation de l\'ingrédient est requise'],
    enum: ['base', 'extra', 'both'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix de l\'ingrédient est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  image: {
    type: String,
    required: [true, 'L\'image de l\'ingrédient est requise'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isSpicy: {
    type: Boolean,
    default: false,
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  allergens: [{
    type: String,
  }],
  orderIndex: {
    type: Number,
    required: [true, 'L\'ordre d\'affichage est requis'],
  },
  nutritionalInfo: {
    calories: {
      type: Number,
      required: [true, 'Les calories sont requises'],
    },
    proteins: {
      type: Number,
      required: [true, 'Les protéines sont requises'],
    },
    carbs: {
      type: Number,
      required: [true, 'Les glucides sont requis'],
    },
    fats: {
      type: Number,
      required: [true, 'Les lipides sont requis'],
    },
    fiber: {
      type: Number,
      default: 0,
    },
    sugar: {
      type: Number,
      default: 0,
    },
    servingSize: {
      type: Number,
      default: 100,
    },
  },
});

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description du produit est requise'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Le prix du produit est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  image: {
    type: String,
    required: [true, 'L\'image du produit est requise'],
  },
  category: {
    type: String,
    required: [true, 'La catégorie du produit est requise'],
    enum: ['Burgers', 'Pizzas', 'Salades', 'Desserts', 'Boissons', 'Accompagnements'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number,
    required: [true, 'Le temps de préparation est requis'],
    min: [1, 'Le temps de préparation minimum est de 1 minute'],
  },
  ingredients: [{
    type: Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: [true, 'Les ingrédients sont requis'],
  }],
  allergens: [{
    type: String,
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      required: [true, 'Les calories sont requises'],
    },
    proteins: {
      type: Number,
      required: [true, 'Les protéines sont requises'],
    },
    carbs: {
      type: Number,
      required: [true, 'Les glucides sont requis'],
    },
    fats: {
      type: Number,
      required: [true, 'Les lipides sont requis'],
    },
  },
}, {
  timestamps: true,
});

// Créer les modèles
const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const ingredients = [
  // Viandes
  {
    name: 'Cordon bleu',
    type: 'meat',
    usage: 'base',
    price: 2.5,
    image: '/uploads/ingredients/cordon-bleu.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: ['gluten', 'lait', 'œufs'],
    orderIndex: 1,
    nutritionalInfo: {
      calories: 280,
      proteins: 19,
      carbs: 15,
      fats: 16,
      servingSize: 100
    }
  },
  {
    name: 'Nuggets',
    type: 'meat',
    usage: 'base',
    price: 2.0,
    image: '/uploads/ingredients/nuggets.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: ['gluten', 'œufs'],
    orderIndex: 2,
    nutritionalInfo: {
      calories: 296,
      proteins: 15,
      carbs: 18,
      fats: 18,
      servingSize: 100
    }
  },
  {
    name: 'Tenders',
    type: 'meat',
    usage: 'base',
    price: 2.0,
    image: '/uploads/ingredients/tenders.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: ['gluten', 'œufs'],
    orderIndex: 3,
    nutritionalInfo: {
      calories: 280,
      proteins: 17,
      carbs: 16,
      fats: 16,
      servingSize: 100
    }
  },
  {
    name: 'Viande hachée',
    type: 'meat',
    usage: 'base',
    price: 2.0,
    image: '/uploads/ingredients/viande-hachee.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: [],
    orderIndex: 4,
    nutritionalInfo: {
      calories: 243,
      proteins: 26,
      carbs: 0,
      fats: 15,
      servingSize: 100
    }
  },
  {
    name: 'Poulet mariné',
    type: 'meat',
    usage: 'base',
    price: 2.0,
    image: '/uploads/ingredients/poulet-marine.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: [],
    orderIndex: 5,
    nutritionalInfo: {
      calories: 165,
      proteins: 31,
      carbs: 0,
      fats: 3.6,
      servingSize: 100
    }
  },
  {
    name: 'Steak 45g',
    type: 'meat',
    usage: 'base',
    price: 2.0,
    image: '/uploads/ingredients/steak-45.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: [],
    orderIndex: 6,
    nutritionalInfo: {
      calories: 250,
      proteins: 26,
      carbs: 0,
      fats: 17,
      servingSize: 100
    }
  },
  {
    name: 'Steak 90g',
    type: 'meat',
    usage: 'base',
    price: 3.5,
    image: '/uploads/ingredients/steak-90.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: [],
    orderIndex: 7,
    nutritionalInfo: {
      calories: 250,
      proteins: 26,
      carbs: 0,
      fats: 17,
      servingSize: 100
    }
  },
  {
    name: 'Poulet pané',
    type: 'meat',
    usage: 'base',
    price: 2.0,
    image: '/uploads/ingredients/poulet-pane.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: ['gluten', 'œufs'],
    orderIndex: 8,
    nutritionalInfo: {
      calories: 280,
      proteins: 17,
      carbs: 18,
      fats: 15,
      servingSize: 100
    }
  },
  {
    name: 'Merguez',
    type: 'meat',
    usage: 'base',
    price: 1.5,
    image: '/uploads/ingredients/merguez.webp',
    isAvailable: true,
    isSpicy: true,
    isVegetarian: false,
    allergens: [],
    orderIndex: 9,
    nutritionalInfo: {
      calories: 290,
      proteins: 16,
      carbs: 2,
      fats: 25,
      servingSize: 100
    }
  },
  {
    name: 'Kebab',
    type: 'meat',
    usage: 'base',
    price: 2.0,
    image: '/uploads/ingredients/kebab.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: false,
    allergens: [],
    orderIndex: 10,
    nutritionalInfo: {
      calories: 217,
      proteins: 21,
      carbs: 2,
      fats: 14,
      servingSize: 100
    }
  },

  // Légumes
  {
    name: 'Salade',
    type: 'vegetable',
    usage: 'both',
    price: 0.5,
    image: '/uploads/ingredients/salade.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 11,
    nutritionalInfo: {
      calories: 15,
      proteins: 1.4,
      carbs: 2.9,
      fats: 0.2,
      fiber: 1.3,
      servingSize: 100
    }
  },
  {
    name: 'Tomate',
    type: 'vegetable',
    usage: 'both',
    price: 0.5,
    image: '/uploads/ingredients/tomate.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 12,
    nutritionalInfo: {
      calories: 18,
      proteins: 0.9,
      carbs: 3.9,
      fats: 0.2,
      fiber: 1.2,
      sugar: 2.6,
      servingSize: 100
    }
  },
  {
    name: 'Oignon',
    type: 'vegetable',
    usage: 'both',
    price: 0.3,
    image: '/uploads/ingredients/oignon.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 13,
    nutritionalInfo: {
      calories: 40,
      proteins: 1.1,
      carbs: 9.3,
      fats: 0.1,
      fiber: 1.7,
      sugar: 4.2,
      servingSize: 100
    }
  },
  {
    name: 'Champignon',
    type: 'vegetable',
    usage: 'both',
    price: 0.5,
    image: '/uploads/ingredients/champignon.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 14,
    nutritionalInfo: {
      calories: 22,
      proteins: 3.1,
      carbs: 3.3,
      fats: 0.3,
      fiber: 1,
      servingSize: 100
    }
  },
  {
    name: 'Poivron',
    type: 'vegetable',
    usage: 'both',
    price: 0.5,
    image: '/uploads/ingredients/poivron.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 15,
    nutritionalInfo: {
      calories: 20,
      proteins: 0.9,
      carbs: 4.6,
      fats: 0.2,
      fiber: 1.7,
      sugar: 2.4,
      servingSize: 100
    }
  },
  {
    name: 'Olive',
    type: 'vegetable',
    usage: 'both',
    price: 0.5,
    image: '/uploads/ingredients/olive.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: [],
    orderIndex: 16,
    nutritionalInfo: {
      calories: 115,
      proteins: 0.8,
      carbs: 6,
      fats: 11,
      fiber: 3.2,
      servingSize: 100
    }
  },

  // Fromages
  {
    name: 'Chèvre',
    type: 'cheese',
    usage: 'both',
    price: 1.0,
    image: '/uploads/ingredients/chevre.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: ['lait'],
    orderIndex: 17,
    nutritionalInfo: {
      calories: 268,
      proteins: 18.5,
      carbs: 0.9,
      fats: 21.6,
      servingSize: 100
    }
  },
  {
    name: 'Mozzarella',
    type: 'cheese',
    usage: 'both',
    price: 1.0,
    image: '/uploads/ingredients/mozzarella.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: ['lait'],
    orderIndex: 18,
    nutritionalInfo: {
      calories: 280,
      proteins: 28,
      carbs: 2.2,
      fats: 17,
      servingSize: 100
    }
  },
  {
    name: 'Cheddar',
    type: 'cheese',
    usage: 'both',
    price: 1.0,
    image: '/uploads/ingredients/cheddar.webp',
    isAvailable: true,
    isSpicy: false,
    isVegetarian: true,
    allergens: ['lait'],
    orderIndex: 19,
    nutritionalInfo: {
      calories: 402,
      proteins: 25,
      carbs: 1.3,
      fats: 33,
      servingSize: 100
    }
  }
];

const products = [
  {
    name: "Burger Classic",
    description: "Notre burger signature avec steak haché frais, cheddar, salade, tomate et sauce maison",
    price: 9.99,
    image: "/api/placeholder/400/300",
    category: "Burgers",
    available: true,
    preparationTime: 15,
    ingredients: [
      ingredients.find(ingredient => ingredient.name === 'Viande hachée'),
      ingredients.find(ingredient => ingredient.name === 'Cheddar'),
      ingredients.find(ingredient => ingredient.name === 'Salade'),
      ingredients.find(ingredient => ingredient.name === 'Tomate')
    ],
    allergens: ["Gluten", "Lactose"],
    nutritionalInfo: {
      calories: 650,
      proteins: 35,
      carbs: 48,
      fats: 25,
    }
  },
  {
    name: "Pizza Margherita",
    description: "Pizza traditionnelle avec sauce tomate, mozzarella et basilic frais",
    price: 11.99,
    image: "/api/placeholder/400/300",
    category: "Pizzas",
    available: true,
    preparationTime: 20,
    ingredients: [
      ingredients.find(ingredient => ingredient.name === 'Tomate'),
      ingredients.find(ingredient => ingredient.name === 'Mozzarella'),
      ingredients.find(ingredient => ingredient.name === 'Basilic')
    ],
    allergens: ["Gluten", "Lactose"],
    nutritionalInfo: {
      calories: 800,
      proteins: 30,
      carbs: 90,
      fats: 28,
    }
  },
  {
    name: "Salade César",
    description: "Salade romaine, poulet grillé, croûtons, parmesan et sauce césar",
    price: 8.99,
    image: "/api/placeholder/400/300",
    category: "Salades",
    available: true,
    preparationTime: 10,
    ingredients: [
      ingredients.find(ingredient => ingredient.name === 'Poulet mariné'),
      ingredients.find(ingredient => ingredient.name === 'Salade'),
      ingredients.find(ingredient => ingredient.name === 'Croûtons'),
      ingredients.find(ingredient => ingredient.name === 'Parmesan')
    ],
    allergens: ["Gluten", "Lactose", "Œuf"],
    nutritionalInfo: {
      calories: 450,
      proteins: 28,
      carbs: 20,
      fats: 18,
    }
  }
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fastfood';
    
    console.log(' Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log(' Connecté à MongoDB');

    // Mise à jour des ingrédients
    console.log(' Mise à jour des ingrédients...');
    const ingredientMap = new Map();
    
    for (const ingredient of ingredients) {
      const updatedIngredient = await Ingredient.findOneAndUpdate(
        { name: ingredient.name },
        ingredient,
        { upsert: true, new: true }
      );
      ingredientMap.set(ingredient.name, updatedIngredient._id);
    }
    console.log(' Ingrédients mis à jour avec succès');

    // Mise à jour des produits
    console.log(' Mise à jour des produits...');
    for (const product of products) {
      // Créer une nouvelle version du produit avec les IDs d'ingrédients
      const productData = {
        ...product,
        ingredients: product.ingredients
          .map(ing => ing && typeof ing === 'object' && 'name' in ing ? ingredientMap.get(ing.name) : null)
          .filter(id => id !== null && id !== undefined)
      };

      await Product.findOneAndUpdate(
        { name: product.name },
        productData,
        { upsert: true, new: true }
      );
    }
    console.log(' Produits mis à jour avec succès');

    console.log(' Initialisation terminée!');
    process.exit(0);
  } catch (error) {
    console.error(' Erreur:', error);
    process.exit(1);
  }
}

seed();