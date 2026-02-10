                                                                                                                                        import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { isFile } from '@/utils/fileUtils';

// Types
import { Food, FoodInputAPI } from '@/types/food';
import { Drink, DrinkInput } from '@/types/drink';
import { Dessert, DessertInput } from '@/types/dessert';
import { Sauce, SauceInput } from '@/types/sauce';
import { Side, SideInput } from '@/types/side';
import { Ingredient, IngredientInput } from '@/types/ingredient';

// Fonction utilitaire pour parser les réponses JSON de manière robuste
async function parseResponse(response: Response) {
  const text = await response.text();
  
  if (!text) {
    throw new Error('Réponse vide du serveur');
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.error('Erreur parsing JSON:', parseError);
    console.error('Contenu reçu:', text);
    console.error('Status:', response.status, 'StatusText:', response.statusText);
    console.error('Headers:', Object.fromEntries(response.headers.entries()));
    throw new Error(`Réponse invalide du serveur (${response.status}): ${text.substring(0, 200)}...`);
  }
}

interface ProductContextType {
  // Foods
  foods: Food[];
  createFood: (food: FoodInputAPI) => Promise<void>;
  updateFood: (id: string, food: Partial<FoodInputAPI>) => Promise<void>;
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

      // Vérifier le content-type avant de parser
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      // Récupérer le contenu de la réponse
      const text = await response.text();
      
      if (!response.ok) {
        // Essayer de parser le JSON même si le content-type n'est pas correct
        try {
          const error = JSON.parse(text);
          throw new Error(error.message || `Erreur HTTP ${response.status}`);
        } catch (jsonError) {
          // Si ce n'est pas du JSON, utiliser le texte brut
          throw new Error(`Erreur HTTP ${response.status}: ${text || response.statusText}`);
        }
      }

      // Essayer de parser le JSON
      if (!text) {
        throw new Error('Réponse vide reçue');
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('[ProductContext] Erreur parsing JSON:', parseError);
        console.error('[ProductContext] Contenu reçu:', text);
        throw new Error('Réponse non-JSON reçue');
      }
    } catch (error) {
      console.error('[ProductContext] Erreur chargement données:', error);
      throw error;
    }
  }, []);

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(' [ProductContext] Chargement des données...');
        
        // Charger les données une par une pour éviter les erreurs en cascade
        const loadDataSafely = async (endpoint: string, setter: (data: any) => void, name: string, isPublic = false) => {
          try {
            let data;
            if (isPublic) {
              // Utiliser l'API publique pour les utilisateurs non authentifiés
              const publicEndpoint = endpoint.replace('/api/admin/', '/api/');
              const response = await fetch(publicEndpoint);
              data = await parseResponse(response);
            } else {
              // Utiliser l'API admin pour les utilisateurs authentifiés
              data = await fetchWithAuth(endpoint);
            }
            setter(data || []);
            console.log(`✅ [ProductContext] ${name} chargés:`, data?.length || 0);
          } catch (error) {
            console.warn(`⚠️ [ProductContext] Erreur chargement ${name}:`, error);
            setter([]); // Initialiser avec un tableau vide en cas d'erreur
          }
        };

        if (isAuthenticated) {
          // Charger toutes les données admin si authentifié
          await Promise.all([
            loadDataSafely('/api/admin/foods', setFoods, 'plats'),
            loadDataSafely('/api/admin/drinks', setDrinks, 'boissons'),
            loadDataSafely('/api/admin/desserts', setDesserts, 'desserts'),
            loadDataSafely('/api/admin/sauces', setSauces, 'sauces'),
            loadDataSafely('/api/admin/sides', setSides, 'accompagnements'),
            loadDataSafely('/api/admin/ingredients', setIngredients, 'ingrédients')
          ]);
        } else {
          // Charger seulement les données publiques si non authentifié
          await Promise.all([
            loadDataSafely('/api/admin/foods', setFoods, 'plats', true),
            loadDataSafely('/api/admin/drinks', setDrinks, 'boissons', true),
            loadDataSafely('/api/admin/desserts', setDesserts, 'desserts', true),
            loadDataSafely('/api/admin/sauces', setSauces, 'sauces', true),
            loadDataSafely('/api/admin/sides', setSides, 'accompagnements', true),
            loadDataSafely('/api/admin/ingredients', setIngredients, 'ingrédients', true)
          ]);
        }
        
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
  const createFood = useCallback(async (food: FoodInputAPI) => {
    try {
      console.log(' [ProductContext] Données reçues pour createFood:', food);
      const formData = new FormData();
      
      if (food.image && typeof food.image === 'object' && 'name' in food.image) {
        formData.append('image', food.image as File);
        const { image, ...restData } = food;
        console.log(' [ProductContext] Données JSON à envoyer:', restData);
        console.log(' [ProductContext] baseIngredients dans restData:', restData.baseIngredients);
        formData.append('data', JSON.stringify(restData));
      } else {
        // Inclure l'image même si c'est une chaîne (URL existante)
        console.log(' [ProductContext] Données JSON à envoyer (avec image string):', food);
        console.log(' [ProductContext] baseIngredients dans food:', food.baseIngredients);
        formData.append('data', JSON.stringify(food));
      }

      const response = await fetch('/api/admin/foods', {
        method: 'POST',
        credentials: 'include',
        body: formData
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newFood = await parseResponse(response);
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

  const updateFood = useCallback(async (id: string, food: Partial<FoodInputAPI>) => {
    try {
      console.log(' [ProductContext] Mise à jour food:', id, food);
      const formData = new FormData();
      
      if (food.image && typeof food.image === 'object' && 'name' in food.image) {
        formData.append('image', food.image as File);
        const { image, ...restData } = food;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        // Inclure l'image même si c'est une chaîne (URL existante)
        formData.append('data', JSON.stringify({ ...food, _id: id }));
      }

      const response = await fetch(`/api/admin/foods/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedFood = await parseResponse(response);
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
        // Récupérer le contenu de la réponse
        const text = await response.text();
        
        if (!text) {
          throw new Error('Réponse vide du serveur');
        }

        // Essayer de parser le JSON
        let error;
        try {
          error = JSON.parse(text);
        } catch (parseError) {
          console.error('Erreur deleteFood: JSON.parse:', parseError);
          console.error('Contenu reçu:', text);
          throw new Error('Réponse invalide du serveur');
        }

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
      
      if (isFile(drink.image)) {
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
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newDrink = await parseResponse(response);
      console.log(' [ProductContext] Nouvelle boisson reçue:', newDrink);
      setDrinks(prev => {
        const updated = [...prev, newDrink];
        console.log(' [ProductContext] State drinks mis à jour:', updated.length, 'boissons');
        return updated;
      });
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
      
      if (isFile(drink.image)) {
        formData.append('image', drink.image);
        const { image, ...restData } = drink;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        formData.append('data', JSON.stringify({ ...drink, _id: id }));
      }

      const response = await fetch(`/api/admin/drinks/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedDrink = await parseResponse(response);
      console.log(' [ProductContext] Boisson mise à jour reçue:', updatedDrink);
      setDrinks(prev => {
        const updated = prev.map(d => d._id === id ? updatedDrink : d);
        console.log(' [ProductContext] State drinks mis à jour pour modification');
        return updated;
      });
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
      const response = await fetch(`/api/admin/drinks/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await parseResponse(response);
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
      
      if (isFile(side.image)) {
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
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newSide = await parseResponse(response);
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
      
      if (isFile(side.image)) {
        formData.append('image', side.image);
        const { image, ...restData } = side;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        formData.append('data', JSON.stringify({ ...side, _id: id }));
      }

      const response = await fetch(`/api/admin/sides/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedSide = await parseResponse(response);
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
      const response = await fetch(`/api/admin/sides/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await parseResponse(response);
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
      
      const options: RequestInit = {
        method: 'POST',
        credentials: 'include',
      };

      if (dessertData instanceof FormData) {
        options.body = dessertData;
        // Ne pas définir Content-Type pour FormData
      } else {
        options.body = JSON.stringify(dessertData);
        options.headers = {
          'Content-Type': 'application/json',
        };
      }

      const response = await fetch('/api/admin/desserts', options);

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la création du dessert');
      }

      const newDessert = await parseResponse(response);
      console.log(' [ProductContext] Dessert créé:', newDessert);
      setDesserts(prev => [...prev, newDessert]);
      showToast({
        title: 'Succès',
        description: 'Dessert créé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error(' [ProductContext] Erreur création dessert:', error);
      showToast({
        title: 'Erreur',
        description: error && typeof error === 'object' && 'message' in error ? error.message as string : 'Erreur lors de la création',
        variant: 'destructive'
      });
      throw error;
    }
  }, []);

  const updateDessert = useCallback(async (id: string, dessertData: Partial<DessertInput> | FormData) => {
    try {
      console.log(' [ProductContext] Mise à jour dessert:', id);
      
      const options: RequestInit = {
        method: 'PUT',
        credentials: 'include',
      };

      if (dessertData instanceof FormData) {
        options.body = dessertData;
        // Ne pas définir Content-Type pour FormData
      } else {
        options.body = JSON.stringify(dessertData);
        options.headers = {
          'Content-Type': 'application/json',
        };
      }

      const response = await fetch(`/api/admin/desserts/${id}`, options);

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la mise à jour du dessert');
      }

      const updatedDessert = await parseResponse(response);
      console.log(' [ProductContext] Dessert mis à jour:', updatedDessert);
      setDesserts(prev => prev.map(d => String(d._id || d.id) === String(id) ? updatedDessert : d));
      showToast({
        title: 'Succès',
        description: 'Dessert mis à jour avec succès',
        variant: 'success'
      });
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
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la suppression du dessert');
      }

      console.log(' [ProductContext] Dessert supprimé:', id);
      setDesserts(prev => prev.filter(d => (d._id || d.id) !== id));
      showToast({
        title: 'Succès',
        description: 'Dessert supprimé avec succès',
        variant: 'success'
      });
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
      
      if (isFile(sauce.image)) {
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
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newSauce = await parseResponse(response);
      console.log(' [ProductContext] Nouvelle sauce reçue:', newSauce);
      setSauces(prev => {
        const updated = [...prev, newSauce];
        console.log(' [ProductContext] State sauces mis à jour:', updated.length, 'sauces');
        return updated;
      });
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
      
      if (isFile(sauce.image)) {
        formData.append('image', sauce.image);
        const { image, ...restData } = sauce;
        formData.append('data', JSON.stringify({ ...restData, _id: id }));
      } else {
        formData.append('data', JSON.stringify({ ...sauce, _id: id }));
      }

      const response = await fetch(`/api/admin/sauces/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedSauce = await parseResponse(response);
      console.log(' [ProductContext] Sauce mise à jour reçue:', updatedSauce);
      setSauces(prev => {
        const updated = prev.map(s => String(s._id) === String(id) ? updatedSauce : s);
        console.log(' [ProductContext] State sauces mis à jour pour modification');
        return updated;
      });
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
      const response = await fetch(`/api/admin/sauces/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await parseResponse(response);
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
      
      if (isFile(ingredient.image)) {
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
        try {
          const error = await parseResponse(response);
          throw new Error(error.message || 'Erreur lors de la création');
        } catch (parseError) {
          console.error('Erreur parsing response:', parseError);
          throw new Error(`Erreur serveur (${response.status}): ${response.statusText}`);
        }
      }

      const newIngredient = await parseResponse(response);
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
      
      if (isFile(ingredient.image)) {
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
        const error = await parseResponse(response);
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updatedIngredient = await parseResponse(response);
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
        const error = await parseResponse(response);
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


