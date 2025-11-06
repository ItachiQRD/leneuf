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

  // Jouer un son de notification en continu et fort
  useEffect(() => {
    if (!isOpen || !order) return;

    let audio: HTMLAudioElement | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const playSound = () => {
      try {
        audio = new Audio('/meteor_samsung.mp3');
        audio.volume = 1.0; // Volume maximum (100%)
        audio.play().catch(error => {
          console.error('Erreur lors de la lecture du son:', error);
        });
      } catch (error) {
        console.error('Erreur lors de la lecture du son:', error);
      }
    };

    // Jouer immédiatement
    playSound();

    // Répéter toutes les 2 secondes
    intervalId = setInterval(() => {
      if (audio) {
        audio.currentTime = 0; // Réinitialiser pour rejouer depuis le début
        audio.play().catch(error => {
          console.error('Erreur lors de la répétition du son:', error);
        });
      } else {
        playSound();
      }
    }, 2000);

    // Nettoyer quand le modal se ferme ou quand on clique sur imprimer
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
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

  // Fonction pour déterminer la catégorie à partir du nom ou des customIngredients
  const getCategoryName = (item: any): string => {
    // Si la catégorie est directement disponible
    if (item.category) {
      const categoryMap: Record<string, string> = {
        'burgers': 'Burger',
        'sandwichs': 'Sandwich',
        'pizzas': 'Pizza',
        'tacos': 'Tacos',
        'paninis': 'Panini',
        'tex-mex': 'Tex-Mex',
        'assiettes': 'Assiette',
        'ptite-faim': 'P\'tite Faim',
        'menu-enfants': 'Menu Enfant',
        'accompagnements': 'Accompagnement',
        'boissons': 'Boisson',
        'desserts': 'Dessert'
      };
      return categoryMap[item.category] || '';
    }

    // Déterminer la catégorie à partir du nom du produit
    const productName = item.productName?.toLowerCase() || '';
    if (productName.includes('burger')) return 'Burger';
    if (productName.includes('sandwich')) return 'Sandwich';
    if (productName.includes('pizza')) return 'Pizza';
    if (productName.includes('tacos')) return 'Tacos';
    if (productName.includes('panini')) return 'Panini';
    if (productName.includes('tex-mex') || productName.includes('texmex')) return 'Tex-Mex';
    if (productName.includes('assiette')) return 'Assiette';
    if (productName.includes('nuggets') || productName.includes('wings')) return 'P\'tite Faim';
    if (productName.includes('menu enfant') || productName.includes('menu-enfant')) return 'Menu Enfant';
    if (productName.includes('menu')) return 'Menu';

    // Déterminer à partir des customIngredients
    if (item.customIngredients) {
      if (item.customIngredients.type === 'burger') return 'Burger';
      if (item.customIngredients.type === 'sandwich') return 'Sandwich';
      if (item.customIngredients.type === 'tacos') return 'Tacos';
      if (item.customIngredients.type === 'bowl') return 'Tex-Mex';
      if (item.customIngredients.menuId || item.customIngredients.menuName) return 'Menu';
    }

    return '';
  };

  // Fonction pour formater le nom du produit (similaire à OrderTicket)
  const formatProductName = (item: any) => {
    const category = getCategoryName(item);
    let productName = '';

    if (item.productName && item.productName !== 'Produit personnalisé') {
      if (item.productName.toLowerCase().includes('pizza')) {
        productName = item.productName.replace(/\s+(Junior|Senior|Mega|XL|L|M|S)\s*$/, ' Pizza');
      } else if (item.productName.toLowerCase().includes('tacos')) {
        const sizeMatch = item.productName.match(/\s+(Junior|Senior|Mega|XL|L|M|S)\s*$/);
        if (sizeMatch) {
          productName = `Tacos ${sizeMatch[1]}`;
        } else {
          productName = 'Tacos';
        }
      } else {
        productName = item.productName;
      }
    } else if (item.options && item.options.length > 0) {
      const mainOption = item.options.find((opt: any) => 
        opt.name === 'Viandes' || opt.name === 'Ingrédients de base'
      );
      if (mainOption) {
        productName = mainOption.choice.name;
      } else {
        productName = 'Produit personnalisé';
      }
    } else {
      productName = 'Produit personnalisé';
    }

    // Ajouter la catégorie avant le nom si elle existe et n'est pas déjà dans le nom
    if (category && !productName.toLowerCase().includes(category.toLowerCase())) {
      return `${category} ${productName}`;
    }

    return productName;
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
    // Arrêter le son quand on imprime
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    // Créer le contenu HTML pour l'impression
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: auto;
              margin: 5mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', 'Courier', monospace;
              font-size: 12px;
              line-height: 1.4;
              color: black;
              background: white;
              margin: 0;
              padding: 5mm;
              width: 100%;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            h1 {
              font-size: 16px;
              font-weight: 900;
              margin: 0 0 3px 0;
              text-align: center;
              letter-spacing: 1px;
            }
            h2 {
              font-size: 14px;
              font-weight: 900;
              margin: 8px 0 4px 0;
              letter-spacing: 0.5px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid black;
              padding-bottom: 6px;
              margin-bottom: 8px;
            }
            .section {
              margin-bottom: 8px;
              border-bottom: 1px solid black;
              padding-bottom: 4px;
            }
            .item {
              margin-bottom: 4px;
              padding-bottom: 4px;
              border-bottom: 1px solid #ccc;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              font-weight: 900;
              font-size: 15px;
              letter-spacing: 0.6px;
              text-transform: uppercase;
              margin-bottom: 6px;
            }
            .item-details {
              font-size: 12px;
              font-weight: 900;
              margin-top: 6px;
              letter-spacing: 0.4px;
              line-height: 1.5;
              text-transform: uppercase;
              padding-left: 8px;
            }
            .item-details div {
              font-weight: 900;
              margin: 1px 0;
            }
            .client-info {
              font-size: 12px;
              font-weight: 900;
              margin: 2px 0;
              letter-spacing: 0.3px;
              line-height: 1.4;
            }
            .promotion {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              border-top: 1px dashed #999;
              font-size: 12px;
              font-weight: 900;
              letter-spacing: 0.3px;
            }
            .total {
              border-top: 2px solid black;
              padding-top: 4px;
              font-weight: 900;
              font-size: 14px;
              display: flex;
              justify-content: space-between;
              letter-spacing: 0.5px;
            }
            .footer {
              text-align: center;
              border-top: 1px dashed #999;
              padding-top: 4px;
              margin-top: 8px;
              font-weight: 900;
              letter-spacing: 0.5px;
            }
            .bold { 
              font-weight: 900;
              letter-spacing: 0.3px;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 5mm;
                width: 100%;
              }
              @page {
                margin: 5mm;
              }
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
            <div class="client-info"><strong>Nom:</strong> ${order.customer?.name || order.userId?.name || 'N/A'}</div>
            <div class="client-info"><strong>Tél:</strong> ${order.customer?.phone || order.userId?.phone || 'N/A'}</div>
            <div class="client-info"><strong>Adresse:</strong> ${order.orderType === 'pickup' ? 'À emporter' : (order.deliveryAddress?.street || order.customer?.address || 'N/A')}</div>
            ${order.orderType !== 'pickup' && order.deliveryAddress?.postalCode && order.deliveryAddress.postalCode !== '00000' ? `<div class="client-info">${order.deliveryAddress.postalCode} ${order.deliveryAddress.city || ''}</div>` : ''}
            ${order.deliveryAddress?.complement ? `<div class="client-info"><strong>Instructions:</strong> ${order.deliveryAddress.complement}</div>` : ''}
            <div class="client-info"><strong>Paiement:</strong> ${order.paymentMethod === 'card' ? 'CARTE' : 'ESPECES'}</div>
          </div>

          <div class="section">
            <h2>ARTICLES</h2>
            ${order.items.map((item: any) => {
              const customDetails = renderCustomIngredients(item.customIngredients);
              const productName = formatProductName(item).toUpperCase();
              return `
                <div class="item">
                  <div class="item-header">
                    <span>${item.quantity}X ${productName}</span>
                    <span>${(item.quantity * item.price).toFixed(2)}€</span>
                  </div>
                  ${customDetails && customDetails.length > 0 ? `
                    <div class="item-details">
                      ${customDetails.map((detail: string) => `<div>• ${detail.toUpperCase()}</div>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          ${order.promotionDiscount && order.promotionDiscount > 0 ? `
          <div class="promotion">
            <span>Remise (${order.promotionDescription || 'Promotion'}):</span>
            <span>-${order.promotionDiscount.toFixed(2)}€</span>
          </div>
          ` : ''}
          <div class="total">
            <span>TOTAL:</span>
            <span>${order.total.toFixed(2)}€</span>
          </div>

          <div class="footer">
            <div>MERCI POUR VOTRE COMMANDE !</div>
            <div>BON APPÉTIT !</div>
          </div>
        </body>
      </html>
    `;

    // Créer un iframe caché pour l'impression directe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();

      // Attendre que le contenu soit chargé puis imprimer directement
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          
          // Nettoyer après impression
          setTimeout(() => {
            if (iframe.parentNode) {
              document.body.removeChild(iframe);
            }
          }, 500);
        }, 100);
      };
      
      // Fallback si onload ne se déclenche pas
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setTimeout(() => {
            if (iframe.parentNode) {
              document.body.removeChild(iframe);
            }
          }, 500);
        }
      }, 200);
    } else {
      // Fallback : utiliser window.print() directement si iframe ne fonctionne pas
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => printWindow.close(), 100);
        }, 100);
      }
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

