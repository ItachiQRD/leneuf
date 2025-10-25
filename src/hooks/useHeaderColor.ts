import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useHeaderColor = (threshold = 100) => {
  const router = useRouter();
  const [headerStyle, setHeaderStyle] = useState({
    backgroundColor: 'transparent',
    textColor: 'text-white',
    borderColor: 'border-transparent',
    boxShadow: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const isCommanderPage = router.pathname === '/commander';
      
      if (scrollPosition > threshold || isCommanderPage) {
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
  }, [threshold, router.pathname]);

  return headerStyle;
};
