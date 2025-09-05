// hooks/useIngredients.ts
import { useState, useEffect, useCallback } from 'react';
import { Ingredient, CreateIngredientData, UpdateIngredientData } from '@/types/ingredient';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ingredients');
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }
      const data = await response.json();
      setIngredients(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      console.error('Error fetching ingredients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const getIngredientsByType = useCallback((type: string) => {
    return ingredients.filter(ingredient => ingredient.type === type);
  }, [ingredients]);

  const createIngredient = async (data: CreateIngredientData) => {
    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create ingredient');
      }

      const newIngredient = await response.json();
      setIngredients(prev => [...prev, newIngredient]);
      return newIngredient;
    } catch (err) {
      console.error('Error creating ingredient:', err);
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  const updateIngredient = async (id: string, data: UpdateIngredientData) => {
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update ingredient');
      }

      const updatedIngredient = await response.json();
      setIngredients(prev => prev.map(ing => ing._id === id ? updatedIngredient : ing));
      return updatedIngredient;
    } catch (err) {
      console.error('Error updating ingredient:', err);
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ingredient');
      }

      setIngredients(prev => prev.filter(ing => ing._id !== id));
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  return {
    ingredients,
    isLoading,
    error,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    getIngredientsByType,
    fetchIngredients
  };
}