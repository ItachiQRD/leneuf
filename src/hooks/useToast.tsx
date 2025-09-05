import { ToastAction } from "@/components/ui/Toast";
import { useToast as useToastUI } from "@radix-ui/react-toast";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export const useToast = () => {
  const { toast } = useToastUI();

  const showToast = (options: ToastOptions) => {
    const { title, description, variant = 'default' } = options;
    toast({
      title,
      description,
      variant,
      duration: 3000,
    });
  };

  return {
    toast: {
      success(title: string, description?: string) {
        showToast({ title, description, variant: 'success' });
      },
      error(title: string, description?: string) {
        showToast({ title, description, variant: 'destructive' });
      }
    }
  };
};
