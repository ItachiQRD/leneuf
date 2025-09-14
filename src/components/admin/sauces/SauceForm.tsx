import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Sauce, SauceInput, SAUCE_CATEGORIES, SPICY_LEVELS } from '@/types/sauce';
import { useToast } from '@/hooks/use-toast';
import { isFile } from '@/utils/fileUtils';
import { Button } from '@/components/ui/Buttons';
import { motion } from 'framer-motion';

// Import des sections
import BasicSauceInfo from './sections/BasicSauceInfo';
import NutritionalInfo from './sections/NutritionalInfo';
import SpicySection from './sections/SpicySection';

interface SauceFormProps {
  initialData?: Partial<Sauce>;
  onSubmit: () => void;
  onCancel: () => void;
}

const SECTIONS = [
  {
    id: 'basic',
    label: 'Informations de base',
    Component: BasicSauceInfo,
    errorKeys: ['name', 'type', 'description', 'price', 'image', 'maxQuantity']
  },
  {
    id: 'nutritional',
    label: 'Informations nutritionnelles',
    Component: NutritionalInfo,
    errorKeys: ['nutritionalInfo']
  },
  {
    id: 'spicy',
    label: 'Niveau de piquant',
    Component: SpicySection,
    errorKeys: ['spicyLevel']
  }
];

export default function SauceForm({
  initialData,
  onSubmit,
  onCancel
}: SauceFormProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SauceInput>({
    defaultValues: {
      name: '',
      type: 'mayo',
      description: '',
      price: 0,
      image: '',
      available: true,
      maxQuantity: 5,
      allergens: [],
      nutritionalInfo: {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        servingSize: 'portion'
      },
      spicyLevel: 'mild',
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false,
      ...initialData
    }
  });

  const { handleSubmit, formState: { errors } } = form;

  const onFormSubmit = async (data: SauceInput) => {
    try {
      setIsSubmitting(true);
      
      // Convertir les champs numériques
      const convertedData = {
        ...data,
        price: Number(data.price),
        maxQuantity: Number(data.maxQuantity),
        nutritionalInfo: {
          ...data.nutritionalInfo,
          calories: Number(data.nutritionalInfo.calories),
          proteins: Number(data.nutritionalInfo.proteins),
          carbs: Number(data.nutritionalInfo.carbs),
          fats: Number(data.nutritionalInfo.fats)
        }
      };
      
      const formData = new FormData();

      // Gérer l'image
      if (isFile(data.image)) {
        formData.append('image', data.image);
        const { image, ...restData } = convertedData;
        formData.append('data', JSON.stringify({
          ...restData,
          _id: initialData?._id
        }));
      } else if (data.image) {
        formData.append('data', JSON.stringify({
          ...convertedData,
          _id: initialData?._id
        }));
      } else {
        toast({
          title: "Erreur",
          description: "Une image est requise",
          variant: "destructive"
        });
        return;
      }

      const method = initialData?._id ? 'PUT' : 'POST';
      
      const response = await fetch('/api/admin/sauces', {
        method,
        credentials: 'include',
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          const errorMessage = Array.isArray(responseData.errors)
            ? responseData.errors.map((e: any) => e.message).join('\n')
            : responseData.errors;
          throw new Error(errorMessage);
        }
        throw new Error(responseData.message || 'Une erreur est survenue');
      }

      toast({
        title: "Succès !",
        description: initialData?._id 
          ? "La sauce a été modifiée avec succès"
          : "La sauce a été créée avec succès",
        variant: "success"
      });

      onSubmit();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = (sectionId: string) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return false;
    return section.errorKeys.some(key => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return errors[parent as keyof typeof errors]?.[child as keyof NonNullable<(typeof errors)[keyof typeof errors]>];
      }
      return !!errors[key as keyof typeof errors];
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div className="flex space-x-4 mb-6">
        {SECTIONS.map(({ id, label }) => (
          <Button
            key={id}
            type="button"
            variant={activeSection === id ? 'default' : 'outline'}
            onClick={() => setActiveSection(id)}
            className={hasErrors(id) ? 'border-red-500' : ''}
          >
            {label}
          </Button>
        ))}
      </div>

      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {SECTIONS.map(({ id, Component }) => (
          activeSection === id && <Component key={id} form={form} />
        ))}
      </motion.div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : initialData?._id ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}