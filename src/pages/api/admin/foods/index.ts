// src/pages/api/admin/foods/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
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

const nutritionalInfoSchema = z.object({
  calories: z.number().min(0).default(0),
  proteins: z.number().min(0).default(0),
  carbs: z.number().min(0).default(0),
  fats: z.number().min(0).default(0),
  servingSize: z.string().default('100g')
});

// Schéma de validation pour les plats
const foodSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(['burger', 'pizza', 'salad', 'sandwich_durum', 'paninis', 'plates', 'tex_mex', 'kids_menu', 'small_hunger'], {
    errorMap: () => ({ message: "Type de plat invalide" })
  }),
  price: z.number().min(0, "Le prix doit être positif").optional().or(z.undefined()),
  image: z.string().optional(),
  active: z.boolean().default(true),
  available: z.boolean().default(true),
  preparationTimeMinutes: z.number().min(1, "Le temps de préparation doit être au moins 1 minute"),
  category: z.enum(['bestseller', 'new', 'regular'], {
    errorMap: () => ({ message: "Catégorie invalide" })
  }),
  baseIngredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  spicyLevel: z.enum(['mild', 'medium', 'hot', 'extra_hot']).default('mild'),
  nutritionalInfo: nutritionalInfoSchema.default({}),
  isVegan: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  // Champs optionnels spécifiques
  pizzaBase: z.string().optional(),
  pizzaSizes: z.array(z.object({
    name: z.string(),
    price: z.number(),
    diameter: z.string(),
    isDefault: z.boolean().default(false)
  })).optional(),
  paniniAccompaniments: z.object({
    fries: z.boolean().default(false),
    drink: z.string().optional(),
    drinkPrice: z.number().default(0)
  }).optional(),
  plateAccompaniments: z.object({
    bread: z.boolean().default(false),
    fries: z.boolean().default(false),
    salad: z.boolean().default(false)
  }).optional(),
  includesSurprise: z.boolean().optional(),
  includesCaprisun: z.boolean().optional()
}).passthrough();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(' [API Foods] Méthode reçue:', req.method);
  console.log(' [API Foods] URL:', req.url);

  try {
    await connectDB();

    switch (req.method) {
      case 'GET':
        try {
          console.log(' [API Foods] Récupération des plats actifs');
          const foods = await Food.find({ active: true }).sort({ createdAt: -1 });
          console.log(' [API Foods] Plats récupérés:', foods.length);
          res.status(200).json(foods);
        } catch (error) {
          console.error(' [API Foods] Erreur récupération:', error);
          res.status(500).json({ message: 'Erreur lors de la récupération des plats' });
        }
        break;

      case 'POST':
        try {
          console.log(' [API Foods] Création d\'un nouveau plat');
          
          const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
          });

          console.log(' [API Foods] Parsing du formulaire...');
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
            console.log(' [API Foods] Données parsées:', data);
          } catch (error) {
            console.error(' [API Foods] Erreur parsing JSON:', error);
            throw new Error('Format de données invalide');
          }

          // Gérer l'image
          if (files.image) {
            console.log(' [API Foods] Traitement de l\'image...');
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadImage(imageFile, 'foods');
              console.log(' [API Foods] Image uploadée:', imageUrl);
              data.image = imageUrl;
            } catch (error) {
              console.error(' [API Foods] Erreur upload image:', error);
              throw new Error('Erreur lors du traitement de l\'image');
            }
          } else if (!data.image) {
            throw new Error('Une image est requise');
          }

          // Validation et création
          try {
            console.log(' [API Foods] Données avant validation:', data);
            const validatedData = foodSchema.parse(data);
            console.log(' [API Foods] Données validées:', validatedData);
            const food = await Food.create(validatedData);
            console.log(' [API Foods] Plat créé avec succès');
            res.status(201).json(food);
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
          console.error(' [API Foods] Erreur création:', error);
          res.status(500).json({
            message: 'Erreur lors de la création du plat',
            error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
          });
        }
        break;

      case 'PUT':
        try {
          console.log(' [API Foods] Mise à jour d\'un plat');
          
          const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
          });

          console.log(' [API Foods] Parsing du formulaire...');
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
            console.log(' [API Foods] Données parsées:', data);
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
            console.log(' [API Foods] Traitement de la nouvelle image...');
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadImage(imageFile, 'foods');
              console.log(' [API Foods] Nouvelle image uploadée:', imageUrl);
              data.image = imageUrl;
            } catch (error) {
              console.error(' [API Foods] Erreur upload image:', error);
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          // Validation et mise à jour
          try {
            console.log(' [API Foods] Données avant validation:', data);
            const validatedData = foodSchema.parse(data);
            console.log(' [API Foods] Données validées:', validatedData);
            
            const { _id, ...updateData } = validatedData;
            const food = await Food.findByIdAndUpdate(_id, updateData, { new: true });
            
            if (!food) {
              throw new Error('Plat non trouvé');
            }
            
            console.log(' [API Foods] Plat mis à jour avec succès');
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
          res.status(500).json({
            message: 'Erreur lors de la mise à jour du plat',
            error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
          });
        }
        break;

      default:
        console.log(' [API Foods] Méthode non autorisée:', req.method);
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(' [API Foods] Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
}

export default withAdmin(handler);