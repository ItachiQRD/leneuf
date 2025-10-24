import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Gift,
  Users,
  Clock,
  Star,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

interface Promotion {
  _id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_delivery';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  applicableCategories: string[];
  conditions: {
    minQuantity?: number;
    buyQuantity?: number;
    getQuantity?: number;
    freeProduct?: string;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  image?: string;
}

const promotionTypes = [
  { value: 'percentage', label: 'Pourcentage de réduction' },
  { value: 'fixed', label: 'Montant fixe de réduction' },
  { value: 'buy_x_get_y', label: 'Achetez X, obtenez Y gratuit' },
  { value: 'free_delivery', label: 'Livraison gratuite' }
];

const categories = [
  'pizza', 'burger', 'salad', 'sandwich', 'dessert', 'drink'
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as const,
    value: 0,
    minOrder: 0,
    maxDiscount: 0,
    applicableCategories: [] as string[],
    conditions: {
      minQuantity: 1,
      buyQuantity: 1,
      getQuantity: 1,
      freeProduct: ''
    },
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: 0,
    image: ''
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions');
      const data = await response.json();
      if (data.success) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePromotion = async () => {
    try {
      const url = editingPromotion ? '/api/promotions' : '/api/promotions';
      const method = editingPromotion ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _id: editingPromotion?._id
        }),
      });

      if (response.ok) {
        await fetchPromotions();
        setShowForm(false);
        setEditingPromotion(null);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value,
      minOrder: promotion.minOrder || 0,
      maxDiscount: promotion.maxDiscount || 0,
      applicableCategories: promotion.applicableCategories,
      conditions: promotion.conditions,
      startDate: new Date(promotion.startDate).toISOString().split('T')[0],
      endDate: new Date(promotion.endDate).toISOString().split('T')[0],
      isActive: promotion.isActive,
      usageLimit: promotion.usageLimit || 0,
      image: promotion.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      try {
        const response = await fetch(`/api/promotions?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchPromotions();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrder: 0,
      maxDiscount: 0,
      applicableCategories: [],
      conditions: {
        minQuantity: 1,
        buyQuantity: 1,
        getQuantity: 1,
        freeProduct: ''
      },
      startDate: '',
      endDate: '',
      isActive: true,
      usageLimit: 0,
      image: ''
    });
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <Badge className="bg-gray-500 text-white">Inactive</Badge>;
    }

    if (now < startDate) {
      return <Badge className="bg-blue-500 text-white">À venir</Badge>;
    }

    if (now > endDate) {
      return <Badge className="bg-red-500 text-white">Expirée</Badge>;
    }

    return <Badge className="bg-green-500 text-white">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
              <p className="text-gray-600 mt-2">Gérez vos offres et promotions</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setEditingPromotion(null);
                setShowForm(true);
              }}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle promotion
            </Button>
          </div>
        </div>

        {/* Liste des promotions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <motion.div
              key={promotion._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header de la carte */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {promotion.name}
                  </h3>
                  {getStatusBadge(promotion)}
                </div>
                <p className="text-gray-600 text-sm">
                  {promotion.description}
                </p>
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Gift className="w-4 h-4 mr-2" />
                    <span>Type: {promotionTypes.find(t => t.value === promotion.type)?.label}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(promotion.startDate).toLocaleDateString('fr-FR')} - 
                      {new Date(promotion.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Utilisée {promotion.usedCount} fois</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(promotion)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(promotion._id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de formulaire */}
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingPromotion(null);
              resetForm();
            }}
            title={editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la promotion
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Offre Pizza"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de promotion
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    options={promotionTypes}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Description de la promotion..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valeur
                  </label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commande minimum (€)
                  </label>
                  <Input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégories applicables
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.applicableCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              applicableCategories: [...formData.applicableCategories, category]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              applicableCategories: formData.applicableCategories.filter(c => c !== category)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Conditions spéciales pour buy_x_get_y */}
              {formData.type === 'buy_x_get_y' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité à acheter
                    </label>
                    <Input
                      type="number"
                      value={formData.conditions.buyQuantity}
                      onChange={(e) => setFormData({
                        ...formData,
                        conditions: { ...formData.conditions, buyQuantity: Number(e.target.value) }
                      })}
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité offerte
                    </label>
                    <Input
                      type="number"
                      value={formData.conditions.getQuantity}
                      onChange={(e) => setFormData({
                        ...formData,
                        conditions: { ...formData.conditions, getQuantity: Number(e.target.value) }
                      })}
                      placeholder="1"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPromotion(null);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button onClick={handleSavePromotion}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingPromotion ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
