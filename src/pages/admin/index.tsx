import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  BarChart,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Commandes du jour",
      value: "12",
      change: "+8%",
      icon: ShoppingBag,
    },
    {
      title: "Revenu du jour",
      value: "485€",
      change: "+12%",
      icon: DollarSign,
    },
    {
      title: "Produits actifs",
      value: "45",
      change: "+2",
      icon: Package,
    },
    {
      title: "Clients actifs",
      value: "126",
      change: "+15%",
      icon: Users,
    },
  ];

  return (
    <div className="container mx-auto px-4 p-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Ventes hebdomadaires</h2>
          <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
            <BarChart className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Graphique des ventes</span>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Produits populaires</h2>
          <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
            <TrendingUp className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Graphique des produits</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
