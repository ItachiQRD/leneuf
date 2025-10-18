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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

        {/* Ticket Content - Optimisé pour l'impression */}
        <div className="p-6 print:p-4" id="ticket-content">
          {/* Restaurant Info */}
          <div className="text-center mb-6 print:mb-4">
            <h1 className="text-2xl font-bold text-gray-900 print:text-xl">Le 9</h1>
            <p className="text-gray-600 print:text-sm">Restaurant Fast-Food</p>
            <p className="text-sm text-gray-500 print:text-xs">
              {new Date().toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Order Info */}
          <div className="border-b border-gray-200 pb-4 mb-4 print:pb-2 print:mb-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 print:text-sm">Commande #{order._id.slice(-8)}</span>
              <span className="text-sm text-gray-600 print:text-xs">
                {new Date(order.createdAt).toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium print:text-xs ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status === 'pending' ? 'En attente' :
                 order.status === 'processing' ? 'En cours' :
                 order.status === 'completed' ? 'Terminée' : 'Annulée'}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 print:mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 print:text-sm print:mb-2">Informations Client</h3>
            <div className="bg-gray-50 rounded-lg p-4 print:bg-white print:p-2 print:border print:border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 print:text-xs">Nom:</p>
                  <p className="text-gray-900 print:text-xs">
                    {order.userId?.name || order.customer?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 print:text-xs">Téléphone:</p>
                  <p className="text-gray-900 print:text-xs">
                    {order.userId?.phone || order.customer?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 print:text-xs">Email:</p>
                  <p className="text-gray-900 print:text-xs">
                    {order.userId?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 print:text-xs">Mode de paiement:</p>
                  <p className="text-gray-900 print:text-xs">
                    {order.customer?.paymentMethod === 'card' ? 'Carte bancaire' : 
                     order.customer?.paymentMethod === 'cash' ? 'Espèces' : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-6 print:mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 print:text-sm print:mb-2">Adresse de Livraison</h3>
            <div className="bg-gray-50 rounded-lg p-4 print:bg-white print:p-2 print:border print:border-gray-300">
              <p className="text-gray-900 print:text-xs">{order.deliveryAddress.street}</p>
              <p className="text-gray-900 print:text-xs">
                {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
              </p>
              {order.deliveryAddress.complement && (
                <p className="text-gray-600 print:text-xs">{order.deliveryAddress.complement}</p>
              )}
              {order.customer?.deliveryInstructions && (
                <div className="mt-2 pt-2 border-t border-gray-200 print:border-gray-400">
                  <p className="text-sm font-medium text-gray-700 print:text-xs">Instructions:</p>
                  <p className="text-gray-600 print:text-xs">{order.customer.deliveryInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6 print:mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 print:text-sm print:mb-2">Articles Commandés</h3>
            <div className="space-y-3 print:space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 print:border-gray-400 print:p-2">
                  <div className="flex justify-between items-start mb-2 print:mb-1">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 print:text-sm">
                        {formatProductName(item)}
                      </div>
                      <div className="text-sm text-gray-600 print:text-xs">
                        Quantité: {item.quantity} × {item.price.toFixed(2)} €
                      </div>
                    </div>
                    <div className="font-medium text-lg print:text-sm">
                      {(item.quantity * item.price).toFixed(2)} €
                    </div>
                  </div>
                  
                  {/* Product Options */}
                  {item.options && item.options.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 print:border-gray-400">
                      <div className="text-sm font-medium text-gray-700 mb-1 print:text-xs">Personnalisations:</div>
                      <div className="space-y-1 print:space-y-0">
                        {item.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex justify-between items-center text-sm print:text-xs">
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
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 print:pt-2 print:border-gray-400">
            <div className="flex justify-between items-center font-bold text-xl print:text-lg">
              <span>Total</span>
              <span>{order.total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-4 pt-4 border-t border-gray-200 print:pt-2 print:border-gray-400">
              <h4 className="font-semibold text-gray-900 mb-2 print:text-sm">Notes:</h4>
              <p className="text-gray-600 print:text-xs">{order.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center print:mt-4 print:pt-2 print:border-gray-400">
            <p className="text-sm text-gray-500 print:text-xs">
              Merci pour votre commande ! Bon appétit ! 🍔
            </p>
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
