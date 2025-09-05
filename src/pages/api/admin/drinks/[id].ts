import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { withAdmin } from '@/utils/api';
import connectDB from '@/lib/mongodb';
import Drink from '@/models/Drink';
import { imageService } from '@/services/imageService';
import { DrinkSchema } from '@/types/drink';
import { ZodError } from 'zod';

export const config = { api: { bodyParser: false } };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await connectDB();

    switch (req.method) {
      case 'GET': {
        const drink = await Drink.findOne({ _id: id, active: true });
        if (!drink) {
          return res.status(404).json({ message: 'Boisson non trouvée' });
        }
        return res.status(200).json(drink);
      }

      case 'PUT': {
        const { fields, files } = await parseForm(req) as any;
        let drinkData;

        try {
          drinkData = JSON.parse(fields.data);
        } catch (error) {
          return res.status(400).json({ message: 'Données JSON invalides' });
        }

        let imageUrl = drinkData.image;
        if (files.image) {
          try {
            const uploadedFile = files.image[0] || files.image;
            const processedImage = await imageService.processImage(uploadedFile);
            imageUrl = processedImage.large;
          } catch (error) {
            return res.status(400).json({ message: 'Erreur traitement image' });
          }
        }

        try {
          const validatedData = DrinkSchema.parse({
            ...drinkData,
            image: imageUrl
          });

          const updatedDrink = await Drink.findByIdAndUpdate(
            id,
            { ...validatedData },
            { new: true, runValidators: true }
          );

          if (!updatedDrink) {
            return res.status(404).json({ message: 'Boisson non trouvée' });
          }

          return res.status(200).json(updatedDrink);
        } catch (error) {
          if (error instanceof ZodError) {
            return res.status(400).json({
              message: 'Données invalides',
              errors: error.errors
            });
          }
          throw error;
        }
      }

      case 'DELETE': {
        const drink = await Drink.findByIdAndUpdate(
          id,
          { active: false },
          { new: true }
        );
        
        if (!drink) {
          return res.status(404).json({ message: 'Boisson non trouvée' });
        }
        
        return res.status(200).json({ message: 'Boisson supprimée avec succès' });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Une erreur est survenue' 
    });
  }
}

async function parseForm(req: NextApiRequest) {
  const form = formidable({
    uploadDir: './public/uploads',
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export default withAdmin(handler);