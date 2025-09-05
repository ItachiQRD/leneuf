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
        // Calculer l'opacité en fonction du scroll
        const opacity = Math.min(scrollPosition / threshold, 0.9);
        setHeaderStyle({
          backgroundColor: `bg-white/${Math.floor(opacity * 100)}`,
          textColor: scrollPosition > threshold / 2 ? 'text-gray-900' : 'text-white',
          borderColor: 'border-transparent',
          boxShadow: opacity > 0.5 ? 'shadow-md' : ''
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Appel initial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return headerStyle;
};
