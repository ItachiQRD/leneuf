import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Side, SideCategory, SideInput } from '@/types/side';
import { useToast } from '@/contexts/ToastContext';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/Buttons';
import { motion } from 'framer-motion';

// Sections de formulaire
import BasicSideInfo from './sections/BasicSideInfo';
import SizesSection from './sections/SizesSection';

interface SideFormProps {
  initialData?: Partial<Side>;
  category: SideCategory;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function SideForm({
  initialData,
  category,
  onSubmit,
  onCancel
}: SideFormProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { createSide, updateSide } = useProducts();

  const form = useForm<SideInput>({
    defaultValues: {
      category,
      name: '',
      active: true,
      price: 0,
      image: initialData?.image || '',
      available: true,
      sizes: [],
      ingredients: [],
      allergens: [],
      vegetarian: false,
      vegan: false,
      preparationTime: 5,
      ...initialData
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
      id: 'sizes', 
      label: 'Tailles et prix',
      hasErrors: !!errors.sizes
    }
  ];

  const onFormSubmit = async (data: SideInput) => {
    try {
      setIsSubmitting(true);
      
      // Vérifier qu'une image est fournie
      if (!data.image || (typeof data.image === 'string' && data.image.trim() === '')) {
        showToast({
          title: "Erreur",
          description: "Une image est requise pour l'accompagnement",
          variant: "destructive"
        });
        return;
      }
      
      if (initialData?._id) {
        // Modification
        await updateSide(initialData._id, data);
      } else {
        // Création
        await createSide(data);
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
            <BasicSideInfo form={form} category={category} />
          )}
          
          {activeSection === 'sizes' && (
            <SizesSection form={form} />
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