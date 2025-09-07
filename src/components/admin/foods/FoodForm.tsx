import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Food, FoodType, FoodInputAPI } from '@/types/food';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Buttons';
import { motion } from 'framer-motion';

// Sections de formulaire
import BasicFoodInfo from './sections/BasicFoodInfo';
import NutritionalInfo from './sections/NutritionalInfo';
import SpecificOptions from './sections/SpecificOptions';

interface FoodFormProps {
  initialData?: Partial<Food>;
  type: FoodType;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function FoodForm({
  initialData,
  type,
  onSubmit,
  onCancel
}: FoodFormProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const getInitialImage = () => {
    if (initialData?.image && typeof initialData.image === 'string') {
      return initialData.image;
    }
    return '';
  };

  // Valeurs nutritionnelles par défaut selon le type de plat
  const getDefaultNutritionalInfo = (foodType: string) => {
    const defaults = {
      burger: { calories: 650, proteins: 35, carbs: 45, fats: 35, servingSize: '1 burger' },
      pizza: { calories: 280, proteins: 12, carbs: 35, fats: 10, servingSize: '100g' },
      salad: { calories: 120, proteins: 8, carbs: 15, fats: 4, servingSize: '1 portion' },
      sandwich_durum: { calories: 450, proteins: 25, carbs: 40, fats: 20, servingSize: '1 sandwich' },
      tacos: { calories: 380, proteins: 20, carbs: 35, fats: 18, servingSize: '1 taco' },
      bowls: { calories: 320, proteins: 18, carbs: 30, fats: 12, servingSize: '1 bowl' },
      paninis: { calories: 420, proteins: 22, carbs: 38, fats: 16, servingSize: '1 panini' },
      plates: { calories: 480, proteins: 28, carbs: 25, fats: 22, servingSize: '1 assiette' },
      tex_mex: { calories: 520, proteins: 30, carbs: 42, fats: 25, servingSize: '1 portion' },
      kids_menu: { calories: 280, proteins: 15, carbs: 30, fats: 12, servingSize: '1 portion' },
      small_hunger: { calories: 180, proteins: 10, carbs: 20, fats: 8, servingSize: '1 portion' }
    };
    return defaults[foodType as keyof typeof defaults] || { calories: 0, proteins: 0, carbs: 0, fats: 0, servingSize: '100g' };
  };

  // Tailles de pizza par défaut
  const getDefaultPizzaSizes = () => [
    { name: 'Junior', price: 9, diameter: '26cm', isDefault: true },
    { name: 'Sénior', price: 13, diameter: '32cm', isDefault: false },
    { name: 'Méga', price: 17, diameter: '40cm', isDefault: false }
  ];

  const form = useForm<FoodInputAPI>({
    defaultValues: {
      type,
      name: '',
      price: type !== 'pizza' ? 0 : undefined,
      image: getInitialImage(),
      active: true,
      available: true,
      category: 'regular',
      preparationTimeMinutes: 15,
      baseIngredients: [],
      allergens: [],
      spicyLevel: 'mild',
      nutritionalInfo: getDefaultNutritionalInfo(type),
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false,
      // Tailles de pizza par défaut si c'est une pizza
      ...(type === 'pizza' && { pizzaSizes: getDefaultPizzaSizes() }),
      ...(initialData && {
        name: initialData.name || '',
        price: initialData.price,
        type: initialData.type || type,
        category: initialData.category || 'regular',
        active: initialData.active ?? true,
        available: initialData.available ?? true,
        preparationTimeMinutes: initialData.preparationTimeMinutes || 15,
        baseIngredients: initialData.baseIngredients || [],
        allergens: initialData.allergens || [],
        spicyLevel: initialData.spicyLevel || 'mild',
        nutritionalInfo: initialData.nutritionalInfo || getDefaultNutritionalInfo(initialData.type || type),
        isVegan: initialData.isVegan ?? false,
        isVegetarian: initialData.isVegetarian ?? false,
        isGlutenFree: initialData.isGlutenFree ?? false,
        // Tailles de pizza par défaut si c'est une pizza et pas de données existantes
        ...(initialData.type === 'pizza' && !(initialData as any).pizzaSizes && { pizzaSizes: getDefaultPizzaSizes() })
      })
    }
  });

  const { handleSubmit, formState: { errors } } = form;

  const sections = [
    { 
      id: 'basic', 
      label: 'Informations de base',
      hasErrors: !!errors.name || !!errors.price || !!errors.image
    },
    { 
      id: 'nutrition', 
      label: 'Valeurs nutritionnelles',
      hasErrors: !!errors.nutritionalInfo
    },
    { 
      id: 'specific', 
      label: 'Options spécifiques',
      hasErrors: false
    }
  ];

  // Fonction pour nettoyer les données avant envoi
  const cleanDataForAPI = (data: any) => {
    const cleanedData: any = {
      name: data.name,
      type: data.type,
      image: typeof data.image === 'string' ? data.image : undefined,
      active: data.active,
      available: data.available,
      category: data.category,
      preparationTimeMinutes: Number(data.preparationTimeMinutes),
      baseIngredients: data.baseIngredients,
      allergens: data.allergens,
      spicyLevel: data.spicyLevel,
      nutritionalInfo: {
        calories: Number(data.nutritionalInfo?.calories || 0),
        proteins: Number(data.nutritionalInfo?.proteins || 0),
        carbs: Number(data.nutritionalInfo?.carbs || 0),
        fats: Number(data.nutritionalInfo?.fats || 0),
        servingSize: data.nutritionalInfo?.servingSize || '100g'
      },
      isVegan: data.isVegan,
      isVegetarian: data.isVegetarian,
      isGlutenFree: data.isGlutenFree
    };

    // Ajouter l'ID si c'est une mise à jour
    if (initialData?._id) {
      cleanedData._id = initialData._id;
    }

    // Ajouter le prix seulement s'il est défini et n'est pas undefined
    if (data.price !== undefined && data.price !== null && data.price !== '') {
      cleanedData.price = Number(data.price);
    }
    
    // Ajouter les champs optionnels spécifiques s'ils existent
    if (data.pizzaBase) cleanedData.pizzaBase = data.pizzaBase;
    if (data.pizzaSizes) {
      cleanedData.pizzaSizes = data.pizzaSizes.map((size: any) => ({
        ...size,
        price: Number(size.price)
      }));
    }
    if (data.paniniAccompaniments) {
      cleanedData.paniniAccompaniments = {
        ...data.paniniAccompaniments,
        drinkPrice: Number(data.paniniAccompaniments.drinkPrice || 0)
      };
    }
    if (data.plateAccompaniments) cleanedData.plateAccompaniments = data.plateAccompaniments;
    if (data.includesSurprise) cleanedData.includesSurprise = data.includesSurprise;
    if (data.includesCaprisun) cleanedData.includesCaprisun = data.includesCaprisun;
    
    return cleanedData;
  };

  const onFormSubmit = async (data: FoodInputAPI) => {
    try {
      setIsSubmitting(true);
      console.log('Données du formulaire:', data);
      const formData = new FormData();
      
      if (data.image && typeof data.image === 'object' && 'name' in data.image) {
        formData.append('image', data.image as File);
        const cleanedData = cleanDataForAPI(data);
        console.log('Données nettoyées sans image:', cleanedData);
        formData.append('data', JSON.stringify(cleanedData));
      } else {
        const cleanedData = cleanDataForAPI(data);
        console.log('Données nettoyées complètes:', cleanedData);
        formData.append('data', JSON.stringify(cleanedData));
      }

      const method = initialData?._id ? 'PUT' : 'POST';
      const successMessage = initialData?._id 
        ? "Le plat a été modifié avec succès"
        : "Le plat a été créé avec succès";

      const response = await fetch('/api/admin/foods', {
        method,
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API détaillée:', errorData);
        console.error('Erreurs de validation:', errorData.errors);
        throw new Error(errorData.message || 'Une erreur est survenue');
      }

      showToast({
        title: "Succès !",
        description: successMessage,
        variant: "success"
      });

      // Rafraîchir la page après création/modification
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      onSubmit();
    } catch (error) {
      console.error('Form submission error:', error);
      showToast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Navigation des sections */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-4">
            {sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 relative ${
                  activeSection === section.id
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-orange-500'
                } ${section.hasErrors ? 'text-red-500' : ''}`}
              >
                {section.label}
                {section.hasErrors && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des sections */}
        <div className="space-y-6">
          {activeSection === 'basic' && (
            <BasicFoodInfo form={form} type={type} />
          )}
          
          {activeSection === 'nutrition' && (
            <NutritionalInfo form={form} />
          )}

          {activeSection === 'specific' && (
            <SpecificOptions form={form} type={type} />
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          <div>
            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-red-500">
                Veuillez corriger les erreurs avant de soumettre le formulaire
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
            >
              {initialData?._id ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}