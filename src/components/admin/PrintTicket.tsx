import React, { useRef } from 'react';
import { Printer, Download, X } from 'lucide-react';

interface PrintTicketProps {
  order: any;
  onClose: () => void;
}

export default function PrintTicket({ order, onClose }: PrintTicketProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Impossible d\'ouvrir la fenêtre d\'impression. Veuillez autoriser les popups.');
      return;
    }

    // Copier le contenu du ticket
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              color: black;
              background: white;
              margin: 0;
              padding: 10px;
            }
            @media print {
              body { margin: 0; padding: 5px; }
              .no-print { display: none !important; }
            }
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
          </style>
        </head>
        <body>
          ${printContent}
          <div class="print-controls no-print">
            <button class="print-button" onclick="window.print()">
              <span style="margin-right: 5px;">🖨️</span>Imprimer
            </button>
            <button class="print-button secondary" onclick="window.close()">
              <span style="margin-right: 5px;">❌</span>Fermer
            </button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    // Auto-print après un court délai
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownload = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - LE NEUF</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              color: black;
              background: white;
              margin: 0;
              padding: 10px;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `], { type: 'text/html' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-commande-${order._id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Aperçu d'impression</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl font-bold"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu du ticket */}
        <div className="p-4">
          <div ref={printRef} className="bg-white text-black p-4 border border-gray-300">
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-2 mb-4">
              <div className="text-lg font-black">LE NEUF</div>
              <div className="font-bold">Fast Food & Grill</div>
              <div className="font-bold">Commande #{order._id}</div>
              <div className="font-bold">
                {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Client & Livraison */}
            <div className="mb-4 border-b border-black pb-2">
              <div className="font-black text-sm mb-1">CLIENT & LIVRAISON</div>
              <div className="text-xs space-y-1">
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

            {/* Articles */}
            <div className="mb-4 border-b border-black pb-2">
              <div className="font-black text-sm mb-2">ARTICLES</div>
              <div className="space-y-2">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="text-xs border-b border-gray-300 pb-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-black">
                          {item.quantity}x {item.productName}
                        </div>
                        {item.customIngredients && (
                          <div className="text-xs text-gray-600 mt-1">
                            {Object.entries(item.customIngredients).map(([key, value]: [string, any]) => (
                              <div key={key} className="font-bold">
                                • {key}: {Array.isArray(value) ? value.join(', ') : value}
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
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-black pt-2 font-black text-sm flex justify-between">
              <span>TOTAL:</span>
              <span>{order.total.toFixed(2)}€</span>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-dashed border-gray-400 pt-2 mt-4">
              <div className="font-black text-xs">MERCI POUR VOTRE COMMANDE !</div>
              <div className="font-bold text-xs">BON APPÉTIT !</div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}
