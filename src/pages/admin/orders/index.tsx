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
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

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
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      {/* Header mobile */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="p-4">
        {/* Filtres et recherche mobile */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
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

        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const orderStatusConfig = statusConfig[order.status as keyof typeof statusConfig];
                const paymentConfig = paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig];
                
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    {/* Header de la commande */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <Package className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {order.total.toFixed(2)} €
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Client */}
                    <div className="mb-3">
                      <div className="text-sm text-gray-900">{order.userId.name}</div>
                      <div className="text-xs text-gray-500">{order.userId.email}</div>
                    </div>

                    {/* Produits */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-400">
                        {order.items.slice(0, 2).map(item => formatProductName(item)).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} autres`}
                      </div>
                    </div>

                    {/* Statuts */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={orderStatusConfig.color}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{orderStatusConfig.label}</span>
                      </Badge>
                      <Badge className={paymentConfig.color}>
                        {paymentConfig.label}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir détails
                      </Button>
                      <Select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value as any)}
                        options={[
                          { value: 'pending', label: 'En attente' },
                          { value: 'processing', label: 'En cours' },
                          { value: 'completed', label: 'Terminée' },
                          { value: 'cancelled', label: 'Annulée' }
                        ]}
                        className="w-32 text-xs"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination mobile */}
        {totalPages > 1 && (
          <div className="mt-4">
            <div className="text-xs text-gray-700 text-center mb-3">
              Page {currentPage} sur {totalPages} • {filteredOrders.length} commandes
            </div>
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-xs"
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-xs"
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Commande #${order._id.slice(-8)}`}>
      <div className="space-y-6">
        {/* Informations client */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Informations client</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <span className="font-medium">{order.userId.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">{order.userId.email}</span>
            </div>
            {order.userId.phone && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{order.userId.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Adresse de livraison */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Adresse de livraison</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <div>{order.deliveryAddress.street}</div>
                <div>{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</div>
                {order.deliveryAddress.complement && (
                  <div className="text-sm text-gray-600">{order.deliveryAddress.complement}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Articles commandés */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Articles commandés</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      {formatProductName(item)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Quantité: {item.quantity} × {item.price.toFixed(2)} €
                    </div>
                  </div>
                  <div className="font-medium text-lg">
                    {(item.quantity * item.price).toFixed(2)} €
                  </div>
                </div>
                
                {/* Options du produit */}
                {item.options && item.options.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">Personnalisations :</div>
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
              </div>
            ))}
            <div className="border-t pt-2">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>{order.total.toFixed(2)} €</span>
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
