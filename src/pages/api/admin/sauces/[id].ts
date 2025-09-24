import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Sauce from '@/models/Sauce';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';
import { sauceSchema } from '@/types/sauce';
import { ZodError } from 'zod';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
          });

          const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err);
              resolve([fields, files]);
            });
          });

          if (!fields.data) {
            throw new Error('Données manquantes');
          }

          let updateData;
          try {
            updateData = typeof fields.data === 'string'
              ? JSON.parse(fields.data)
              : JSON.parse(fields.data[0]);
          } catch (error) {
            throw new Error('Format de données invalide');
          }

          // Gérer l'image si une nouvelle image est fournie
          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadToCloudinary(imageFile, 'sauces', updateData.name);
              updateData.image = imageUrl;
            } catch (error) {
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          // Nettoyer les données
          const cleanData = {
            ...updateData,
            price: typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price,
            nutritionalInfo: updateData.nutritionalInfo ? {
              ...updateData.nutritionalInfo,
              calories: typeof updateData.nutritionalInfo.calories === 'string' ? parseFloat(updateData.nutritionalInfo.calories) : updateData.nutritionalInfo.calories,
              proteins: typeof updateData.nutritionalInfo.proteins === 'string' ? parseFloat(updateData.nutritionalInfo.proteins) : updateData.nutritionalInfo.proteins,
              carbs: typeof updateData.nutritionalInfo.carbs === 'string' ? parseFloat(updateData.nutritionalInfo.carbs) : updateData.nutritionalInfo.carbs,
              fats: typeof updateData.nutritionalInfo.fats === 'string' ? parseFloat(updateData.nutritionalInfo.fats) : updateData.nutritionalInfo.fats
            } : updateData.nutritionalInfo
          };

          // Validation et mise à jour
          try {
            const updateSchema = sauceSchema.partial();
            const validatedData = updateSchema.parse(cleanData);

            const sauce = await Sauce.findByIdAndUpdate(id, validatedData, { new: true });

            if (!sauce) {
              return res.status(404).json({ message: 'Sauce non trouvée' });
            }

            return res.status(200).json(sauce);
          } catch (error) {
            if (error instanceof ZodError) {
              return res.status(400).json({
                message: 'Erreur de validation',
                errors: error.errors
              });
            }
            throw error;
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la sauce:', error);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour de la sauce' });
        }

      case 'DELETE':
        try {
          // Récupérer la sauce avant suppression pour obtenir l'URL de l'image
          const sauce = await Sauce.findById(id);
          
          if (!sauce) {
            return res.status(404).json({ message: 'Sauce non trouvée' });
          }

          // Supprimer l'image de Cloudinary si elle existe
          if (sauce.image && typeof sauce.image === 'string') {
            try {
              await imageService.deleteFromCloudinary(sauce.image);
            } catch (error) {
              console.error('Erreur suppression image Cloudinary:', error);
              // On continue la suppression même si l'image n'a pas pu être supprimée
            }
          }

          // Supprimer la sauce de la base de données
          await Sauce.findByIdAndDelete(id);
          return res.status(200).json({ message: 'Sauce supprimée avec succès' });
        } catch (error) {
          console.error('Erreur lors de la suppression de la sauce:', error);
          return res.status(500).json({ message: 'Erreur lors de la suppression de la sauce' });
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
