// pages/api/ingredients/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { withAdmin } from '@/utils/api';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';
import { imageService } from '@/services/imageService';

export const config = { api: { bodyParser: false } };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await dbConnect();

    switch (req.method) {
      case 'GET': {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
          return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }
        return res.status(200).json(ingredient);
      }

      case 'PUT': {
        const form = formidable({
          maxFileSize: 10 * 1024 * 1024, // 10MB
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
            const imageUrl = await imageService.uploadToCloudinary(imageFile, 'ingredients', updateData.name);
            updateData.image = imageUrl;
          } catch (error) {
            throw new Error('Erreur lors du traitement de l\'image');
          }
        }

        // Nettoyer les données
        const cleanData = {
          ...updateData,
          price: typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price,
          orderIndex: typeof updateData.orderIndex === 'string' ? parseInt(updateData.orderIndex) : updateData.orderIndex || 0,
          available: Boolean(updateData.available),
          isSpicy: Boolean(updateData.isSpicy),
          isVegetarian: Boolean(updateData.isVegetarian),
          allergens: Array.isArray(updateData.allergens) ? updateData.allergens : []
        };

        // Validation et mise à jour
        const updatedIngredient = await Ingredient.findByIdAndUpdate(
          id,
          cleanData,
          { new: true, runValidators: true }
        );

        if (!updatedIngredient) {
          return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }

        return res.status(200).json(updatedIngredient);
      }

      case 'DELETE': {
        // Récupérer l'ingrédient avant suppression pour obtenir l'URL de l'image
        const ingredient = await Ingredient.findById(id);
        
        if (!ingredient) {
          return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }

        // Supprimer l'image de Cloudinary si elle existe
        if (ingredient.image && typeof ingredient.image === 'string') {
          try {
            await imageService.deleteFromCloudinary(ingredient.image);
          } catch (error) {
            console.error('Erreur suppression image Cloudinary:', error);
            // On continue la suppression même si l'image n'a pas pu être supprimée
          }
        }

        // Supprimer l'ingrédient de la base de données
        await Ingredient.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Ingrédient supprimé avec succès' });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur API ingredients:', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
    });
  }
}

export default withAdmin(handler);