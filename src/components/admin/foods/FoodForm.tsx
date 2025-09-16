import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Food, FoodType, FoodInputAPI } from '@/types/food';
import { useToast } from '@/contexts/ToastContext';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/Buttons';

// Sections de formulaire
import BasicFoodInfo from './sections/BasicFoodInfo';

interface FoodFormProps {
  initialData?: Partial<FoodInputAPI>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { createFood, updateFood } = useProducts();

  const getInitialImage = () => {
    if (initialData?.image && typeof initialData.image === 'string') {
      return initialData.image;
    }
    return '';
  };



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
      description: '',
      ...(initialData && {
        name: initialData.name || '',
        price: initialData.price,
        type: initialData.type || type,
        category: initialData.category || 'regular',
        active: initialData.active ?? true,
        available: initialData.available ?? true,
        preparationTimeMinutes: initialData.preparationTimeMinutes || 15,
        baseIngredients: initialData.baseIngredients || [],
        description: initialData.description || ''
      })
    }
  });

  const { handleSubmit, formState: { errors } } = form;

  const sections = [
    { 
      id: 'basic', 
      label: 'Informations de base',
      hasErrors: !!errors.name || !!errors.price || !!errors.image || !!errors.preparationTimeMinutes || !!errors.category || !!errors.baseIngredients
    }
  ];


  const onFormSubmit = async (data: FoodInputAPI) => {
    try {
      setIsSubmitting(true);
      console.log('Données du formulaire:', data);

      // Validation côté client
      if (!data.baseIngredients || data.baseIngredients.length === 0) {
        showToast({
          title: "Erreur de validation",
          description: "Vous devez ajouter au moins un ingrédient de base",
          variant: "destructive"
        });
        return;
      }

      // Nettoyer les données pour ne garder que les champs nécessaires
      const cleanData = {
        name: data.name,
        type: data.type,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        image: data.image,
        available: data.available,
        preparationTimeMinutes: typeof data.preparationTimeMinutes === 'string' ? parseInt(data.preparationTimeMinutes) : data.preparationTimeMinutes,
        category: data.category,
        baseIngredients: data.baseIngredients || [],
        active: data.active,
        description: data.description
      };

      console.log('Données nettoyées:', cleanData);

      if (initialData?._id) {
        // Modification
        await updateFood(initialData._id, cleanData);
        } else {
        // Création
        await createFood(cleanData);
      }

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

        {/* Contenu des sections */}
        <div className="space-y-6">
          <BasicFoodInfo form={form} type={type} />
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