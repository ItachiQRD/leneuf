/**
 * Upload direct vers Cloudinary depuis le client
 * Évite la limite de payload de Vercel (4.5MB)
 */

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload une image directement vers Cloudinary depuis le client
 */
export async function uploadToCloudinary(
  file: File,
  category: string = 'foods',
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  try {
    // Vérifier la configuration Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.warn('[CloudinaryUpload] Configuration manquante, fallback vers API route:', {
        cloudName: !!cloudName,
        uploadPreset: !!uploadPreset
      });
      
      // Fallback: utiliser l'API route (limite 4.5MB sur Vercel)
      return await uploadViaApiRoute(file, category);
    }

    // Créer FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `fast-food-app/${category}`);
    formData.append('transformation', JSON.stringify([
      { width: 800, height: 600, crop: 'limit', quality: 'auto' },
      { format: 'webp' }
    ]));

    // Upload vers Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Erreur inconnue' } }));
      console.error('[CloudinaryUpload] Erreur upload:', errorData);
      return {
        success: false,
        error: errorData.error?.message || 'Erreur lors de l\'upload de l\'image'
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.secure_url
    };
  } catch (error) {
    console.error('[CloudinaryUpload] Erreur:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload'
    };
  }
}

/**
 * Fallback: Upload via API route (limite 4.5MB sur Vercel)
 */
async function uploadViaApiRoute(
  file: File,
  category: string = 'foods'
): Promise<CloudinaryUploadResult> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      if (response.status === 413) {
        return {
          success: false,
          error: 'Fichier trop volumineux pour l\'upload via API. Veuillez configurer Cloudinary pour les fichiers > 4.5MB.'
        };
      }
      const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
      return {
        success: false,
        error: errorData.message || 'Erreur lors de l\'upload'
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url
    };
  } catch (error) {
    console.error('[CloudinaryUpload] Erreur fallback API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'upload via API'
    };
  }
}
