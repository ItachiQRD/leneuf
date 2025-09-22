import { NextApiRequest, NextApiResponse } from 'next';
import { cloudinaryStorage } from '@/services/cloudinaryStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔍 [Test Cloudinary] Début du test...');
    
    // Vérifier les variables d'environnement
    const config = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
    };

    console.log('🔧 [Test Cloudinary] Configuration:', {
      cloudName: config.cloudName ? '✅ Présent' : '❌ Manquant',
      apiKey: config.apiKey ? '✅ Présent' : '❌ Manquant',
      apiSecret: config.apiSecret ? '✅ Présent' : '❌ Manquant'
    });

    // Vérifier si toutes les variables sont présentes
    if (!config.cloudName || !config.apiKey || !config.apiSecret) {
      return res.status(500).json({
        success: false,
        message: 'Configuration Cloudinary incomplète',
        config: {
          cloudName: !!config.cloudName,
          apiKey: !!config.apiKey,
          apiSecret: !!config.apiSecret
        }
      });
    }

    // Tester l'initialisation du service Cloudinary
    console.log('🚀 [Test Cloudinary] Initialisation du service Cloudinary...');
    const cloudinaryService = new (await import('@/services/cloudinaryStorage')).CloudinaryStorageService();
    console.log('✅ [Test Cloudinary] Service Cloudinary initialisé');

    // Tester un upload simple
    console.log('📤 [Test Cloudinary] Test d\'upload...');
    const testBuffer = Buffer.from('test image data');
    const testFile = {
      filepath: '/tmp/test.txt',
      originalFilename: 'test.txt',
      mimetype: 'text/plain'
    };
    
    // Créer un fichier temporaire pour le test
    const fs = await import('fs');
    fs.writeFileSync('/tmp/test.txt', testBuffer);
    
    const result = await cloudinaryService.uploadImage(testFile, 'test');
    
    if (result.success) {
      console.log('✅ [Test Cloudinary] Upload réussi:', result.imageUrl);
      
      // Nettoyer le test
      if (result.publicId) {
        await cloudinaryService.deleteImage(result.publicId);
        console.log('🗑️ [Test Cloudinary] Image de test supprimée');
      }

      // Nettoyer le fichier temporaire
      fs.unlinkSync('/tmp/test.txt');

      return res.status(200).json({
        success: true,
        message: 'Configuration Cloudinary fonctionne',
        details: {
          configuration: 'Valide',
          upload: 'Réussi',
          imageUrl: result.imageUrl
        }
      });
    } else {
      console.error('❌ [Test Cloudinary] Échec upload:', result.error);
      return res.status(500).json({
        success: false,
        message: 'Échec de l\'upload Cloudinary',
        error: result.error
      });
    }

  } catch (error) {
    console.error('❌ [Test Cloudinary] Erreur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du test Cloudinary',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
