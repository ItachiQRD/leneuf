import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit3, 
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Package,
  Phone,
  MessageSquare,
  Printer,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { OrderTicket } from '@/components/admin/OrderTicket';

// Fonction utilitaire pour formater les noms de produits
const formatProductName = (item: any) => {
  if (item.productName && item.productName !== 'Produit personnalisé') {
    return item.productName;
  }
  
  // Pour les produits personnalisés, créer un nom basé sur les options
  if (item.options && item.options.length > 0) {
    const mainOption = item.options.find((opt: any) => 
      opt.name === 'Viandes' || opt.name === 'Ingrédients de base'
    );
    if (mainOption) {
      return `${mainOption.choice.name} (Personnalisé)`;
    }
  }
  
  return 'Produit personnalisé';
};

// Fonction utilitaire pour formater les options
const formatOptionName = (option: any) => {
  const nameMap: { [key: string]: string } = {
    'Viandes': 'Viandes',
    'Sauces': 'Sauces',
    'Suppléments': 'Suppléments',
    'Ingrédients de base': 'Ingrédients',
    'Accompagnement': 'Accompagnement',
    'Boisson': 'Boisson'
  };
  
  return nameMap[option.name] || option.name;
};

interface Order {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  customer?: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: 'card' | 'cash';
    deliveryInstructions?: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    options?: Array<{
      name: string;
      choice: {
        name: string;
        price: number;
      };
    }>;
    customIngredients?: any;
  }>;
  total: number;
  promotionDiscount?: number;
  promotionDescription?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    complement?: string;
  };
  deliveryTime?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'card' | 'cash';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  pending: { 
    label: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock 
  },
  processing: { 
    label: 'En cours', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Package 
  },
  completed: { 
    label: 'Terminée', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle 
  },
  cancelled: { 
    label: 'Annulée', 
    color: 'bg-red-100 text-red-800', 
    icon: XCircle 
  }
};

const paymentStatusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Payée', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Échouée', color: 'bg-red-100 text-red-800' }
};

export default function AdminOrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination.total);
      } else {
        setError(data.message || 'Erreur lors du chargement des commandes');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled', notes?: string) => {
    try {
      setUpdating(true);
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          notes
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus, notes: notes || order.notes }
              : order
          )
        );
        setShowOrderModal(false);
        setSelectedOrder(null);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error updating order:', err);
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        setShowOrderModal(false);
        setSelectedOrder(null);
      } else {
        setError(data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la commande');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.userId?.name || order.customer?.name || '';
    const customerContact = order.userId?.email || order.customer?.phone || '';
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return <Icon className="w-4 h-4" />;
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des commandes</h1>
          <p className="mt-2 text-gray-600">
            Gérez et suivez toutes les commandes de vos clients
          </p>
        </div>

        {/* Filtres et recherche - Desktop */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, email ou ID de commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'pending', label: 'En attente' },
                  { value: 'processing', label: 'En cours' },
                  { value: 'completed', label: 'Terminées' },
                  { value: 'cancelled', label: 'Annulées' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Filtres et recherche - Mobile optimisé */}
        <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher une commande
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par statut
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'pending', label: 'En attente' },
                  { value: 'processing', label: 'En cours' },
                  { value: 'completed', label: 'Terminées' },
                  { value: 'cancelled', label: 'Annulées' }
                ]}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Liste des commandes - Desktop */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchOrders} className="mt-4">
                Réessayer
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const orderStatusConfig = statusConfig[order.status as keyof typeof statusConfig];
                    const paymentConfig = paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig];
                    
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.userId?.name || order.customer?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.userId?.email || order.customer?.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={orderStatusConfig.color}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{orderStatusConfig.label}</span>
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.total.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowTicket(true);
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Printer className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteOrder(order._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Liste des commandes - Mobile */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchOrders} className="mt-4">
                Réessayer
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const orderStatusConfig = statusConfig[order.status as keyof typeof statusConfig];
              const paymentConfig = paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig];
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {order.total.toFixed(2)} €
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Informations client simplifiées - Optimisé mobile */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <span className="font-semibold text-gray-900 text-base">
                          {order.userId?.name || order.customer?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {order.userId?.phone || order.customer?.phone || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* Statuts - Optimisé pour mobile */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${orderStatusConfig.color} px-3 py-1 text-sm font-medium`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{orderStatusConfig.label}</span>
                      </Badge>
                      <Badge className={`${paymentConfig.color} px-3 py-1 text-sm font-medium`}>
                        {paymentConfig.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions - Optimisé pour mobile */}
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="w-full flex items-center justify-center py-2 px-3 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowTicket(true);
                        }}
                        className="w-full flex items-center justify-center py-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteOrder(order._id)}
                        className="w-full flex items-center justify-center py-2 px-3 text-sm font-medium text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination - Optimisé pour mobile */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-700 font-medium">
                Page {currentPage} sur {totalPages} ({orders.length} commandes)
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex-1 sm:flex-none px-4 py-2"
                >
                  ← Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex-1 sm:flex-none px-4 py-2"
                >
                  Suivant →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détail de commande */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            isOpen={showOrderModal}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
            onUpdateStatus={updateOrderStatus}
            updating={updating}
          />
        )}

        {/* Modal d'impression de ticket */}
        {selectedOrder && showTicket && (
          <OrderTicket
            order={selectedOrder}
            onClose={() => {
              setShowTicket(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Composant modal pour les détails de commande
function OrderDetailModal({ 
  order, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  updating 
}: {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled', notes?: string) => void;
  updating: boolean;
}) {
  const [newStatus, setNewStatus] = useState<'pending' | 'processing' | 'completed' | 'cancelled'>(order.status);
  const [notes, setNotes] = useState(order.notes || '');

  const handleUpdate = () => {
    onUpdateStatus(order._id, newStatus, notes);
  };

  // Fonction pour afficher les customIngredients de manière simplifiée
  const renderCustomIngredients = (customIngredients: any) => {
    if (!customIngredients) return null;

    const details = [];

    // Informations de base pour burgers/sandwichs
    if (customIngredients.menuOption) {
      details.push(`Menu: ${customIngredients.menuOption}`);
    }

    if (customIngredients.breadType) {
      details.push(`Type: pain`);
      details.push(`Classic: ${customIngredients.breadType}`);
    }

    if (customIngredients.vegetables && customIngredients.vegetables.length > 0) {
      details.push(`Crudités: ${customIngredients.vegetables.join(', ')}`);
    }

    if (customIngredients.withFries !== undefined) {
      details.push(`Frites: ${customIngredients.withFries ? 'Oui' : 'Non'}`);
    }

    if (customIngredients.drink) {
      const drinkName = typeof customIngredients.drink === 'string' ? customIngredients.drink : customIngredients.drink.name;
      details.push(`Boisson: ${drinkName}`);
    }

    // Informations pour tacos/paninis
    if (customIngredients.baseIngredients && customIngredients.baseIngredients.length > 0) {
      details.push(`Base: ${customIngredients.baseIngredients.map((ing: any) => ing.name).join(', ')}`);
    }

    if (customIngredients.supplements && customIngredients.supplements.length > 0) {
      details.push(`Suppléments: ${customIngredients.supplements.map((sup: any) => sup.name).join(', ')}`);
    }

    if (customIngredients.sauces && customIngredients.sauces.length > 0) {
      details.push(`Sauces: ${customIngredients.sauces.map((sauce: any) => sauce.name).join(', ')}`);
    }

    if (customIngredients.meats && customIngredients.meats.length > 0) {
      details.push(`Viandes: ${customIngredients.meats.map((meat: any) => meat.name).join(', ')}`);
    }

    if (customIngredients.ingredients && customIngredients.ingredients.length > 0) {
      details.push(`Ingrédients: ${customIngredients.ingredients.map((ing: any) => ing.name).join(', ')}`);
    }

    if (customIngredients.size) {
      details.push(`Taille: ${customIngredients.size}`);
    }

    // Gestion des sauces (une seule fois, à la fin)
    if (customIngredients.sauce) {
      const sauceName = typeof customIngredients.sauce === 'string' ? customIngredients.sauce : customIngredients.sauce.name;
      details.push(`Sauce: ${sauceName}`);
    }

    if (customIngredients.type) {
      details.push(`Type: ${customIngredients.type}`);
    }

    return details.length > 0 ? details : null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Commande #${order._id.slice(-8)}`}>
      <div className="space-y-6">
        {/* Articles commandés - EN HAUT */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Articles commandés</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => {
              const customSections = renderCustomIngredients(item.customIngredients);
              
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {/* En-tête de l'article */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg mb-1">
                        {formatProductName(item)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Quantité: {item.quantity} × {item.price.toFixed(2)} €
                      </div>
                    </div>
                    <div className="font-bold text-xl text-gray-900">
                      {(item.quantity * item.price).toFixed(2)} €
                    </div>
                  </div>
                  
                  {/* Options du produit (ancien système) */}
                  {item.options && item.options.length > 0 && (
                    <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Personnalisations :
                      </div>
                      <div className="space-y-1">
                        {item.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600 font-medium">{formatOptionName(option)}:</span>
                              <span className="font-medium text-gray-900">{option.choice.name}</span>
                            </div>
                            {option.choice.price > 0 && (
                              <span className="text-gray-600 font-medium">+{option.choice.price.toFixed(2)} €</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Ingredients (nouveau système) - Affichage vertical */}
                  {customSections && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                      <div className="text-gray-700 space-y-1">
                        {customSections.map((detail, detailIndex) => (
                          <div key={detailIndex}>
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Promotion */}
            {order.promotionDiscount && order.promotionDiscount > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-800">
                    Remise ({order.promotionDescription || 'Promotion'}):
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    -{order.promotionDiscount.toFixed(2)} €
                  </span>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
              <div className="flex justify-between items-center font-bold text-xl">
                <span className="text-gray-900">Total de la commande</span>
                <span className="text-red-600">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paiement */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Paiement
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Méthode:</span>
              <span className="font-medium text-gray-900">
                {order.paymentMethod === 'card' ? 'Carte bancaire' : 
                 order.paymentMethod === 'cash' ? 'Espèces' : 
                 order.paymentMethod || 'Non spécifié'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Statut:</span>
              <Badge className={
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {order.paymentStatus === 'paid' ? 'Payé' :
                 order.paymentStatus === 'pending' ? 'En attente' :
                 order.paymentStatus === 'failed' ? 'Échec' : 'Inconnu'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informations client
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <span className="font-medium text-gray-900">
                  {order.userId?.name || order.customer?.name || 'N/A'}
                </span>
                {order.userId?.email && (
                  <div className="text-sm text-gray-600">
                    {order.userId.email}
                  </div>
                )}
              </div>
            </div>
            
            {(order.userId?.phone || order.customer?.phone) && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">
                  {order.userId?.phone || order.customer?.phone}
                </span>
              </div>
            )}

            {/* Adresse de livraison */}
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-gray-700">Adresse de livraison:</span>
                <div className="text-sm text-gray-600 mt-1">
                  <div className="font-medium">
                    {order.deliveryAddress.street}
                    {order.deliveryAddress.postalCode && order.deliveryAddress.city && 
                      order.deliveryAddress.postalCode !== '00000' && 
                      `, ${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}`
                    }
                  </div>
                  {order.deliveryAddress.complement && (
                    <div className="italic mt-1">{order.deliveryAddress.complement}</div>
                  )}
                </div>
              </div>
            </div>
            
            {order.customer?.deliveryInstructions && (
              <div className="flex items-start">
                <MessageSquare className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Instructions de livraison:</span>
                  <div className="text-sm text-gray-600 mt-1">
                    {order.customer.deliveryInstructions}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Mise à jour du statut */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Mise à jour du statut</h3>
          <div className="space-y-4">
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'pending' | 'processing' | 'completed' | 'cancelled')}
              options={[
                { value: 'pending', label: 'En attente' },
                { value: 'processing', label: 'En cours' },
                { value: 'completed', label: 'Terminée' },
                { value: 'cancelled', label: 'Annulée' }
              ]}
            />
            
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={updating || newStatus === order.status}
          >
            {updating ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

