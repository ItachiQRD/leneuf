import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';

export const config = {
  api: {
    bodyParser: false,
  },
};

type FormidableFile = {
  filepath: string;
  newFilename?: string;
  originalFilename?: string;
  mimetype?: string;
  size?: number;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {

    // Configuration formidable pour Vercel
    // Sur Vercel, les fichiers sont stockés en mémoire (pas de filepath)
    const form = formidable({
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      // Sur Vercel/serverless, ne pas spécifier uploadDir pour stocker en mémoire
      // uploadDir sera géré automatiquement
      filter: ({ mimetype }) => {
        const isValid = Boolean(mimetype && mimetype.includes('image'));

        return isValid;
      },
      filename: (name, ext, part) => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `image-${timestamp}-${random}${ext}`;
      }
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('❌ [Upload API] Erreur parsing:', err);
          reject(err);
        }
        resolve([fields, files]);
      });
    });

    console.log('📋 [Upload API] Champs reçus:', Object.keys(fields));
    console.log('📁 [Upload API] Fichiers reçus:', Object.keys(files));

    const fileKey = Object.keys(files)[0];
    let file = files[fileKey] as unknown as FormidableFile | FormidableFile[];

    // Formidable peut retourner un array de fichiers
    if (Array.isArray(file)) {
      file = file[0];
    }

    if (!file) {
      console.error('❌ [Upload API] Aucun fichier reçu');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Log pour debug
    console.log('📄 [Upload API] Structure du fichier:', {
      hasFilepath: !!(file as any).filepath,
      hasBuffer: !!(file as any).buffer,
      hasBuf: !!(file as any)._buf,
      size: (file as any).size,
      mimetype: (file as any).mimetype,
      keys: Object.keys(file || {})
    });

    // Utiliser Cloudinary pour tous les environnements
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category || 'foods';

    const imageUrl = await imageService.uploadToCloudinary(file, category);

    res.status(200).json({
      url: imageUrl,
      filename: file.newFilename,
      originalFilename: file.originalFilename,
      size: file.size,
      message: 'Upload successful (Cloudinary)'
    });
  } catch (error) {
    console.error('❌ [Upload API] Erreur:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error uploading file',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export default handler;