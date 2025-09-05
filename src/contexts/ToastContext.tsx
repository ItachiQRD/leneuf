// contexts/ToastContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
  action?: React.ReactNode;
};

interface ToastContextType {
  toasts: ToastType[];
  showToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
  toast: (options: {
    title?: string;
    description: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = useCallback((toast: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(({
    title,
    description,
    variant = 'default',
  }: {
    title?: string;
    description: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';
  }) => {
    const message = title ? `${title}: ${description}` : description;

    switch (variant) {
      case 'success':
        // toastify.success(message);
        break;
      case 'error':
      case 'destructive':
        // toastify.error(message);
        break;
      case 'warning':
        // toastify.warning(message);
        break;
      case 'info':
        // toastify.info(message);
        break;
      default:
        // toastify(message);
        break;
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}