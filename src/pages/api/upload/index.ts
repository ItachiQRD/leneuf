import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import { withAdmin } from '@/utils/api';

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
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return Boolean(mimetype && mimetype.includes('image'));
      },
      filename: (name, ext, part) => {
        const timestamp = Date.now();
        return `image-${timestamp}${ext}`;
      }
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const fileKey = Object.keys(files)[0];
    const file = files[fileKey] as unknown as FormidableFile;

    if (!file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Renvoie l'URL relative de l'image
    const relativeUrl = `/uploads/${file.newFilename}`;

    res.status(200).json({
      url: relativeUrl,
      message: 'Upload successful'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Error uploading file' 
    });
  }
};

export default withAdmin(handler);