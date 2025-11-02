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
  customIngredients?: any; // Pour les compositions personnalisées (tacos, paninis)
  options?: any[]; // Pour les options sélectionnées (sauces, boissons, etc.)
  config?: any; // Pour les menus pizzas avec tous les détails (pizzas, boissons, nuggets/wings, brownies)
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  promotionDiscount: number;
  promotionDescription: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromotion: (discount: number, description: string) => void;
  removePromotion: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [promotionDescription, setPromotionDescription] = useState('');
  const { showToast } = useToast();

  // Load cart and promotions from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedPromotionDiscount = localStorage.getItem('promotionDiscount');
    const savedPromotionDescription = localStorage.getItem('promotionDescription');
    
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedPromotionDiscount) {
      setPromotionDiscount(parseFloat(savedPromotionDiscount));
    }
    if (savedPromotionDescription) {
      setPromotionDescription(savedPromotionDescription);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Save promotions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('promotionDiscount', promotionDiscount.toString());
    localStorage.setItem('promotionDescription', promotionDescription);
  }, [promotionDiscount, promotionDescription]);

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
    setPromotionDiscount(0);
    setPromotionDescription('');
    showToast({
      title: 'Panier vidé',
      description: 'Tous les articles ont été retirés du panier',
    });
  };

  const applyPromotion = (discount: number, description: string) => {
    setPromotionDiscount(discount);
    setPromotionDescription(description);
    showToast({
      title: 'Promotion appliquée',
      description: description,
    });
  };

  const removePromotion = () => {
    setPromotionDiscount(0);
    setPromotionDescription('');
    showToast({
      title: 'Promotion retirée',
      description: 'La promotion a été retirée de votre panier',
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        promotionDiscount,
        promotionDescription,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromotion,
        removePromotion,
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
