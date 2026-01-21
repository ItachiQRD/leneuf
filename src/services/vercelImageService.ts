// Service d'upload d'images adapté à Vercel
// Utilise des URLs temporaires et un stockage externe

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export class VercelImageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  async uploadImage(file: File, category: string): Promise<string> {
    try {
      console.log('📤 Upload image Vercel:', { 
        fileName: file.name, 
        category, 
        size: file.size,
        type: file.type 
      });

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux (max 5MB)');
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      // Créer FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);

      // Upload vers l'API
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        // Ne pas définir Content-Type pour FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur upload API:', errorText);
        throw new Error(`Erreur upload: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Upload réussi:', result);

      return result.url;
    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      throw error;
    }
  }

  async uploadImageFromBuffer(buffer: Buffer, filename: string, category: string): Promise<string> {
    try {
      console.log('📤 Upload buffer Vercel:', { filename, category, size: buffer.length });

      // Créer un blob à partir du buffer
      const blob = new Blob([new Uint8Array(buffer)]);
      const file = new File([blob], filename, { type: 'image/jpeg' });

      return await this.uploadImage(file, category);
    } catch (error) {
      console.error('❌ Erreur upload buffer:', error);
      throw error;
    }
  }

  // Méthode de fallback pour les environnements sans stockage de fichiers
  generatePlaceholderUrl(filename: string, category: string): string {
    const encodedFilename = encodeURIComponent(filename);
    return `https://via.placeholder.com/400x300/cccccc/666666?text=${encodedFilename}`;
  }

  // Méthode pour valider les URLs d'images
  isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

// Instance par défaut
export const vercelImageService = new VercelImageService();
