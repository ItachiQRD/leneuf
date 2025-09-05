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
}

interface ProcessedImage {
  large: string;
  medium: string;
  thumbnail: string;
}

const SIZES: ImageSize[] = [
  { width: 800, height: 800, quality: 90, suffix: 'large' },
  { width: 400, height: 400, quality: 80, suffix: 'medium' },
  { width: 200, height: 200, quality: 70, suffix: 'thumbnail' }
];

export class ImageService {
  private uploadsDir: string;
  private categories: string[] = ['foods', 'drinks', 'sauces', 'desserts', 'sides'];

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

    const processSize = async ({ width, height, quality, suffix }: ImageSize) => {
      const outputPath = this.getImagePath(filename, suffix, category);
      await sharp(imageBuffer)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality })
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

  async deleteImage(imageUrl: string) {
    if (!imageUrl) return;

    // Extraire la catégorie et le nom de fichier de l'URL
    const matches = imageUrl.match(/\/uploads\/([^\/]+)\/([^-]+)/);
    if (!matches) return;

    const [, category, filename] = matches;

    for (const { suffix } of SIZES) {
      const imagePath = this.getImagePath(filename, suffix, category);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(`Failed to delete image ${imagePath}:`, error);
      }
    }
  }
}

export const imageService = new ImageService();