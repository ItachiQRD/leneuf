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
      const order = new Order(req.body);
      const savedOrder = await order.save();
      console.log('Order saved successfully:', savedOrder._id);
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', error.message);
      res.status(500).json({ 
        error: 'Failed to create order',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
