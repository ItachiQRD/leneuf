import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { path: filePath } = req.query;

  if (!filePath || typeof filePath !== 'object') {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  try {
    // Construire le chemin complet du fichier
    const fullPath = path.join(process.cwd(), 'public', 'uploads', ...filePath);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(fullPath);
    
    // Déterminer le type MIME
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Définir les headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 an
    res.setHeader('Content-Length', fileBuffer.length);
    
    // Envoyer le fichier
    res.send(fileBuffer);
  } catch (error) {
    console.error('Erreur serveur image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
