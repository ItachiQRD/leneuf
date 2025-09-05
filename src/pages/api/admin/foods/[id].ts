import { NextApiRequest, NextApiResponse } from 'next';
import { withAdmin } from '@/utils/api';
import Food from '@/models/Food';
import { connectDB } from '@/lib/mongodb';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';
import { FoodUpdateSchema } from '@/schemas/food';
import { ZodError } from 'zod';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest) => {
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const parseJson = (req: NextApiRequest) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
  });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(' [API Foods] Méthode reçue:', req.method);
  console.log(' [API Foods] URL:', req.url);
  console.log(' [API Foods] Query:', req.query);
  console.log(' [API Foods] Content-Type:', req.headers['content-type']);

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    console.log(' [API Foods] ID invalide:', id);
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await connectDB();

    switch (req.method) {
      case 'GET': {
        console.log(' [API Foods] Recherche du plat:', id);
        const food = await Food.findOne({ _id: id, active: true });
        if (!food) {
          console.log(' [API Foods] Plat non trouvé:', id);
          return res.status(404).json({ message: 'Plat non trouvé' });
        }
        console.log(' [API Foods] Plat trouvé');
        return res.status(200).json(food);
      }

      case 'PUT': {
        console.log(' [API Foods] Début de mise à jour du plat:', id);
        
        // Récupérer le plat existant
        const existingFood = await Food.findById(id);
        if (!existingFood) {
          console.log(' [API Foods] Plat existant non trouvé:', id);
          return res.status(404).json({ message: 'Plat non trouvé' });
        }

        let foodData;
        let imageUrl = existingFood.image; // Garder l'image existante par défaut
        let files: formidable.Files = {};

        // Vérifier si la requête contient un fichier
        const contentType = req.headers['content-type'] || '';
        const isMultipart = contentType.includes('multipart/form-data');

        try {
          if (isMultipart) {
            console.log(' [API Foods] Traitement d\'une requête avec fichier');
            const formResult = await parseForm(req) as any;
            const { fields, files: formFiles } = formResult;
            files = formFiles;
            
            try {
              console.log(' [API Foods] Données du formulaire:', fields);
              foodData = JSON.parse(fields.data[0]); // Accéder au premier élément du tableau
              console.log(' [API Foods] Données parsées:', foodData);
            } catch (error) {
              console.error(' [API Foods] Erreur parsing JSON:', error);
              return res.status(400).json({ message: 'Données JSON invalides' });
            }
          } else {
            console.log(' [API Foods] Traitement d\'une requête sans fichier');
            try {
              foodData = await parseJson(req);
              console.log(' [API Foods] Données reçues:', foodData);
            } catch (error) {
              console.error(' [API Foods] Erreur parsing body:', error);
              return res.status(400).json({ message: 'Données invalides' });
            }
          }

          // Valider les données avec Zod
          try {
            console.log(' [API Foods] Validation des données...');
            const validatedData = FoodUpdateSchema.parse(foodData);
            console.log(' [API Foods] Données valides:', validatedData);
            foodData = validatedData;
          } catch (error) {
            if (error instanceof ZodError) {
              console.error(' [API Foods] Erreur validation:', error.errors);
              return res.status(400).json({ 
                message: 'Données invalides',
                errors: error.errors 
              });
            }
            throw error;
          }

          // Gérer l'upload d'image si présent
          if (files && files.image && files.image[0]) { // Accéder au premier élément du tableau
            try {
              console.log(' [API Foods] Upload de la nouvelle image');
              const uploadResult = await imageService.uploadImage(files.image[0] as any);
              imageUrl = uploadResult;
              console.log(' [API Foods] Nouvelle image uploadée:', imageUrl);

              // Supprimer l'ancienne image
              if (existingFood.image) {
                try {
                  await imageService.deleteImage(existingFood.image);
                  console.log(' [API Foods] Ancienne image supprimée');
                } catch (error) {
                  console.error(' [API Foods] Erreur suppression ancienne image:', error);
                  // Continue même si l'ancienne image n'a pas pu être supprimée
                }
              }
            } catch (error) {
              console.error(' [API Foods] Erreur upload image:', error);
              return res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image' });
            }
          }

          // Mettre à jour le plat
          const updateData = {
            ...foodData,
            image: imageUrl,
            updatedAt: new Date()
          };

          console.log(' [API Foods] Mise à jour du plat avec les données:', updateData);

          const updatedFood = await Food.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
          );

          if (!updatedFood) {
            console.log(' [API Foods] Plat non trouvé après mise à jour');
            return res.status(404).json({ message: 'Plat non trouvé' });
          }

          console.log(' [API Foods] Plat mis à jour avec succès');
          return res.status(200).json(updatedFood);

        } catch (error) {
          console.error(' [API Foods] Erreur inattendue:', error);
          return res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du plat',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          });
        }
      }

      case 'DELETE': {
        console.log(' [API Foods] Tentative de suppression:', id);
        const food = await Food.findById(id);
        
        if (!food) {
          console.log(' [API Foods] Plat non trouvé pour suppression:', id);
          return res.status(404).json({ message: 'Plat non trouvé' });
        }

        // Supprimer l'image si elle existe
        if (food.image) {
          try {
            await imageService.deleteImage(food.image);
            console.log(' [API Foods] Image supprimée:', food.image);
          } catch (error) {
            console.error(' [API Foods] Erreur suppression image:', error);
            // On continue même si l'image n'a pas pu être supprimée
          }
        }

        await Food.findByIdAndDelete(id);
        console.log(' [API Foods] Plat supprimé avec succès:', id);
        return res.status(200).json({ message: 'Plat supprimé avec succès' });
      }

      default:
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error(' [API Foods] Erreur serveur:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur interne',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

export default withAdmin(handler);
