import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Plus, Minus, Info } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { Badge } from '@/components/ui/Badge';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAddToCart: (quantity: number) => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onAddToCart
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
    onClose();
  };

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev =>
      prev.includes(extra)
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
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
              <Dialog.Panel className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white">
                <div className="relative aspect-video">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Dialog.Title className="text-2xl font-playfair font-bold">
                        {product.name}
                      </Dialog.Title>
                      <p className="text-text-secondary mt-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {product.isVegetarian && (
                        <Badge variant="success">Végétarien</Badge>
                      )}
                      {product.isSpicy && (
                        <Badge variant="error">Épicé</Badge>
                      )}
                    </div>
                  </div>

                  {/* Tailles */}
                  {product.sizes && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Taille</h3>
                      <div className="flex gap-3">
                        {product.sizes.map((size: any) => (
                          <button
                            key={size.name}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                              selectedSize === size
                                ? 'border-primary bg-primary/5'
                                : 'border-border-light hover:border-primary'
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {size.name}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {size.price.toFixed(2)}€
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extras */}
                  {product.extras && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Extras</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {product.extras.map((extra: any) => (
                          <button
                            key={extra.name}
                            onClick={() => toggleExtra(extra.name)}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                              selectedExtras.includes(extra.name)
                                ? 'border-primary bg-primary/5'
                                : 'border-border-light hover:border-primary'
                            }`}
                          >
                            <span className="text-sm">{extra.name}</span>
                            <span className="text-sm text-text-secondary">
                              +{extra.price.toFixed(2)}€
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantité et ajout au panier */}
                  <div className="flex items-center justify-between pt-6 border-t border-border-light">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 rounded-full hover:bg-surface-alt transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-lg font-medium w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 rounded-full hover:bg-surface-alt transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      className="min-w-[200px]"
                    >
                      Ajouter au panier - {(
                        (selectedSize?.price || product.price) * quantity +
                        selectedExtras.reduce(
                          (acc, extra) => 
                            acc + (product.extras.find((e: any) => e.name === extra)?.price || 0),
                          0
                        )
                      ).toFixed(2)}€
                    </Button>
                  </div>

                  {/* Allergènes */}
                  {product.allergens && product.allergens.length > 0 && (
                    <div className="flex items-start gap-2 mt-4 pt-4 border-t border-border-light">
                      <Info className="w-4 h-4 text-text-tertiary mt-0.5" />
                      <p className="text-xs text-text-tertiary">
                        Allergènes : {product.allergens.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}