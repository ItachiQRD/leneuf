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
      const { customer, items, total, status, userId, deliveryAddress, paymentStatus, paymentMethod, notes, orderType } = req.body;
      
      // Pour pickup, customer peut être minimal (nom et téléphone suffisent)
      // Pour delivery, customer avec adresse est requis
      if (orderType === 'pickup') {
        // Pour pickup, vérifier au moins que customer existe avec nom et téléphone
        if (!customer || !customer.name || !customer.phone) {
          return res.status(400).json({ 
            error: 'Données de commande invalides',
            details: 'Pour une commande à emporter, le nom et le téléphone sont requis'
          });
        }
      } else {
        // Pour delivery, vérifier customer avec adresse
        if ((!customer && !userId) || (customer && !customer.address)) {
          return res.status(400).json({ 
            error: 'Données de commande invalides',
            details: 'Pour une livraison, une adresse est requise'
          });
        }
      }
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
          error: 'Données de commande invalides',
          details: 'Les articles sont requis'
        });
      }
      
      // Déterminer l'adresse selon le type de commande
      let finalDeliveryAddress;
      if (orderType === 'pickup') {
        // Pour les commandes à emporter, mettre "À emporter"
        finalDeliveryAddress = {
          street: 'À emporter',
          city: 'N/A', // Valeur par défaut pour satisfaire le modèle
          postalCode: 'N/A', // Valeur par défaut pour satisfaire le modèle
          complement: ''
        };
      } else if (customer && customer.address) {
        // Pour les livraisons, utiliser l'adresse du client
        finalDeliveryAddress = {
          street: customer.address,
          city: 'Ville', // À extraire de l'adresse si nécessaire
          postalCode: '00000', // À extraire de l'adresse si nécessaire
          complement: customer.deliveryInstructions || ''
        };
      } else {
        // Fallback
        finalDeliveryAddress = deliveryAddress || {
          street: 'Adresse par défaut',
          city: 'Ville',
          postalCode: '00000',
          complement: ''
        };
      }
      
      // Créer la commande avec validation
      const orderData = {
        userId: userId || null, // Optionnel pour les commandes sans compte
        customer: customer || null, // Nouveau format avec informations client
        orderType: orderType || 'delivery', // Type de commande
        items: items.map((item: any) => ({
          productId: item.productId || 'custom-product',
          productName: item.productName || 'Produit personnalisé',
          quantity: item.quantity || 1,
          price: item.price || 0,
          options: item.options || [],
          customIngredients: item.config || item.customIngredients || null
        })),
        total: total || 0,
        status: status || 'pending',
        deliveryAddress: finalDeliveryAddress,
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
