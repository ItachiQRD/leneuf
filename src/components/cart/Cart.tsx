import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Panier
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Fermer</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {/* Contenu du panier ici */}
                          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            Votre panier est vide
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <p>Total</p>
                        <p>0.00 €</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Livraison calculée à la commande.
                      </p>
                      <div className="mt-6">
                        <button
                          className="w-full rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-600"
                          onClick={onClose}
                        >
                          Commander
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          ou{' '}
                          <button
                            type="button"
                            className="font-medium text-primary hover:text-primary-600"
                            onClick={onClose}
                          >
                            Continuer mes achats
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
