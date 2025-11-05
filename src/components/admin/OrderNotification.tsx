import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Bell, X, ShoppingCart, MapPin, Phone, Clock, ArrowRight, Printer } from 'lucide-react';
import { useRouter } from 'next/router';

interface OrderNotificationProps {
  isOpen: boolean;
  order: any;
  onClose: () => void;
  onViewOrder: () => void;
}

export default function OrderNotification({ isOpen, order, onClose, onViewOrder }: OrderNotificationProps) {
  const router = useRouter();

  // Jouer un son de notification
  useEffect(() => {
    if (isOpen && order) {
      try {
        // Le fichier est dans public/ avec underscore
        const audio = new Audio('/meteor_samsung.mp3');
        audio.volume = 0.5;
        audio.play().catch(error => {
          console.error('Erreur lors de la lecture du son:', error);
        });
      } catch (error) {
        console.error('Erreur lors de la lecture du son:', error);
      }
    }
  }, [isOpen, order]);

  if (!order) return null;

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  const getOrderType = () => {
    // Vérifier si c'est une commande à emporter ou en livraison
    // On peut utiliser orderType si disponible ou checker l'adresse
    if (order.orderType === 'pickup') {
      return 'À emporter';
    }
    return 'En livraison';
  };

  // Fonction pour formater le nom du produit (similaire à OrderTicket)
  const formatProductName = (item: any) => {
    if (item.productName && item.productName !== 'Produit personnalisé') {
      if (item.productName.toLowerCase().includes('pizza')) {
        return item.productName.replace(/\s+(Junior|Senior|Mega|XL|L|M|S)\s*$/, ' Pizza');
      }
      if (item.productName.toLowerCase().includes('tacos')) {
        const sizeMatch = item.productName.match(/\s+(Junior|Senior|Mega|XL|L|M|S)\s*$/);
        if (sizeMatch) {
          return `Tacos ${sizeMatch[1]}`;
        }
        return 'Tacos';
      }
      return item.productName;
    }
    
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

  // Fonction pour rendre les ingrédients personnalisés (similaire à OrderTicket)
  const renderCustomIngredients = (customIngredients: any) => {
    if (!customIngredients) return null;
    const details = [];

    if (customIngredients.menuId || customIngredients.menuName) {
      if (customIngredients.pizzas && customIngredients.pizzas.length > 0) {
        customIngredients.pizzas.forEach((pizza: any) => {
          details.push(`${pizza.quantity}x ${pizza.name}`);
        });
      }
      if (customIngredients.drinks && customIngredients.drinks.length > 0) {
        customIngredients.drinks.forEach((drink: any) => {
          details.push(`${drink.quantity}x ${drink.name}`);
        });
      }
      if (customIngredients.petiteFaim) {
        details.push(`6x ${customIngredients.petiteFaim.name}`);
      }
      if (customIngredients.brownies) {
        details.push(`${customIngredients.brownies.quantity}x ${customIngredients.brownies.name} (inclus)`);
      }
    }

    if (customIngredients.vegetables && customIngredients.vegetables.length > 0) {
      details.push(`Crudités: ${customIngredients.vegetables.join(', ')}`);
    }

    const sauces = [];
    if (customIngredients.sauces && customIngredients.sauces.length > 0) {
      sauces.push(...customIngredients.sauces.map((sauce: any) => sauce.name));
    }
    if (customIngredients.sauce) {
      const sauceName = typeof customIngredients.sauce === 'string' ? customIngredients.sauce : customIngredients.sauce.name;
      if (!sauces.includes(sauceName)) {
        sauces.push(sauceName);
      }
    }
    if (sauces.length > 0) {
      details.push(`Sauces: ${sauces.join(', ')}`);
    }

    if (customIngredients.meats && customIngredients.meats.length > 0) {
      if (customIngredients.meats.length === 1 && customIngredients.meats[0].quantity) {
        const meat = customIngredients.meats[0];
        details.push(`${meat.quantity} ${meat.name}`);
      } else {
        details.push(`Viandes: ${customIngredients.meats.map((meat: any) => meat.name).join(', ')}`);
      }
    }

    if (customIngredients.baseIngredients && customIngredients.baseIngredients.length > 0) {
      details.push(`Base: ${customIngredients.baseIngredients.map((ing: any) => ing.name).join(', ')}`);
    }

    if (customIngredients.size) {
      details.push(`Taille: ${customIngredients.size}`);
    }

    return details.length > 0 ? details : null;
  };

  // Fonction pour imprimer directement
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.2;
              color: black;
              background: white;
              margin: 0;
              padding: 10px;
            }
            h1 {
              font-size: 18px;
              font-weight: 900;
              margin: 0 0 5px 0;
              text-align: center;
            }
            h2 {
              font-size: 16px;
              font-weight: 800;
              margin: 10px 0 5px 0;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid black;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 10px;
              border-bottom: 1px solid black;
              padding-bottom: 5px;
            }
            .item {
              margin-bottom: 5px;
              padding-bottom: 5px;
              border-bottom: 1px solid #ccc;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              font-weight: 900;
            }
            .item-details {
              font-size: 12px;
              color: #666;
              margin-top: 2px;
            }
            .total {
              border-top: 2px solid black;
              padding-top: 5px;
              font-weight: 900;
              font-size: 16px;
              display: flex;
              justify-content: space-between;
            }
            .footer {
              text-align: center;
              border-top: 1px dashed #999;
              padding-top: 5px;
              margin-top: 10px;
            }
            .bold { font-weight: 700; }
            @media print {
              body { margin: 0; padding: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LE NEUF</h1>
            <div class="bold">Fast Food & Grill</div>
            <div class="bold">Commande #${order._id.slice(-8)}</div>
            <div class="bold">${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div class="section">
            <h2>CLIENT & LIVRAISON</h2>
            <div class="bold"><strong>Nom:</strong> ${order.customer?.name || order.userId?.name || 'N/A'}</div>
            <div class="bold"><strong>Tél:</strong> ${order.customer?.phone || order.userId?.phone || 'N/A'}</div>
            <div class="bold"><strong>Adresse:</strong> ${order.deliveryAddress?.street || order.customer?.address || 'N/A'}</div>
            ${order.deliveryAddress?.postalCode && order.deliveryAddress.postalCode !== '00000' ? `<div class="bold">${order.deliveryAddress.postalCode} ${order.deliveryAddress.city || ''}</div>` : ''}
            ${order.deliveryAddress?.complement ? `<div class="bold"><strong>Instructions:</strong> ${order.deliveryAddress.complement}</div>` : ''}
            <div class="bold"><strong>Paiement:</strong> ${order.paymentMethod === 'card' ? 'CARTE' : 'ESPECES'}</div>
          </div>

          <div class="section">
            <h2>ARTICLES</h2>
            ${order.items.map((item: any) => {
              const customDetails = renderCustomIngredients(item.customIngredients);
              return `
                <div class="item">
                  <div class="item-header">
                    <span>${item.quantity}x ${formatProductName(item)}</span>
                    <span>${(item.quantity * item.price).toFixed(2)}€</span>
                  </div>
                  ${customDetails && customDetails.length > 0 ? `
                    <div class="item-details">
                      ${customDetails.map((detail: string) => `<div class="bold">• ${detail}</div>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          ${order.promotionDiscount && order.promotionDiscount > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-top: 1px dashed #999;">
            <span style="font-size: 12px;">Remise (${order.promotionDescription || 'Promotion'}):</span>
            <span style="font-size: 12px;">-${order.promotionDiscount.toFixed(2)}€</span>
          </div>
          ` : ''}
          <div class="total">
            <span>TOTAL:</span>
            <span>${order.total.toFixed(2)}€</span>
          </div>

          <div class="footer">
            <div style="font-weight: 900;">MERCI POUR VOTRE COMMANDE !</div>
            <div class="bold">BON APPÉTIT !</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      // Attendre que le contenu soit chargé avant d'imprimer
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } else {
      alert('Impossible d\'ouvrir la fenêtre d\'impression. Veuillez autoriser les pop-ups pour ce site.');
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[100]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-4"
                >
                  <Bell className="w-8 h-8 text-white animate-pulse" />
                </motion.div>

                <div className="text-center mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Nouvelle commande !
                  </Dialog.Title>
                  <p className="text-gray-600 dark:text-gray-400">
                    Une nouvelle commande vient d'être passée
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
                  {/* Informations client */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.customer?.name || 'Client'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items?.length || 0} article{order.items?.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {formatPrice(order.total || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Type de commande */}
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {getOrderType()}
                    </span>
                  </div>

                  {/* Adresse si livraison */}
                  {order.customer?.address && order.orderType !== 'pickup' && (
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {order.customer.address}
                      </span>
                    </div>
                  )}

                  {/* Téléphone */}
                  {order.customer?.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {order.customer.phone}
                      </span>
                    </div>
                  )}

                  {/* Heure */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrint}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimer
                    </button>
                    <button
                      onClick={() => {
                        onViewOrder();
                        onClose();
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center"
                    >
                      Voir la commande
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Plus tard
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

