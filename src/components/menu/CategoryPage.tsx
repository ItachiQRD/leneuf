import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Filter, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Food } from '@/types/food';
import MenuItem from './MenuItem';

interface CategoryPageProps {
  title: string;
  description: string;
  type: 'burger' | 'pizza' | 'side';
  filters: {
    id: string;
    name: string;
  }[];
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const gridVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function CategoryPage({
  title,
  description,
  type,
  filters
}: CategoryPageProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching items for type:', type);
        
        const response = await fetch(`/api/menu/foods?type=${type}`);
        const contentType = response.headers.get("content-type");
        console.log('Response content type:', contentType);
        
        if (!response.ok) {
          let errorMessage = 'Erreur lors du chargement des plats';
          try {
            const errorData = await response.json();
            console.error('Error response:', {
              status: response.status,
              statusText: response.statusText,
              data: errorData
            });
            errorMessage = errorData.message || errorData.details || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        
        if (!Array.isArray(data)) {
          console.error('Received non-array data:', data);
          throw new Error('Format de données invalide');
        }
        
        setItems(data);
      } catch (error) {
        console.error('Error in fetchItems:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  // Filter items based on category and active filter
  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => {
        // Handle specific filters for each type
        switch (type) {
          case 'burger':
          case 'pizza':
            return item.category === activeFilter;
          case 'side':
            // Pour les accompagnements, utiliser l'ID du filtre directement
            return item.type === activeFilter;
          default:
            return true;
        }
      });

  return (
    <>
      <Head>
        <title>Le Neuf - {title} | Menu</title>
        <meta name="description" content={description} />
      </Head>

      <motion.div
        className="min-h-screen bg-background pb-16"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] bg-surface-800">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(/images/menu/${type}-header.jpg)` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center text-white">
            <Link 
              href="/menu" 
              className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour au menu
            </Link>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              {title}
            </h1>
            <p className="max-w-2xl text-lg text-gray-200">
              {description}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-surface rounded-xl shadow-lg p-6 mb-8">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-8">
              <Filter className="w-5 h-5" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-surface-100 hover:bg-surface-200'
                  }`}
                >
                  Tous
                </button>
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      activeFilter === filter.id
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 hover:bg-surface-200'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Chargement des plats...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-error">
                <p className="text-lg font-semibold mb-2">Une erreur est survenue</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <p className="text-lg font-semibold mb-2">Aucun plat trouvé</p>
                <p className="text-sm text-gray-600">
                  Aucun élément ne correspond à vos critères de recherche
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={gridVariants}
                initial="initial"
                animate="animate"
              >
                {filteredItems.map((item) => (
                  <motion.div key={item._id.toString()} variants={itemVariants}>
                    <MenuItem
                      id={item._id.toString()}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      image={item.image}
                      category={item.category}
                      isNew={item.category === 'new'}
                      isPopular={item.category === 'bestseller'}
                      preparationTime={item.preparationTimeMinutes}
                      isVegetarian={item.isVegetarian}
                      isSpicy={item.spicyLevel === 'hot'}
                      allergens={item.allergens}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
