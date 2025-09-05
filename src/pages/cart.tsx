import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold">Votre panier est vide</h2>
          <p className="mt-2 text-gray-600">
            Ajoutez des articles à votre panier pour commencer votre commande
          </p>
          <Link href="/menu">
            <Button className="mt-6">
              Voir le menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 p-4 mb-4 bg-white rounded-lg shadow"
              >
                {item.image && (
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 96px) 100vw, 96px"
                    />
                  </div>
                )}

                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.price.toFixed(2)} €</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            variant="destructive"
            className="mt-4"
            onClick={clearCart}
          >
            Vider le panier
          </Button>
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span>Gratuit</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <Button className="w-full">
              Passer la commande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
