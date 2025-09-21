import { NextApiRequest, NextApiResponse } from 'next';
import { GmailStorageService } from '@/services/gmailStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔍 [Test Vercel Gmail] Début du test...');
    
    // Vérifier les variables d'environnement
    const config = {
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      userEmail: process.env.GMAIL_USER_EMAIL
    };

    console.log('🔧 [Test Vercel Gmail] Configuration:', {
      clientId: config.clientId ? '✅ Présent' : '❌ Manquant',
      clientSecret: config.clientSecret ? '✅ Présent' : '❌ Manquant',
      refreshToken: config.refreshToken ? '✅ Présent' : '❌ Manquant',
      userEmail: config.userEmail ? '✅ Présent' : '❌ Manquant'
    });

    // Vérifier si toutes les variables sont présentes
    if (!config.clientId || !config.clientSecret || !config.refreshToken || !config.userEmail) {
      return res.status(500).json({
        success: false,
        message: 'Configuration Gmail incomplète sur Vercel',
        config: {
          clientId: !!config.clientId,
          clientSecret: !!config.clientSecret,
          refreshToken: !!config.refreshToken,
          userEmail: !!config.userEmail
        }
      });
    }

    // Tester l'initialisation du service Gmail
    console.log('🚀 [Test Vercel Gmail] Initialisation du service Gmail...');
    const gmailService = new GmailStorageService();
    console.log('✅ [Test Vercel Gmail] Service Gmail initialisé');

    // Tester un upload simple
    console.log('📤 [Test Vercel Gmail] Test d\'upload...');
    const testBuffer = Buffer.from('test image data');
    const result = await gmailService.uploadImage(testBuffer, 'test-vercel.webp', 'test');
    
    if (result.success) {
      console.log('✅ [Test Vercel Gmail] Upload réussi:', result.imageUrl);
      
      // Nettoyer le test
      if (result.messageId) {
        await gmailService.deleteImage(result.messageId);
        console.log('🗑️ [Test Vercel Gmail] Image de test supprimée');
      }

      return res.status(200).json({
        success: true,
        message: 'Configuration Gmail fonctionne sur Vercel',
        details: {
          configuration: 'Valide',
          upload: 'Réussi',
          imageUrl: result.imageUrl
        }
      });
    } else {
      console.error('❌ [Test Vercel Gmail] Échec upload:', result.error);
      return res.status(500).json({
        success: false,
        message: 'Échec de l\'upload Gmail sur Vercel',
        error: result.error
      });
    }

  } catch (error) {
    console.error('❌ [Test Vercel Gmail] Erreur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du test Gmail sur Vercel',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
