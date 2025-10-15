import { useState, useEffect } from 'react';

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'card' | 'cash';
  deliveryInstructions?: string;
}

const COOKIE_NAME = 'customer_data';
const COOKIE_EXPIRY_DAYS = 30;

export const useCustomerData = () => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
    deliveryInstructions: ''
  });

  // Charger les données depuis les cookies au montage
  useEffect(() => {
    const loadCustomerData = () => {
      try {
        const cookies = document.cookie.split(';');
        const customerCookie = cookies.find(cookie => 
          cookie.trim().startsWith(`${COOKIE_NAME}=`)
        );

        if (customerCookie) {
          const cookieValue = customerCookie.split('=')[1];
          const decodedData = decodeURIComponent(cookieValue);
          const parsedData = JSON.parse(decodedData);
          setCustomerData(parsedData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données client:', error);
      }
    };

    loadCustomerData();
  }, []);

  // Sauvegarder les données dans les cookies
  const saveCustomerData = (data: CustomerData) => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
      
      const cookieValue = encodeURIComponent(JSON.stringify(data));
      const cookieString = `${COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      
      document.cookie = cookieString;
      setCustomerData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données client:', error);
    }
  };

  // Mettre à jour une partie des données
  const updateCustomerData = (updates: Partial<CustomerData>) => {
    const newData = { ...customerData, ...updates };
    saveCustomerData(newData);
  };

  // Effacer les données
  const clearCustomerData = () => {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setCustomerData({
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'card',
      deliveryInstructions: ''
    });
  };

  return {
    customerData,
    saveCustomerData,
    updateCustomerData,
    clearCustomerData
  };
};
