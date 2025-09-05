import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';

// Données de test temporaires
const mockFoods = {
  burger: [
    {
      _id: '1',
      name: 'Classic Burger',
      description: 'Notre burger signature avec steak haché frais',
      type: 'burger',
      price: 8.90,
      image: '/images/menu/burgers/classic.jpg',
      category: 'classic',
      preparationTimeMinutes: 15,
      isVegetarian: false,
      spicyLevel: 'none',
      allergens: ['gluten', 'milk'],
      active: true,
      available: true,
    },
    {
      _id: '2',
      name: 'Cheese Burger',
      description: 'Délicieux burger avec fromage fondu',
      type: 'burger',
      price: 9.90,
      image: '/images/menu/burgers/cheese.jpg',
      category: 'classic',
      preparationTimeMinutes: 15,
      isVegetarian: false,
      spicyLevel: 'none',
      allergens: ['gluten', 'milk'],
      active: true,
      available: true,
    }
  ],
  pizza: [
    {
      _id: '3',
      name: 'Margherita',
      description: 'La classique italienne avec sauce tomate et mozzarella',
      type: 'pizza',
      price: 10.90,
      image: '/images/menu/pizzas/margherita.jpg',
      category: 'classique',
      preparationTimeMinutes: 20,
      isVegetarian: true,
      spicyLevel: 'none',
      allergens: ['gluten', 'milk'],
      active: true,
      available: true,
    },
    {
      _id: '4',
      name: 'Pepperoni',
      description: 'Pizza avec pepperoni et fromage',
      type: 'pizza',
      price: 12.90,
      image: '/images/menu/pizzas/pepperoni.jpg',
      category: 'classique',
      preparationTimeMinutes: 20,
      isVegetarian: false,
      spicyLevel: 'mild',
      allergens: ['gluten', 'milk'],
      active: true,
      available: true,
    }
  ]
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type } = req.query;
    console.log('Requested food type:', type);

    // Essayer d'abord de se connecter à la base de données
    try {
      console.log('Trying to connect to database...');
      await connectDB();
      console.log('Database connection successful');

      const query: any = {
        active: true,
        available: true,
      };

      if (type) {
        query.type = type;
      }

      const foods = await Food.find(query).lean();
      
      if (foods && foods.length > 0) {
        console.log(`Found ${foods.length} foods in database`);
        return res.status(200).json(foods);
      }
    } catch (dbError) {
      console.warn('Database connection failed, using mock data:', dbError);
    }

    // Si la base de données n'est pas accessible ou ne renvoie pas de données,
    // utiliser les données de test
    console.log('Using mock data');
    const mockData = type ? mockFoods[type as keyof typeof mockFoods] || [] : [];
    return res.status(200).json(mockData);

  } catch (error) {
    console.error('Error in foods API:', error);
    return res.status(500).json({
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
