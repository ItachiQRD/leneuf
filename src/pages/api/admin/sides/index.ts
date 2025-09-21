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
        console.log(' [API Sides] ===== DÉBUT CRÉATION ACCOMPAGNEMENT =====');
        console.log(' [API Sides] Headers reçus:', req.headers);
        console.log(' [API Sides] Content-Type:', req.headers['content-type']);
        
        const form = formidable({
          maxFileSize: 5 * 1024 * 1024, // 5MB
        });

        console.log(' [API Sides] Parsing du formulaire...');
        const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              console.error(' [API Sides] Erreur parsing formidable:', err);
              reject(err);
            }
            console.log(' [API Sides] Champs reçus:', Object.keys(fields));
            console.log(' [API Sides] Fichiers reçus:', Object.keys(files));
            resolve([fields, files]);
          });
        });

        if (!fields.data) {
          console.error(' [API Sides] ERREUR: Aucune donnée reçue dans fields.data');
          console.log(' [API Sides] Champs disponibles:', fields);
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
          console.log(' [API Sides] Données avant validation:', JSON.stringify(cleanData, null, 2));
          
          // Vérifier chaque champ requis
          console.log(' [API Sides] Vérification des champs requis:');
          console.log(' - name:', cleanData.name, typeof cleanData.name);
          console.log(' - category:', cleanData.category, typeof cleanData.category);
          console.log(' - price:', cleanData.price, typeof cleanData.price);
          console.log(' - image:', cleanData.image, typeof cleanData.image);
          console.log(' - available:', cleanData.available, typeof cleanData.available);
          console.log(' - sizes:', cleanData.sizes, Array.isArray(cleanData.sizes));
          console.log(' - ingredients:', cleanData.ingredients, Array.isArray(cleanData.ingredients));
          console.log(' - nutritionalInfo:', cleanData.nutritionalInfo, typeof cleanData.nutritionalInfo);
          console.log(' - preparationTime:', cleanData.preparationTime, typeof cleanData.preparationTime);
          
          const validatedData = sideSchema.parse(cleanData);
          console.log(' [API Sides] Données validées avec succès:', JSON.stringify(validatedData, null, 2));
          
          const side = await Side.create(validatedData);
          console.log(' [API Sides] Accompagnement créé avec succès, ID:', side._id);
          res.status(201).json(side);
        } catch (error) {
          if (error instanceof ZodError) {
            console.error(' [API Sides] Erreur validation Zod:');
            error.errors.forEach((err, index) => {
              console.error(`  ${index + 1}. Champ: ${err.path.join('.')}, Message: ${err.message}, Valeur: ${err.input}`);
            });
            return res.status(400).json({
              message: 'Erreur de validation',
              errors: error.errors
            });
          }
          console.error(' [API Sides] Erreur inattendue:', error);
          throw error;
        }
      } catch (error) {
        console.error(' [API Sides] ===== ERREUR CRÉATION ACCOMPAGNEMENT =====');
        console.error(' [API Sides] Type d\'erreur:', typeof error);
        console.error(' [API Sides] Message d\'erreur:', error instanceof Error ? error.message : 'Erreur inconnue');
        console.error(' [API Sides] Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
        console.error(' [API Sides] Erreur complète:', error);
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
