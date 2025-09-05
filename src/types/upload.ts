// src/types/upload.ts
import { File } from 'formidable';
import { promises as fs } from 'fs';



export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface ProcessedImage {
  large: string;
  medium?: string;
  thumbnail?: string;
}

export async function convertFormidableFileToUploadedFile(file: File): Promise<UploadedFile> {
  // Lire le contenu du fichier pour obtenir le buffer
  const buffer = await fs.readFile(file.filepath);
  
  return {
    fieldname: 'image',
    originalname: file.originalFilename || 'untitled',
    encoding: '7bit',
    mimetype: file.mimetype || 'application/octet-stream',
    buffer, 
    size: file.size,
  };
}