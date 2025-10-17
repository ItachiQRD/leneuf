import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Food from '@/models/Food';
import Drink from '@/models/Drink';
import Side from '@/models/Side';
import Dessert from '@/models/Dessert';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { category } = req.query;

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ message: 'Category is required' });
    }

    let products = [];

    switch (category) {
      case 'burgers':
        products = await Food.find({ 
          type: 'burger',
          available: true,
          active: true 
        }).select('name price image description category type baseIngredients nutritionalInfo');
        break;

      case 'sandwichs':
        products = await Food.find({ 
          type: 'sandwich_durum',
          available: true,
          active: true 
        }).select('name price image description category type baseIngredients nutritionalInfo');
        break;

      case 'pizzas':
        products = await Food.find({ 
          type: 'pizza',
          available: true,
          active: true 
        }).select('name price image description category type baseIngredients nutritionalInfo');
        break;

      case 'assiettes':
        products = await Food.find({ 
          $or: [
            { type: 'plates' },
            { type: 'salad' }
          ],
          available: true,
          active: true 
        }).select('name price image description category type baseIngredients nutritionalInfo');
        break;

      case 'accompagnements':
        products = await Side.find({ 
          available: true,
          active: true 
        }).select('name price image description category nutritionalInfo');
        break;

      case 'tacos':
        // Pour les tacos, on retourne les options de base
        products = [
          {
            _id: 'tacos-base',
            name: 'Tacos',
            type: 'tacos',
            category: 'tacos',
            description: 'Composez votre tacos',
            customizable: true
          },
          {
            _id: 'bowl-base',
            name: 'Bowl',
            type: 'bowl',
            category: 'tacos',
            description: 'Composez votre bowl',
            customizable: true
          }
        ];
        break;

      case 'paninis':
        products = await Food.find({ 
          type: 'paninis',
          available: true,
          active: true 
        }).select('name price image description category type baseIngredients nutritionalInfo');
        break;

      case 'boissons':
        products = await Drink.find({ 
          available: true,
          active: true 
        }).select('name price image description category nutritionalInfo sizes type brand');
        break;

      case 'desserts':
        products = await Dessert.find({ 
          available: true,
          active: true 
        }).select('name price image description category nutritionalInfo');
        break;

      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    // Ajouter le type de produit pour le frontend et formater les prix
    const productsWithType = products.map(product => {
      const productObj = product.toObject ? product.toObject() : product;
      
      // Pour les boissons, ajouter un prix de base si pas défini
      if (category === 'boissons' && (!productObj.price || productObj.price === 0)) {
        productObj.price = productObj.sizes?.[0]?.price || 0;
      }
      
      return {
        ...productObj,
        productType: getProductType(category)
      };
    });

    res.status(200).json({
      success: true,
      products: productsWithType
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function getProductType(category: string): string {
  switch (category) {
    case 'burgers':
    case 'sandwichs':
    case 'pizzas':
    case 'assiettes':
    case 'paninis':
      return 'food';
    case 'accompagnements':
      return 'side';
    case 'boissons':
      return 'drink';
    case 'desserts':
      return 'dessert';
    case 'tacos':
      return 'customizable';
    default:
      return 'food';
  }
}
