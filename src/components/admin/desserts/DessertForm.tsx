// components/admin/desserts/DessertForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dessert, DessertInput, DessertType } from '@/types/dessert';
import { useProducts } from '@/contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { isFile } from '@/utils/fileUtils';
import { Button } from '@/components/ui/Buttons';
import { motion } from 'framer-motion';
import { z } from 'zod';

// Import des sections
import BasicDessertInfo from './sections/BasicDessertInfo';
import SizesDessertSection from './sections/SizesDessertSection';

// Définition du schéma de validation Zod
const sizeSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire'),
  price: z.union([
    z.number().min(0, 'Le prix doit être supérieur ou égal à 0'),
    z.string().transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num)) throw new Error('Le prix doit être un nombre');
      return num;
    })
  ]),
  isDefault: z.boolean().default(false)
});

// Schéma de base commun
const baseDessertSchema = {
  type: z.enum(['cake', 'ice_cream', 'cookie', 'brownie', 'muffin'], {
    required_error: "Le type de dessert est requis",
    invalid_type_error: "Type de dessert invalide"
  }),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  price: z.union([
    z.number().min(0, "Le prix doit être positif"),
    z.string().transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num)) throw new Error('Le prix doit être un nombre');
      return num;
    })
  ]),
  available: z.boolean().default(true),
  active: z.boolean().default(true),
  sizes: z.array(sizeSchema).default([])
};

// Schéma pour la création (avec image obligatoire)
const createDessertSchema = z.object({
  ...baseDessertSchema,
  image: z.any()
}).refine((data) => {
  if (data.sizes.length === 0) return true;
  const defaultSizes = data.sizes.filter(size => size.isDefault);
  return defaultSizes.length <= 1;
}, {
  message: "Il ne peut y avoir qu'une seule taille par défaut",
  path: ["sizes"]
});

// Schéma pour la mise à jour (image optionnelle)
const updateDessertSchema = z.object({
  ...baseDessertSchema,
  image: z.any().optional()
}).refine((data) => {
  if (data.sizes.length === 0) return true;
  const defaultSizes = data.sizes.filter(size => size.isDefault);
  return defaultSizes.length <= 1;
}, {
  message: "Il ne peut y avoir qu'une seule taille par défaut",
  path: ["sizes"]
});

interface DessertFormProps {
  initialData?: Partial<Dessert>;
  type: DessertType;
  onSubmit: () => void;
  onCancel: () => void;
}

const SECTIONS = [
  {
    id: 'basic',
    label: 'Informations de base',
    Component: BasicDessertInfo,
    errorKeys: ['name', 'price', 'image']
  },
  {
    id: 'sizes',
    label: 'Tailles et prix',
    Component: SizesDessertSection,
    errorKeys: ['sizes']
  }
];

export default function DessertForm({
  initialData,
  type,
  onSubmit,
  onCancel
}: DessertFormProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createDessert, updateDessert } = useProducts();

  const form = useForm<DessertInput>({
    defaultValues: {
      type,
      name: '',
      price: 0,
      image: '',
      available: true,
      active: true,
      sizes: [],
      ...initialData
    }
  });

  const { handleSubmit, formState: { errors } } = form;

  const onFormSubmit = async (data: DessertInput) => {
    try {
      setIsSubmitting(true);
      console.log(' [DessertForm] Soumission du formulaire:', { initialData, data });
      
      const formData = new FormData();
      
      // Préparer les données
      const { image, ...restData } = data;
      
      // Si une nouvelle image est fournie (File), l'ajouter au FormData
      const hasNewImage = isFile(image);
      if (hasNewImage) {
        console.log(' [DessertForm] Nouvelle image détectée');
        formData.append('image', image);
      }
      
      // Convertir les prix en nombres
      const formattedData = {
        ...restData,
        price: typeof restData.price === 'string' ? parseFloat(restData.price) : restData.price,
        sizes: restData.sizes?.map(size => ({
          ...size,
          price: typeof size.price === 'string' ? parseFloat(size.price) : size.price
        })) || []
      };

      // Utiliser soit _id soit id
      const dessertId = initialData?._id || initialData?.id;
      console.log(' [DessertForm] ID du dessert:', dessertId);

      // Valider les données avec le schéma approprié
      const schema = dessertId ? updateDessertSchema : createDessertSchema;
      const validationResult = schema.safeParse(formattedData);

      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format();
        let errorMessage = "Erreurs de validation:\n";
        Object.entries(formattedErrors).forEach(([field, error]) => {
          if (field !== '_errors' && error && typeof error === 'object' && '_errors' in error) {
            const errorObj = error as { _errors: string[] };
            errorMessage += `${field}: ${errorObj._errors.join(', ')}\n`;
          }
        });
        throw new Error(errorMessage);
      }

      // Ajouter les données validées au FormData
      formData.append('data', JSON.stringify(formattedData));

      if (dessertId) {
        console.log(' [DessertForm] Mise à jour du dessert:', dessertId);
        await updateDessert(dessertId, hasNewImage ? formData : formattedData);
      } else {
        console.log(' [DessertForm] Création d\'un nouveau dessert');
        await createDessert(formData);
      }

      onSubmit();
    } catch (error) {
      console.error(' [DessertForm] Erreur:', error);
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
    return section.errorKeys.some(key => errors[key as keyof DessertInput]);
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