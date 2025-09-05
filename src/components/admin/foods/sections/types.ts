import { UseFormReturn } from 'react-hook-form';
import { FoodFormData, FoodType } from '@/types/food';

export interface BaseSectionProps {
  form: UseFormReturn<FoodFormData>;
}

export interface TypedSectionProps extends BaseSectionProps {
  type: FoodType;
}