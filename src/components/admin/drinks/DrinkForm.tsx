import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Drink, DrinkInput, DrinkSchema } from '@/types/drink';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Buttons';
import { useAuth } from '@/contexts/AuthContext';
import NutritionalInfo from './sections/NutritionalInfo';
import BasicDrinkInfo from './sections/BasicDrinkInfo';
import SizesDrinkSection from './sections/SizesDrinkSection';

interface DrinkFormProps {
  initialData?: Partial<Drink>;
  onSubmit: () => void;
  onCancel: () => void;
}

const sections = [
  { id: 'basic', label: 'Informations de base' },
  { id: 'sizes', label: 'Tailles' },
  { id: 'nutrition', label: 'Valeurs nutritionnelles' }
];

export default function DrinkForm({ initialData, onSubmit, onCancel }: DrinkFormProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();
  const { toast } = useToast();

  
  const form = useForm<DrinkInput>({
    resolver: zodResolver(DrinkSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'soda',
      image: initialData?.image || undefined,
      brand: initialData?.brand || '',
      price:1,
      available: initialData?.available ?? true,
      sizes: initialData?.sizes || [{
        name: 'Standard',
        price: 2.50,
        volume: 330,
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
      const formData = new FormData();
      
      // Vérifier si l'image est un objet File
      if (data.image && data.image instanceof File) {
        formData.append('image', data.image);
        const { image, ...restData } = data;
        formData.append('data', JSON.stringify({
          ...restData,
          _id: initialData?._id, // Ajouter l'ID pour la mise à jour
          image: initialData?.image // Ajouter l'ancienne image pour la suppression
        }));
      } else {
        formData.append('data', JSON.stringify({
          ...data,
          _id: initialData?._id // Ajouter l'ID pour la mise à jour
        }));
      }
  
      const response = await fetch('/api/admin/drinks', {
        method: initialData?._id ? 'PUT' : 'POST',
        credentials: 'include',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur lors de la ${initialData?._id ? 'mise à jour' : 'création'}`);
      }
  
      toast({
        title: "Succès !",
        description: `La boisson a été ${initialData?._id ? 'mise à jour' : 'créée'} avec succès`,
        variant: "success"
      });
      
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
          {activeSection === 'sizes' && <SizesDrinkSection form={form} />}
          {activeSection === 'nutrition' && <NutritionalInfo form={form} />}
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