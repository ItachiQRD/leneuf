import React, { createContext, useContext, useState, useEffect } from 'react';

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  language: string;
  notifications: {
    orders: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  accessibility: {
    highContrast: boolean;
    screenReader: boolean;
  };
}

interface PreferencesContextType {
  preferences: Preferences;
  updatePreferences: (updates: Partial<Preferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: Preferences = {
  theme: 'system',
  fontSize: 'medium',
  reducedMotion: false,
  language: 'fr',
  notifications: {
    orders: true,
    promotions: true,
    newsletter: false
  },
  accessibility: {
    highContrast: false,
    screenReader: false
  }
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  // Charger les préférences au montage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Sauvegarder les préférences lors des changements
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Appliquer le thème
    if (preferences.theme === 'system') {
      document.documentElement.classList.remove('dark', 'light');
    } else {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(preferences.theme);
    }

    // Appliquer la taille de police
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[preferences.fontSize];

    // Appliquer les préférences d'accessibilité
    if (preferences.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
      notifications: {
        ...prev.notifications,
        ...(updates.notifications || {})
      },
      accessibility: {
        ...prev.accessibility,
        ...(updates.accessibility || {})
      }
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider value={{
      preferences,
      updatePreferences,
      resetPreferences
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}