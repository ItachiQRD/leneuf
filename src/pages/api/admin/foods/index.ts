// src/pages/api/admin/foods/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Food from '@/models/Food';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';
import { z, ZodError } from 'zod';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Schéma de validation pour les plats (simplifié)
const foodSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(['burger', 'pizza', 'salad', 'sandwich_durum'], {
    errorMap: () => ({ message: "Type de plat invalide" })
  }),
  price: z.number().min(0, "Le prix doit être positif").optional(),
  image: z.string(),
  active: z.boolean().default(true),
  available: z.boolean().default(true),
  preparationTimeMinutes: z.number().min(1, "Le temps de préparation doit être au moins 1 minute"),
  category: z.enum(['bestseller', 'new', 'regular'], {
    errorMap: () => ({ message: "Catégorie invalide" })
  }),
  baseIngredients: z.array(z.string()).min(1, "Au moins un ingrédient est requis"),
  description: z.string().optional()
});

async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    await dbConnect();

    switch (req.method) {
      case 'GET':
        try {

          const foods = await Food.find({ active: true }).sort({ createdAt: -1 });
          console.log(' [API Foods] Plats récupérés:', foods.length);
          console.log(' [API Foods] Premier plat image:', foods[0]?.image);

          res.status(200).json(foods);
        } catch (error) {
          console.error(' [API Foods] Erreur récupération:', error);
          res.status(500).json({ message: 'Erreur lors de la récupération des plats' });
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
            return res.status(400).json({ message: 'Données manquantes' });
          }

          let data;
          try {
            data = typeof fields.data === 'string'
              ? JSON.parse(fields.data)
              : JSON.parse(fields.data[0]);

          } catch (error) {
            console.error(' [API Foods] Erreur parsing JSON:', error);
            throw new Error('Format de données invalide');
          }

          // Gérer l'image
          if (files.image) {

            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadToCloudinary(imageFile, 'foods', data.name);
              console.log(' [API Foods] Image URL générée:', imageUrl);

              data.image = imageUrl;
            } catch (error) {
              console.error(' [API Foods] Erreur upload image:', error);
              throw new Error('Erreur lors du traitement de l\'image');
            }
          } else if (!data.image) {
            throw new Error('Une image est requise');
          }

          // Nettoyer les données (convertir les strings en numbers)
          const cleanData = {
            ...data,
            price: data.price ? (typeof data.price === 'string' ? parseFloat(data.price) : data.price) : undefined,
            preparationTimeMinutes: typeof data.preparationTimeMinutes === 'string' ? parseInt(data.preparationTimeMinutes) : data.preparationTimeMinutes,
            baseIngredients: Array.isArray(data.baseIngredients) ? data.baseIngredients : (data.baseIngredients ? [data.baseIngredients] : [])
          };

          console.log(' [API Foods] Données reçues:', JSON.stringify(data, null, 2));
          console.log(' [API Foods] baseIngredients reçus:', data.baseIngredients);
          console.log(' [API Foods] baseIngredients nettoyés:', cleanData.baseIngredients);
          console.log(' [API Foods] Image finale sauvegardée:', cleanData.image);

          // Vérifier que les champs obligatoires sont présents
          if (!cleanData.name) {
            return res.status(400).json({ message: 'Le nom est requis' });
          }
          if (!cleanData.type) {
            return res.status(400).json({ message: 'Le type est requis' });
          }
          if (cleanData.type !== 'pizza' && !cleanData.price) {
            return res.status(400).json({ message: 'Le prix est requis pour ce type de plat' });
          }
          if (!cleanData.image) {
            return res.status(400).json({ message: 'L\'image est requise' });
          }
          if (!cleanData.baseIngredients || cleanData.baseIngredients.length === 0) {
            return res.status(400).json({ message: 'Au moins un ingrédient de base est requis' });
          }

          // Validation et création
          try {
            const validatedData = foodSchema.parse(cleanData);
            const food = await Food.create(validatedData);
            res.status(201).json(food);
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
          console.error(' [API Foods] Erreur création:', error);
          res.status(500).json({
            message: 'Erreur lors de la création du plat',
            error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
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

          if (!fields.data) {
            return res.status(400).json({ message: 'Données manquantes' });
          }

          let data;
          try {
            data = typeof fields.data === 'string'
              ? JSON.parse(fields.data)
              : JSON.parse(fields.data[0]);

          } catch (error) {
            console.error(' [API Foods] Erreur parsing JSON:', error);
            throw new Error('Format de données invalide');
          }

          // Vérifier que l'ID est présent
          if (!data._id) {
            throw new Error('ID du plat requis pour la mise à jour');
          }

          // Gérer l'image si une nouvelle est fournie
          if (files.image) {

            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadToCloudinary(imageFile, 'foods', data.name);

              data.image = imageUrl;
            } catch (error) {
              console.error(' [API Foods] Erreur upload image:', error);
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          // Validation et mise à jour
          try {

            const validatedData = foodSchema.parse(data);

            const food = await Food.findByIdAndUpdate(data._id, validatedData, { new: true });

            if (!food) {
              throw new Error('Plat non trouvé');
            }

            res.status(200).json(food);
          } catch (error) {
            if (error instanceof ZodError) {
              console.error(' [API Foods] Erreur validation Zod:', error.errors);
              return res.status(400).json({
                message: 'Erreur de validation',
                errors: error.errors
              });
            }
            throw error;
          }
        } catch (error) {
          console.error(' [API Foods] Erreur mise à jour:', error);
          return res.status(500).json({
            message: 'Erreur lors de la mise à jour du plat',
            error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
          });
        }
        break;

      default:

        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(' [API Foods] Erreur serveur:', error);
    return res.status(500).json({ message: 'Erreur serveur interne' });
  }
}

export default withAdmin(handler);