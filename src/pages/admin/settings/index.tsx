import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Building2, 
  Clock, 
  Truck, 
  Bell, 
  Wrench, 
  Save, 
  Database,
  CreditCard,
  Printer,
  Globe,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/use-toast';

interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

interface OpeningHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

interface DeliverySettings {
  enabled: boolean;
  minOrder: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedTime: number;
  zones: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  soundNotifications: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
}

interface SystemSettings {
  maintenanceMode: boolean;
  autoPrint: boolean;
  defaultPrinter: string;
}

const daysOfWeek = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  // État pour les paramètres du restaurant
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>({
    name: 'Le 9',
    address: '9 route de Bétheny, 51100 Reims',
    phone: '0326407967',
    email: 'contact@leneuf.fr',
    website: 'https://leneuf.fr',
  });

  // État pour les horaires
  const [openingHours, setOpeningHours] = useState<OpeningHours>({
    monday: { open: '11:00', close: '22:00', closed: false },
    tuesday: { open: '11:00', close: '22:00', closed: false },
    wednesday: { open: '11:00', close: '22:00', closed: false },
    thursday: { open: '11:00', close: '22:00', closed: false },
    friday: { open: '11:00', close: '23:00', closed: false },
    saturday: { open: '11:00', close: '23:00', closed: false },
    sunday: { open: '11:00', close: '22:00', closed: false },
  });

  // État pour la livraison
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    enabled: true,
    minOrder: 10,
    deliveryFee: 2.5,
    freeDeliveryThreshold: 30,
    estimatedTime: 30,
    zones: '',
  });

  // État pour les notifications
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    soundNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
  });

  // État pour le système
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    autoPrint: true,
    defaultPrinter: '',
  });

  // Charger les paramètres depuis localStorage au montage
  useEffect(() => {
    const savedRestaurant = localStorage.getItem('restaurantSettings');
    const savedHours = localStorage.getItem('openingHours');
    const savedDelivery = localStorage.getItem('deliverySettings');
    const savedNotifications = localStorage.getItem('notificationSettings');
    const savedSystem = localStorage.getItem('systemSettings');

    if (savedRestaurant) {
      setRestaurantSettings(JSON.parse(savedRestaurant));
    }
    if (savedHours) {
      setOpeningHours(JSON.parse(savedHours));
    }
    if (savedDelivery) {
      setDeliverySettings(JSON.parse(savedDelivery));
    }
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
    if (savedSystem) {
      setSystemSettings(JSON.parse(savedSystem));
    }
  }, []);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      // Sauvegarder dans localStorage
      switch (section) {
        case 'general':
          localStorage.setItem('restaurantSettings', JSON.stringify(restaurantSettings));
          break;
        case 'hours':
          localStorage.setItem('openingHours', JSON.stringify(openingHours));
          break;
        case 'delivery':
          localStorage.setItem('deliverySettings', JSON.stringify(deliverySettings));
          break;
        case 'notifications':
          localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
          break;
        case 'system':
          localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
          break;
      }

      // Ici, vous pourriez aussi sauvegarder dans une API
      // await fetch('/api/admin/settings', { method: 'POST', body: JSON.stringify(...) });

      toast({
        title: 'Paramètres sauvegardés',
        description: 'Les modifications ont été enregistrées avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      restaurant: restaurantSettings,
      hours: openingHours,
      delivery: deliverySettings,
      notifications: notificationSettings,
      system: systemSettings,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export réussi',
      description: 'Les paramètres ont été exportés.',
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.restaurant) setRestaurantSettings(data.restaurant);
        if (data.hours) setOpeningHours(data.hours);
        if (data.delivery) setDeliverySettings(data.delivery);
        if (data.notifications) setNotificationSettings(data.notifications);
        if (data.system) setSystemSettings(data.system);

        toast({
          title: 'Import réussi',
          description: 'Les paramètres ont été importés.',
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Le fichier est invalide.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Building2 },
    { id: 'hours', label: 'Horaires', icon: Clock },
    { id: 'delivery', label: 'Livraison', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'Système', icon: Wrench },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Settings className="w-8 h-8 mr-3" />
          Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les paramètres de votre restaurant et de votre système
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {/* Onglet Général */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Informations du restaurant
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Nom du restaurant
                  </label>
                  <Input
                    value={restaurantSettings.name}
                    onChange={(e) =>
                      setRestaurantSettings({ ...restaurantSettings, name: e.target.value })
                    }
                    placeholder="Le 9"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Téléphone
                  </label>
                  <Input
                    value={restaurantSettings.phone}
                    onChange={(e) =>
                      setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })
                    }
                    placeholder="0326407967"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) =>
                      setRestaurantSettings({ ...restaurantSettings, email: e.target.value })
                    }
                    placeholder="contact@leneuf.fr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Site web
                  </label>
                  <Input
                    value={restaurantSettings.website}
                    onChange={(e) =>
                      setRestaurantSettings({ ...restaurantSettings, website: e.target.value })
                    }
                    placeholder="https://leneuf.fr"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Adresse
                  </label>
                  <Input
                    value={restaurantSettings.address}
                    onChange={(e) =>
                      setRestaurantSettings({ ...restaurantSettings, address: e.target.value })
                    }
                    placeholder="9 route de Bétheny, 51100 Reims"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => handleSave('general')}
                disabled={saving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Onglet Horaires */}
        {activeTab === 'hours' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Horaires d'ouverture
              </h2>
              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const dayData = openingHours[day.key as keyof OpeningHours];
                  return (
                    <div
                      key={day.key}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={!dayData.closed}
                          onChange={(e) =>
                            setOpeningHours({
                              ...openingHours,
                              [day.key]: { ...dayData, closed: !e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-red-600 rounded"
                        />
                        <span className="font-medium text-gray-900 dark:text-white w-24">
                          {day.label}
                        </span>
                        {!dayData.closed && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              value={dayData.open}
                              onChange={(e) =>
                                setOpeningHours({
                                  ...openingHours,
                                  [day.key]: { ...dayData, open: e.target.value },
                                })
                              }
                              className="w-32"
                            />
                            <span className="text-gray-500">-</span>
                            <Input
                              type="time"
                              value={dayData.close}
                              onChange={(e) =>
                                setOpeningHours({
                                  ...openingHours,
                                  [day.key]: { ...dayData, close: e.target.value },
                                })
                              }
                              className="w-32"
                            />
                          </div>
                        )}
                        {dayData.closed && (
                          <span className="text-gray-500 italic">Fermé</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => handleSave('hours')}
                disabled={saving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Onglet Livraison */}
        {activeTab === 'delivery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Paramètres de livraison
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Livraison activée
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Autoriser les commandes en livraison
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={deliverySettings.enabled}
                    onChange={(e) =>
                      setDeliverySettings({ ...deliverySettings, enabled: e.target.checked })
                    }
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Commande minimum (€)
                    </label>
                    <Input
                      type="number"
                      value={deliverySettings.minOrder}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          minOrder: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frais de livraison (€)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={deliverySettings.deliveryFee}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          deliveryFee: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Livraison gratuite à partir de (€)
                    </label>
                    <Input
                      type="number"
                      value={deliverySettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Temps estimé (minutes)
                    </label>
                    <Input
                      type="number"
                      value={deliverySettings.estimatedTime}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          estimatedTime: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zones de livraison
                  </label>
                  <textarea
                    value={deliverySettings.zones}
                    onChange={(e) =>
                      setDeliverySettings({ ...deliverySettings, zones: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Listez les zones de livraison (une par ligne)"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => handleSave('delivery')}
                disabled={saving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Onglet Notifications */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Paramètres de notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Notifications par email
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recevoir des emails pour les nouvelles commandes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Notifications sonores
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Activer les sons de notification pour les nouvelles commandes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.soundNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        soundNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Notifications de commandes
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Afficher les notifications de nouvelles commandes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        orderNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Alertes de stock faible
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recevoir des alertes lorsque le stock est faible
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.lowStockAlerts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        lowStockAlerts: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => handleSave('notifications')}
                disabled={saving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Onglet Système */}
        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Paramètres système
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      Mode maintenance
                      <AlertCircle className="w-4 h-4 ml-2 text-orange-500" />
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Désactiver temporairement les commandes en ligne
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })
                    }
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <Printer className="w-4 h-4 mr-2" />
                      Impression automatique
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Imprimer automatiquement les tickets lors de nouvelles commandes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.autoPrint}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, autoPrint: e.target.checked })
                    }
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>

                {systemSettings.autoPrint && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Imprimante par défaut
                    </label>
                    <Input
                      value={systemSettings.defaultPrinter}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, defaultPrinter: e.target.value })
                      }
                      placeholder="Nom de l'imprimante"
                    />
                  </div>
                )}

                {/* Sauvegarde et restauration */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Sauvegarde et restauration
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exporter les paramètres
                    </Button>
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Importer les paramètres
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => handleSave('system')}
                disabled={saving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

