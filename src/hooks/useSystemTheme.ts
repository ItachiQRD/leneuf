import { useEffect, useState } from "react";

export function useSystemTheme() {
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
      
      updateSystemTheme();
      mediaQuery.addEventListener('change', updateSystemTheme);
      return () => mediaQuery.removeEventListener('change', updateSystemTheme);
    }, []);
  
    return systemTheme;
  }