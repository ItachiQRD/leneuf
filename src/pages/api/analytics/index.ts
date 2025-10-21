import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Order {
  _id: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    category?: string;
  }>;
  total: number;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
  };
  customer?: {
    name: string;
  };
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  salesData: Array<{
    name: string;
    ventes: number;
    commandes: number;
  }>;
  productData: Array<{
    name: string;
    ventes: number;
    revenus: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  hourlyData: Array<{
    heure: string;
    commandes: number;
  }>;
  topProducts: Array<{
    name: string;
    ventes: number;
    revenus: number;
  }>;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Lire les commandes depuis le fichier JSON
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    
    let orders: Order[] = [];
    
    if (fs.existsSync(ordersPath)) {
      const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
      orders = ordersData.orders || [];
    } else {
      // Données par défaut si le fichier n'existe pas
      orders = generateDefaultOrders();
    }

    // Calculer les statistiques
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Clients uniques
    const uniqueCustomers = new Set(
      orders.map(order => 
        order.userId?._id || order.customer?.name || 'anonymous'
      )
    ).size;

    // Données des ventes par jour (7 derniers jours)
    const salesData = generateSalesData(orders);
    
    // Données des produits
    const productData = generateProductData(orders);
    
    // Données par catégorie
    const categoryData = generateCategoryData(orders);
    
    // Données par heure
    const hourlyData = generateHourlyData(orders);
    
    // Top produits
    const topProducts = generateTopProducts(orders);

    const analyticsData: AnalyticsData = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      uniqueCustomers,
      salesData,
      productData,
      categoryData,
      hourlyData,
      topProducts
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function generateSalesData(orders: Order[]) {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === date.toDateString();
    });
    
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const dayName = dayNames[date.getDay()];
    
    last7Days.push({
      name: dayName,
      ventes: dayOrders.reduce((sum, order) => sum + order.total, 0),
      commandes: dayOrders.length
    });
  }
  
  return last7Days;
}

function generateProductData(orders: Order[]) {
  const productMap = new Map<string, { ventes: number; revenus: number }>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const existing = productMap.get(item.productName) || { ventes: 0, revenus: 0 };
      productMap.set(item.productName, {
        ventes: existing.ventes + item.quantity,
        revenus: existing.revenus + (item.quantity * item.price)
      });
    });
  });
  
  return Array.from(productMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.ventes - a.ventes)
    .slice(0, 7);
}

function generateCategoryData(orders: Order[]) {
  const categoryMap = new Map<string, number>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.category || 'Autres';
      categoryMap.set(category, (categoryMap.get(category) || 0) + (item.quantity * item.price));
    });
  });
  
  const total = Array.from(categoryMap.values()).reduce((sum, value) => sum + value, 0);
  
  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
      color: getCategoryColor(name)
    }))
    .sort((a, b) => b.value - a.value);
}

function generateHourlyData(orders: Order[]) {
  const hourlyMap = new Map<number, number>();
  
  orders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
  });
  
  const hourlyData = [];
  for (let hour = 12; hour <= 22; hour++) {
    hourlyData.push({
      heure: `${hour}h`,
      commandes: hourlyMap.get(hour) || 0
    });
  }
  
  return hourlyData;
}

function generateTopProducts(orders: Order[]) {
  const productMap = new Map<string, { ventes: number; revenus: number }>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const existing = productMap.get(item.productName) || { ventes: 0, revenus: 0 };
      productMap.set(item.productName, {
        ventes: existing.ventes + item.quantity,
        revenus: existing.revenus + (item.quantity * item.price)
      });
    });
  });
  
  return Array.from(productMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.ventes - a.ventes)
    .slice(0, 5);
}

function getCategoryColor(category: string): string {
  const colors = {
    'pizzas': '#8884d8',
    'burgers': '#82ca9d',
    'tacos': '#ffc658',
    'sandwichs': '#ff7c7c',
    'accompagnements': '#8dd1e1',
    'boissons': '#d084d0',
    'desserts': '#ffb347',
    'Autres': '#d3d3d3'
  };
  
  return colors[category as keyof typeof colors] || '#d3d3d3';
}

function generateDefaultOrders(): Order[] {
  const now = new Date();
  const orders: Order[] = [];
  
  // Générer des commandes des 7 derniers jours
  for (let i = 0; i < 20; i++) {
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 7));
    orderDate.setHours(12 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));
    
    const products = [
      { name: 'Kebab Classic', price: 6.50, category: 'sandwichs' },
      { name: 'Pizza Reine', price: 12.00, category: 'pizzas' },
      { name: 'Burger Royal', price: 8.50, category: 'burgers' },
      { name: 'Tacos 3 Viandes', price: 7.50, category: 'tacos' },
      { name: 'Frites', price: 2.50, category: 'accompagnements' },
      { name: 'Coca-Cola', price: 2.00, category: 'boissons' },
      { name: 'Brownie', price: 3.50, category: 'desserts' }
    ];
    
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, numItems);
    
    const items = selectedProducts.map(product => ({
      productName: product.name,
      quantity: Math.floor(Math.random() * 2) + 1,
      price: product.price,
      category: product.category
    }));
    
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    orders.push({
      _id: `order_${i + 1}`,
      items,
      total,
      createdAt: orderDate.toISOString(),
      userId: {
        _id: `user_${i + 1}`,
        name: `Client ${i + 1}`
      },
      deliveryAddress: {
        street: `${Math.floor(Math.random() * 100) + 1} Rue de la Paix`,
        city: 'Reims',
        postalCode: '51100',
        complement: ''
      },
      paymentMethod: Math.random() > 0.5 ? 'card' : 'cash',
      status: 'completed',
      paymentStatus: 'paid'
    });
  }
  
  return orders;
}
