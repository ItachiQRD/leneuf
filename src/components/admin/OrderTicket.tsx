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
    // Créer un contenu HTML simple avec styles inline pour l'impression thermique
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              margin: 0;
              size: A4;
            }
            body {
              margin: 0;
              padding: 5px;
              font-family: monospace;
              font-size: 16px;
              line-height: 1.2;
              color: black;
              background: white;
            }
            .print-button {
              position: fixed;
              top: 10px;
              right: 10px;
              background: #007bff;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              z-index: 1000;
            }
            @media print {
              .print-button { display: none; }
              body { font-size: 20px; padding: 2px; }
            }
          </style>
        </head>
        <body>
          <button class="print-button" onclick="window.print()">🖨️ Imprimer</button>
          
          <div style="text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 15px;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">LE NEUF</div>
            <div style="font-size: 18px; font-weight: bold;">Fast Food & Grill</div>
            <div style="font-size: 16px; font-weight: bold;">Commande #${order._id}</div>
            <div style="font-size: 16px; font-weight: bold;">${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div style="margin-bottom: 15px; border-bottom: 1px solid black; padding-bottom: 10px;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">CLIENT & LIVRAISON</div>
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 3px;"><strong>Nom:</strong> ${order.userId?.name || order.customer?.name || 'N/A'}</div>
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 3px;"><strong>Tél:</strong> ${order.userId?.phone || order.customer?.phone || 'N/A'}</div>
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 3px;"><strong>Adresse:</strong> ${order.deliveryAddress.street}</div>
            ${order.deliveryAddress.postalCode !== '00000' ? `<div style="font-size: 16px; font-weight: bold; margin-bottom: 3px;">${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}</div>` : ''}
            ${order.deliveryAddress.complement ? `<div style="font-size: 16px; font-weight: bold; margin-bottom: 3px;"><strong>Instructions:</strong> ${order.deliveryAddress.complement}</div>` : ''}
            <div style="font-size: 16px; font-weight: bold;"><strong>Paiement:</strong> ${order.paymentMethod === 'card' ? 'CARTE' : 'ESPECES'}</div>
          </div>

          <div style="margin-bottom: 15px; border-bottom: 1px solid black; padding-bottom: 10px;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">ARTICLES</div>
            ${order.items.map(item => {
              const customDetails = renderCustomIngredients(item.customIngredients);
              return `
                <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #ccc;">
                  <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-bottom: 3px;">
                    <span>${item.quantity}x ${formatProductName(item)}</span>
                    <span>${(item.quantity * item.price).toFixed(2)}€</span>
                  </div>
                  ${customDetails && customDetails.length > 0 ? `
                    <div style="font-size: 14px; color: #333; margin-top: 3px;">
                      ${customDetails.map(detail => `<div style="font-weight: bold;">• ${detail}</div>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <div style="border-top: 2px solid black; padding-top: 10px; font-weight: bold; font-size: 18px; display: flex; justify-content: space-between;">
            <span>TOTAL:</span>
            <span>${order.total.toFixed(2)}€</span>
          </div>

          <div style="text-align: center; border-top: 1px dashed #999; padding-top: 10px; margin-top: 15px;">
            <div style="font-weight: bold; font-size: 18px; margin-bottom: 3px;">MERCI POUR VOTRE COMMANDE !</div>
            <div style="font-weight: bold; font-size: 16px;">BON APPÉTIT !</div>
          </div>
        </body>
      </html>
    `;

    // Méthode 1: Essayer d'ouvrir dans un nouvel onglet
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Attendre que le contenu soit chargé avant d'imprimer
        printWindow.onload = () => {
          setTimeout(() => {
            // Forcer l'application des styles d'impression sur mobile
            const style = printWindow.document.createElement('style');
            style.textContent = `
              @media print {
                body { 
                  font-size: 20px !important; 
                  padding: 2px !important;
                  margin: 0 !important;
                }
                @page {
                  margin: 0 !important;
                }
              }
            `;
            printWindow.document.head.appendChild(style);
            printWindow.print();
          }, 500);
        };
      } else {
        // Méthode 2: Fallback - créer un blob et télécharger
        fallbackPrint(printContent);
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      // Méthode 3: Fallback - afficher dans la même fenêtre
      fallbackPrint(printContent);
    }
  };

  const fallbackPrint = (content: string) => {
    // Créer un blob avec le contenu HTML
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-commande-${order._id}.html`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Afficher un message à l'utilisateur
    alert('Le ticket a été téléchargé. Ouvrez le fichier dans votre navigateur et utilisez Ctrl+P pour imprimer.');
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
