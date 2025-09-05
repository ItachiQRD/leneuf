// Ce fichier n'est plus utilisé car nous utilisons maintenant le Toaster de shadcn/ui
// Voir src/components/ui/Toast.tsx et src/components/ui/Toaster.tsx

import React from 'react';
import { useToast } from '@/contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm rounded-lg shadow-lg p-4 transition-all transform animate-in slide-in-from-right ${
            toast.variant === 'destructive'
              ? 'bg-red-600 text-white'
              : toast.variant === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-900'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{toast.title}</h3>
              {toast.description && (
                <p className="mt-1 text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-current opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
          {toast.action}
        </div>
      ))}
    </div>
  );
}
