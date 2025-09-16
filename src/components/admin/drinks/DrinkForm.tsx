import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Drink, DrinkInput, DrinkSchema } from '@/types/drink';
import { useToast } from '@/hooks/use-toast';
import { isFile } from '@/utils/fileUtils';
import { Button } from '@/components/ui/Buttons';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import BasicDrinkInfo from './sections/BasicDrinkInfo';

interface DrinkFormProps {
  initialData?: Partial<Drink>;
  onSubmit: () => void;
  onCancel: () => void;
}

const sections = [
  { id: 'basic', label: 'Informations de base' }
];

export default function DrinkForm({ initialData, onSubmit, onCancel }: DrinkFormProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createDrink, updateDrink } = useProducts();

  
  const form = useForm<DrinkInput>({
    resolver: zodResolver(DrinkSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'soda',
      image: initialData?.image || undefined,
      brand: initialData?.brand || '',
      available: initialData?.available ?? true,
      sizes: initialData?.sizes || [{
        name: 'Standard',
        price: 2.50,
        volume: '330ml',
        isDefault: true
      }],
      nutritionalInfo: {
        calories: initialData?.nutritionalInfo?.calories || 0,
        sugar: initialData?.nutritionalInfo?.sugar || 0,
        servingSize: initialData?.nutritionalInfo?.servingSize || 100
      },
      allergens: initialData?.allergens || []
    },
    mode: 'onSubmit',
  });
  
  const { handleSubmit, formState: { errors } } = form;
  
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Erreurs de validation:', errors);
    }
  }, [errors]);
  

  const onFormSubmit = async (data: DrinkInput) => {
    console.log('Données du formulaire:', data);
    try {
      setIsSubmitting(true);
      
      // Vérifier qu'une image est fournie
      if (!data.image || (typeof data.image === 'string' && data.image.trim() === '')) {
        toast({
          title: "Erreur",
          description: "Une image est requise pour la boisson",
          variant: "destructive"
        });
        return;
      }
      
      if (initialData?._id) {
        // Modification
        await updateDrink(initialData._id, data);
      } else {
        // Création
        await createDrink(data);
      }

      onSubmit();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
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
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="border-b mb-6">
          <nav className="flex space-x-4">
            {sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 relative ${
                  activeSection === section.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          {activeSection === 'basic' && <BasicDrinkInfo form={form} />}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
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
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'En cours...' : initialData?._id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </div>
  );
}