import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';

interface TexMexIngredient {
  _id: string;
  name: string;
  image: string;
  type: string;
  price: number;
}

// Ingrédients TexMex par défaut
const defaultTexMexIngredients: TexMexIngredient[] = [
  {
    _id: 'texmex-1',
    name: 'Nuggets',
    image: '/images/ingredients/nuggets.jpg',
    type: 'texmex',
    price: 0
  },
  {
    _id: 'texmex-2',
    name: 'Tenders',
    image: '/images/ingredients/tenders.jpg',
    type: 'texmex',
    price: 0
  },
  {
    _id: 'texmex-3',
    name: 'Mozza Sticks',
    image: '/images/ingredients/mozza-sticks.jpg',
    type: 'texmex',
    price: 0
  },
  {
    _id: 'texmex-4',
    name: 'Hot Wings',
    image: '/images/ingredients/hot-wings.jpg',
    type: 'texmex',
    price: 0
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Récupérer les produits "ptite-faim" qui contiennent les ingrédients TexMex
    const ptiteFaimProducts = [
      {
        _id: 'ptite-faim-3-nuggets',
        name: '3 Nuggets',
        price: 2.5,
        image: '/images/ptite-faim/3-nuggets.jpeg',
        description: '3 Nuggets croustillants',
        category: 'ptite-faim',
        type: 'snack'
      },
      {
        _id: 'ptite-faim-3-hot-wings',
        name: '3 Hot Wings',
        price: 2.5,
        image: '/images/ptite-faim/3-hot-wings.jpeg',
        description: '3 Ailes de poulet épicées',
        category: 'ptite-faim',
        type: 'snack'
      },
      {
        _id: 'ptite-faim-2-tenders',
        name: '2 Tenders',
        price: 2.5,
        image: '/images/ptite-faim/2-tenders.jpeg',
        description: '2 Tenders de poulet',
        category: 'ptite-faim',
        type: 'snack'
      },
      {
        _id: 'ptite-faim-3-mozza-sticks',
        name: '3 Mozza Sticks',
        price: 2.5,
        image: '/images/ptite-faim/3-mozza-sticks.jpeg',
        description: '3 Bâtonnets de mozzarella',
        category: 'ptite-faim',
        type: 'snack'
      }
    ];

    // Mapper les produits ptite-faim vers le format TexMex
    const texMexIngredients: TexMexIngredient[] = ptiteFaimProducts.map(product => ({
      _id: product._id,
      name: product.name.replace(/^\d+\s+/, ''), // Enlever le nombre au début
      image: product.image,
      type: 'texmex',
      price: 0 // Prix gratuit car c'est un ingrédient de base
    }));

    res.status(200).json({ 
      success: true, 
      ingredients: texMexIngredients 
    });
  } catch (error) {
    console.error('Erreur lors du chargement des ingrédients TexMex:', error);
    // En cas d'erreur, retourner les ingrédients par défaut
    res.status(200).json({ 
      success: true, 
      ingredients: defaultTexMexIngredients 
    });
  }
}

