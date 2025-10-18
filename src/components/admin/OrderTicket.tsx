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

  const formatOptionName = (option: any) => {
    const nameMap: { [key: string]: string } = {
      'Viandes': 'Viandes',
      'Sauces': 'Sauces',
      'Suppléments': 'Suppléments',
      'Ingrédients de base': 'Ingrédients',
      'Taille': 'Taille',
      'Type': 'Type'
    };
    return nameMap[option.name] || option.name;
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

        {/* Ticket Content - Style ticket de magasin */}
        <div className="p-4 print:p-2" id="ticket-content">
          {/* Restaurant Info - Style ticket */}
          <div className="text-center mb-4 print:mb-2">
            <div className="border-b-2 border-gray-800 pb-2 print:pb-1">
              <h1 className="text-3xl font-bold print:text-2xl">LE 9</h1>
              <p className="text-sm print:text-xs">RESTAURANT FAST-FOOD</p>
            </div>
            <div className="mt-2 text-xs print:text-xs">
              {new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Order Info - Style ticket */}
          <div className="border-b border-dashed border-gray-400 pb-2 mb-3 print:pb-1 print:mb-2">
            <div className="text-center">
              <div className="text-sm font-bold print:text-xs">COMMANDE #{order._id.slice(-8)}</div>
              <div className="text-xs print:text-xs">
                {new Date(order.createdAt).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Customer Info - Style ticket */}
          <div className="mb-3 print:mb-2">
            <div className="text-xs font-bold print:text-xs mb-1">CLIENT:</div>
            <div className="text-xs print:text-xs">
              {order.userId?.name || order.customer?.name || 'N/A'}
            </div>
            <div className="text-xs print:text-xs">
              TEL: {order.userId?.phone || order.customer?.phone || 'N/A'}
            </div>
            {order.userId?.email && (
              <div className="text-xs print:text-xs">
                EMAIL: {order.userId.email}
              </div>
            )}
            <div className="text-xs print:text-xs">
              PAIEMENT: {order.customer?.paymentMethod === 'card' ? 'CARTE' : 
                         order.customer?.paymentMethod === 'cash' ? 'ESPECES' : 'N/A'}
            </div>
          </div>

          {/* Delivery Address - Style ticket */}
          <div className="mb-3 print:mb-2">
            <div className="text-xs font-bold print:text-xs mb-1">LIVRAISON:</div>
            <div className="text-xs print:text-xs">
              {order.deliveryAddress.street}
            </div>
            <div className="text-xs print:text-xs">
              {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
            </div>
            {order.deliveryAddress.complement && (
              <div className="text-xs print:text-xs">
                {order.deliveryAddress.complement}
              </div>
            )}
            {order.customer?.deliveryInstructions && (
              <div className="text-xs print:text-xs mt-1">
                NOTE: {order.customer.deliveryInstructions}
              </div>
            )}
          </div>

          {/* Order Items - Style ticket */}
          <div className="mb-3 print:mb-2">
            <div className="border-b border-dashed border-gray-400 pb-1 mb-2 print:pb-1 print:mb-1">
              <div className="text-xs font-bold print:text-xs">ARTICLES:</div>
            </div>
            <div className="space-y-1 print:space-y-0">
              {order.items.map((item, index) => (
                <div key={index} className="text-xs print:text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold">
                        {item.quantity}x {formatProductName(item)}
                      </div>
                      <div className="text-xs">
                        @ {item.price.toFixed(2)}€
                      </div>
                      
                      {/* Product Options - Style ticket */}
                      {item.options && item.options.length > 0 && (
                        <div className="ml-2 mt-1">
                          {item.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="text-xs">
                              + {formatOptionName(option)}: {option.choice.name}
                              {option.choice.price > 0 && ` (+${option.choice.price.toFixed(2)}€)`}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Custom Ingredients - Style ticket */}
                      {item.customIngredients && (
                        <div className="ml-2 mt-1">
                          {item.customIngredients.baseIngredients && item.customIngredients.baseIngredients.length > 0 && (
                            <div className="text-xs">
                              + Base: {item.customIngredients.baseIngredients.map((ing: any) => ing.name).join(', ')}
                            </div>
                          )}
                          {item.customIngredients.supplements && item.customIngredients.supplements.length > 0 && (
                            <div className="text-xs">
                              + Supp: {item.customIngredients.supplements.map((sup: any) => sup.name).join(', ')}
                            </div>
                          )}
                          {item.customIngredients.sauces && item.customIngredients.sauces.length > 0 && (
                            <div className="text-xs">
                              + Sauce: {item.customIngredients.sauces.map((sauce: any) => sauce.name).join(', ')}
                            </div>
                          )}
                          {item.customIngredients.meats && item.customIngredients.meats.length > 0 && (
                            <div className="text-xs">
                              + Viande: {item.customIngredients.meats.map((meat: any) => meat.name).join(', ')}
                            </div>
                          )}
                          {item.customIngredients.ingredients && item.customIngredients.ingredients.length > 0 && (
                            <div className="text-xs">
                              + Ingr: {item.customIngredients.ingredients.map((ing: any) => ing.name).join(', ')}
                            </div>
                          )}
                          {item.customIngredients.size && (
                            <div className="text-xs">
                              + Taille: {item.customIngredients.size}
                            </div>
                          )}
                          {item.customIngredients.type && (
                            <div className="text-xs">
                              + Type: {item.customIngredients.type}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-right">
                      {(item.quantity * item.price).toFixed(2)}€
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total - Style ticket */}
          <div className="border-t-2 border-gray-800 pt-2 print:pt-1 print:border-gray-800">
            <div className="flex justify-between items-center font-bold text-sm print:text-xs">
              <span>TOTAL:</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Notes - Style ticket */}
          {order.notes && (
            <div className="mt-2 print:mt-1">
              <div className="text-xs font-bold print:text-xs">NOTE:</div>
              <div className="text-xs print:text-xs">{order.notes}</div>
            </div>
          )}

          {/* Footer - Style ticket */}
          <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-center print:mt-2 print:pt-1 print:border-gray-400">
            <div className="text-xs print:text-xs">
              MERCI POUR VOTRE COMMANDE !
            </div>
            <div className="text-xs print:text-xs mt-1">
              BON APPETIT ! 🍔
            </div>
            <div className="text-xs print:text-xs mt-2">
              {new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
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

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ticket-content, #ticket-content * {
            visibility: visible;
          }
          #ticket-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
