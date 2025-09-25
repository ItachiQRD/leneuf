import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';

// Désactiver le bodyParser par défaut de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const ingredients = await Ingredient.find({ $or: [{ active: true }, { active: { $exists: false } }] });
        res.status(200).json(ingredients);
      } catch (error) {
        console.error('Erreur lors de la récupération des ingrédients:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
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

        let data;
        try {
          data = typeof fields.data === 'string'
            ? JSON.parse(fields.data)
            : JSON.parse(fields.data[0]);
        } catch (error) {
          throw new Error('Format de données invalide');
        }

        // Gérer l'image
        if (files.image) {
          const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
          try {
            const imageUrl = await imageService.uploadToCloudinary(imageFile, 'ingredients', data.name);
            data.image = imageUrl;
          } catch (error) {
            throw new Error('Erreur lors du traitement de l\'image');
          }
        } else if (!data.image) {
          throw new Error('Une image est requise');
        }

        // Nettoyer les données
        const cleanData = {
          ...data,
          price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
          orderIndex: typeof data.orderIndex === 'string' ? parseInt(data.orderIndex) : data.orderIndex || 0,
          available: Boolean(data.available),
          isSpicy: Boolean(data.isSpicy),
          isVegetarian: Boolean(data.isVegetarian),
          allergens: Array.isArray(data.allergens) ? data.allergens : []
        };

        // Validation et création
        const ingredient = await Ingredient.create(cleanData);
        res.status(201).json(ingredient);
      } catch (error) {
        console.error('Erreur lors de la création de l\'ingrédient:', error);
        res.status(500).json({
          message: 'Erreur lors de la création de l\'ingrédient',
          error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default withAdmin(handler);
