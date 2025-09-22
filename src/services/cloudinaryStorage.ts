import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  error?: string;
}

export class CloudinaryStorageService {
  private config: CloudinaryConfig;

  constructor() {
    this.config = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    };

    console.log('[CloudinaryStorage] Configuration chargée:', {
      cloudName: this.config.cloudName ? '✅ Présent' : '❌ Manquant',
      apiKey: this.config.apiKey ? '✅ Présent' : '❌ Manquant',
      apiSecret: this.config.apiSecret ? '✅ Présent' : '❌ Manquant'
    });

    // Configuration de Cloudinary
    cloudinary.config({
      cloud_name: this.config.cloudName,
      api_key: this.config.apiKey,
      api_secret: this.config.apiSecret
    });
  }

  /**
   * Convertit un fichier formidable en buffer
   */
  private async fileToBuffer(file: any): Promise<Buffer> {
    if (Buffer.isBuffer(file)) {
      return file;
    }

    if (file.filepath) {
      const fs = await import('fs');
      return fs.readFileSync(file.filepath);
    }

    throw new Error('Impossible de convertir le fichier en buffer');
  }

  /**
   * Upload une image vers Cloudinary
   */
  async uploadImage(imageFile: any, category: string = 'foods'): Promise<UploadResult> {
    try {
      console.log(`[CloudinaryStorage] Uploading image to category: ${category}`);

      // Vérifier la configuration
      if (!this.config.cloudName || !this.config.apiKey || !this.config.apiSecret) {
        throw new Error('Configuration Cloudinary incomplète');
      }

      // Convertir le fichier en buffer
      const imageBuffer = await this.fileToBuffer(imageFile);
      console.log(`[CloudinaryStorage] Image buffer size: ${imageBuffer.length} bytes`);

      // Créer un stream à partir du buffer
      const imageStream = new Readable();
      imageStream.push(imageBuffer);
      imageStream.push(null);

      // Upload vers Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `fast-food-app/${category}`,
            resource_type: 'auto',
            transformation: [
              { width: 800, height: 600, crop: 'limit', quality: 'auto' },
              { format: 'webp' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('[CloudinaryStorage] Upload error:', error);
              reject(error);
            } else {
              console.log('[CloudinaryStorage] Upload successful:', result?.secure_url);
              resolve(result);
            }
          }
        );

        imageStream.pipe(uploadStream);
      });

      const uploadResult = result as any;

      return {
        success: true,
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };

    } catch (error) {
      console.error('[CloudinaryStorage] Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Supprime une image de Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      console.log(`[CloudinaryStorage] Deleting image: ${publicId}`);

      const result = await cloudinary.uploader.destroy(publicId);
      console.log('[CloudinaryStorage] Delete result:', result);

      return result.result === 'ok';
    } catch (error) {
      console.error('[CloudinaryStorage] Delete error:', error);
      return false;
    }
  }

  /**
   * Récupère les informations d'une image
   */
  async getImageInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('[CloudinaryStorage] Get info error:', error);
      return null;
    }
  }

  /**
   * Génère une URL d'image avec transformations
   */
  generateImageUrl(publicId: string, transformations: any = {}): string {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true
    });
  }
}

// Instance singleton
export const cloudinaryStorage = new CloudinaryStorageService();
