'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Ingredient, IngredientInput } from '@/types/ingredient';
import IngredientForm from './IngredientForm';
import { useProducts } from '@/contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

export default function IngredientModal({ isOpen, onClose, ingredient }: IngredientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createIngredient, updateIngredient, deleteIngredient } = useProducts();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!ingredient?._id) return;

    try {
      setIsSubmitting(true);
      await deleteIngredient(ingredient._id);
      toast({
        title: "Succès",
        description: "L'ingrédient a été supprimé avec succès",
        variant: "success"
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: IngredientInput) => {
    try {
      setIsSubmitting(true);

      if (ingredient?._id) {
        await updateIngredient(ingredient._id, data);
      } else {
        await createIngredient(data);
      }
      
      toast({
        title: "Succès",
        description: "L'ingrédient a été enregistré avec succès",
        variant: "success"
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-[85vw] xl:max-w-7xl p-0">
        <DialogTitle className="sr-only">
          {ingredient ? "Modifier l'ingrédient" : "Nouvel ingrédient"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {ingredient ? "Modifiez les informations de l'ingrédient" : "Ajoutez un nouvel ingrédient au système"}
        </DialogDescription>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {ingredient ? "Modifier l'ingrédient" : "Nouvel ingrédient"}
          </h2>
          
          <IngredientForm
            initialData={ingredient || undefined}
            onSubmit={handleSubmit}
            onCancel={onClose}
            onDelete={ingredient ? handleDelete : undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}