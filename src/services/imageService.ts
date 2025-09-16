import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';

interface ImageSize {
  width: number;
  height: number;
  quality?: number;
  suffix: string;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

interface ProcessedImage {
  large: string;
  medium: string;
  thumbnail: string;
}

// Configuration améliorée pour une meilleure qualité
const SIZES: ImageSize[] = [
  { 
    width: 1200, 
    height: 1200, 
    quality: 95, 
    suffix: 'large',
    fit: 'inside' // Préserve les proportions sans recadrer
  },
  { 
    width: 600, 
    height: 600, 
    quality: 90, 
    suffix: 'medium',
    fit: 'inside'
  },
  { 
    width: 300, 
    height: 300, 
    quality: 85, 
    suffix: 'thumbnail',
    fit: 'cover' // Pour les miniatures, on peut recadrer
  }
];

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

  private getImagePath(filename: string, suffix: string, category: string): string {
    return path.join(this.uploadsDir, category, `${filename}-${suffix}.webp`);
  }

  private getPublicPath(filename: string, suffix: string, category: string): string {
    return `/uploads/${category}/${filename}-${suffix}.webp`;
  }

  async uploadImage(file: formidable.File, category: string = 'foods'): Promise<string> {
    if (!this.categories.includes(category)) {
      throw new Error(`Invalid category: ${category}. Must be one of: ${this.categories.join(', ')}`);
    }
    const result = await this.processImage(file, category);
    return result.large;
  }

  async processImage(file: formidable.File, category: string): Promise<ProcessedImage> {
    await this.init();

    const filename = uuidv4();
    const imageBuffer = await fs.readFile(file.filepath);

    // Obtenir les métadonnées de l'image originale
    const metadata = await sharp(imageBuffer).metadata();
    const { width: originalWidth, height: originalHeight } = metadata;

    const processSize = async ({ width, height, quality, suffix, fit }: ImageSize) => {
      const outputPath = this.getImagePath(filename, suffix, category);
      
      // Pour les images plus petites que la taille cible, on les garde à leur taille originale
      const targetWidth = originalWidth && originalWidth < width ? originalWidth : width;
      const targetHeight = originalHeight && originalHeight < height ? originalHeight : height;

      let sharpInstance = sharp(imageBuffer);

      // Appliquer des optimisations selon la taille
      if (suffix === 'large') {
        // Pour les grandes images, on applique un léger sharpen pour compenser la compression
        sharpInstance = sharpInstance
          .sharpen({ sigma: 0.5, m1: 0.5, m2: 2, x1: 2, y2: 10 })
          .normalize(); // Améliore le contraste
      } else if (suffix === 'medium') {
        // Pour les images moyennes, on applique un sharpen plus léger
        sharpInstance = sharpInstance
          .sharpen({ sigma: 0.3, m1: 0.5, m2: 2, x1: 2, y2: 10 });
      }

      await sharpInstance
        .resize(targetWidth, targetHeight, {
          fit: fit || 'inside',
          position: 'center',
          withoutEnlargement: true, // Ne pas agrandir les images plus petites
          kernel: sharp.kernel.lanczos3 // Meilleur algorithme de redimensionnement
        })
        .webp({ 
          quality: quality || 90,
          effort: 6, // Plus d'effort pour une meilleure compression
          lossless: false,
          nearLossless: false,
          smartSubsample: true // Optimise la sous-échantillonnage
        })
        .toFile(outputPath);

      return this.getPublicPath(filename, suffix, category);
    };

    const [large, medium, thumbnail] = await Promise.all(
      SIZES.map(size => processSize(size))
    );

    // Nettoyer le fichier temporaire
    await fs.unlink(file.filepath);

    return {
      large,
      medium,
      thumbnail
    };
  }

  // Nouvelle méthode pour créer une seule image de haute qualité
  async uploadSingleHighQualityImage(file: formidable.File, category: string = 'foods'): Promise<string> {
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

  async deleteImage(imageUrl: string) {
    if (!imageUrl) return;

    // Extraire la catégorie et le nom de fichier de l'URL
    const matches = imageUrl.match(/\/uploads\/([^\/]+)\/([^-]+)/);
    if (!matches) return;

    const [, category, filename] = matches;

    // Supprimer toutes les variantes
    for (const { suffix } of SIZES) {
      const imagePath = this.getImagePath(filename, suffix, category);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(`Failed to delete image ${imagePath}:`, error);
      }
    }

    // Supprimer aussi l'image simple si elle existe
    const simpleImagePath = path.join(this.uploadsDir, category, `${filename}.webp`);
    try {
      await fs.unlink(simpleImagePath);
    } catch (error) {
      // Ignorer si le fichier n'existe pas
    }
  }
}

export const imageService = new ImageService();