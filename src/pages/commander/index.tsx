import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Clock, MapPin, Phone, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import TacosComposer from '@/components/commander/TacosComposer';

export default function CommanderPage() {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount, addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('sandwichs');
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showTacosComposer, setShowTacosComposer] = useState(false);

  // Données de menu
  const menuCategories = [
    { id: 'sandwichs', name: 'Sandwichs', active: true },
    { id: 'burgers', name: 'Burgers', active: false },
    { id: 'pizzas', name: 'Pizzas', active: false },
    { id: 'assiettes', name: 'Assiettes', active: false },
    { id: 'accompagnements', name: 'Accompagnements', active: false },
    { id: 'tacos', name: 'Tacos / Bowls', active: false },
    { id: 'paninis', name: 'Paninis', active: false },
    { id: 'boissons', name: 'Boissons', active: false },
    { id: 'desserts', name: 'Desserts', active: false },
  ];

  // Charger les produits quand la catégorie change
  useEffect(() => {
    if (selectedCategory === 'tacos') {
      setProducts([]);
      return;
    }
    
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const fetchProducts = async (category: string) => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`/api/products/by-category/${category}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleAddToCart = (item: any) => {
    const cartItem = {
      _id: item._id || item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      type: item.productType || 'food'
    };
    addItem(cartItem);
  };

  const handleTacosClick = () => {
    setShowTacosComposer(true);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login?redirect=/commander';
      return;
    }

    setIsLoading(true);
    try {
      console.log('Commande en cours...', { items, total });
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      window.location.href = '/commande-confirmee';
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="flex h-screen">
        {/* Menu de gauche */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Menu</h2>
            <nav className="space-y-2">
              {menuCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu central - Articles */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {menuCategories.find(c => c.id === selectedCategory)?.name}
          </h1>
          
          {selectedCategory === 'tacos' ? (
            /* Interface spéciale pour les tacos */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌮</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Composez votre Tacos ou Bowl
              </h2>
              <p className="text-gray-600 mb-8">
                Choisissez votre type, taille, viande, sauces et suppléments
              </p>
              <button
                onClick={handleTacosClick}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                Commencer la composition
              </button>
            </div>
          ) : (
            /* Liste des produits normaux */
            <div className="space-y-4">
              {loadingProducts ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des produits...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun produit disponible dans cette catégorie</p>
                </div>
              ) : (
                products.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || '/images/placeholder-food.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description || 'Délicieux plat préparé avec soin'}
                      </p>
                      {item.baseIngredients && item.baseIngredients.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ingrédients: {item.baseIngredients.join(', ')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-red-600">
                        {item.price.toFixed(2)} €
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Panier de droite */}
        <div className="w-80 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <ShoppingCart className="w-6 h-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Panier</h2>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.image || '/images/placeholder-food.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {total.toFixed(2)} €
                </span>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Commande en cours...' : 'Commander'}
              </button>
              
              {!isAuthenticated && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Vous devez être connecté pour commander
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Composant de composition des tacos */}
      <TacosComposer
        isOpen={showTacosComposer}
        onClose={() => setShowTacosComposer(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
