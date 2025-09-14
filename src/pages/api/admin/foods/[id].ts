import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { z } from 'zod';
import { imageService } from '@/services/imageService';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextApiRequest) {
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    keepExtensions: true,
  });

  const [fields, files] = await form.parse(req);
  return { fields, files };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await connectDB();

    switch (req.method) {
      case 'PUT':
        try {
          const { fields, files } = await parseForm(req);
          let updateData;
          
          try {
            updateData = JSON.parse(fields.data as string);
          } catch (error) {
            return res.status(400).json({ message: 'Données JSON invalides' });
          }

          // Nettoyer les données (convertir les strings en numbers)
          const cleanData = {
            ...updateData,
            price: updateData.price ? (typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price) : undefined,
            preparationTimeMinutes: typeof updateData.preparationTimeMinutes === 'string' ? parseInt(updateData.preparationTimeMinutes) : updateData.preparationTimeMinutes,
            nutritionalInfo: updateData.nutritionalInfo ? {
              ...updateData.nutritionalInfo,
              calories: typeof updateData.nutritionalInfo?.calories === 'string' ? parseInt(updateData.nutritionalInfo.calories) : updateData.nutritionalInfo?.calories || 0,
              proteins: typeof updateData.nutritionalInfo?.proteins === 'string' ? parseInt(updateData.nutritionalInfo.proteins) : updateData.nutritionalInfo?.proteins || 0,
              carbs: typeof updateData.nutritionalInfo?.carbs === 'string' ? parseInt(updateData.nutritionalInfo.carbs) : updateData.nutritionalInfo?.carbs || 0,
              fats: typeof updateData.nutritionalInfo?.fats === 'string' ? parseInt(updateData.nutritionalInfo.fats) : updateData.nutritionalInfo?.fats || 0
            } : updateData.nutritionalInfo
          };

          // Gérer l'image si une nouvelle image est fournie
          if (files.image) {
            const file = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              console.log(' [API Foods PUT] Upload de la nouvelle image...');
              const imageUrl = await imageService.uploadImage(file, 'foods');
              console.log(' [API Foods PUT] Image uploadée:', imageUrl);
              cleanData.image = imageUrl;
            } catch (error) {
              console.error(' [API Foods PUT] Erreur upload image:', error);
              return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
            }
          }

          const food = await Food.findByIdAndUpdate(id, cleanData, { new: true });
          
          if (!food) {
            return res.status(404).json({ message: 'Plat non trouvé' });
          }
          
          return res.status(200).json(food);
        } catch (error) {
          console.error('Erreur lors de la mise à jour du plat:', error);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour du plat' });
        }

      case 'DELETE':
        try {
          const food = await Food.findByIdAndUpdate(id, { 
            active: false, 
            deletedAt: new Date() 
          }, { new: true });
          
          if (!food) {
            return res.status(404).json({ message: 'Plat non trouvé' });
          }
          
          return res.status(200).json({ message: 'Plat supprimé avec succès' });
        } catch (error) {
          console.error('Erreur lors de la suppression du plat:', error);
          return res.status(500).json({ message: 'Erreur lors de la suppression du plat' });
        }

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ message: 'Erreur serveur interne' });
  }
}

export default withAdmin(handler);
