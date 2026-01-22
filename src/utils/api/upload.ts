import { NextApiRequest } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';

export interface UploadResult {
  fields: formidable.Fields;
  files: formidable.Files;
}

export async function handleUpload(req: NextApiRequest): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Créer le dossier d'upload s'il n'existe pas
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: function ({ mimetype }) {
      // Accepter uniquement les images
      return mimetype?.includes('image/') ?? false;
    },
    filename: function (name, ext, part) {
      // Générer un nom de fichier unique
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      return `${part.name}-${uniqueSuffix}${ext}`;
    }
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}
