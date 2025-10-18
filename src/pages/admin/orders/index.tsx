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

        {/* Filtres et recherche - Mobile */}
        <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {order.items.slice(0, 2).map(item => formatProductName(item)).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} autres`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.userId?.name || order.customer?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.userId ? 'Compte' : 'Invité'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.userId?.email || order.customer?.phone || 'N/A'}
                          </div>
                          {order.customer?.address && (
                            <div className="text-xs text-gray-500 truncate max-w-32">
                              {order.customer.address}
                            </div>
                          )}
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

                  {/* Informations client améliorées */}
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {order.userId?.name || order.customer?.name || 'N/A'}
                        </span>
                      </div>
                      {order.userId ? (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <User className="w-3 h-3 mr-1" />
                          Compte
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          <Package className="w-3 h-3 mr-1" />
                          Invité
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong>Contact:</strong> {order.userId?.email || order.customer?.phone || 'N/A'}
                      </p>
                      {order.customer?.address && (
                        <p className="text-sm text-gray-600">
                          <strong>Adresse:</strong> {order.customer.address}
                        </p>
                      )}
                      {order.customer?.deliveryInstructions && (
                        <p className="text-sm text-gray-600">
                          <strong>Instructions:</strong> {order.customer.deliveryInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Articles commandés */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Articles commandés:</p>
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.quantity}x {formatProductName(item)}
                          </span>
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{order.items.length - 3} autres articles
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-2">
                      <Badge className={orderStatusConfig.color}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{orderStatusConfig.label}</span>
                      </Badge>
                      <Badge className={paymentConfig.color}>
                        {paymentConfig.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="flex-1"
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
                        className="flex-1 text-blue-600 hover:text-blue-700"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteOrder(order._id)}
                        className="flex-1 text-red-600 hover:text-red-700"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto"
              >
                Suivant
              </Button>
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

  // Fonction pour afficher les customIngredients de manière structurée
  const renderCustomIngredients = (customIngredients: any) => {
    if (!customIngredients) return null;

    const sections = [];

    // Informations de base pour burgers/sandwichs
    if (customIngredients.menuOption) {
      sections.push({
        title: 'Menu',
        content: customIngredients.menuOption
      });
    }

    if (customIngredients.breadType) {
      sections.push({
        title: 'Pain',
        content: customIngredients.breadType
      });
    }

    if (customIngredients.vegetables && customIngredients.vegetables.length > 0) {
      sections.push({
        title: 'Crudités',
        content: customIngredients.vegetables.join(', ')
      });
    }

    if (customIngredients.withFries !== undefined) {
      sections.push({
        title: 'Frites',
        content: customIngredients.withFries ? 'Oui' : 'Non'
      });
    }

    if (customIngredients.sauce) {
      sections.push({
        title: 'Sauce',
        content: typeof customIngredients.sauce === 'string' ? customIngredients.sauce : customIngredients.sauce.name
      });
    }

    if (customIngredients.drink) {
      sections.push({
        title: 'Boisson',
        content: typeof customIngredients.drink === 'string' ? customIngredients.drink : customIngredients.drink.name
      });
    }

    // Informations pour tacos/paninis
    if (customIngredients.baseIngredients && customIngredients.baseIngredients.length > 0) {
      sections.push({
        title: 'Ingrédients de base',
        content: customIngredients.baseIngredients.map((ing: any) => ing.name).join(', ')
      });
    }

    if (customIngredients.supplements && customIngredients.supplements.length > 0) {
      sections.push({
        title: 'Suppléments',
        content: customIngredients.supplements.map((sup: any) => sup.name).join(', ')
      });
    }

    if (customIngredients.sauces && customIngredients.sauces.length > 0) {
      sections.push({
        title: 'Sauces',
        content: customIngredients.sauces.map((sauce: any) => sauce.name).join(', ')
      });
    }

    if (customIngredients.meats && customIngredients.meats.length > 0) {
      sections.push({
        title: 'Viandes',
        content: customIngredients.meats.map((meat: any) => meat.name).join(', ')
      });
    }

    if (customIngredients.ingredients && customIngredients.ingredients.length > 0) {
      sections.push({
        title: 'Ingrédients',
        content: customIngredients.ingredients.map((ing: any) => ing.name).join(', ')
      });
    }

    if (customIngredients.size) {
      sections.push({
        title: 'Taille',
        content: customIngredients.size
      });
    }

    if (customIngredients.type) {
      sections.push({
        title: 'Type',
        content: customIngredients.type
      });
    }

    if (customIngredients.quantity) {
      sections.push({
        title: 'Quantité',
        content: customIngredients.quantity.toString()
      });
    }

    return sections.length > 0 ? sections : null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Commande #${order._id.slice(-8)}`}>
      <div className="space-y-6">
        {/* Informations client */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Informations client</h3>
            {order.userId ? (
              <Badge className="bg-blue-100 text-blue-800">
                <User className="w-3 h-3 mr-1" />
                Compte utilisateur
              </Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-800">
                <Package className="w-3 h-3 mr-1" />
                Commande invité
              </Badge>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <span className="font-medium text-gray-900">
                  {order.userId?.name || order.customer?.name || 'N/A'}
                </span>
                <div className="text-sm text-gray-600">
                  {order.userId?.email || order.customer?.phone || 'N/A'}
                </div>
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

        {/* Informations de livraison et paiement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Adresse de livraison */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Adresse de livraison
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{order.deliveryAddress.street}</div>
                <div className="text-gray-600">{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</div>
                {order.deliveryAddress.complement && (
                  <div className="text-sm text-gray-600 italic">{order.deliveryAddress.complement}</div>
                )}
              </div>
            </div>
          </div>

          {/* Informations de paiement */}
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
        </div>

        {/* Informations de la commande */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Informations de la commande
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date de commande:</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Statut actuel:</span>
                <Badge className={
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {order.status === 'pending' ? 'En attente' :
                   order.status === 'processing' ? 'En cours' :
                   order.status === 'completed' ? 'Terminée' :
                   order.status === 'cancelled' ? 'Annulée' : order.status}
                </Badge>
              </div>
              {order.deliveryTime && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Heure de livraison:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.deliveryTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg text-red-600">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles commandés */}
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

                  {/* Custom Ingredients (nouveau système) */}
                  {customSections && (
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Détails de la personnalisation :
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {customSections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="flex items-center text-sm">
                            <span className="text-gray-600 font-medium min-w-0 flex-shrink-0 mr-2">
                              {section.title}:
                            </span>
                            <span className="font-medium text-gray-900 truncate">
                              {section.content}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Total */}
            <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
              <div className="flex justify-between items-center font-bold text-xl">
                <span className="text-gray-900">Total de la commande</span>
                <span className="text-red-600">{order.total.toFixed(2)} €</span>
              </div>
            </div>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Ajoutez des notes pour cette commande..."
              />
            </div>
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

