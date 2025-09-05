import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Drink from '@/models/Drink';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';
import { DrinkSchema } from '@/types/drink';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await connectDB();

    switch (method) {
      case 'GET':
        try {
          const drinks = await Drink.find({}).sort({ createdAt: -1 });
          res.status(200).json(drinks);
        } catch (error) {
          console.error('Error fetching drinks:', error);
          res.status(500).json({ 
            error: 'Error fetching drinks',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
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

          const data = fields.data ? JSON.parse(fields.data.toString()) : {};
          let imageUrl = '';

          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              imageUrl = await imageService.uploadImage(imageFile, 'drinks');
              data.image = imageUrl;
            } catch (error) {
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          // Créer l'objet drink avec les données validées
          const drinkData = {
            name: data.name,
            type: data.type,
            brand: data.brand,
            price: parseFloat(data.price),
            image: imageUrl || data.image,
            available: data.available ?? true,
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            nutritionalInfo: data.nutritionalInfo || {
              calories: 0,
              sugar: 0,
              servingSize: 100
            },
            allergens: Array.isArray(data.allergens) ? data.allergens : []
          };

          const validatedDrink = DrinkSchema.parse(drinkData);
          const drink = await Drink.create(validatedDrink);

          res.status(201).json(drink);
        } catch (error) {
          console.error('Error creating drink:', error);
          res.status(500).json({ 
            error: 'Error creating drink',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

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

          const data = fields.data ? JSON.parse(fields.data.toString()) : {};
          let imageUrl = data.image; // Garder l'ancienne image par défaut

          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              // Si c'est une mise à jour, récupérer l'ancienne image pour la supprimer
              if (method === 'PUT') {
                const existingDrink = await Drink.findById(data._id);
                if (existingDrink?.image) {
                  await imageService.deleteImage(existingDrink.image);
                }
              }
              imageUrl = await imageService.uploadImage(imageFile, 'drinks');
              data.image = imageUrl;
            } catch (error) {
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          const drinkData = {
            name: data.name,
            type: data.type,
            brand: data.brand,
            price: parseFloat(data.price),
            image: imageUrl,
            available: data.available ?? true,
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            nutritionalInfo: data.nutritionalInfo || {
              calories: 0,
              sugar: 0,
              servingSize: 100
            },
            allergens: Array.isArray(data.allergens) ? data.allergens : []
          };

          const validatedDrink = DrinkSchema.parse(drinkData);
          
          // Mettre à jour la boisson existante
          const updatedDrink = await Drink.findByIdAndUpdate(
            data._id,
            validatedDrink,
            { new: true, runValidators: true }
          );

          if (!updatedDrink) {
            throw new Error('Boisson non trouvée');
          }

          res.status(200).json(updatedDrink);
        } catch (error) {
          console.error('Error updating drink:', error);
          res.status(500).json({ 
            error: 'Error updating drink',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.query;
          
          if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'ID manquant ou invalide' });
          }

          // Récupérer la boisson pour avoir l'URL de l'image
          const drink = await Drink.findById(id);
          
          if (!drink) {
            return res.status(404).json({ error: 'Boisson non trouvée' });
          }

          // Supprimer l'image si elle existe
          if (drink.image) {
            try {
              await imageService.deleteImage(drink.image);
            } catch (error) {
              console.error('Erreur lors de la suppression de l\'image:', error);
              // Continuer même si la suppression de l'image échoue
            }
          }

          // Supprimer la boisson
          await Drink.findByIdAndDelete(id);

          res.status(200).json({ message: 'Boisson supprimée avec succès' });
        } catch (error) {
          console.error('Error deleting drink:', error);
          res.status(500).json({ 
            error: 'Error deleting drink',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAdmin(handler);