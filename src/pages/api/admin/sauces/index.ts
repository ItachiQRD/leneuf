import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Sauce } from '@/models/Sauce';
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
  const { method } = req;

  try {
    await connectDB();

    switch (method) {
      case 'GET':
        try {
          const sauces = await Sauce.find({}).sort({ createdAt: -1 });
          res.status(200).json(sauces);
        } catch (error) {
          console.error('Error fetching sauces:', error);
          res.status(500).json({ message: 'Erreur lors de la récupération des sauces' });
        }
        break;

      case 'POST':
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

          let data = typeof fields.data === 'string'
            ? JSON.parse(fields.data)
            : JSON.parse(fields.data[0]);

          // Gérer l'image si elle est présente
          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              // Si c'est une mise à jour, récupérer l'ancienne image pour la supprimer
              if (method === 'PUT' && data._id) {
                const existingSauce = await Sauce.findById(data._id);
                if (existingSauce?.image) {
                  await imageService.deleteImage(existingSauce.image);
                }
              }
              const imageUrl = await imageService.uploadImage(imageFile, 'sauces');
              data.image = imageUrl;
            } catch (error) {
              console.error('Error processing image:', error);
              throw new Error('Erreur lors du traitement de l\'image');
            }
          } else if (method === 'POST') {
            throw new Error('L\'image est requise pour créer une sauce');
          }

          try {
            const validatedData = sauceSchema.parse({
              ...data,
              _id: method === 'PUT' ? data._id : undefined
            });
            
            let sauce;
            if (method === 'PUT') {
              if (!validatedData._id) {
                return res.status(400).json({
                  message: 'ID manquant pour la mise à jour'
                });
              }

              sauce = await Sauce.findByIdAndUpdate(
                validatedData._id,
                validatedData,
                { new: true, runValidators: true }
              );

              if (!sauce) {
                return res.status(404).json({
                  message: 'Sauce non trouvée'
                });
              }
            } else {
              sauce = await Sauce.create(validatedData);
            }

            res.status(method === 'POST' ? 201 : 200).json(sauce);
          } catch (error) {
            if (error instanceof ZodError) {
              return res.status(400).json({
                message: 'Erreur de validation',
                errors: error.errors.map(err => ({
                  field: err.path.join('.'),
                  message: err.message
                }))
              });
            }
            if (error instanceof Error) {
              return res.status(400).json({
                message: error.message
              });
            }
            throw error;
          }
        } catch (error) {
          console.error('Error processing request:', error);
          res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Une erreur est survenue'
          });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.query;
          const sauce = await Sauce.findById(id);
          
          if (!sauce) {
            return res.status(404).json({ message: 'Sauce non trouvée' });
          }

          // Supprimer l'image associée
          if (sauce.image) {
            await imageService.deleteImage(sauce.image);
          }

          await Sauce.findByIdAndDelete(id);
          res.status(200).json({ message: 'Sauce supprimée avec succès' });
        } catch (error) {
          console.error('Error deleting sauce:', error);
          res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Erreur lors de la suppression de la sauce'
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
      message: error instanceof Error ? error.message : 'Une erreur serveur est survenue'
    });
  }
}

export default withAdmin(handler);