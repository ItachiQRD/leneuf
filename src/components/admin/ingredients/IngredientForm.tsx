'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ingredient, IngredientInput, IngredientSchema } from '@/types/ingredient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Buttons';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { FieldError } from 'react-hook-form';

interface IngredientFormProps {
  initialData?: Partial<Ingredient>;
  onSubmit: (data: IngredientInput) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const INGREDIENT_TYPES: SelectOption[] = [
  { value: 'meat', label: 'Viande' },
  { value: 'cheese', label: 'Fromage' },
  { value: 'vegetable', label: 'Légume' },
  { value: 'extra', label: 'Extra' },
];

const USAGE_TYPES: SelectOption[] = [
  { value: 'base', label: 'Ingrédient de base uniquement' },
  { value: 'extra', label: 'Supplément uniquement' },
  { value: 'both', label: 'Base et Supplément' },
];

export default function IngredientForm({ initialData, onSubmit, onCancel, onDelete }: IngredientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<IngredientInput>({
    resolver: zodResolver(IngredientSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      type: initialData?.type ?? 'meat',
      usage: initialData?.usage ?? 'base',
      price: initialData?.price ?? 0,
      image: initialData?.image ?? '',
      isAvailable: initialData?.isAvailable ?? true,
      isSpicy: initialData?.isSpicy ?? false,
      isVegetarian: initialData?.isVegetarian ?? false,
      allergens: initialData?.allergens ?? [],
      orderIndex: initialData?.orderIndex ?? 0,
      nutritionalInfo: initialData?.nutritionalInfo ?? {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        servingSize: 100
      }
    },
    mode: 'onSubmit',
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Erreurs de validation:', errors);
    }
  }, [errors]);

  const handleImageChange = (file: string | File) => {
    setValue('image', file);
  };

  const getErrorMessage = (error: FieldError | undefined): string | undefined => {
    return error?.message;
  };

  const onFormSubmit = async (data: IngredientInput) => {
    try {
      setIsSubmitting(true);
      // Assurez-vous que les valeurs numériques sont des nombres
      const formattedData = {
        ...data,
        price: parseFloat(data.price.toString()),
        orderIndex: parseInt(data.orderIndex.toString())
      };
      await onSubmit(formattedData);
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
    <div className="w-full max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Informations principales
              </h3>
              <div className="space-y-4">
                <Input
                  label="Nom"
                  {...register('name')}
                  error={getErrorMessage(errors.name)}
                  placeholder="Nom de l'ingrédient"
                  className="w-full"
                />

                <Select
                  label="Type d'ingrédient"
                  {...register('type')}
                  error={errors.type?.message}
                  options={INGREDIENT_TYPES}
                  className="w-full"
                />

                <Select
                  label="Utilisation"
                  {...register('usage')}
                  error={errors.usage?.message}
                  options={USAGE_TYPES}
                  className="w-full"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prix"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          setValue('price', value);
                        }
                      }
                    })}
                    error={getErrorMessage(errors.price)}
                    placeholder="0.00"
                    className="w-full"
                  />

                  <Input
                    label="Ordre d'affichage"
                    type="number"
                    min="0"
                    {...register('orderIndex', {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setValue('orderIndex', value);
                        }
                      }
                    })}
                    error={getErrorMessage(errors.orderIndex)}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Image et caractéristiques
              </h3>
              
              <div className="space-y-6">
                <ImageUpload
                  value={watch('image')}
                  onChange={handleImageChange}
                  error={getErrorMessage(errors.image)}
                  label="Image de l'ingrédient"
                />

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Caractéristiques
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <Switch
                        checked={watch('isAvailable')}
                        onCheckedChange={(checked) => setValue('isAvailable', checked)}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Disponible</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <Switch
                        checked={watch('isSpicy')}
                        onCheckedChange={(checked) => setValue('isSpicy', checked)}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Épicé</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <Switch
                        checked={watch('isVegetarian')}
                        onCheckedChange={(checked) => setValue('isVegetarian', checked)}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Végétarien</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Valeurs nutritionnelles (pour 100g)
              </h3>
              <div className="space-y-4">
                <Input
                  label="Calories (kcal)"
                  type="number"
                  {...register('nutritionalInfo.calories', { valueAsNumber: true })}
                  error={getErrorMessage(errors.nutritionalInfo?.calories)}
                />
                <Input
                  label="Protéines (g)"
                  type="number"
                  step="0.1"
                  {...register('nutritionalInfo.proteins', { valueAsNumber: true })}
                  error={getErrorMessage(errors.nutritionalInfo?.proteins)}
                />
                <Input
                  label="Glucides (g)"
                  type="number"
                  step="0.1"
                  {...register('nutritionalInfo.carbs', { valueAsNumber: true })}
                  error={getErrorMessage(errors.nutritionalInfo?.carbs)}
                />
                <Input
                  label="Lipides (g)"
                  type="number"
                  step="0.1"
                  {...register('nutritionalInfo.fats', { valueAsNumber: true })}
                  error={getErrorMessage(errors.nutritionalInfo?.fats)}
                />
                <Input
                  label="Fibres (g)"
                  type="number"
                  step="0.1"
                  {...register('nutritionalInfo.fiber', { valueAsNumber: true })}
                  error={getErrorMessage(errors.nutritionalInfo?.fiber)}
                />
                <Input
                  label="Sucres (g)"
                  type="number"
                  step="0.1"
                  {...register('nutritionalInfo.sugar', { valueAsNumber: true })}
                  error={getErrorMessage(errors.nutritionalInfo?.sugar)}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Allergènes
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Ajouter un allergène et appuyer sur Entrée"
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        const currentAllergens = watch('allergens') || [];
                        setValue('allergens', [...currentAllergens, value]);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {watch('allergens')?.map((allergen, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-full text-sm flex items-center gap-2 group"
                    >
                      {allergen}
                      <button
                        type="button"
                        onClick={() => {
                          const currentAllergens = watch('allergens') || [];
                          setValue(
                            'allergens',
                            currentAllergens.filter((_, i) => i !== index)
                          );
                        }}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
          {initialData?._id && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isSubmitting}
              className="mr-auto px-6"
            >
              Supprimer
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6"
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? 'En cours...' : initialData?._id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </div>
  );
}