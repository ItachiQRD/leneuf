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
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          console.log(' [API Sides] Mise à jour d\'un accompagnement');
          
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

          let updateData;
          try {
            updateData = typeof fields.data === 'string'
              ? JSON.parse(fields.data)
              : JSON.parse(fields.data[0]);
            console.log(' [API Sides] Données parsées:', updateData);
          } catch (error) {
            console.error(' [API Sides] Erreur parsing JSON:', error);
            throw new Error('Format de données invalide');
          }

          // Gérer l'image si une nouvelle image est fournie
          if (files.image) {
            console.log(' [API Sides] Traitement de la nouvelle image...');
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadImage(imageFile, 'sides');
              console.log(' [API Sides] Nouvelle image uploadée:', imageUrl);
              updateData.image = imageUrl;
            } catch (error) {
              console.error(' [API Sides] Erreur upload image:', error);
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          // Nettoyer les données (convertir les strings en numbers et supprimer les champs non nécessaires)
          const cleanData = {
            ...updateData,
            price: typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price,
            preparationTime: typeof updateData.preparationTime === 'string' ? parseInt(updateData.preparationTime) : updateData.preparationTime,
            sizes: updateData.sizes ? updateData.sizes.map((size: any) => ({
              ...size,
              price: typeof size.price === 'string' ? parseFloat(size.price) : size.price
            })) : updateData.sizes
          };

          // Supprimer les champs qui ne sont plus dans le modèle
          delete cleanData.description;

          // Validation et mise à jour
          try {
            console.log(' [API Sides] Données avant validation:', cleanData);
            const validatedData = sideSchema.parse(cleanData);
            console.log(' [API Sides] Données validées:', validatedData);
            const side = await Side.findByIdAndUpdate(id, validatedData, { new: true });
            
            if (!side) {
              return res.status(404).json({ message: 'Accompagnement non trouvé' });
            }
            
            console.log(' [API Sides] Accompagnement mis à jour avec succès');
            return res.status(200).json(side);
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
          console.error(' [API Sides] Erreur mise à jour:', error);
          return res.status(500).json({
            message: 'Erreur lors de la mise à jour de l\'accompagnement',
            error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
          });
        }

      case 'DELETE':
        try {
          console.log(' [API Sides] Suppression de l\'accompagnement ID:', id);
          
          const side = await Side.findByIdAndDelete(id);
          
          if (!side) {
            return res.status(404).json({ message: 'Accompagnement non trouvé' });
          }
          
          console.log(' [API Sides] Accompagnement supprimé définitivement de la base de données');
          return res.status(200).json({ message: 'Accompagnement supprimé avec succès' });
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'accompagnement:', error);
          return res.status(500).json({ message: 'Erreur lors de la suppression de l\'accompagnement' });
        }

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ message: 'Erreur serveur interne' });
  }
}

export default withAdmin(handler);