import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'menu' | 'combo';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  applicableProducts: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  image?: string;
}

const PROMOTIONS_FILE = path.join(process.cwd(), 'data', 'promotions.json');

// Données par défaut
const defaultPromotions: Promotion[] = [
  {
    id: '1',
    name: '2 Pizzas Seniors = 3ème Offerte',
    description: 'Achetez 2 pizzas seniors et obtenez la 3ème gratuite',
    type: 'combo',
    value: 0,
    applicableProducts: ['pizzas'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 100,
    usedCount: 45,
    image: '/images/promotions/pizza-senior.jpg'
  },
  {
    id: '2',
    name: '2 Pizzas Mégas = 3ème Offerte',
    description: 'Achetez 2 pizzas mégas et obtenez la 3ème gratuite',
    type: 'combo',
    value: 0,
    applicableProducts: ['pizzas'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 100,
    usedCount: 32,
    image: '/images/promotions/pizza-mega.jpg'
  },
  {
    id: '3',
    name: 'Menu Senior - 25€',
    description: '2 pizzas seniors + 1 boisson 1.5L',
    type: 'menu',
    value: 25,
    applicableProducts: ['pizzas', 'boissons'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 200,
    usedCount: 78,
    image: '/images/promotions/menu-senior.jpg'
  },
  {
    id: '4',
    name: 'Menu Trio - 25€',
    description: '3 pizzas juniors + 1 boisson 1.5L',
    type: 'menu',
    value: 25,
    applicableProducts: ['pizzas', 'boissons'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 150,
    usedCount: 56,
    image: '/images/promotions/menu-trio.jpg'
  },
  {
    id: '5',
    name: 'Menu Couple - 19€',
    description: '1 pizza sénior + 6 nuggets/ailes + 2 boissons 33cl + 2 brownies',
    type: 'menu',
    value: 19,
    applicableProducts: ['pizzas', 'accompagnements', 'boissons', 'desserts'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 100,
    usedCount: 23,
    image: '/images/promotions/menu-couple.jpg'
  },
  {
    id: '6',
    name: 'Menu Famille - 34€',
    description: '2 pizzas mégas + 1 boisson 1.5L',
    type: 'menu',
    value: 34,
    applicableProducts: ['pizzas', 'boissons'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 80,
    usedCount: 34,
    image: '/images/promotions/menu-famille.jpg'
  },
  {
    id: '7',
    name: 'Menu Le Neuf - 34€',
    description: '4 pizzas juniors + 1 boisson 1.5L',
    type: 'menu',
    value: 34,
    applicableProducts: ['pizzas', 'boissons'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 60,
    usedCount: 12,
    image: '/images/promotions/menu-le-neuf.jpg'
  },
  {
    id: '8',
    name: 'Menu Top - 51€',
    description: '5 pizzas séniors + 2 boissons 1.5L',
    type: 'menu',
    value: 51,
    applicableProducts: ['pizzas', 'boissons'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 40,
    usedCount: 8,
    image: '/images/promotions/menu-top.jpg'
  },
  {
    id: '9',
    name: 'Livraison Gratuite',
    description: 'Livraison gratuite pour toute commande supérieure à 25€',
    type: 'fixed',
    value: 0,
    minOrder: 25,
    applicableProducts: ['all'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 1000,
    usedCount: 234,
    image: '/images/promotions/livraison-gratuite.jpg'
  },
  {
    id: '10',
    name: 'Réduction 10%',
    description: '10% de réduction sur votre première commande',
    type: 'percentage',
    value: 10,
    maxDiscount: 15,
    applicableProducts: ['all'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usageLimit: 500,
    usedCount: 89,
    image: '/images/promotions/reduction-10.jpg'
  }
];

function loadPromotions(): Promotion[] {
  try {
    if (fs.existsSync(PROMOTIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROMOTIONS_FILE, 'utf8'));
      return data.promotions || defaultPromotions;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des promotions:', error);
  }
  return defaultPromotions;
}

function savePromotions(promotions: Promotion[]): void {
  try {
    const dataDir = path.dirname(PROMOTIONS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(PROMOTIONS_FILE, JSON.stringify({ promotions }, null, 2));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des promotions:', error);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const promotions = loadPromotions();
      res.status(200).json({ promotions });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors du chargement des promotions' });
    }
  } else if (req.method === 'POST') {
    try {
      const promotions = loadPromotions();
      const newPromotion: Promotion = {
        id: Date.now().toString(),
        ...req.body,
        usedCount: 0
      };
      promotions.push(newPromotion);
      savePromotions(promotions);
      res.status(201).json({ promotion: newPromotion });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de la promotion' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      const promotions = loadPromotions();
      const index = promotions.findIndex(p => p.id === id);
      
      if (index === -1) {
        return res.status(404).json({ message: 'Promotion non trouvée' });
      }
      
      promotions[index] = { ...promotions[index], ...updateData };
      savePromotions(promotions);
      res.status(200).json({ promotion: promotions[index] });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la promotion' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const promotions = loadPromotions();
      const filteredPromotions = promotions.filter(p => p.id !== id);
      
      if (filteredPromotions.length === promotions.length) {
        return res.status(404).json({ message: 'Promotion non trouvée' });
      }
      
      savePromotions(filteredPromotions);
      res.status(200).json({ message: 'Promotion supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la promotion' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
