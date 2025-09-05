import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Dessert } from '@/models/Dessert';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';
import { dessertSchema } from '@/types/dessert';
import { ZodError } from 'zod';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  console.log(' [API Desserts Index] Méthode reçue:', method);

  try {
    await connectDB();

    switch (method) {
      case 'GET':
        try {
          console.log(' [API Desserts Index] Récupération des desserts actifs');
          const desserts = await Dessert.find({ active: { $ne: false } }).sort({ createdAt: -1 });
          console.log(` [API Desserts Index] ${desserts.length} desserts trouvés`);
          res.status(200).json(desserts);
        } catch (error) {
          console.error(' [API Desserts Index] Erreur récupération desserts:', error);
          res.status(500).json({ message: 'Erreur lors de la récupération des desserts' });
        }
        break;

      case 'POST':
      case 'PUT':
        try {
          console.log(' [API Desserts Index] Création d\'un nouveau dessert');
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
            console.error(' [API Desserts Index] Données manquantes');
            throw new Error('Données manquantes');
          }

          let data = typeof fields.data === 'string'
            ? JSON.parse(fields.data)
            : JSON.parse(fields.data[0]);

          // Gérer l'image si elle est présente
          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              console.log(' [API Desserts Index] Upload de l\'image');
              const imageUrl = await imageService.uploadImage(imageFile, 'desserts');
              data.image = imageUrl;
              console.log(' [API Desserts Index] Image uploadée:', imageUrl);
            } catch (error) {
              console.error(' [API Desserts Index] Erreur upload image:', error);
              throw new Error('Erreur lors du traitement de l\'image');
            }
          } else if (method === 'POST') {
            console.error(' [API Desserts Index] Image manquante');
            throw new Error('L\'image est requise pour créer un dessert');
          }

          try {
            const validatedData = dessertSchema.parse({
              ...data,
              _id: method === 'PUT' ? data._id : undefined
            });
            
            console.log(' [API Desserts Index] Données validées');
            let dessert;
            if (method === 'PUT') {
              if (!validatedData._id) {
                return res.status(400).json({
                  message: 'ID manquant pour la mise à jour'
                });
              }

              dessert = await Dessert.findByIdAndUpdate(
                validatedData._id,
                validatedData,
                { new: true, runValidators: true }
              );

              if (!dessert) {
                return res.status(404).json({
                  message: 'Dessert non trouvé'
                });
              }
            } else {
              dessert = await Dessert.create(validatedData);
            }
            console.log(' [API Desserts Index] Dessert créé:', dessert._id);
            res.status(method === 'POST' ? 201 : 200).json(dessert);
          } catch (error) {
            if (error instanceof ZodError) {
              console.error(' [API Desserts Index] Erreur validation:', error.errors);
              return res.status(400).json({
                message: 'Erreur de validation',
                errors: error.errors
              });
            }
            throw error;
          }
        } catch (error) {
          console.error(' [API Desserts Index] Erreur création dessert:', error);
          res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Une erreur est survenue'
          });
        }
        break;

      default:
        console.log(' [API Desserts Index] Méthode non autorisée:', method);
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error(' [API Desserts Index] Erreur serveur:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Une erreur serveur est survenue'
    });
  }
}

export default withAdmin(handler);