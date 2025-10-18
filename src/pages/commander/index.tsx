import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Clock, MapPin, Phone, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import TacosComposer from '@/components/commander/TacosComposer';
import MenuSelector from '@/components/commander/MenuSelector';
import PaniniComposer from '@/components/commander/PaniniComposer';
import BurgerSandwichComposer from '@/components/commander/BurgerSandwichComposer';
import TexMexComposer from '@/components/commander/TexMexComposer';

export default function CommanderPage() {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount, addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ptite-faim');
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showTacosComposer, setShowTacosComposer] = useState(false);
  const [showMenuSelector, setShowMenuSelector] = useState(false);
  const [showPaniniComposer, setShowPaniniComposer] = useState(false);
  const [showBurgerSandwichComposer, setShowBurgerSandwichComposer] = useState(false);
  const [showTexMexComposer, setShowTexMexComposer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [productForSize, setProductForSize] = useState<any>(null);
  const [selectedSauce, setSelectedSauce] = useState<any>(null);
  const [sauces, setSauces] = useState<any[]>([]);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [productForCustomization, setProductForCustomization] = useState<any>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedSauceForProduct, setSelectedSauceForProduct] = useState<any>(null);
  const [selectedMenuOption, setSelectedMenuOption] = useState<string>(''); // 'frites' ou 'frites-boisson'
  const [selectedDrinks, setSelectedDrinks] = useState<any[]>([]);
  const [drinks, setDrinks] = useState<any[]>([]);

  // Données de menu
  const menuCategories = [
    { id: 'sandwichs', name: 'Sandwichs', active: true },
    { id: 'burgers', name: 'Burgers', active: false },
    { id: 'pizzas', name: 'Pizzas', active: false },
    { id: 'assiettes', name: 'Assiettes', active: false },
    { id: 'accompagnements', name: 'Accompagnements', active: false },
    { id: 'tacos', name: 'Tacos / Bowls', active: false },
    { id: 'paninis', name: 'Paninis', active: false },
    { id: 'tex-mex', name: 'Tex Mex', active: false },
    { id: 'ptite-faim', name: 'P\'tite Faim', active: false },
    { id: 'menu-enfants', name: 'Menu Enfants', active: false },
    { id: 'boissons', name: 'Boissons', active: false },
    { id: 'desserts', name: 'Desserts', active: false },
  ];

  // Charger les produits quand la catégorie change
  useEffect(() => {
    if (selectedCategory === 'tacos' || selectedCategory === 'paninis') {
      setProducts([]);
      return;
    }
    
    // Catégories avec produits statiques
    if (selectedCategory === 'tex-mex' || selectedCategory === 'ptite-faim' || selectedCategory === 'menu-enfants') {
      setProducts(getStaticProducts(selectedCategory));
      return;
    }
    
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  // Charger les sauces quand on ouvre le modal pour les accompagnements ou la personnalisation
  useEffect(() => {
    if ((showSizeSelector && selectedCategory === 'accompagnements' && sauces.length === 0) ||
        (showCustomizationModal && sauces.length === 0)) {
      fetchSauces();
    }
  }, [showSizeSelector, showCustomizationModal, selectedCategory, sauces.length]);

  // Charger les boissons quand on ouvre le modal de personnalisation pour Tex-Mex
  useEffect(() => {
    if (showCustomizationModal && selectedCategory === 'tex-mex' && drinks.length === 0) {
      fetchDrinks();
    }
  }, [showCustomizationModal, selectedCategory, drinks.length]);

  // Produits statiques basés sur le menu
  const getStaticProducts = (category: string) => {
    switch (category) {
      case 'tex-mex':
        return [
          {
            _id: 'tex-mex-7-pieces',
            name: '7 pièces + Frite + boisson',
            price: 8.5,
            image: '/images/tex-mex/tex-mex-7-pieces.jpeg',
            description: '7 pièces au choix (Tenders, Hot Wings, Nuggets, Mozza Stick) + Frite + Boisson',
            category: 'tex-mex',
            type: 'combo'
          },
          {
            _id: 'tex-mex-14-pieces',
            name: '14 pièces + 2 frites + 2 boissons',
            price: 14.9,
            image: '/images/tex-mex/tex-mex-14-pieces.jpeg',
            description: '14 pièces au choix + 2 Frites + 2 Boissons',
            category: 'tex-mex',
            type: 'combo'
          },
          {
            _id: 'tex-mex-20-pieces',
            name: '20 pièces + 4 Frites + boisson 1,5L',
            price: 20,
            image: '/images/tex-mex/tex-mex-20-pieces.png',
            description: '20 pièces au choix + 4 Frites + Boisson 1,5L',
            category: 'tex-mex',
            type: 'combo'
          }
        ];
      
      case 'ptite-faim':
        return [
          {
            _id: 'ptite-faim-3-nuggets',
            name: '3 Nuggets',
            price: 2.5,
            image: '/images/ptite-faim/3-nuggets.jpeg',
            description: '3 Nuggets croustillants',
            category: 'ptite-faim',
            type: 'snack'
          },
          {
            _id: 'ptite-faim-3-hot-wings',
            name: '3 Hot Wings',
            price: 2.5,
            image: '/images/ptite-faim/3-hot-wings.jpeg',
            description: '3 Ailes de poulet épicées',
            category: 'ptite-faim',
            type: 'snack'
          },
          {
            _id: 'ptite-faim-2-tenders',
            name: '2 Tenders',
            price: 2.5,
            image: '/images/ptite-faim/2-tenders.jpeg',
            description: '2 Tenders de poulet',
            category: 'ptite-faim',
            type: 'snack'
          },
          {
            _id: 'ptite-faim-petit-burger',
            name: 'P\'tit Burger',
            price: 2.5,
            image: '/images/ptite-faim/petit-burger.jpeg',
            description: 'Mini burger avec steak 45g',
            category: 'ptite-faim',
            type: 'snack'
          },
          {
            _id: 'ptite-faim-3-mozza-sticks',
            name: '3 Mozza Sticks',
            price: 2.5,
            image: '/images/ptite-faim/3-mozza-sticks.jpeg',
            description: '3 Bâtonnets de mozzarella',
            category: 'ptite-faim',
            type: 'snack'
          },
          {
            _id: 'ptite-faim-petite-salade',
            name: 'P\'tite Salade',
            price: 2.5,
            image: '/images/ptite-faim/petite-salade.jpeg',
            description: 'Salade tomate oignon',
            category: 'ptite-faim',
            type: 'snack'
          }
        ];
      
      case 'menu-enfants':
        return [
          {
            _id: 'menu-enfants-5-nuggets',
            name: '5 Nuggets + Frites',
            price: 6,
            image: '/images/menu-enfants/menu-enfants-nuggets.jpeg',
            description: '5 Nuggets + Frites + 1 Caprisun + une surprise',
            category: 'menu-enfants',
            type: 'menu'
          },
          {
            _id: 'menu-enfants-mini-kebab',
            name: 'Mini Kebab + Frites',
            price: 6,
            image: '/images/menu-enfants/menu-enfants-kebab.jpeg',
            description: 'Mini Kebab + Frites + 1 Caprisun + une surprise',
            category: 'menu-enfants',
            type: 'menu'
          },
          {
            _id: 'menu-enfants-cheese-burger',
            name: 'Cheese Burger + Frites',
            price: 6,
            image: '/images/menu-enfants/menu-enfants-burger.jpeg',
            description: 'Cheese Burger + Frites + 1 Caprisun + une surprise',
            category: 'menu-enfants',
            type: 'menu'
          }
        ];
      
      default:
        return [];
    }
  };

  const fetchProducts = async (category: string) => {
    setLoadingProducts(true);
    try {
      // Vérifier si c'est une catégorie statique
      const staticCategories = ['ptite-faim', 'tex-mex', 'menu-enfants'];
      if (staticCategories.includes(category)) {
        setProducts(getStaticProducts(category));
      } else {
        // Récupérer depuis l'API pour les autres catégories
      const response = await fetch(`/api/products/by-category/${category}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSauces = async () => {
    try {
      const response = await fetch('/api/products/tacos-options');
      const data = await response.json();
      if (data.success) {
        setSauces(data.data.sauces);
      }
    } catch (error) {
      console.error('Error fetching sauces:', error);
    }
  };

  const fetchDrinks = async () => {
    try {
      const response = await fetch('/api/products/boissons');
      const data = await response.json();
      if (data.success) {
        setDrinks(data.data);
      }
    } catch (error) {
      console.error('Error fetching drinks:', error);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // Fonction pour ajouter les produits personnalisés au panier (tacos, paninis)
  const handleAddCustomToCart = (item: any) => {
    addItem(item);
  };

  const handleAddToCart = (item: any) => {
    // Produits qui nécessitent une composition personnalisée (tacos, paninis)
    const needsCustomComposition = ['tacos', 'paninis'].includes(selectedCategory);
    
    if (needsCustomComposition) {
    if (selectedCategory === 'paninis') {
      setSelectedProduct(item);
      setShowPaniniComposer(true);
      return;
    }

    if (selectedCategory === 'tacos') {
      setShowTacosComposer(true);
      return;
    }
    }

    // Produits qui nécessitent une composition avec étapes (burgers, sandwichs, tex-mex)
    const needsStepComposition = ['burgers', 'sandwichs', 'tex-mex'].includes(selectedCategory);
    
    if (needsStepComposition) {
      if (selectedCategory === 'burgers' || selectedCategory === 'sandwichs') {
        setSelectedProduct(item);
        setShowBurgerSandwichComposer(true);
      return;
    }

      if (selectedCategory === 'tex-mex') {
        setSelectedProduct(item);
        setShowTexMexComposer(true);
      return;
      }
    }

    // Produits qui nécessitent une personnalisation simple (accompagnements, assiettes, ptite-faim)
    const needsCustomization = ['accompagnements', 'assiettes', 'ptite-faim'].includes(selectedCategory);
    
    if (needsCustomization) {
      setProductForCustomization(item);
      setSelectedIngredients([]);
      setSelectedSauceForProduct(null);
      setSelectedMenuOption('');
      setSelectedDrinks([]);
      setShowCustomizationModal(true);
      return;
    }

    // Produits qui nécessitent un sélecteur de taille (pizzas, boissons avec tailles multiples)
    const needsSizeSelector = (selectedCategory === 'pizzas') || 
                             (selectedCategory === 'boissons' && item.sizes && item.sizes.length > 1);
    
    if (needsSizeSelector) {
      setProductForSize(item);
      setShowSizeSelector(true);
      return;
    }

    // Tous les autres produits sont ajoutés directement au panier
    // Cela inclut : menu-enfants, boissons simples, desserts
      const cartItem = {
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
      category: item.category || selectedCategory,
        type: item.type || 'food'
    };
    addItem(cartItem);
  };

  const handleTacosClick = () => {
    setShowTacosComposer(true);
  };

  const handlePaniniClick = () => {
    setShowPaniniComposer(true);
  };

  const handleSizeSelect = (size: any) => {
    if (productForSize) {
      let price = size.price;
      let name = `${productForSize.name} (${size.name})`;
      
      // Pour les pizzas, utiliser les prix fixes
      if (selectedCategory === 'pizzas') {
        const isMargherita = productForSize.name.toLowerCase().includes('margherita') || 
                            productForSize.name.toLowerCase().includes('margarita');
        
        if (isMargherita) {
          // Margherita : 7€, 9€, 14€
          price = size.name === 'Junior' ? 7 : size.name === 'Senior' ? 9 : 14;
        } else {
          // Autres pizzas : 9€, 13€, 17€
          price = size.name === 'Junior' ? 9 : size.name === 'Senior' ? 13 : 17;
        }
      }
      
      // Pour les accompagnements, ajouter la sauce si sélectionnée
      if (selectedCategory === 'accompagnements' && selectedSauce) {
        name += ` + ${selectedSauce.name}`;
      }
      
      const cartItem = {
        _id: `${productForSize._id || productForSize.id}-${size.name}${selectedSauce ? `-${selectedSauce._id}` : ''}`,
        name: name,
        price: price,
        image: productForSize.image,
        category: productForSize.category,
        type: productForSize.productType || 'food'
      };
      addItem(cartItem);
    }
    setShowSizeSelector(false);
    setProductForSize(null);
    setSelectedSauce(null);
  };

  // Fonctions pour la personnalisation des produits
  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleSauceSelect = (sauce: any) => {
    setSelectedSauceForProduct(sauce);
  };

  const handleMenuOptionSelect = (option: string) => {
    setSelectedMenuOption(option);
  };

  const handleDrinkToggle = (drink: any) => {
    setSelectedDrinks(prev => {
      const isSelected = prev.some(d => d._id === drink._id);
      if (isSelected) {
        return prev.filter(d => d._id !== drink._id);
      } else {
        return [...prev, drink];
      }
    });
  };

  const getMaxDrinksForTexMex = () => {
    if (!productForCustomization) return 0;
    const productName = productForCustomization.name.toLowerCase();
    if (productName.includes('7 pièces')) return 1;
    if (productName.includes('14 pièces')) return 2;
    if (productName.includes('20 pièces')) return 1; // 1 boisson 1.5L
    return 0;
  };

  const getDrinkOptionsForTexMex = () => {
    if (drinks.length === 0) return [];
    
    const productName = productForCustomization?.name.toLowerCase() || '';
    
    if (productName.includes('7 pièces')) {
      // 7 pièces : toutes les boissons (choix libre)
      return drinks;
    } else if (productName.includes('14 pièces')) {
      // 14 pièces : toutes les boissons (choix libre)
      return drinks;
    } else if (productName.includes('20 pièces')) {
      // 20 pièces : seulement les boissons 1.5L
      return drinks.filter(drink => {
        // Vérifier si la boisson a une taille 1.5L dans le champ sizes
        if (drink.sizes && Array.isArray(drink.sizes)) {
          return drink.sizes.some((size: any) => {
            const volume = size.volume?.toLowerCase() || '';
            return volume.includes('1.5l') ||
                   volume.includes('1.5 l') ||
                   volume.includes('1,5l') ||
                   volume.includes('1,5 l') ||
                   volume.includes('1500ml') ||
                   volume.includes('1500 ml') ||
                   volume.includes('1l5') ||
                   volume.includes('1 l 5');
          });
        }
        
        // Fallback : vérifier dans le nom si pas de sizes
        const drinkName = drink.name.toLowerCase();
        return drinkName.includes('1.5l') ||
               drinkName.includes('1.5 l') ||
               drinkName.includes('1,5l') ||
               drinkName.includes('1,5 l') ||
               drinkName.includes('1500ml') ||
               drinkName.includes('1500 ml') ||
               drinkName.includes('1l5') ||
               drinkName.includes('1 l 5');
      });
    }
    
    return [];
  };

  const handleCustomizationConfirm = () => {
    if (!productForCustomization) return;

    // Calculer le prix total
    let totalPrice = productForCustomization.price;
    
    // Ajouter le prix des options menu pour burgers et sandwichs
    if (['burgers', 'sandwichs'].includes(selectedCategory)) {
      if (selectedMenuOption === 'frites') {
        totalPrice += 2; // Prix des frites
      } else if (selectedMenuOption === 'frites-boisson') {
        totalPrice += 4; // Prix des frites + boisson
      }
    }

    // Créer l'item personnalisé
    const cartItem = {
      _id: productForCustomization._id,
      name: productForCustomization.name,
      price: totalPrice,
      image: productForCustomization.image,
      category: productForCustomization.category || selectedCategory,
      type: productForCustomization.type || 'food',
      customIngredients: {
        ingredients: selectedIngredients,
        sauce: selectedSauceForProduct,
        menuOption: selectedMenuOption,
        drinks: selectedDrinks
      }
    };

    addItem(cartItem);
    
    // Fermer le modal et réinitialiser
    setShowCustomizationModal(false);
    setProductForCustomization(null);
    setSelectedIngredients([]);
    setSelectedSauceForProduct(null);
    setSelectedMenuOption('');
    setSelectedDrinks([]);
  };

  const handleCheckout = () => {
    if (!items || items.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    // Rediriger vers la page de checkout
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Menu de gauche */}
        <div className="w-64 bg-white shadow-lg flex flex-col flex-shrink-0">
          <div className="p-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Menu</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
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
          ) : selectedCategory === 'paninis' ? (
            /* Interface spéciale pour les paninis */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥪</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Composez votre Panini
              </h2>
              <p className="text-gray-600 mb-8">
                Choisissez votre viande, fromage et suppléments
              </p>
              <button
                onClick={handlePaniniClick}
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
              ) : !products || products.length === 0 ? (
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
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Image
                        src={item.image || '/images/placeholder-food.jpg'}
                        alt={item.name}
                        fill
                        className={`rounded-lg ${selectedCategory === 'boissons' ? 'object-contain' : 'object-cover'}`}
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
                        {selectedCategory === 'pizzas' ? (
                          (() => {
                            const isMargherita = item.name.toLowerCase().includes('margherita') || 
                                                item.name.toLowerCase().includes('margarita');
                            const minPrice = isMargherita ? 7 : 9;
                            const maxPrice = isMargherita ? 14 : 17;
                            return `${minPrice}€ - ${maxPrice}€`;
                          })()
                        ) : (
                          item.price && !isNaN(item.price) ? `${item.price.toFixed(2)}€` : 
                          item.sizes && item.sizes.length > 0 ? 
                          `À partir de ${Math.min(...item.sizes.map((s: any) => s.price)).toFixed(2)}€` : 
                          'Prix sur demande'
                        )}
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
        <div className="w-80 bg-white shadow-lg flex-shrink-0 hidden lg:block">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <ShoppingCart className="w-6 h-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Panier</h2>
            </div>
            
            {!items || items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {items && items.map((item) => (
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
                        {item.price && !isNaN(item.price) ? (item.price * item.quantity).toFixed(2) : '0.00'} €
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Menu horizontal fixe */}
        <div className="bg-white shadow-sm border-b sticky top-20 z-40">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-gray-900 mb-3">
              {menuCategories.find(c => c.id === selectedCategory)?.name}
            </h1>
            
            {/* Menu horizontal des catégories */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {menuCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu principal mobile */}
        <div className="p-4 pb-24">
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
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors w-full"
              >
                Commencer la composition
              </button>
            </div>
          ) : selectedCategory === 'paninis' ? (
            /* Interface spéciale pour les paninis */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥪</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Composez votre Panini
              </h2>
              <p className="text-gray-600 mb-8">
                Choisissez votre viande, fromage et suppléments
              </p>
              <button
                onClick={handlePaniniClick}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors w-full"
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
              ) : !products || products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun produit disponible dans cette catégorie</p>
                </div>
              ) : (
                products.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Image
                          src={item.image || '/images/placeholder-food.jpg'}
                          alt={item.name}
                          fill
                          className={`rounded-lg ${selectedCategory === 'boissons' ? 'object-contain' : 'object-cover'}`}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.description || 'Délicieux plat préparé avec soin'}
                        </p>
                        {item.baseIngredients && item.baseIngredients.length > 0 && (
                          <p className="text-xs text-gray-500 mb-2">
                            Ingrédients: {item.baseIngredients.join(', ')}
                </p>
              )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">
                            {selectedCategory === 'pizzas' ? (
                              (() => {
                                const isMargherita = item.name.toLowerCase().includes('margherita') || 
                                                    item.name.toLowerCase().includes('margarita');
                                const minPrice = isMargherita ? 7 : 9;
                                const maxPrice = isMargherita ? 14 : 17;
                                return `${minPrice}€ - ${maxPrice}€`;
                              })()
                            ) : (
                              item.price && !isNaN(item.price) ? `${item.price.toFixed(2)}€` : 
                              item.sizes && item.sizes.length > 0 ? 
                              `À partir de ${Math.min(...item.sizes.map((s: any) => s.price)).toFixed(2)}€` : 
                              'Prix sur demande'
                            )}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            Ajouter
                          </button>
            </div>
          </div>
        </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>

      </div>

      {/* Composant de composition des tacos */}
      <TacosComposer
        isOpen={showTacosComposer}
        onClose={() => setShowTacosComposer(false)}
        onAddToCart={handleAddCustomToCart}
      />

      {/* Composant de sélection de menu */}
      <MenuSelector
        isOpen={showMenuSelector}
        onClose={() => setShowMenuSelector(false)}
        onAddToCart={handleAddToCart}
        product={selectedProduct}
      />

      {/* Composant de composition de panini */}
      <PaniniComposer
        isOpen={showPaniniComposer}
        onClose={() => setShowPaniniComposer(false)}
        onAddToCart={handleAddCustomToCart}
      />

      {/* Composant de composition burger/sandwich */}
      <BurgerSandwichComposer
        isOpen={showBurgerSandwichComposer}
        onClose={() => setShowBurgerSandwichComposer(false)}
        onAddToCart={handleAddCustomToCart}
        product={selectedProduct}
        type={selectedCategory === 'burgers' ? 'burger' : 'sandwich'}
      />

      {/* Composant de composition Tex-Mex */}
      <TexMexComposer
        isOpen={showTexMexComposer}
        onClose={() => setShowTexMexComposer(false)}
        onAddToCart={handleAddCustomToCart}
        product={selectedProduct}
      />

      {/* Composant de sélection de taille */}
      {showSizeSelector && productForSize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Choisissez la taille pour {productForSize.name}
            </h3>
            
            <div className="space-y-3">
              {selectedCategory === 'pizzas' ? (
                // Tailles fixes pour les pizzas
                [
                  { name: 'Junior', description: '29cm', price: 0 },
                  { name: 'Senior', description: '33cm', price: 0 },
                  { name: 'Mega', description: '40cm', price: 0 }
                ].map((size, index) => {
                  const isMargherita = productForSize.name.toLowerCase().includes('margherita') || 
                                      productForSize.name.toLowerCase().includes('margarita');
                  
                  const price = isMargherita 
                    ? (size.name === 'Junior' ? 7 : size.name === 'Senior' ? 9 : 14)
                    : (size.name === 'Junior' ? 9 : size.name === 'Senior' ? 13 : 17);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect({ ...size, price })}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">{size.name}</h4>
                          <p className="text-sm text-gray-600">{size.description}</p>
                        </div>
                        <span className="text-lg font-bold text-red-600">
                          {price.toFixed(2)} €
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : selectedCategory === 'accompagnements' ? (
                // Tailles pour les accompagnements avec sélection de sauce
                productForSize.sizes.map((size: any, index: number) => (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{size.name}</h4>
                        {size.description && (
                          <p className="text-sm text-gray-600">{size.description}</p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        {size.price.toFixed(2)} €
                      </span>
                    </div>
                    
                    {/* Sélection de sauce */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sauce (optionnelle)
                      </label>
                      <select
                        value={selectedSauce?._id || ''}
                        onChange={(e) => {
                          const sauce = sauces.find(s => s._id === e.target.value);
                          setSelectedSauce(sauce || null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Aucune sauce</option>
                        {sauces.map((sauce) => (
                          <option key={sauce._id} value={sauce._id}>
                            {sauce.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => handleSizeSelect(size)}
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                ))
              ) : (
                // Tailles dynamiques pour les autres produits (boissons)
                productForSize.sizes.map((size: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleSizeSelect(size)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{size.name}</h4>
                        {size.description && (
                          <p className="text-sm text-gray-600">{size.description}</p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        {size.price.toFixed(2)} €
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowSizeSelector(false);
                  setProductForSize(null);
                  setSelectedSauce(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de personnalisation des produits */}
      {showCustomizationModal && productForCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Personnaliser {productForCustomization.name}
            </h3>
            
            {/* Ingrédients (pour burgers et sandwichs) */}
            {['burgers', 'sandwichs'].includes(selectedCategory) && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Ingrédients</h4>
                <div className="space-y-2">
                  {['Salade', 'Tomate', 'Oignons'].map((ingredient) => (
                    <label key={ingredient} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(ingredient)}
                        onChange={() => handleIngredientToggle(ingredient)}
                        className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{ingredient}</span>
                    </label>
                  ))}
    </div>
              </div>
            )}

            {/* Choix des sauces */}
            {(['accompagnements', 'assiettes', 'ptite-faim', 'menu-enfant'].includes(selectedCategory) || 
              ['burgers', 'sandwichs'].includes(selectedCategory)) && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Sauce</h4>
              <div className="grid grid-cols-2 gap-3">
                {sauces.map((sauce) => (
                  <label key={sauce._id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="sauce"
                      value={sauce._id}
                      checked={selectedSauceForProduct?._id === sauce._id}
                      onChange={() => handleSauceSelect(sauce)}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg transition-all ${
                      selectedSauceForProduct?._id === sauce._id 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="relative w-full h-16 mb-2">
                        <Image
                          src={sauce.image}
                          alt={sauce.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900 text-center">
                        {sauce.name}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            )}

            {/* Options menu (pour burgers et sandwichs) */}
            {['burgers', 'sandwichs'].includes(selectedCategory) && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="menuOption"
                      value=""
                      checked={selectedMenuOption === ''}
                      onChange={() => handleMenuOptionSelect('')}
                      className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-gray-700">Seul (+0€)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="menuOption"
                      value="frites"
                      checked={selectedMenuOption === 'frites'}
                      onChange={() => handleMenuOptionSelect('frites')}
                      className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-gray-700">Avec frites (+2€)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="menuOption"
                      value="frites-boisson"
                      checked={selectedMenuOption === 'frites-boisson'}
                      onChange={() => handleMenuOptionSelect('frites-boisson')}
                      className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-gray-700">Avec frites et boisson (+4€)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Choix des boissons (pour Tex-Mex) */}
            {selectedCategory === 'tex-mex' && getDrinkOptionsForTexMex().length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Boissons incluses ({getMaxDrinksForTexMex()} boisson{getMaxDrinksForTexMex() > 1 ? 's' : ''})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {getDrinkOptionsForTexMex().map((drink) => {
                    const isSelected = selectedDrinks.some(d => d._id === drink._id);
                    const canSelect = selectedDrinks.length < getMaxDrinksForTexMex() || isSelected;
                    const isDisabled = !canSelect && !isSelected;
                    
                    return (
                      <label key={drink._id} className={`relative cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleDrinkToggle(drink)}
                          disabled={isDisabled}
                          className="sr-only"
                        />
                        <div className={`p-3 border-2 rounded-lg transition-all ${
                          isSelected 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          <div className="relative w-full h-16 mb-2 bg-gray-50 rounded-md flex items-center justify-center">
                            <Image
                              src={drink.image || '/images/placeholder-drink.jpg'}
                              alt={drink.name}
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-900 text-center">
                            {drink.name}
                          </p>
                          {isSelected && (
                            <p className="text-xs text-red-600 text-center mt-1">
                              Sélectionné
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {selectedDrinks.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedDrinks.length} boisson{selectedDrinks.length > 1 ? 's' : ''} sélectionnée{selectedDrinks.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {/* Prix total */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Prix total :</span>
                <span className="text-xl font-bold text-red-600">
                  {(() => {
                    let total = productForCustomization.price;
                    if (['burgers', 'sandwichs'].includes(selectedCategory)) {
                      if (selectedMenuOption === 'frites') total += 2;
                      else if (selectedMenuOption === 'frites-boisson') total += 4;
                    }
                    return total.toFixed(2);
                  })()} €
                </span>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCustomizationModal(false);
                  setProductForCustomization(null);
                  setSelectedIngredients([]);
                  setSelectedSauceForProduct(null);
                  setSelectedMenuOption('');
                  setSelectedDrinks([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCustomizationConfirm}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
