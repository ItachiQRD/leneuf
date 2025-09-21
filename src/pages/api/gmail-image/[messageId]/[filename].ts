import { NextApiRequest, NextApiResponse } from 'next';
import { gmailStorage } from '../../../../services/gmailStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messageId, filename } = req.query;

  if (!messageId || !filename || typeof messageId !== 'string' || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  try {
    console.log(`[Gmail API] Fetching image: ${filename} from message ${messageId}`);

    // Récupérer l'image depuis Gmail
    const imageBuffer = await gmailStorage.getImage(messageId, filename);

    if (!imageBuffer) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Définir les headers pour l'image
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', imageBuffer.length);

    // Envoyer l'image
    res.send(imageBuffer);

  } catch (error) {
    console.error('[Gmail API] Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
