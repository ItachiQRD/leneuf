import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mode développement sans base de données
  if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
    console.log('Mode développement sans base de données - simulation de commande');
    
    if (req.method === 'GET') {
      return res.status(200).json([]);
    } else if (req.method === 'POST') {
      console.log('Order data received (simulation):', JSON.stringify(req.body, null, 2));
      const mockOrder = {
        _id: 'mock-order-' + Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Order simulated successfully:', mockOrder._id);
      return res.status(201).json(mockOrder);
    }
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      error: 'Erreur de connexion à la base de données',
      message: 'MongoDB non configuré'
    });
  }

  if (req.method === 'GET') {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else if (req.method === 'POST') {
    try {
      console.log('Order data received:', JSON.stringify(req.body, null, 2));
      
      // Valider les données de la commande
      const { customer, items, total, status, userId, deliveryAddress, paymentStatus, paymentMethod, notes } = req.body;
      
      if ((!customer && !userId) || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
          error: 'Données de commande invalides',
          details: 'customer (ou userId) et items sont requis'
        });
      }
      
      // Fonction pour extraire les informations d'adresse
      const parseAddress = (addressString: string) => {
        if (!addressString) return { street: 'Adresse non fournie', city: 'Ville', postalCode: '00000' };
        
        // Essayer d'extraire le code postal et la ville
        const postalCodeMatch = addressString.match(/(\d{5})\s+([^,]+)/);
        if (postalCodeMatch) {
          return {
            street: addressString.replace(/\d{5}\s+[^,]+/, '').trim().replace(/,$/, ''),
            postalCode: postalCodeMatch[1],
            city: postalCodeMatch[2].trim()
          };
        }
        
        // Si pas de code postal trouvé, retourner l'adresse complète comme rue
        return {
          street: addressString,
          city: 'Ville',
          postalCode: '00000'
        };
      };

      // Créer la commande avec validation
      const orderData = {
        userId: userId || null, // Optionnel pour les commandes sans compte
        customer: customer || null, // Nouveau format avec informations client
        items: items.map((item: any) => ({
          productId: item.productId || 'custom-product',
          productName: item.productName || 'Produit personnalisé',
          quantity: item.quantity || 1,
          price: item.price || 0,
          options: item.options || [],
          customIngredients: item.customIngredients || null
        })),
        total: total || 0,
        status: status || 'pending',
        deliveryAddress: customer ? {
          ...parseAddress(customer.address),
          complement: customer.deliveryInstructions || ''
        } : (deliveryAddress || {
          street: 'Adresse par défaut',
          city: 'Ville',
          postalCode: '00000',
          complement: ''
        }),
        paymentStatus: paymentStatus || 'pending',
        paymentMethod: customer ? customer.paymentMethod : (paymentMethod || 'cash'),
        notes: customer ? customer.deliveryInstructions : (notes || '')
      };
      
      const order = new Order(orderData);
      const savedOrder = await order.save();
      console.log('Order saved successfully:', savedOrder._id);
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      res.status(500).json({ 
        error: 'Failed to create order',
        details: errorMessage 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
