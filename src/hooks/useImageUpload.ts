import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
  error: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error uploading image';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: "L'upload de l'image a échoué",
        variant: "destructive"
      });
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};