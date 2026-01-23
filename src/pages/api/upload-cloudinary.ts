import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

type FormidableFile = {
  filepath?: string;
  newFilename?: string;
  originalFilename?: string;
  mimetype?: string;
  size?: number;
  buffer?: Buffer;
  _buf?: Buffer;
  toBuffer?: () => Promise<Buffer>;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Vérifier la configuration Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        message: 'Configuration Cloudinary manquante. Veuillez configurer CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans Vercel.'
      });
    }

    // Configurer Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    // Configuration formidable pour Vercel (fichiers en mémoire)
    const form = formidable({
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => {
        return Boolean(mimetype && mimetype.includes('image'));
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
          console.error('❌ [Upload Cloudinary API] Erreur parsing:', err);
          reject(err);
        }
        resolve([fields, files]);
      });
    });

    const fileKey = Object.keys(files)[0];
    let file = files[fileKey] as unknown as FormidableFile | FormidableFile[];

    if (Array.isArray(file)) {
      file = file[0];
    }

    if (!file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category || 'foods';

    // Convertir le fichier en buffer
    let imageBuffer: Buffer;
    
    if (Buffer.isBuffer(file)) {
      imageBuffer = file;
    } else if (file.buffer) {
      imageBuffer = file.buffer;
    } else if (file._buf) {
      imageBuffer = file._buf;
    } else if (file.toBuffer) {
      imageBuffer = await file.toBuffer();
    } else if (file.filepath) {
      const fs = await import('fs/promises');
      imageBuffer = await fs.readFile(file.filepath);
    } else {
      // Essayer de lire depuis un stream
      const stream = file as any;
      if (stream && typeof stream.pipe === 'function') {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        imageBuffer = Buffer.concat(chunks);
      } else {
        throw new Error('Impossible de convertir le fichier en buffer');
      }
    }

    // Créer un stream depuis le buffer
    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    // Upload vers Cloudinary avec stream
    const uploadResult = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `fast-food-app/${category}`,
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 1920, crop: 'limit', quality: 'auto' },
            { format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ [Upload Cloudinary API] Erreur upload:', error);
            reject(error);
          } else if (result) {
            console.log('✅ [Upload Cloudinary API] Upload réussi:', result.secure_url);
            resolve(result);
          } else {
            reject(new Error('Aucun résultat de l\'upload'));
          }
        }
      );

      bufferStream.pipe(uploadStream);
    });

    res.status(200).json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      message: 'Upload successful (Cloudinary)'
    });
  } catch (error) {
    console.error('❌ [Upload Cloudinary API] Erreur:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Error uploading file',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
};

export default handler;
