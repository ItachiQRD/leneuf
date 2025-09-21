import { NextApiRequest, NextApiResponse } from 'next';
import { gmailStorage } from '../../../../services/gmailStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messageId, filename } = req.query;

  if (!messageId || !filename || typeof messageId !== 'string' || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  try {
    console.log(`Récupération image Gmail: ${messageId}/${filename}`);
    
    const imageBuffer = await gmailStorage.getImage(messageId, filename);
    
    // Déterminer le type MIME basé sur l'extension
    const mimeType = getMimeType(filename);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 an
    res.setHeader('Content-Length', imageBuffer.length);
    
    res.send(imageBuffer);
  } catch (error) {
    console.error('Erreur récupération image Gmail:', error);
    res.status(404).json({ error: 'Image not found' });
  }
}

function getMimeType(filename: string): string {
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg';
  }
}
