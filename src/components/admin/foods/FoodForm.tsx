import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FoodSchema, FoodInputAPI as FoodInput, FOOD_TYPES } from '@/types/food';
import { Button } from '@/components/ui/Buttons';
import BasicFoodInfo from './sections/BasicFoodInfo';
import NutritionalInfo from './sections/NutritionalInfo';
import ExtrasInfo from './sections/ExtrasInfo';
import AllergensInfo from './sections/AllergensInfo';
import IngredientsInfo from './sections/IngredientsInfo';
import { useToast } from '@/contexts/ToastContext';
import { useProducts } from '@/contexts/ProductContext';
import { useIngredients } from '@/hooks/useIngredients';

interface FoodFormProps {
  initialData?: FoodInput;
  onSubmit: (data: FoodInput) => Promise<void>;
  onCancel: () => void;
}

export default function FoodForm({ initialData, onSubmit, onCancel }: FoodFormProps) {
  const { toast } = useToast();
  const { ingredients, isLoading: isLoadingIngredients } = useIngredients();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    initialData?.baseIngredients || []
  );

  const form = useForm<FoodInput>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      type: initialData?.type || 'burger',
      category: initialData?.category || 'regular',
      image: initialData?.image || '',
      preparationTimeMinutes: initialData?.preparationTimeMinutes || 15,
      available: initialData?.available ?? true,
      maxSauces: initialData?.maxSauces || 2,
      isVegan: initialData?.isVegan || false,
      isVegetarian: initialData?.isVegetarian || false,
      isGlutenFree: initialData?.isGlutenFree || false,
      allergens: initialData?.allergens || [],
      spicyLevel: initialData?.spicyLevel || 'mild',
      nutritionalInfo: initialData?.nutritionalInfo || {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        servingSize: 'portion'
      },
      extras: initialData?.extras || [],
      baseIngredients: initialData?.baseIngredients || []
    }
  });

  const handleImagePreview = () => {
    const imageValue = form.watch('image');
    if (imageValue && typeof imageValue !== 'string') {
      return URL.createObjectURL(imageValue as File);
    }
    return imageValue as string;
  };

  useEffect(() => {
    if (selectedIngredients.length > 0 && ingredients) {
      const selectedIngredientsData = ingredients.filter(ing => selectedIngredients.includes(ing._id));
      const totalNutritionalInfo = selectedIngredientsData.reduce(
        (acc, ingredient) => ({
          calories: acc.calories + (ingredient.nutritionalInfo?.calories || 0),
          proteins: acc.proteins + (ingredient.nutritionalInfo?.proteins || 0),
          carbs: acc.carbs + (ingredient.nutritionalInfo?.carbs || 0),
          fats: acc.fats + (ingredient.nutritionalInfo?.fats || 0),
        }),
        { calories: 0, proteins: 0, carbs: 0, fats: 0 }
      );

      // Arrondir les valeurs à 2 décimales
      Object.entries(totalNutritionalInfo).forEach(([key, value]) => {
        if (key in totalNutritionalInfo) {
          totalNutritionalInfo[key as keyof typeof totalNutritionalInfo] = Math.round(value * 100) / 100;
        }
      });

      form.setValue('nutritionalInfo', {
        ...totalNutritionalInfo,
        servingSize: form.getValues('nutritionalInfo.servingSize') || '100g'
      });
    }
  }, [selectedIngredients, ingredients, form]);

  const handleSubmit = async (data: FoodInput) => {
    try {
      // Convertir les champs numériques
      const formData = new FormData();
      
      // Gérer l'image
      if (data.image) {
        if (typeof data.image !== 'string' && data.image instanceof File) {
          formData.append('file', data.image);
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Erreur lors de l\'upload de l\'image');
          }
          
          const { url } = await uploadResponse.json();
          formData.delete('file');
          formData.append('image', url);
        } else {
          formData.append('image', data.image);
        }
      }

      // Ajouter les autres champs
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'image' && value !== undefined) {
          formData.append(key, JSON.stringify(value));
        }
      });

      await onSubmit(data);
      toast({
        description: "Le plat a été enregistré avec succès",
        variant: "success"
      });
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        description: "Erreur lors de la sauvegarde du plat",
        variant: "destructive"
      });
    }
  };

  if (isLoadingIngredients) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const foodTypeOptions: { value: string; label: string; }[] = [...FOOD_TYPES];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <BasicFoodInfo form={form} types={foodTypeOptions} />
      <IngredientsInfo
        form={form}
        ingredients={ingredients}
        selectedIngredients={selectedIngredients}
        onIngredientChange={(id: string, isChecked: boolean) => {
          setSelectedIngredients(prev => 
            isChecked ? [...prev, id] : prev.filter(i => i !== id)
          );
        }}
      />
      <NutritionalInfo form={form} />
      <ExtrasInfo form={form} />
      <AllergensInfo form={form} />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
