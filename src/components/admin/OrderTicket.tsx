import React from 'react';

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

interface OrderTicketProps {
  order: Order;
  onClose: () => void;
}

export function OrderTicket({ order, onClose }: OrderTicketProps) {
  const formatProductName = (item: any) => {
    if (item.productName && item.productName !== 'Produit personnalisé') {
      // Pour les pizzas, remplacer la taille par "Pizza"
      if (item.productName.toLowerCase().includes('pizza')) {
        return item.productName.replace(/\s+(Junior|Senior|Mega|XL|L|M|S)\s*$/, ' Pizza');
      }
      // Pour les tacos, garder seulement "Tacos" + taille
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

  const renderCustomIngredients = (customIngredients: any) => {
    if (!customIngredients) return null;

    const details = [];

    if (customIngredients.menuOption) {
      details.push(`Menu: ${customIngredients.menuOption}`);
    }

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

  const handlePrint = () => {
    // Créer un nouvel élément pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
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
            .black { font-weight: 900; }
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
            <div class="bold"><strong>Adresse:</strong> ${order.deliveryAddress.street}</div>
            ${order.deliveryAddress.postalCode !== '00000' ? `<div class="bold">${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}</div>` : ''}
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

          <div class="total">
            <span>TOTAL:</span>
            <span>${order.total.toFixed(2)}€</span>
          </div>

          <div class="footer">
            <div class="black">MERCI POUR VOTRE COMMANDE !</div>
            <div class="bold">BON APPÉTIT !</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
                  <div className="font-bold"><strong>Adresse:</strong> {order.deliveryAddress.street}</div>
                  {order.deliveryAddress.postalCode !== '00000' && (
                    <div className="font-bold">{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</div>
                  )}
                  {order.deliveryAddress.complement && (
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
                    <div key={index} className="text-sm border-b border-gray-300 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-black">
                            {item.quantity}x {formatProductName(item)}
                          </div>
                          
                          {customDetails && customDetails.length > 0 && (
                            <div className="text-sm text-gray-600 mt-1">
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
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
