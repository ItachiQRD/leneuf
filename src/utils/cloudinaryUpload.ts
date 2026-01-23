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
    // Essayer d'abord avec NEXT_PUBLIC_ (pour le client)
    // Puis sans préfixe (pour compatibilité)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
                      (typeof window !== 'undefined' ? (window as any).__CLOUDINARY_CLOUD_NAME__ : undefined);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                          (typeof window !== 'undefined' ? (window as any).__CLOUDINARY_UPLOAD_PRESET__ : undefined);

    // Limite Vercel pour les serverless functions
    const VERCEL_MAX_SIZE = 4.5 * 1024 * 1024; // 4.5MB
    const fileSizeMB = file.size / (1024 * 1024);

    if (!cloudName || !uploadPreset) {
      // Si les variables client ne sont pas configurées, utiliser l'API route
      // qui utilise les variables serveur (CLOUDINARY_CLOUD_NAME, etc.)
      // Cette route gère les fichiers jusqu'à 10MB via stream
      console.warn('[CloudinaryUpload] Variables client non configurées, utilisation de l\'API route avec variables serveur:', {
        cloudName: !!cloudName,
        uploadPreset: !!uploadPreset,
        fileSize: `${fileSizeMB.toFixed(2)}MB`,
        serverVarsAvailable: {
          CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
          CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET
        }
      });
      
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
 * Fallback: Upload via API route qui utilise les variables serveur Cloudinary
 * Cette route utilise un stream pour gérer les fichiers jusqu'à 10MB
 */
async function uploadViaApiRoute(
  file: File,
  category: string = 'foods'
): Promise<CloudinaryUploadResult> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);

    // Utiliser la nouvelle route qui gère les gros fichiers avec stream
    const response = await fetch('/api/upload-cloudinary', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
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
