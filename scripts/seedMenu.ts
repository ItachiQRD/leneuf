import mongoose from 'mongoose';
import Food from '../src/models/Food';
import Drink from '../src/models/Drink';
import Side from '../src/models/Side';
import Dessert from '../src/models/Dessert';
import Menu from '../src/models/Menu';
import Promotion from '../src/models/Promotion';
import { dbConnect } from '../src/lib/dbConnect';

const seedMenuData = async () => {
  try {
    await dbConnect();
    console.log('Connexion à la base de données établie');

    // Nettoyer les collections existantes
    await Food.deleteMany({});
    await Drink.deleteMany({});
    await Side.deleteMany({});
    await Dessert.deleteMany({});
    await Menu.deleteMany({});
    await Promotion.deleteMany({});

    console.log('Collections nettoyées');

    // 1. PIZZAS
    const pizzas = [
      // Pizzas Margherita
      {
        name: 'Pizza Margherita',
        description: 'Tomate, mozzarella, basilic',
        price: 7,
        type: 'pizza',
        category: 'regular',
        image: '/images/menu/pizzas/margherita.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['tomate', 'mozzarella', 'basilic'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 250,
          proteins: 12,
          carbs: 30,
          fats: 8,
          servingSize: '100g'
        },
        extras: [],
        maxSauces: 0,
        isVegan: false,
        isVegetarian: true,
        isGlutenFree: false,
        pizzaBase: 'tomate',
        pizzaSizes: [
          { name: 'junior', price: 7, diameter: '29cm', isDefault: true },
          { name: 'senior', price: 9, diameter: '33cm', isDefault: false },
          { name: 'mega', price: 14, diameter: '40cm', isDefault: false }
        ]
      },
      // Pizzas Base Tomate
      {
        name: 'Pizza Reine',
        description: 'Jambon, champignons',
        price: 9,
        type: 'pizza',
        category: 'regular',
        image: '/images/menu/pizzas/reine.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['tomate', 'fromage', 'jambon', 'champignons'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 280,
          proteins: 15,
          carbs: 32,
          fats: 10,
          servingSize: '100g'
        },
        extras: [],
        maxSauces: 0,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        pizzaBase: 'tomate',
        pizzaSizes: [
          { name: 'junior', price: 9, diameter: '29cm', isDefault: true },
          { name: 'senior', price: 13, diameter: '33cm', isDefault: false },
          { name: 'mega', price: 17, diameter: '40cm', isDefault: false }
        ]
      },
      {
        name: 'Pizza Kebab',
        description: 'Kebab, viande hachée',
        price: 9,
        type: 'pizza',
        category: 'regular',
        image: '/images/menu/pizzas/kebab.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['tomate', 'fromage', 'kebab', 'viande_hachee'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 320,
          proteins: 18,
          carbs: 30,
          fats: 12,
          servingSize: '100g'
        },
        extras: [],
        maxSauces: 0,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        pizzaBase: 'tomate',
        pizzaSizes: [
          { name: 'junior', price: 9, diameter: '29cm', isDefault: true },
          { name: 'senior', price: 13, diameter: '33cm', isDefault: false },
          { name: 'mega', price: 17, diameter: '40cm', isDefault: false }
        ]
      },
      {
        name: 'Pizza Végane',
        description: 'Poivrons, olives, champignons, artichauts',
        price: 9,
        type: 'pizza',
        category: 'regular',
        image: '/images/menu/pizzas/vegane.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['tomate', 'fromage_vegan', 'poivrons', 'olives', 'champignons', 'artichauts'],
        allergens: ['gluten'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 220,
          proteins: 8,
          carbs: 35,
          fats: 6,
          servingSize: '100g'
        },
        extras: [],
        maxSauces: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: false,
        pizzaBase: 'tomate',
        pizzaSizes: [
          { name: 'junior', price: 9, diameter: '29cm', isDefault: true },
          { name: 'senior', price: 13, diameter: '33cm', isDefault: false },
          { name: 'mega', price: 17, diameter: '40cm', isDefault: false }
        ]
      },
      {
        name: 'Pizza 4 Fromages',
        description: 'Chèvre, bleu, reblochon, mozzarella',
        price: 9,
        type: 'pizza',
        category: 'regular',
        image: '/images/menu/pizzas/4-fromages.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['tomate', 'chevre', 'bleu', 'reblochon', 'mozzarella'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 350,
          proteins: 20,
          carbs: 28,
          fats: 18,
          servingSize: '100g'
        },
        extras: [],
        maxSauces: 0,
        isVegan: false,
        isVegetarian: true,
        isGlutenFree: false,
        pizzaBase: 'tomate',
        pizzaSizes: [
          { name: 'junior', price: 9, diameter: '29cm', isDefault: true },
          { name: 'senior', price: 13, diameter: '33cm', isDefault: false },
          { name: 'mega', price: 17, diameter: '40cm', isDefault: false }
        ]
      },
      // Pizzas Base Crème
      {
        name: 'Pizza Tartiflette',
        description: 'Bacon, pommes de terre, reblochon',
        price: 9,
        type: 'pizza',
        category: 'regular',
        image: '/images/menu/pizzas/tartiflette.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['creme_fraiche', 'fromage', 'bacon', 'pommes_de_terre', 'reblochon'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 380,
          proteins: 16,
          carbs: 35,
          fats: 20,
          servingSize: '100g'
        },
        extras: [],
        maxSauces: 0,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        pizzaBase: 'creme_fraiche',
        pizzaSizes: [
          { name: 'junior', price: 9, diameter: '29cm', isDefault: true },
          { name: 'senior', price: 13, diameter: '33cm', isDefault: false },
          { name: 'mega', price: 17, diameter: '40cm', isDefault: false }
        ]
      }
    ];

    // 2. TACOS
    const tacos = [
      {
        name: 'Tacos',
        description: 'Tortilla avec viande, légumes, sauce et fromage',
        price: 6.5,
        type: 'tacos',
        category: 'regular',
        image: '/images/menu/tacos.jpg',
        preparationTimeMinutes: 10,
        baseIngredients: ['tortilla', 'viande', 'legumes', 'sauce', 'fromage'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 450,
          proteins: 25,
          carbs: 40,
          fats: 20,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        tacoSizes: [
          { name: 'M', price: 6.5, isDefault: true },
          { name: 'L', price: 7.5, isDefault: false },
          { name: 'XL', price: 9.5, isDefault: false }
        ],
        tacoOptions: {
          meats: [
            { category: 'meat', name: 'Kebab', price: 0, available: true },
            { category: 'meat', name: 'Merguez', price: 0, available: true },
            { category: 'meat', name: 'Poulet', price: 0, available: true },
            { category: 'meat', name: 'Tenders', price: 0, available: true },
            { category: 'meat', name: 'Nuggets', price: 0, available: true },
            { category: 'meat', name: 'Viande hachée', price: 0, available: true },
            { category: 'meat', name: 'Cordon-bleu', price: 0, available: true },
            { category: 'meat', name: 'Jambon', price: 0, available: true }
          ],
          sauces: [
            { category: 'sauce', name: 'Andalouse', price: 0, available: true },
            { category: 'sauce', name: 'Algérienne', price: 0, available: true },
            { category: 'sauce', name: 'Blanche', price: 0, available: true },
            { category: 'sauce', name: 'Biggy', price: 0, available: true },
            { category: 'sauce', name: 'Mayo', price: 0, available: true },
            { category: 'sauce', name: 'Ketchup', price: 0, available: true },
            { category: 'sauce', name: 'Curry', price: 0, available: true },
            { category: 'sauce', name: 'Barbecue', price: 0, available: true },
            { category: 'sauce', name: 'Chili Thai', price: 0, available: true },
            { category: 'sauce', name: 'Samouraï', price: 0, available: true }
          ],
          cheeses: [
            { category: 'cheese', name: 'Cheddar', price: 0, available: true },
            { category: 'cheese', name: 'Chèvre', price: 0, available: true },
            { category: 'cheese', name: 'Boursin', price: 0, available: true },
            { category: 'cheese', name: 'Raclette', price: 0, available: true },
            { category: 'cheese', name: 'Reblochon', price: 0, available: true }
          ],
          supplements: [
            { category: 'supplement', name: 'Œuf', price: 1, available: true },
            { category: 'supplement', name: 'Chorizo', price: 1, available: true },
            { category: 'supplement', name: 'Bacon', price: 1, available: true },
            { category: 'supplement', name: 'Galette de pomme de terre', price: 1, available: true },
            { category: 'supplement', name: 'Champignons', price: 1, available: true }
          ]
        }
      }
    ];

    // 3. BOWLS
    const bowls = [
      {
        name: 'Bowl',
        description: 'Frites, viande au choix, sauce fromage, mozzarella gratinée',
        price: 8,
        type: 'bowls',
        category: 'regular',
        image: '/images/menu/bowls.jpg',
        preparationTimeMinutes: 12,
        baseIngredients: ['frites', 'viande', 'sauce_fromage', 'mozzarella'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 600,
          proteins: 30,
          carbs: 55,
          fats: 25,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 0,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        bowlMeats: [
          { name: 'Kebab', price: 0, available: true },
          { name: 'Merguez', price: 0, available: true },
          { name: 'Poulet', price: 0, available: true },
          { name: 'Tenders', price: 0, available: true },
          { name: 'Nuggets', price: 0, available: true },
          { name: 'Viande hachée', price: 0, available: true },
          { name: 'Cordon-bleu', price: 0, available: true },
          { name: 'Jambon', price: 0, available: true }
        ]
      }
    ];

    // 4. SANDWICHS
    const sandwiches = [
      {
        name: 'Sandwich Kebab',
        description: 'Kebab avec légumes crus',
        price: 7,
        type: 'sandwich_durum',
        category: 'regular',
        image: '/images/menu/sandwichs/kebab.jpg',
        preparationTimeMinutes: 8,
        baseIngredients: ['pain', 'kebab', 'legumes_crus'],
        allergens: ['gluten'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 400,
          proteins: 20,
          carbs: 45,
          fats: 15,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Sandwich Chicken',
        description: 'Poulet avec légumes crus, cheddar',
        price: 7.5,
        type: 'sandwich_durum',
        category: 'regular',
        image: '/images/menu/sandwichs/chicken.jpg',
        preparationTimeMinutes: 8,
        baseIngredients: ['pain', 'poulet', 'legumes_crus', 'cheddar'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 450,
          proteins: 25,
          carbs: 40,
          fats: 18,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Sandwich Durum',
        description: 'Kebab/Poulet avec légumes crus',
        price: 7,
        type: 'sandwich_durum',
        category: 'regular',
        image: '/images/menu/sandwichs/durum.jpg',
        preparationTimeMinutes: 8,
        baseIngredients: ['tortilla', 'kebab_poulet', 'legumes_crus'],
        allergens: ['gluten'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 420,
          proteins: 22,
          carbs: 42,
          fats: 16,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      }
    ];

    // 5. BURGERS
    const burgers = [
      {
        name: 'Burger Simple',
        description: 'Steak 80g, cheddar',
        price: 6,
        type: 'burger',
        category: 'regular',
        image: '/images/menu/burgers/simple.jpg',
        preparationTimeMinutes: 10,
        baseIngredients: ['pain_burger', 'steak_80g', 'cheddar'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 500,
          proteins: 25,
          carbs: 35,
          fats: 25,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 2,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Burger Double',
        description: '2 steaks 80g, 2 cheddars',
        price: 8,
        type: 'burger',
        category: 'bestseller',
        image: '/images/menu/burgers/double.jpg',
        preparationTimeMinutes: 12,
        baseIngredients: ['pain_burger', 'steak_80g', 'steak_80g', 'cheddar', 'cheddar'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 750,
          proteins: 45,
          carbs: 40,
          fats: 40,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 2,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Burger Triple',
        description: '3 steaks 80g, 3 cheddars',
        price: 9,
        type: 'burger',
        category: 'bestseller',
        image: '/images/menu/burgers/triple.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['pain_burger', 'steak_80g', 'steak_80g', 'steak_80g', 'cheddar', 'cheddar', 'cheddar'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 1000,
          proteins: 65,
          carbs: 45,
          fats: 55,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 2,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Chicken Burger',
        description: 'Poulet pané, cheddar',
        price: 7,
        type: 'burger',
        category: 'regular',
        image: '/images/menu/burgers/chicken.jpg',
        preparationTimeMinutes: 10,
        baseIngredients: ['pain_burger', 'poulet_pane', 'cheddar'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 550,
          proteins: 30,
          carbs: 40,
          fats: 28,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 2,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Burger Le Neuf',
        description: '2 steaks 80g, cheddar, œuf',
        price: 9,
        type: 'burger',
        category: 'bestseller',
        image: '/images/menu/burgers/le-neuf.jpg',
        preparationTimeMinutes: 12,
        baseIngredients: ['pain_burger', 'steak_80g', 'steak_80g', 'cheddar', 'oeuf'],
        allergens: ['gluten', 'milk', 'eggs'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 800,
          proteins: 50,
          carbs: 38,
          fats: 45,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 2,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      }
    ];

    // 6. PLATS (ASSIETTES)
    const plats = [
      {
        name: 'Assiette Kebab',
        description: 'Kebab avec frites et salade',
        price: 10,
        type: 'plates',
        category: 'regular',
        image: '/images/menu/plats/kebab.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['kebab', 'frites', 'salade'],
        allergens: ['gluten'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 650,
          proteins: 35,
          carbs: 60,
          fats: 25,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        plateAccompaniments: {
          bread: true,
          fries: true,
          salad: true
        }
      },
      {
        name: 'Assiette Poulet',
        description: 'Poulet avec frites et salade',
        price: 10,
        type: 'plates',
        category: 'regular',
        image: '/images/menu/plats/poulet.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['poulet', 'frites', 'salade'],
        allergens: [],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 600,
          proteins: 40,
          carbs: 55,
          fats: 20,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: true,
        plateAccompaniments: {
          bread: true,
          fries: true,
          salad: true
        }
      },
      {
        name: 'Assiette Mixte',
        description: 'Kebab et poulet avec frites et salade',
        price: 12,
        type: 'plates',
        category: 'regular',
        image: '/images/menu/plats/mixte.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['kebab', 'poulet', 'frites', 'salade'],
        allergens: ['gluten'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 750,
          proteins: 45,
          carbs: 65,
          fats: 30,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        plateAccompaniments: {
          bread: true,
          fries: true,
          salad: true
        }
      }
    ];

    // 7. PANINIS
    const paninis = [
      {
        name: 'Panini Kebab',
        description: 'Kebab avec frites et boisson 33cl',
        price: 6.5,
        type: 'paninis',
        category: 'regular',
        image: '/images/menu/paninis/kebab.jpg',
        preparationTimeMinutes: 10,
        baseIngredients: ['pain_panini', 'kebab'],
        allergens: ['gluten'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 500,
          proteins: 25,
          carbs: 50,
          fats: 20,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        paniniAccompaniments: {
          fries: true,
          drink: '33cl',
          drinkPrice: 0
        }
      },
      {
        name: 'Panini Fromage',
        description: 'Fromage avec frites et boisson 33cl',
        price: 6.5,
        type: 'paninis',
        category: 'regular',
        image: '/images/menu/paninis/fromage.jpg',
        preparationTimeMinutes: 8,
        baseIngredients: ['pain_panini', 'fromage'],
        allergens: ['gluten', 'milk'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 450,
          proteins: 20,
          carbs: 45,
          fats: 18,
          servingSize: '1 portion'
        },
        extras: [],
        maxSauces: 0,
        isVegan: false,
        isVegetarian: true,
        isGlutenFree: false,
        paniniAccompaniments: {
          fries: true,
          drink: '33cl',
          drinkPrice: 0
        }
      }
    ];

    // 8. TEX MEX
    const texMex = [
      {
        name: 'Tenders',
        description: 'Morceaux de poulet panés',
        price: 8.5,
        type: 'tex_mex',
        category: 'regular',
        image: '/images/menu/tex-mex/tenders.jpg',
        preparationTimeMinutes: 12,
        baseIngredients: ['poulet_pane'],
        allergens: ['gluten', 'eggs'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 400,
          proteins: 30,
          carbs: 25,
          fats: 20,
          servingSize: '7 pièces'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Hot Wings',
        description: 'Ailes de poulet épicées',
        price: 8.5,
        type: 'tex_mex',
        category: 'regular',
        image: '/images/menu/tex-mex/hot-wings.jpg',
        preparationTimeMinutes: 15,
        baseIngredients: ['ailes_poulet', 'sauce_epicee'],
        allergens: ['gluten'],
        spicyLevel: 'hot',
        nutritionalInfo: {
          calories: 350,
          proteins: 25,
          carbs: 15,
          fats: 22,
          servingSize: '7 pièces'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Nuggets',
        description: 'Nuggets de poulet',
        price: 8.5,
        type: 'tex_mex',
        category: 'regular',
        image: '/images/menu/tex-mex/nuggets.jpg',
        preparationTimeMinutes: 10,
        baseIngredients: ['nuggets_poulet'],
        allergens: ['gluten', 'eggs'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 380,
          proteins: 20,
          carbs: 30,
          fats: 18,
          servingSize: '7 pièces'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      },
      {
        name: 'Mozza Sticks',
        description: 'Bâtonnets de mozzarella panés',
        price: 8.5,
        type: 'tex_mex',
        category: 'regular',
        image: '/images/menu/tex-mex/mozza-sticks.jpg',
        preparationTimeMinutes: 8,
        baseIngredients: ['mozzarella', 'panure'],
        allergens: ['gluten', 'milk', 'eggs'],
        spicyLevel: 'mild',
        nutritionalInfo: {
          calories: 320,
          proteins: 15,
          carbs: 25,
          fats: 18,
          servingSize: '7 pièces'
        },
        extras: [],
        maxSauces: 1,
        isVegan: false,
        isVegetarian: true,
        isGlutenFree: false
      }
    ];

    // Insérer toutes les données
    const allFoods = [...pizzas, ...tacos, ...bowls, ...sandwiches, ...burgers, ...plats, ...paninis, ...texMex];
    await Food.insertMany(allFoods);
    console.log(`${allFoods.length} plats insérés`);

    // 9. BOISSONS
    const drinks = [
      {
        name: 'Coca-Cola',
        type: 'soda',
        brand: 'Coca-Cola',
        image: '/images/menu/drinks/coca-cola.jpg',
        available: true,
        nutritionalInfo: {
          calories: 140,
          sugar: 35,
          servingSize: 330
        },
        sizes: [
          { name: '33cl', price: 1.5, volume: '33cl', isDefault: true },
          { name: '1.5L', price: 2.9, volume: '1.5L', isDefault: false }
        ]
      },
      {
        name: 'Eau Minérale',
        type: 'water',
        brand: 'Evian',
        image: '/images/menu/drinks/eau.jpg',
        available: true,
        nutritionalInfo: {
          calories: 0,
          sugar: 0,
          servingSize: 500
        },
        sizes: [
          { name: '50cl', price: 1, volume: '50cl', isDefault: true }
        ]
      },
      {
        name: 'Energy Drink',