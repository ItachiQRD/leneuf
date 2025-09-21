import { NextApiRequest, NextApiResponse } from 'next';
import { gmailStorage } from '@/services/gmailStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🧪 [Test Gmail] Début du test de connexion Gmail...');
    
    // Vérifier la configuration
    console.log('🔍 [Test Gmail] Vérification de la configuration...');
    const isValid = await gmailStorage.validateConfig();
    
    if (!isValid) {
      console.error('❌ [Test Gmail] Configuration Gmail invalide');
      return res.status(500).json({
        success: false,
        message: 'Configuration Gmail invalide',
        details: 'Vérifiez les variables d\'environnement Gmail'
      });
    }

    console.log('✅ [Test Gmail] Configuration Gmail valide');

    // Test d'upload d'une image de test (1x1 pixel WebP)
    console.log('📤 [Test Gmail] Test d\'upload d\'image...');
    const testImageBuffer = Buffer.from(
      'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      'base64'
    );

    const uploadResult = await gmailStorage.uploadImage(testImageBuffer, 'test-connection.webp', 'test');
    
    if (!uploadResult.success) {
      console.error('❌ [Test Gmail] Échec de l\'upload:', uploadResult.error);
      return res.status(500).json({
        success: false,
        message: 'Échec de l\'upload Gmail',
        error: uploadResult.error
      });
    }

    console.log('✅ [Test Gmail] Upload réussi:', uploadResult.imageUrl);

    // Test de récupération de l'image
    console.log('📥 [Test Gmail] Test de récupération de l\'image...');
    if (uploadResult.messageId) {
      const retrievedImage = await gmailStorage.getImage(uploadResult.messageId, 'test-connection.webp');
      
      if (!retrievedImage) {
        console.error('❌ [Test Gmail] Échec de la récupération de l\'image');
        return res.status(500).json({
          success: false,
          message: 'Échec de la récupération de l\'image'
        });
      }

      console.log('✅ [Test Gmail] Récupération réussie, taille:', retrievedImage.length, 'bytes');
    }

    // Nettoyer l'image de test
    if (uploadResult.messageId) {
      console.log('🗑️ [Test Gmail] Nettoyage de l\'image de test...');
      await gmailStorage.deleteImage(uploadResult.messageId);
      console.log('✅ [Test Gmail] Image de test supprimée');
    }

    console.log('🎉 [Test Gmail] Tous les tests Gmail ont réussi !');

    res.status(200).json({
      success: true,
      message: 'Connexion Gmail réussie',
      details: {
        configuration: 'Valide',
        upload: 'Réussi',
        retrieval: 'Réussi',
        cleanup: 'Réussi',
        imageUrl: uploadResult.imageUrl
      }
    });

  } catch (error) {
    console.error('❌ [Test Gmail] Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test Gmail',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}
