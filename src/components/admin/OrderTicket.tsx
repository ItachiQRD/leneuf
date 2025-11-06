import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

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
    category?: string;
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
  orderType?: 'delivery' | 'pickup';
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

interface OrderTicketProps {
  order: Order;
  onClose: () => void;
}

export function OrderTicket({ order, onClose }: OrderTicketProps) {
  const isMobile = useIsMobile();
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

  const formatProductName = (item: any) => {
    const category = getCategoryName(item);
    let productName = '';

    if (item.productName && item.productName !== 'Produit personnalisé') {
      // Pour les pizzas, remplacer la taille par "Pizza"
      if (item.productName.toLowerCase().includes('pizza')) {
        productName = item.productName.replace(/\s+(Junior|Senior|Mega|XL|L|M|S)\s*$/, ' Pizza');
      }
      // Pour les tacos, garder seulement "Tacos" + taille
      else if (item.productName.toLowerCase().includes('tacos')) {
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

  const renderCustomIngredients = (customIngredients: any) => {
    if (!customIngredients) return null;

    const details = [];

    // Informations pour menus pizzas
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

    // On ne montre plus le menu dans les détails

    if (customIngredients.breadType) {
      details.push(`Pain: ${customIngredients.breadType}`);
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

    if (customIngredients.baseIngredients && customIngredients.baseIngredients.length > 0) {
      details.push(`Base: ${customIngredients.baseIngredients.map((ing: any) => ing.name).join(', ')}`);
    }

    if (customIngredients.supplements && customIngredients.supplements.length > 0) {
      details.push(`Suppléments: ${customIngredients.supplements.map((sup: any) => sup.name).join(', ')}`);
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
      // Pour TexMex, afficher le nombre et le nom de la viande
      if (customIngredients.meats.length === 1 && customIngredients.meats[0].quantity) {
        const meat = customIngredients.meats[0];
        details.push(`${meat.quantity} ${meat.name}`);
      } else {
        details.push(`Viandes: ${customIngredients.meats.map((meat: any) => meat.name).join(', ')}`);
      }
    }

    if (customIngredients.ingredients && customIngredients.ingredients.length > 0) {
      details.push(`Ingrédients: ${customIngredients.ingredients.map((ing: any) => ing.name).join(', ')}`);
    }

    if (customIngredients.size) {
      details.push(`Taille: ${customIngredients.size}`);
    }

    return details.length > 0 ? details : null;
  };

  const handlePrintMobile = () => {
    // Version mobile-friendly qui utilise l'API d'impression native
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.2;
        color: black;
        background: white;
        padding: 10px;
        max-width: 300px;
        margin: 0 auto;
        border: 1px solid #000;
      ">
        <div style="text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 10px;">
          <div style="font-size: 16px; font-weight: 900;">LE NEUF</div>
          <div style="font-weight: 700;">Fast Food & Grill</div>
          <div style="font-weight: 700;">Commande #${order._id}</div>
          <div style="font-weight: 700;">${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        
        <div style="margin-bottom: 10px; border-bottom: 1px solid black; padding-bottom: 5px;">
          <div style="font-weight: 800; font-size: 14px; margin-bottom: 5px;">CLIENT & LIVRAISON</div>
          <div style="font-weight: 700;"><strong>Nom:</strong> ${order.userId?.name || order.customer?.name || 'N/A'}</div>
          <div style="font-weight: 700;"><strong>Tél:</strong> ${order.userId?.phone || order.customer?.phone || 'N/A'}</div>
          <div style="font-weight: 700;"><strong>Adresse:</strong> ${order.orderType === 'pickup' ? 'À emporter' : order.deliveryAddress.street}</div>
          ${order.orderType !== 'pickup' && order.deliveryAddress.postalCode !== '00000' ? `<div style="font-weight: 700;">${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}</div>` : ''}
          ${order.orderType !== 'pickup' && order.deliveryAddress.complement ? `<div style="font-weight: 700;"><strong>Instructions:</strong> ${order.deliveryAddress.complement}</div>` : ''}
          <div style="font-weight: 700;"><strong>Paiement:</strong> ${order.paymentMethod === 'card' ? 'CARTE' : 'ESPECES'}</div>
        </div>

        <div style="margin-bottom: 10px; border-bottom: 1px solid black; padding-bottom: 5px;">
          <div style="font-weight: 800; font-size: 14px; margin-bottom: 5px;">ARTICLES</div>
          ${order.items.map(item => {
            const customDetails = renderCustomIngredients(item.customIngredients);
            return `
              <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #ccc;">
                <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 15px; letter-spacing: 0.5px; margin-bottom: 4px;">
                  <span>${item.quantity}x ${formatProductName(item)}</span>
                  <span>${(item.quantity * item.price).toFixed(2)}€</span>
                </div>
                ${customDetails && customDetails.length > 0 ? `
                  <div style="font-size: 11px; color: #666; margin-top: 6px; padding-left: 8px;">
                    ${customDetails.map(detail => `<div style="font-weight: 700;">• ${detail}</div>`).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        ${order.promotionDiscount && order.promotionDiscount > 0 ? `
        <div style="border-top: 1px dashed #999; padding-top: 5px; padding-bottom: 5px; font-size: 12px; display: flex; justify-content: space-between;">
          <span>Remise (${order.promotionDescription || 'Promotion'}):</span>
          <span>-${order.promotionDiscount.toFixed(2)}€</span>
        </div>
        ` : ''}
        <div style="border-top: 2px solid black; padding-top: 5px; font-weight: 900; font-size: 14px; display: flex; justify-content: space-between;">
          <span>TOTAL:</span>
          <span>${order.total.toFixed(2)}€</span>
        </div>

        <div style="text-align: center; border-top: 1px dashed #999; padding-top: 5px; margin-top: 10px;">
          <div style="font-weight: 900;">MERCI POUR VOTRE COMMANDE !</div>
          <div style="font-weight: 700;">BON APPÉTIT !</div>
        </div>
      </div>
    `;

    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback: afficher dans une alerte
      alert('Impossible d\'ouvrir la fenêtre d\'impression. Veuillez autoriser les popups.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 20px; background: white; }
            @media print { body { margin: 0; padding: 5px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    // Auto-print après un court délai
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  const handlePrint = () => {
    // Créer le contenu HTML pour l'impression
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.2;
              color: black;
              background: white;
              margin: 0;
              padding: 10px;
              width: 100%;
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
              font-size: 15px;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .item-details {
              font-size: 12px;
              color: #666;
              margin-top: 6px;
              padding-left: 8px;
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
            .black { font-weight: 900; }
            .print-controls {
              text-align: center;
              margin: 20px 0;
              padding: 10px;
              background: #f5f5f5;
              border: 1px solid #ddd;
            }
            .print-button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              margin: 5px;
              font-size: 14px;
              font-family: inherit;
            }
            .print-button:hover {
              background: #2563eb;
            }
            .print-button.secondary {
              background: #6b7280;
            }
            .print-button.secondary:hover {
              background: #4b5563;
            }
            @media print {
              .print-controls { display: none; }
              body { margin: 0; padding: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LE NEUF</h1>
            <div class="bold">Fast Food & Grill</div>
            <div class="bold">Commande #${order._id}</div>
            <div class="bold">${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div class="section">
            <h2>CLIENT & LIVRAISON</h2>
            <div class="bold"><strong>Nom:</strong> ${order.userId?.name || order.customer?.name || 'N/A'}</div>
            <div class="bold"><strong>Tél:</strong> ${order.userId?.phone || order.customer?.phone || 'N/A'}</div>
            <div class="bold"><strong>Adresse:</strong> ${order.orderType === 'pickup' ? 'À emporter' : order.deliveryAddress.street}</div>
            ${order.orderType !== 'pickup' && order.deliveryAddress.postalCode !== '00000' ? `<div class="bold">${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}</div>` : ''}
            ${order.deliveryAddress.complement ? `<div class="bold"><strong>Instructions:</strong> ${order.deliveryAddress.complement}</div>` : ''}
            <div class="bold"><strong>Paiement:</strong> ${order.paymentMethod === 'card' ? 'CARTE' : 'ESPECES'}</div>
          </div>

          <div class="section">
            <h2>ARTICLES</h2>
            ${order.items.map(item => {
              const customDetails = renderCustomIngredients(item.customIngredients);
              return `
                <div class="item">
                  <div class="item-header">
                    <span>${item.quantity}x ${formatProductName(item)}</span>
                    <span>${(item.quantity * item.price).toFixed(2)}€</span>
                  </div>
                  ${customDetails && customDetails.length > 0 ? `
                    <div class="item-details">
                      ${customDetails.map(detail => `<div class="bold">• ${detail}</div>`).join('')}
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
            <div class="black">MERCI POUR VOTRE COMMANDE !</div>
            <div class="bold">BON APPÉTIT !</div>
          </div>

          <div class="print-controls">
            <button class="print-button" onclick="window.print()">🖨️ Imprimer</button>
            <button class="print-button secondary" onclick="window.close()">❌ Fermer</button>
          </div>
        </body>
      </html>
    `;

    // Essayer d'ouvrir une nouvelle fenêtre
    let printWindow;
    try {
      printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la fenêtre:', error);
      // Fallback: utiliser une nouvelle fenêtre sans paramètres
      printWindow = window.open('', '_blank');
    }

    if (!printWindow) {
      // Si window.open est bloqué, essayer d'utiliser le presse-papier
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`
LE NEUF - Fast Food & Grill
Commande #${order._id}
${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}

CLIENT & LIVRAISON
Nom: ${order.userId?.name || order.customer?.name || 'N/A'}
Tél: ${order.userId?.phone || order.customer?.phone || 'N/A'}
Adresse: ${order.orderType === 'pickup' ? 'À emporter' : `${order.deliveryAddress.street}${order.deliveryAddress.postalCode !== '00000' ? ` ${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}` : ''}`}
Paiement: ${order.paymentMethod === 'card' ? 'CARTE' : 'ESPECES'}

ARTICLES
${order.items.map(item => `${item.quantity}x ${formatProductName(item)} - ${(item.quantity * item.price).toFixed(2)}€`).join('\n')}

${order.promotionDiscount && order.promotionDiscount > 0 ? `Remise (${order.promotionDescription || 'Promotion'}): -${order.promotionDiscount.toFixed(2)}€\n` : ''}TOTAL: ${order.total.toFixed(2)}€

MERCI POUR VOTRE COMMANDE !
BON APPÉTIT !
        `).then(() => {
          alert('Le contenu du ticket a été copié dans le presse-papier. Vous pouvez le coller dans un document pour l\'imprimer.');
        }).catch(() => {
          alert('Impossible d\'ouvrir la fenêtre d\'impression. Veuillez autoriser les popups ou utiliser la fonction d\'impression de votre navigateur.');
        });
      } else {
        alert('Impossible d\'ouvrir la fenêtre d\'impression. Veuillez autoriser les popups ou utiliser la fonction d\'impression de votre navigateur.');
      }
      return;
    }

    // Écrire le contenu dans la nouvelle fenêtre
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé puis imprimer
    printWindow.onload = () => {
      printWindow.focus();
      // Délai pour permettre le chargement complet
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  return (
    <>
      {/* Modal pour l'écran */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gray-800 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Ticket de Commande</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* Ticket Content */}
          <div className="p-4">
            {/* Restaurant Header */}
            <div className="text-center mb-4">
              <div className="border-b-2 border-black pb-2">
                <h1 className="text-3xl font-black">LE NEUF</h1>
                <p className="text-lg font-bold">Fast Food & Grill</p>
              </div>
              <div className="mt-2 text-sm font-bold">
                Commande #{order._id}
              </div>
              <div className="text-sm font-bold">
                {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Client & Livraison */}
            <div className="mb-4">
              <div className="border-b border-black pb-2">
                <h2 className="text-lg font-black mb-1">CLIENT & LIVRAISON</h2>
                <div className="text-sm space-y-1">
                  <div className="font-bold"><strong>Nom:</strong> {order.userId?.name || order.customer?.name || 'N/A'}</div>
                  <div className="font-bold"><strong>Tél:</strong> {order.userId?.phone || order.customer?.phone || 'N/A'}</div>
                  <div className="font-bold"><strong>Adresse:</strong> {order.orderType === 'pickup' ? 'À emporter' : order.deliveryAddress.street}</div>
                  {order.orderType !== 'pickup' && order.deliveryAddress.postalCode !== '00000' && (
                    <div className="font-bold">{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</div>
                  )}
                  {order.orderType !== 'pickup' && order.deliveryAddress.complement && (
                    <div className="font-bold"><strong>Instructions:</strong> {order.deliveryAddress.complement}</div>
                  )}
                  <div className="font-bold"><strong>Paiement:</strong> {order.paymentMethod === 'card' ? 'CARTE' : 'ESPECES'}</div>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="mb-4">
              <h2 className="text-lg font-black mb-2 border-b border-black pb-1">ARTICLES</h2>
              <div className="space-y-2">
                {order.items.map((item, index) => {
                  const customDetails = renderCustomIngredients(item.customIngredients);
                  
                  return (
                    <div key={index} className="text-sm border-b border-gray-300 pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-black text-base mb-2 tracking-wide">
                            {item.quantity}x {formatProductName(item)}
                          </div>
                          
                          {customDetails && customDetails.length > 0 && (
                            <div className="text-sm text-gray-600 mt-2 pl-2">
                              {customDetails.map((detail, detailIndex) => (
                                <div key={detailIndex} className="font-bold">
                                  • {detail}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="font-black text-right ml-2">
                          {(item.quantity * item.price).toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promotion */}
            {order.promotionDiscount && order.promotionDiscount > 0 && (
              <div className="border-t border-dashed border-gray-300 pt-2 pb-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Remise ({order.promotionDescription || 'Promotion'}):</span>
                  <span className="text-green-600 font-medium">-{order.promotionDiscount.toFixed(2)}€</span>
                </div>
              </div>
            )}
            
            {/* Total */}
            <div className="border-t-2 border-black pt-2">
              <div className="flex justify-between items-center font-black text-lg">
                <span>TOTAL:</span>
                <span>{order.total.toFixed(2)}€</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-center">
              <div className="text-sm font-black">
                MERCI POUR VOTRE COMMANDE !
              </div>
              <div className="text-sm mt-1 font-bold">
                BON APPÉTIT !
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-4 rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  if (isMobile) {
                    handlePrintMobile();
                  } else {
                    handlePrint();
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isMobile ? '📱 Imprimer' : '🖨️ Imprimer'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
