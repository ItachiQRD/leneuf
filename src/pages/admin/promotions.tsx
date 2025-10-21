import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Plus,
  Edit,
  Trash2,
  Percent,
  Gift,
  Calendar,
  Clock,
  Users,
  Pizza,
  ShoppingBag
} from 'lucide-react';

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

const mockPromotions: Promotion[] = [
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

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4" />;
      case 'fixed': return <Gift className="h-4 w-4" />;
      case 'menu': return <Pizza className="h-4 w-4" />;
      case 'combo': return <ShoppingBag className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-800';
      case 'fixed': return 'bg-green-100 text-green-800';
      case 'menu': return 'bg-orange-100 text-orange-800';
      case 'combo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return promotion.value === 0 ? 'Gratuit' : `${promotion.value}€`;
      case 'menu':
      case 'combo':
        return `${promotion.value}€`;
      default:
        return promotion.value.toString();
    }
  };

  const handleToggleActive = (id: string) => {
    setPromotions(prev => 
      prev.map(promo => 
        promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setPromotions(prev => prev.filter(promo => promo.id !== id));
    }
  };

  const stats = [
    {
      title: "Promotions actives",
      value: promotions.filter(p => p.isActive).length.toString(),
      icon: Gift,
      color: "text-green-600"
    },
    {
      title: "Utilisations totales",
      value: promotions.reduce((sum, p) => sum + p.usedCount, 0).toString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Promotions expirées",
      value: promotions.filter(p => new Date(p.endDate) < new Date()).length.toString(),
      icon: Calendar,
      color: "text-red-600"
    },
    {
      title: "Taux d'utilisation",
      value: `${Math.round((promotions.reduce((sum, p) => sum + p.usedCount, 0) / promotions.reduce((sum, p) => sum + (p.usageLimit || 0), 0)) * 100)}%`,
      icon: Percent,
      color: "text-purple-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Promotions</h1>
              <p className="text-gray-600 dark:text-gray-400">Gérez vos offres et promotions</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle promotion</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Promotions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="overflow-hidden">
              <div className="relative">
                {promotion.image && (
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Pizza className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(promotion.type)}`}>
                    {getTypeIcon(promotion.type)}
                    <span className="ml-1 capitalize">{promotion.type}</span>
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {promotion.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {promotion.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {promotion.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">
                      {formatValue(promotion)}
                    </span>
                    <span className="text-gray-500">
                      {promotion.usedCount}/{promotion.usageLimit || '∞'} utilisations
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Du {new Date(promotion.startDate).toLocaleDateString('fr-FR')} au {new Date(promotion.endDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {promotion.minOrder && (
                    <div className="flex items-center text-xs text-gray-500">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      <span>Commande min: {promotion.minOrder}€</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPromotion(promotion)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleActive(promotion.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      promotion.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {promotion.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
