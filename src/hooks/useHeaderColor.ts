import { useState, useEffect } from 'react';

export const useHeaderColor = (threshold = 100) => {
  const [headerStyle, setHeaderStyle] = useState({
    backgroundColor: 'transparent',
    textColor: 'text-white',
    borderColor: 'border-transparent',
    boxShadow: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > threshold) {
        setHeaderStyle({
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900',
          borderColor: 'border-gray-200',
          boxShadow: 'shadow-md'
        });
      } else {
        // En haut de page, utiliser un fond sombre semi-transparent
        setHeaderStyle({
          backgroundColor: 'bg-black bg-opacity-30',
          textColor: 'text-white',
          borderColor: 'border-transparent',
          boxShadow: ''
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Appel initial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return headerStyle;
};
