import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string | File | null;
  onChange?: (file: File | string) => void;
  error?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, error, label }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Mettre à jour l'URL de prévisualisation quand la valeur change
  useEffect(() => {
    if (!value) {
      setPreviewUrl('');
      return;
    }

    if (typeof value === 'string') {
      setPreviewUrl(value);
    } else if (value && typeof value === 'object' && value.constructor === File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Vérifier les fichiers rejetés (trop volumineux)
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      if (rejectedFile.errors && rejectedFile.errors.length > 0) {
        const error = rejectedFile.errors[0];
        if (error.code === 'file-too-large') {
          toast({
            title: "Fichier trop volumineux",
            description: `L'image dépasse la limite de 10MB. Taille actuelle: ${(rejectedFile.file.size / (1024 * 1024)).toFixed(2)}MB`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    const file = acceptedFiles[0];
    if (!file || !onChange) return;

    // Vérification supplémentaire de la taille (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: `L'image dépasse la limite de 10MB. Taille actuelle: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      onChange(file);

      toast({
        title: "Succès",
        description: "Image sélectionnée avec succès",
        variant: "success",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "La sélection de l'image a échoué",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [onChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !onChange // Désactiver si pas de onChange
  });

  const handleRemoveImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange('');
      setPreviewUrl('');
    }
  }, [onChange]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
          ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-500'}
          ${previewUrl ? 'h-64' : 'h-40'}`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </motion.div>
          )}

          {previewUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
              {onChange && ( // N'afficher le bouton de suppression que si onChange est défini
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">
                {isDragActive ? 
                  'Déposez l\'image ici' : 
                  'Glissez une image ici ou cliquez pour sélectionner'
                }
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP jusqu'à 10MB
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}