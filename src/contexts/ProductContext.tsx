                                                                                                                                          import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

// Types
import { Food, FoodInput } from '@/types/food';
import { Drink, DrinkInput } from '@/types/drink';
import { Dessert, DessertInput } from '@/types/dessert';
import { Sauce, SauceInput } from '@/types/sauce';
import { Side, SideInput } from '@/types/side';
import { Ingredient, IngredientInput } from '@/types/ingredient';

interface ProductContextType {
  // Foods
  foods: Food[];
  createFood: (food: FoodInput) => Promise<void>;
  updateFood: (id: string, food: Partial<FoodInput>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  
  // Drinks
  drinks: Drink[];
  createDrink: (drink: DrinkInput) => Promise<void>;
  updateDrink: (id: string, drink: Partial<DrinkInput>) => Promise<void>;
  deleteDrink: (id: string) => Promise<void>;
  
  // Desserts
  desserts: Dessert[];
  createDessert: (dessert: DessertInput | FormData) => Promise<void>;
  updateDessert: (id: string, dessert: Partial<DessertInput> | FormData) => Promise<void>;
  deleteDessert: (id: string) => Promise<void>;
  
  // Sauces
  sauces: Sauce[];
  createSauce: (sauce: SauceInput) => Promise<void>;
  updateSauce: (id: string, sauce: Partial<SauceInput>) => Promise<void>;
  deleteSauce: (id: string) => Promise<void>;
  
  // Sides
  sides: Side[];
  createSide: (side: SideInput) => Promise<void>;
  updateSide: (id: string, side: Partial<SideInput>) => Promise<void>;
  deleteSide: (id: string) => Promise<void>;
  
  // Ingredients
  ingredients: Ingredient[];
  createIngredient: (ingredient: IngredientInput) => Promise<void>;
  updateIngredient: (id: string, ingredient: Partial<IngredientInput>) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
  
  // Common states
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [sides, setSides] = useState<Side[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fonction utilitaire pour les requêtes
  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Important pour envoyer les cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }

      return response.json();
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = error.message as string;
        console.error('Error fetching data:', errorMessage);
      } else {
        console.error('Error fetching data:', error);
      }
      throw error;
    }
  }, []);

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log(' [ProductContext] Chargement des données...');
        const [foodsData, drinksData, dessertsData, saucesData, sidesData, ingredientsData] = await Promise.all([
          fetchWithAuth('/api/admin/foods'),
          fetchWithAuth('/api/admin/drinks'),
          fetchWithAuth('/api/admin/desserts'),
          fetchWithAuth('/api/admin/sauces'),
          fetchWithAuth('/api/admin/sides'),
          fetchWithAuth('/api/admin/ingredients')
        ]);

        console.log(' [ProductContext] Foods reçus:', foodsData);
        console.log(' [ProductContext] Premier food _id:', foodsData[0]?._id);
        
        setFoods(foodsData);
        setDrinks(drinksData);
        setDesserts(dessertsData);
        setSauces(saucesData);
        setSides(sidesData);
        setIngredients(ingredientsData);
        
        console.log(' [ProductContext] Données chargées avec succès');
      } catch (error) {
        console.error(' [ProductContext] Erreur chargement données:', error);
        setError(error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Foods CRUD
  const createFood = useCallback(async (food: FoodInput) => {
    try {
      const formData = new FormData();
      
      if (food.image instanceof File) {
        formData.append('image', food.image);
        const { image, ...restData } = food;
        formData.append('data', JSON.stringify(restData));
      } else {
        formData.append('data', JSON.stringify(food));
      }

      const response = await fetch('/api/admin/foods', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newFood = await response.json();
      console.log(' [ProductContext] Nouveau food créé:', newFood);
      setFoods(prev => [...prev, newFood]);
      showToast({
        title: 'Succès',
        description: 'Plat créé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error(' [ProductContext] Erreur création food:', error);
      throw error;
    }
  }, []);

  const updateFood = useCallback(async (id: string, food: Partial<FoodInput>) => {
    try {
      console.log(' [ProductContext] Mise à jour food:', id, food);
      const formData = new FormData();
      
      if (food.image instanceof File) {
        formData.append('image', food.image);
        const { image, ...restData } = food;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        formData.append('data', JSON.stringify({ ...food, _id: id }));
      }

      const response = await fetch(`/api/admin/foods/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedFood = await response.json();
      console.log(' [ProductContext] Food mis à jour:', updatedFood);
      setFoods(prev => prev.map(f => f._id === id ? updatedFood : f));
      showToast({
        title: 'Succès',
        description: 'Plat mis à jour avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error(' [ProductContext] Erreur mise à jour food:', error);
      showToast({
        title: 'Erreur',
        description: error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors de la mise à jour',
        variant: 'destructive'
      });
      throw error;
    }
  }, []);

  const deleteFood = useCallback(async (id: string) => {
    try {
      console.log(' [ProductContext] Suppression food:', id);
      const response = await fetch(`/api/admin/foods/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression');
      }

      setFoods(prev => {
        console.log(' [ProductContext] Foods avant suppression:', prev);
        const newFoods = prev.filter(f => f._id !== id);
        console.log(' [ProductContext] Foods après suppression:', newFoods);
        return newFoods;
      });
      
      showToast({
        title: 'Succès',
        description: 'Plat supprimé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error(' [ProductContext] Erreur suppression food:', error);
      showToast({
        title: 'Erreur',
        description: error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors de la suppression',
        variant: 'destructive'
      });
      throw error;
    }
  }, []);

  // Fonctions CRUD pour les boissons
  const createDrink = useCallback(async (drink: DrinkInput) => {
    try {
      const formData = new FormData();
      
      if (drink.image instanceof File) {
        formData.append('image', drink.image);
        const { image, ...restData } = drink;
        formData.append('data', JSON.stringify(restData));
      } else {
        formData.append('data', JSON.stringify(drink));
      }

      const response = await fetch('/api/admin/drinks', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newDrink = await response.json();
      setDrinks(prev => [...prev, newDrink]);
      showToast({
        title: 'Succès',
        description: 'La boisson a été créée avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error creating drink:', error);
      throw error;
    }
  }, []);

  const updateDrink = useCallback(async (id: string, drink: Partial<DrinkInput>) => {
    try {
      const formData = new FormData();
      
      if (drink.image instanceof File) {
        formData.append('image', drink.image);
        const { image, ...restData } = drink;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        formData.append('data', JSON.stringify({ ...drink, _id: id }));
      }

      const response = await fetch('/api/admin/drinks', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedDrink = await response.json();
      setDrinks(prev => prev.map(d => d._id === id ? updatedDrink : d));
      showToast({
        title: 'Succès',
        description: 'La boisson a été mise à jour avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error updating drink:', error);
      throw error;
    }
  }, []);

  const deleteDrink = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/drinks?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression');
      }

      setDrinks(prev => prev.filter(d => d._id !== id));
      showToast({
        title: 'Succès',
        description: 'La boisson a été supprimée avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error deleting drink:', error);
      throw error;
    }
  }, []);

  // Fonctions CRUD pour les sides
  const createSide = useCallback(async (side: SideInput) => {
    try {
      const formData = new FormData();
      
      if (side.image instanceof File) {
        formData.append('image', side.image);
        const { image, ...restData } = side;
        formData.append('data', JSON.stringify(restData));
      } else {
        formData.append('data', JSON.stringify(side));
      }

      const response = await fetch('/api/admin/sides', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newSide = await response.json();
      setSides(prev => [...prev, newSide]); // Mettre à jour le state immédiatement
      showToast({
        title: 'Succès',
        description: 'L\'accompagnement a été créé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error creating side:', error);
      throw error;
    }
  }, []);

  const updateSide = useCallback(async (id: string, side: Partial<SideInput>) => {
    try {
      const formData = new FormData();
      
      if (side.image instanceof File) {
        formData.append('image', side.image);
        const { image, ...restData } = side;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        formData.append('data', JSON.stringify({ ...side, _id: id }));
      }

      const response = await fetch('/api/admin/sides', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedSide = await response.json();
      setSides(prev => prev.map(s => s._id === id ? updatedSide : s)); // Mettre à jour le state immédiatement
      showToast({
        title: 'Succès',
        description: 'L\'accompagnement a été mis à jour avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error updating side:', error);
      throw error;
    }
  }, []);

  const deleteSide = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/sides?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression');
      }

      setSides(prev => prev.filter(s => s._id !== id));
      showToast({
        title: 'Succès',
        description: 'L\'accompagnement a été supprimé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error deleting side:', error);
      throw error;
    }
  }, []);

  // Desserts CRUD
  const createDessert = useCallback(async (dessertData: DessertInput | FormData) => {
    try {
      console.log(' [ProductContext] Création dessert...');
      const response = await fetch('/api/admin/desserts', {
        method: 'POST',
        body: dessertData instanceof FormData ? dessertData : JSON.stringify(dessertData),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du dessert');
      }

      const newDessert = await response.json();
      console.log(' [ProductContext] Dessert créé:', newDessert);
      setDesserts(prev => [...prev, newDessert]);
    } catch (error) {
      console.error(' [ProductContext] Erreur création dessert:', error);
      throw error;
    }
  }, []);

  const updateDessert = useCallback(async (id: string, dessertData: Partial<DessertInput> | FormData) => {
    try {
      console.log(' [ProductContext] Mise à jour dessert:', id);
      const response = await fetch(`/api/admin/desserts/${id}`, {
        method: 'PUT',
        body: dessertData instanceof FormData ? dessertData : JSON.stringify(dessertData),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du dessert');
      }

      const updatedDessert = await response.json();
      console.log(' [ProductContext] Dessert mis à jour:', updatedDessert);
      setDesserts(prev => prev.map(d => d._id === id ? updatedDessert : d));
    } catch (error) {
      console.error(' [ProductContext] Erreur mise à jour dessert:', error);
      showToast({
        title: 'Erreur',
        description: error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors de la mise à jour',
        variant: 'destructive'
      });
      throw error;
    }
  }, []);

  const deleteDessert = useCallback(async (id: string) => {
    try {
      console.log(' [ProductContext] Suppression dessert:', id);
      const response = await fetch(`/api/admin/desserts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression du dessert');
      }

      console.log(' [ProductContext] Dessert supprimé:', id);
      setDesserts(prev => prev.filter(d => d._id !== id));
    } catch (error) {
      console.error(' [ProductContext] Erreur suppression dessert:', error);
      showToast({
        title: 'Erreur',
        description: error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors de la suppression',
        variant: 'destructive'
      });
      throw error;
    }
  }, []);

  // Fonctions CRUD pour les sauces
  const createSauce = useCallback(async (sauce: SauceInput) => {
    try {
      const formData = new FormData();
      
      if (sauce.image instanceof File) {
        formData.append('image', sauce.image);
        const { image, ...restData } = sauce;
        formData.append('data', JSON.stringify(restData));
      } else {
        formData.append('data', JSON.stringify(sauce));
      }

      const response = await fetch('/api/admin/sauces', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newSauce = await response.json();
      setSauces(prev => [...prev, newSauce]);
      showToast({
        title: 'Succès',
        description: 'La sauce a été créée avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error creating sauce:', error);
      throw error;
    }
  }, []);

  const updateSauce = useCallback(async (id: string, sauce: Partial<SauceInput>) => {
    try {
      const formData = new FormData();
      
      if (sauce.image instanceof File) {
        formData.append('image', sauce.image);
        const { image, ...restData } = sauce;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        formData.append('data', JSON.stringify({ ...sauce, _id: id }));
      }

      const response = await fetch('/api/admin/sauces', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedSauce = await response.json();
      setSauces(prev => prev.map(s => s._id === id ? updatedSauce : s));
      showToast({
        title: 'Succès',
        description: 'La sauce a été mise à jour avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error updating sauce:', error);
      throw error;
    }
  }, []);

  const deleteSauce = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/sauces?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression');
      }

      setSauces(prev => prev.filter(s => s._id !== id));
      showToast({
        title: 'Succès',
        description: 'La sauce a été supprimée avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error deleting sauce:', error);
      throw error;
    }
  }, []);

  // Fonctions CRUD pour les ingrédients
  const createIngredient = useCallback(async (ingredient: IngredientInput) => {
    try {
      const formData = new FormData();
      
      if (ingredient.image instanceof File) {
        formData.append('image', ingredient.image);
        const { image, ...restData } = ingredient;
        formData.append('data', JSON.stringify(restData));
      } else {
        formData.append('data', JSON.stringify(ingredient));
      }

      const response = await fetch('/api/admin/ingredients', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newIngredient = await response.json();
      setIngredients(prev => [...prev, newIngredient]);
      showToast({
        title: 'Succès',
        description: 'L\'ingrédient a été créé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error;
    }
  }, []);

  const updateIngredient = useCallback(async (id: string, ingredient: Partial<IngredientInput>) => {
    try {
      const formData = new FormData();
      
      if (ingredient.image instanceof File) {
        formData.append('image', ingredient.image);
        const { image, ...restData } = ingredient;
        formData.append('data', JSON.stringify(restData));
      } else {
        formData.append('data', JSON.stringify(ingredient));
      }

      const response = await fetch(`/api/admin/ingredients/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedIngredient = await response.json();
      setIngredients(prev => prev.map(ing => 
        ing._id === id ? updatedIngredient : ing
      ));
      showToast({
        title: 'Succès',
        description: 'L\'ingrédient a été mis à jour avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error updating ingredient:', error);
      showToast({
        title: 'Erreur',
        description: error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors de la mise à jour',
        variant: 'destructive'
      });
      throw error;
    }
  }, []);

  const deleteIngredient = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ingredients/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }

      setIngredients(prev => prev.filter(i => i._id !== id));
      showToast({
        title: 'Succès',
        description: 'Ingrédient supprimé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      showToast({
        title: 'Erreur',
        description: error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors de la suppression de l\'ingrédient',
        variant: 'destructive'
      });
      throw error;
    }
  }, []);

  const value: ProductContextType = {
    foods,
    sauces,
    drinks,
    desserts,
    sides,
    ingredients,
    loading,
    error,
    deleteFood,
    deleteSauce,
    deleteDrink,
    deleteDessert,
    deleteSide,
    deleteIngredient,
    createFood,
    createSauce,
    createDrink,
    createDessert,
    createSide,
    createIngredient,
    updateFood,
    updateSauce,
    updateDrink,
    updateDessert,
    updateSide,
    updateIngredient,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
