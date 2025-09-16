import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { vercelImageService } from '@/services/vercelImageService';

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
    console.log('📤 [Upload API] Début upload...');
    
    // Configuration formidable pour Vercel
    const form = formidable({
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        const isValid = Boolean(mimetype && mimetype.includes('image'));
        console.log('🔍 [Upload API] Type MIME:', mimetype, 'Valide:', isValid);
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
    const file = files[fileKey] as unknown as FormidableFile;

    if (!file) {
      console.error('❌ [Upload API] Aucun fichier reçu');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    console.log('📄 [Upload API] Fichier reçu:', {
      originalFilename: file.originalFilename,
      newFilename: file.newFilename,
      mimetype: file.mimetype,
      size: file.size
    });

    // Sur Vercel, on ne peut pas écrire dans le système de fichiers
    // Utiliser un service de stockage cloud ou générer une URL temporaire
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category || 'general';
    
    // Pour l'instant, générer une URL placeholder
    // En production, intégrer Cloudinary, AWS S3, ou un autre service
    const imageUrl = vercelImageService.generatePlaceholderUrl(
      file.originalFilename || file.newFilename || 'image',
      category
    );

    console.log('✅ [Upload API] Upload simulé:', imageUrl);

    res.status(200).json({
      url: imageUrl,
      filename: file.newFilename,
      originalFilename: file.originalFilename,
      size: file.size,
      message: 'Upload successful (simulated for Vercel)'
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