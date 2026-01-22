import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';
import { DrinkSchema } from '@/types/drink';
import { ZodError } from 'zod';

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
        const drinks = await Drink.find({ active: true });
        res.status(200).json(drinks);
      } catch (error) {
        console.error('Erreur lors de la récupération des boissons:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
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
            const imageUrl = await imageService.uploadToCloudinary(imageFile, 'drinks', data.name);
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
          price: typeof data.price === 'string' ? parseFloat(data.price.replace(',', '.')) : data.price,
          sizes: data.sizes ? data.sizes.map((size: any) => ({
            ...size,
            price: typeof size.price === 'string' ? parseFloat(size.price.replace(',', '.')) : size.price
          })) : data.sizes || []
        };

        // Validation et création
        try {
          const validatedData = DrinkSchema.parse(cleanData);
          const drink = await Drink.create(validatedData);
          res.status(201).json(drink);
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
        console.error('Erreur lors de la création de la boisson:', error);
        res.status(500).json({
          message: 'Erreur lors de la création de la boisson',
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
