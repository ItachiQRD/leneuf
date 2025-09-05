import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { useProducts } from '@/contexts/ProductContext';

interface OrderStep {
  id: string;
  title: string;
  description: string;
  maxSelections?: number;
  isRequired: boolean;
  options: OrderOption[];
}

interface OrderOption {
  id: string;
  name: string;
  image: string;
  price?: number;
  description?: string;
}

interface Sauce {
  _id: string;
  name: string;
  description: string;
  image: string;
  isSpicy: boolean;
  category: string;
}

// Configuration des étapes de commande
const orderSteps: OrderStep[] = [
  {
    id: 'format',
    title: 'Choisissez votre format',
    description: 'Comment souhaitez-vous déguster votre tacos ?',
    options: [
      {
        id: 'tacos',
        name: 'Tacos',
        image: '/images/menu/format-tacos.jpg',
        description: 'Le traditionnel tacos grillé à la plancha',
      },
      {
        id: 'bowl',
        name: 'Bowl',
        image: '/images/menu/format-bowl.jpg',
        description: 'Version sans tortilla, servi dans un bol',
      },
    ],
    maxSelections: 1,
    isRequired: true,
  },
  {
    id: 'size',
    title: 'Sélectionnez la taille',
    description: 'La taille détermine le nombre de viandes possibles',
    options: [
      { id: 'M', name: 'Classic (M)', description: '1 viande', price: 7.90, image: '/images/menu/sizes/m.jpg' },
      { id: 'L', name: 'Double (L)', description: '2 viandes', price: 9.90, image: '/images/menu/sizes/l.jpg' },
      { id: 'XL', name: 'Triple (XL)', description: '3 viandes', price: 11.90, image: '/images/menu/sizes/xl.jpg' },
    ],
    maxSelections: 1,
    isRequired: true,
  },
  {
    id: 'meats',
    title: 'Choisissez vos viandes',
    description: 'Sélectionnez vos viandes selon la taille choisie',
    options: [
      {
        id: 'viande-hachee',
        name: 'Viande Hachée',
        image: '/images/menu/meats/viande-hachee.jpg',
        description: 'Viande de bœuf hachée assaisonnée',
      },
      {
        id: 'poulet',
        name: 'Poulet',
        image: '/images/menu/meats/poulet.jpg',
        description: 'Émincé de poulet mariné',
      },
      {
        id: 'cordon-bleu',
        name: 'Cordon Bleu',
        image: '/images/menu/meats/cordon-bleu.jpg',
        description: 'Poulet pané fourré au fromage',
      },
      {
        id: 'nuggets',
        name: 'Nuggets',
        image: '/images/menu/meats/nuggets.jpg',
        description: 'Morceaux de poulet panés',
      },
      {
        id: 'kebab',
        name: 'Kebab',
        image: '/images/menu/meats/kebab.jpg',
        description: 'Viande marinée traditionnelle',
      },
      {
        id: 'tenders',
        name: 'Tenders',
        image: '/images/menu/meats/tenders.jpg',
        description: 'Filets de poulet panés',
      },
      {
        id: 'merguez',
        name: 'Merguez',
        image: '/images/menu/meats/merguez.jpg',
        description: 'Saucisse épicée traditionnelle',
      },
    ],
    maxSelections: undefined, // Déterminé dynamiquement selon la taille
    isRequired: true,
  },
  {
    id: 'sauces',
    title: 'Sélectionnez vos sauces',
    description: 'Choisissez jusqu\'à 2 sauces pour votre tacos',
    options: [], // Sera rempli dynamiquement
    maxSelections: 2,
    isRequired: true,
  },
  {
    id: 'extras',
    title: 'Ajoutez des extras',
    description: 'Personnalisez votre tacos avec des suppléments',
    options: [], // Sera rempli dynamiquement
    maxSelections: undefined,
    isRequired: false,
  },
];

export default function TacosOrderForm() {
  const { ingredients } = useProducts();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({
    format: [],
    size: [],
    meats: [],
    sauces: [],
    extras: [],
  });

  // Charger les sauces depuis l'API et mettre à jour les extras avec les ingrédients
  useEffect(() => {
    const fetchSauces = async () => {
      try {
        const response = await fetch('/api/admin/sauces');
        if (!response.ok) {
          throw new Error('Failed to fetch sauces');
        }
        const data = await response.json();
        // Mettre à jour les options de sauce dans orderSteps
        const sauceStep = orderSteps.find(step => step.id === 'sauces');
        if (sauceStep) {
          sauceStep.options = data.map((sauce: Sauce) => ({
            id: sauce._id,
            name: sauce.name,
            description: sauce.description,
            image: sauce.image.startsWith('/') ? sauce.image : `/${sauce.image}`,
          }));
        }

        // Mettre à jour les extras avec les ingrédients disponibles
        const extrasStep = orderSteps.find(step => step.id === 'extras');
        if (extrasStep && ingredients) {
          const extraIngredients = ingredients
            .filter(ingredient => ingredient.isAvailable)
            .map(ingredient => ({
              id: ingredient._id,
              name: ingredient.name,
              image: ingredient.image.startsWith('/') ? ingredient.image : `/${ingredient.image}`,
              price: ingredient.price || 1.00,
            }));
          extrasStep.options = extraIngredients;
          console.log('Ingrédients chargés comme extras:', extraIngredients);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSauces();
  }, [ingredients]);

  // Obtenir le nombre maximum de viandes selon la taille
  const getMaxMeatSelections = () => {
    const selectedSize = selections.size[0];
    switch (selectedSize) {
      case 'M':
        return 1;
      case 'L':
        return 2;
      case 'XL':
        return 3;
      default:
        return 1;
    }
  };

  // Calculer le prix total
  const calculateTotalPrice = () => {
    let total = 0;

    // Prix de base selon la taille
    const sizeOption = orderSteps[1].options.find(opt => opt.id === selections.size[0]);
    if (sizeOption?.price) {
      total += sizeOption.price;
    }

    // Prix des extras
    selections.extras.forEach(extraId => {
      const extraOption = orderSteps[4].options.find(opt => opt.id === extraId);
      if (extraOption?.price) {
        total += extraOption.price;
      }
    });

    return total;
  };

  // Vérifier si une option est sélectionnée
  const isSelected = (optionId: string) => {
    return selections[orderSteps[currentStep].id].includes(optionId);
  };

  // Gérer la sélection d'une option
  const handleSelect = (optionId: string) => {
    const step = orderSteps[currentStep];
    const stepId = step.id;
    
    setSelections(prev => {
      const currentSelections = [...prev[stepId]];
      const maxSelections = stepId === 'meats' ? getMaxMeatSelections() : step.maxSelections;

      if (maxSelections === 1) {
        return { ...prev, [stepId]: [optionId] };
      } else {
        const index = currentSelections.indexOf(optionId);
        if (index === -1) {
          if (!maxSelections || currentSelections.length < maxSelections) {
            currentSelections.push(optionId);
          }
        } else {
          currentSelections.splice(index, 1);
        }
        return { ...prev, [stepId]: currentSelections };
      }
    });
  };

  // Vérifier si on peut passer à l'étape suivante
  const canProceed = () => {
    const step = orderSteps[currentStep];
    const currentSelections = selections[step.id];

    if (!step.isRequired) return true;
    if (step.id === 'meats') {
      const maxMeats = getMaxMeatSelections();
      return currentSelections.length === maxMeats;
    }
    if (step.maxSelections === 1) {
      return currentSelections.length === 1;
    }
    return currentSelections.length > 0;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Étapes de progression */}
      <div className="flex justify-between mb-8">
        {orderSteps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${
              index === currentStep
                ? 'text-primary'
                : index < currentStep
                ? 'text-success'
                : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${index === currentStep ? 'border-primary bg-primary/10' : 
                index < currentStep ? 'border-success bg-success/10' : 
                'border-gray-300'}`}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < orderSteps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                index < currentStep ? 'bg-success' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Titre et description de l'étape */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{orderSteps[currentStep].title}</h2>
        <p className="text-gray-600">{orderSteps[currentStep].description}</p>
      </div>

      {/* Options de l'étape courante */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence mode="wait">
          {orderSteps[currentStep].options.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected(option.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={option.image}
                  alt={option.name}
                  fill
                  className="object-cover"
                />
                {isSelected(option.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-1">{option.name}</h3>
              {option.description && (
                <p className="text-sm text-gray-600">{option.description}</p>
              )}
              {option.price && (
                <p className="text-sm font-semibold text-primary mt-2">
                  {option.price.toFixed(2)}€
                </p>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation et prix total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            Retour
          </Button>
          <div className="text-xl font-bold">
            Total: {calculateTotalPrice().toFixed(2)}€
          </div>
        </div>
        <Button
          variant="default"
          onClick={() => {
            if (currentStep < orderSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
            } else {
              // Gérer la finalisation de la commande
              console.log('Commande finalisée:', selections);
            }
          }}
          disabled={!canProceed()}
        >
          {currentStep === orderSteps.length - 1 ? (
            'Commander'
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}