import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';
import { cloudinaryStorage } from './cloudinaryStorage';


export class ImageService {
  private uploadsDir: string;
  private categories: string[] = ['foods', 'drinks', 'sauces', 'desserts', 'sides', 'ingredients'];

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'public/uploads');
  }

  async init() {
    // Créer le dossier uploads et tous les sous-dossiers de catégories
    await fs.mkdir(this.uploadsDir, { recursive: true });
    await Promise.all(
      this.categories.map(category =>
        fs.mkdir(path.join(this.uploadsDir, category), { recursive: true })
      )
    );
  }


  async uploadImage(file: any, category: string = 'foods'): Promise<string> {
    if (!this.categories.includes(category)) {
      throw new Error(`Invalid category: ${category}. Must be one of: ${this.categories.join(', ')}`);
    }
    
    await this.init();

    const filename = uuidv4();
    const imageBuffer = await fs.readFile(file.filepath);
    const metadata = await sharp(imageBuffer).metadata();

    // Garder l'image à sa taille originale ou la redimensionner intelligemment
    const maxWidth = 1920;
    const maxHeight = 1920;
    
    let targetWidth = metadata.width;
    let targetHeight = metadata.height;

    // Redimensionner seulement si l'image est trop grande
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        const ratio = Math.min(maxWidth / metadata.width, maxHeight / metadata.height);
        targetWidth = Math.round(metadata.width * ratio);
        targetHeight = Math.round(metadata.height * ratio);
      }
    }

    const outputPath = path.join(this.uploadsDir, category, `${filename}.webp`);

    await sharp(imageBuffer)
      .resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      .sharpen({ sigma: 0.5, m1: 0.5, m2: 2, x1: 2, y2: 10 })
      .normalize()
      .webp({ 
        quality: 95,
        effort: 6,
        smartSubsample: true
      })
      .toFile(outputPath);

    // Nettoyer le fichier temporaire
    await fs.unlink(file.filepath);

    return `/uploads/${category}/${filename}.webp`;
  }

  // Alias pour la compatibilité
  async uploadSingleHighQualityImage(file: any, category: string = 'foods'): Promise<string> {
    return this.uploadImage(file, category);
  }

  /**
   * Supprime une image de Cloudinary
   */
  async deleteFromCloudinary(imageUrl: string): Promise<boolean> {
    try {
      return await cloudinaryStorage.deleteImageByUrl(imageUrl);
    } catch (error) {
      console.error('Erreur suppression image Cloudinary:', error);
      return false;
    }
  }

  // Méthode pour uploader vers Cloudinary (pour Vercel et local)
  async uploadToCloudinary(file: any, category: string = 'foods', productName?: string): Promise<string> {
    if (!this.categories.includes(category)) {
      throw new Error(`Invalid category: ${category}. Must be one of: ${this.categories.join(', ')}`);
    }

    // Upload vers Cloudinary
    const result = await cloudinaryStorage.uploadImage(file, category, productName);

    if (!result.success) {
      throw new Error(`Cloudinary upload failed: ${result.error}`);
    }

    // Nettoyer le fichier temporaire
    await fs.unlink(file.filepath);

    return result.imageUrl!;
  }


}

export const imageService = new ImageService();