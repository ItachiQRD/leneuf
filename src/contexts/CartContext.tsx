import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'food' | 'drink' | 'dessert' | 'side';
  category?: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === newItem._id);
      
      if (existingItem) {
        showToast({
          title: 'Quantité mise à jour',
          description: `${existingItem.name} a été ajouté au panier`,
        });
        return prevItems.map(item =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      showToast({
        title: 'Article ajouté',
        description: `${newItem.name} a été ajouté au panier`,
      });
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item._id === itemId);
      if (itemToRemove) {
        showToast({
          title: 'Article retiré',
          description: `${itemToRemove.name} a été retiré du panier`,
        });
      }
      return prevItems.filter(item => item._id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) return;

    setItems(prevItems => {
      if (quantity === 0) {
        return prevItems.filter(item => item._id !== itemId);
      }

      return prevItems.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    showToast({
      title: 'Panier vidé',
      description: 'Tous les articles ont été retirés du panier',
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
