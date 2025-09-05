import { useProducts } from '@/contexts/ProductContext';

// Hook pour les aliments
export function useFood() {
  const {
    foods,
    loading,
    error,
    createFood,
    updateFood,
    deleteFood,
  } = useProducts();

  return {
    foods,
    loading,
    error,
    createFood,
    updateFood,
    deleteFood,
  };
}

// Hook pour les boissons
export function useDrink() {
  const {
    drinks,
    loading,
    error,
    createDrink,
    updateDrink,
    deleteDrink,
  } = useProducts();

  return {
    drinks,
    loading,
    error,
    createDrink,
    updateDrink,
    deleteDrink,
  };
}

// Hook pour les desserts
export function useDessert() {
  const {
    desserts,
    loading,
    error,
    createDessert,
    updateDessert,
    deleteDessert,
  } = useProducts();

  return {
    desserts,
    loading,
    error,
    createDessert,
    updateDessert,
    deleteDessert,
  };
}

// Hook pour les sauces
export function useSauce() {
  const {
    sauces,
    loading,
    error,
    createSauce,
    updateSauce,
    deleteSauce,
  } = useProducts();

  return {
    sauces,
    loading,
    error,
    createSauce,
    updateSauce,
    deleteSauce,
  };
}

// Hook pour les accompagnements
export function useSide() {
  const {
    sides,
    loading,
    error,
    createSide,
    updateSide,
    deleteSide,
  } = useProducts();

  return {
    sides,
    loading,
    error,
    createSide,
    updateSide,
    deleteSide,
  };
}
