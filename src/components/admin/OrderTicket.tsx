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
      // Vérifier si c'est une pizza
      if (item.category === 'pizzas' || item.productName.toLowerCase().includes('pizza')) {
        return `${item.productName} (Pizza)`;
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

  // Fonction pour afficher les customIngredients de manière simplifiée
  const renderCustomIngredients = (customIngredients: any) => {
    if (!customIngredients) return null;

    const details = [];

    // Informations de base pour burgers/sandwichs
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

    // Informations pour tacos/paninis
    if (customIngredients.baseIngredients && customIngredients.baseIngredients.length > 0) {
      details.push(`Base: ${customIngredients.baseIngredients.map((ing: any) => ing.name).join(', ')}`);
    }

    if (customIngredients.supplements && customIngredients.supplements.length > 0) {
      details.push(`Suppléments: ${customIngredients.supplements.map((sup: any) => sup.name).join(', ')}`);
    }

    // Gestion des sauces (éviter les doublons)
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
      details.push(`Viandes: ${customIngredients.meats.map((meat: any) => meat.name).join(', ')}`);
    }

    if (customIngredients.ingredients && customIngredients.ingredients.length > 0) {
      details.push(`Ingrédients: ${customIngredients.ingredients.map((ing: any) => ing.name).join(', ')}`);
    }

    if (customIngredients.size) {
      details.push(`Taille: ${customIngredients.size}`);
    }

    // Type supprimé pour simplifier l'affichage

    return details.length > 0 ? details : null;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
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

        {/* Ticket Content - Optimisé pour imprimante thermique */}
        <div className="p-4 print:p-1 ticket-container" id="ticket-content">
          {/* Restaurant Info */}
          <div className="text-center mb-3 print:mb-2">
            <div className="border-b-2 border-gray-800 pb-2 print:pb-1">
              <h1 className="text-3xl font-bold print:text-4xl">LE 9</h1>
              <p className="text-sm print:text-lg">RESTAURANT FAST-FOOD</p>
            </div>
            <div className="mt-2 text-xs print:text-base">
              {new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Customer & Delivery Info - Fusionné */}
          <div className="mb-3 print:mb-2">
            <div className="text-xs font-bold print:text-base mb-1">CLIENT & LIVRAISON:</div>
            <div className="text-xs print:text-base">
              {order.userId?.name || order.customer?.name || 'N/A'}
            </div>
            <div className="text-xs print:text-base">
              TEL: {order.userId?.phone || order.customer?.phone || 'N/A'}
            </div>
            {order.userId?.email && (
              <div className="text-xs print:text-base">
                EMAIL: {order.userId.email}
              </div>
            )}
            <div className="text-xs print:text-base">
              PAIEMENT: {order.customer?.paymentMethod === 'card' ? 'CARTE' : 
                         order.customer?.paymentMethod === 'cash' ? 'ESPECES' : 'N/A'}
            </div>
            <div className="text-xs print:text-base mt-1">
              ADRESSE: {order.deliveryAddress.street}
            </div>
            <div className="text-xs print:text-base">
              {order.deliveryAddress.postalCode !== '00000' ? `${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}` : order.deliveryAddress.city}
            </div>
            {order.deliveryAddress.complement && (
              <div className="text-xs print:text-base">
                {order.deliveryAddress.complement}
              </div>
            )}
            {order.customer?.deliveryInstructions && (
              <div className="text-xs print:text-base mt-1">
                NOTE: {order.customer.deliveryInstructions}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-3 print:mb-2 print:page-break-inside-auto">
            <div className="pb-1 mb-2 print:pb-1 print:mb-1">
              <div className="text-xs font-bold print:text-base">ARTICLES:</div>
            </div>
            <div className="space-y-2 print:space-y-1 print:page-break-inside-auto">
              {order.items.map((item, index) => {
                const customDetails = renderCustomIngredients(item.customIngredients);
                
                return (
                  <div key={index} className="text-xs print:text-base border-b border-gray-200 pb-1 print:pb-0 print:page-break-inside-auto">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold">
                          {item.quantity}x {formatProductName(item)}
                        </div>
                        
                        {/* Détails personnalisés - affichage simplifié avec saut de ligne */}
                        {customDetails && customDetails.length > 0 && (
                          <div className="text-xs print:text-base text-gray-600">
                            {customDetails
                              .filter((detail: string) => {
                                // Ne pas afficher la taille pour les pizzas car elle est déjà affichée au-dessus
                                if (detail.startsWith('Taille:') && 
                                    (item.category === 'pizzas' || item.productName.toLowerCase().includes('pizza'))) {
                                  return false;
                                }
                                return true;
                              })
                              .map((detail, detailIndex) => (
                                <div key={detailIndex} className="mt-1">
                                  • {detail}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-right ml-2">
                        {(item.quantity * item.price).toFixed(2)}€
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 border-gray-800 pt-2 print:pt-1 print:border-gray-800 total-section">
            <div className="flex justify-between items-center font-bold text-sm print:text-lg">
              <span>TOTAL:</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-2 print:mt-1">
              <div className="text-xs font-bold print:text-base">NOTE:</div>
              <div className="text-xs print:text-base">{order.notes}</div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-center print:mt-2 print:pt-1 print:border-gray-400 ticket-footer">
            <div className="text-xs print:text-base">
              MERCI POUR VOTRE COMMANDE !
            </div>
            <div className="text-xs print:text-base mt-1">
              BON APPETIT !
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 p-4 rounded-b-lg print:hidden">
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

      {/* Print Styles optimisés pour imprimante thermique */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ticket-content, #ticket-content * {
            visibility: visible;
          }
          #ticket-content {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            font-family: 'Courier New', monospace !important;
            font-size: 12px !important;
            line-height: 1.2 !important;
            color: black !important;
            padding: 5px !important;
            max-height: none !important;
            overflow: visible !important;
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* Supprimer toutes les bordures et ombres pour l'impression thermique */
          * {
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          /* Garder seulement les bordures de séparation essentielles */
          .border-b-2, .border-t-2 {
            border-bottom: 2px solid black !important;
            border-top: 2px solid black !important;
          }
          .border-b, .border-t {
            border-bottom: 1px solid black !important;
            border-top: 1px solid black !important;
          }
          .border-dashed {
            border-style: dashed !important;
          }
          /* S'assurer que tout le contenu est visible */
          body, html {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          /* Espacement simplifié */
          .space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }
          .space-y-1 > * + * {
            margin-top: 0.25rem !important;
          }
          /* Layout simplifié pour l'impression */
          .flex {
            display: block !important;
          }
          .flex-1 {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
