import { useToast as useToastUI } from '@/components/ui/Toast';

export const useToast = () => {
  const { toast } = useToastUI();
  return { toast };
};
