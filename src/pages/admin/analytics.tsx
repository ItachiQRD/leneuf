import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Star,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7j');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Erreur analytics:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const stats = analyticsData ? [
    {
      title: "Revenus totaux",
      value: `${analyticsData.totalRevenue.toFixed(2)}€`,
      change: "+15.3%",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      title: "Commandes",
      value: analyticsData.totalOrders.toString(),
      change: "+8.2%",
      changeType: "positive",
      icon: ShoppingBag,
    },
    {
      title: "Panier moyen",
      value: `${analyticsData.averageOrderValue.toFixed(2)}€`,
      change: "+3.1%",
      changeType: "positive",
      icon: TrendingUp,
    },
    {
      title: "Clients uniques",
      value: analyticsData.uniqueCustomers.toString(),
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
    },
  ] : [];

  const topProducts = analyticsData?.topProducts || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Aucune donnée disponible</p>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">Analyse détaillée des performances</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* Filtre de période */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="24h">24h</option>
                  <option value="7j">7 jours</option>
                  <option value="30j">30 jours</option>
                  <option value="90j">90 jours</option>
                </select>
              </div>
              {/* Bouton d'export */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                      <span className={`ml-2 text-sm flex items-center ${
                        stat.changeType === 'positive' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
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

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ventes hebdomadaires */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Ventes hebdomadaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'ventes' ? `${value}€` : value,
                        name === 'ventes' ? 'Ventes' : 'Commandes'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventes" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Produits populaires */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.productData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value}`, 'Ventes']} />
                    <Bar dataKey="ventes" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques secondaires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Répartition par catégorie */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Répartition par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Part']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Commandes par heure */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Commandes par heure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="heure" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, 'Commandes']} />
                    <Line 
                      type="monotone" 
                      dataKey="commandes" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top produits */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Top 5 produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.ventes} ventes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{product.revenus}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau détaillé des ventes */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Détail des ventes par produit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Produit</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Ventes</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Revenus</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Panier moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.productData.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{product.ventes}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{product.revenus}€</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {(product.revenus / product.ventes).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

