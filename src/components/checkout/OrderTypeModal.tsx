import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingBag, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'delivery' | 'pickup') => void;
}

export default function OrderTypeModal({ isOpen, onClose, onSelect }: OrderTypeModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                    Mode de commande
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comment souhaitez-vous recevoir votre commande ?
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelect('delivery');
                      onClose();
                    }}
                    className="flex items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-4">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        En livraison
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Livraison à votre adresse
                      </p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelect('pickup');
                      onClose();
                    }}
                    className="flex items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        À emporter
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Récupération sur place
                      </p>
                    </div>
                  </motion.button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

