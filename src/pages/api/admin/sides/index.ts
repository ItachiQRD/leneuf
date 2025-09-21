import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Side from '@/models/Side';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';
import { sideSchema } from '@/types/side';
import { ZodError } from 'zod';


export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextApiRequest) {
  const form = formidable({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const sides = await Side.find({ active: true });
        res.status(200).json(sides);
      } catch (error) {
        console.error('Erreur lors de la récupération des accompagnements:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        console.log(' [API Sides] Création d\'un nouvel accompagnement');
        
        const form = formidable({
          maxFileSize: 5 * 1024 * 1024, // 5MB
        });

        console.log(' [API Sides] Parsing du formulaire...');
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
          console.log(' [API Sides] Données parsées:', data);
        } catch (error) {
          console.error(' [API Sides] Erreur parsing JSON:', error);
          throw new Error('Format de données invalide');
        }

        // Gérer l'image
        if (files.image) {
          console.log(' [API Sides] Traitement de l\'image...');
          const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
          try {
            const imageUrl = await imageService.uploadImage(imageFile, 'sides');
            console.log(' [API Sides] Image uploadée:', imageUrl);
            data.image = imageUrl;
          } catch (error) {
            console.error(' [API Sides] Erreur upload image:', error);
            throw new Error('Erreur lors du traitement de l\'image');
          }
        } else if (!data.image) {
          throw new Error('Une image est requise');
        }

        // Nettoyer les données (convertir les strings en numbers et supprimer les champs non nécessaires)
        const cleanData = {
          ...data,
          price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
          preparationTime: typeof data.preparationTime === 'string' ? parseInt(data.preparationTime) : data.preparationTime,
          sizes: data.sizes.map((size: any) => ({
            ...size,
            price: typeof size.price === 'string' ? parseFloat(size.price) : size.price
          }))
        };

        // Supprimer les champs qui ne sont plus dans le modèle
        delete cleanData.description;

        // Validation et création
        try {
          console.log(' [API Sides] Données avant validation:', cleanData);
          const validatedData = sideSchema.parse(cleanData);
          console.log(' [API Sides] Données validées:', validatedData);
          const side = await Side.create(validatedData);
          console.log(' [API Sides] Accompagnement créé avec succès');
          res.status(201).json(side);
        } catch (error) {
          if (error instanceof ZodError) {
            console.error(' [API Sides] Erreur validation Zod:', error.errors);
            return res.status(400).json({
              message: 'Erreur de validation',
              errors: error.errors
            });
          }
          throw error;
        }
      } catch (error) {
        console.error(' [API Sides] Erreur création:', error);
        res.status(500).json({
          message: 'Erreur lors de la création de l\'accompagnement',
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
