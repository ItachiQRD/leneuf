import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { href: '/', label: 'Accueil' },
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'À Propos' },
    { href: '/contact', label: 'Contact' },
  ];

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
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white/95 backdrop-blur-md shadow-xl">
                    <div className="flex items-center justify-between px-4 py-6 bg-white/80 backdrop-blur-md">
                      <Dialog.Title className="text-2xl font-bold font-playfair text-gray-900">
                        Menu
                      </Dialog.Title>
                      <button
                        type="button"
                        className="relative -m-2 p-2 text-gray-900 hover:text-primary transition-colors"
                        onClick={onClose}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Fermer</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-6 flow-root">
                      <div className="space-y-8 px-6">
                        {menuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block text-xl font-medium text-gray-900 hover:text-primary transition-colors"
                            onClick={onClose}
                          >
                            {item.label}
                          </Link>
                        ))}
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
