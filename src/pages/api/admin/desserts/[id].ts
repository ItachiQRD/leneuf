// pages/api/admin/desserts/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { withAdmin } from '@/utils/api';
import { connectDB } from '@/lib/mongodb';
import { Dessert } from '@/models/Dessert';
import { imageService } from '@/services/imageService';
import { dessertSchema } from '@/types/dessert';
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
  console.log(' [API Desserts] Méthode reçue:', req.method);
  console.log(' [API Desserts] URL:', req.url);
  console.log(' [API Desserts] Query:', req.query);
  console.log(' [API Desserts] Content-Type:', req.headers['content-type']);

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    console.log(' [API Desserts] ID invalide:', id);
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await connectDB();

    switch (req.method) {
      case 'GET': {
        console.log(' [API Desserts] Recherche du dessert:', id);
        const dessert = await Dessert.findOne({ _id: id, active: true });
        if (!dessert) {
          console.log(' [API Desserts] Dessert non trouvé:', id);
          return res.status(404).json({ message: 'Dessert non trouvé' });
        }
        console.log(' [API Desserts] Dessert trouvé');
        return res.status(200).json(dessert);
      }

      case 'PUT': {
        console.log(' [API Desserts] Début de mise à jour du dessert:', id);
        
        // Récupérer le dessert existant
        const existingDessert = await Dessert.findById(id);
        if (!existingDessert) {
          console.log(' [API Desserts] Dessert existant non trouvé:', id);
          return res.status(404).json({ message: 'Dessert non trouvé' });
        }

        let dessertData;
        let imageUrl = existingDessert.image; // Garder l'image existante par défaut

        // Vérifier si la requête contient un fichier
        const contentType = req.headers['content-type'] || '';
        const isMultipart = contentType.includes('multipart/form-data');

        if (isMultipart) {
          console.log(' [API Desserts] Traitement d\'une requête avec fichier');
          const { fields, files } = await parseForm(req) as any;
          
          try {
            dessertData = JSON.parse(fields.data);
            console.log(' [API Desserts] Données reçues:', dessertData);
          } catch (error) {
            console.error(' [API Desserts] Erreur parsing JSON:', error);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }

          if (files.image) {
            try {
              console.log(' [API Desserts] Traitement de la nouvelle image');
              const uploadedFile = files.image[0] || files.image;
              imageUrl = await imageService.uploadImage(uploadedFile, 'desserts');
              console.log(' [API Desserts] Nouvelle image uploadée:', imageUrl);
            } catch (error) {
              console.error(' [API Desserts] Erreur traitement image:', error);
              return res.status(400).json({ message: 'Erreur lors du traitement de l\'image' });
            }
          }
        } else {
          console.log(' [API Desserts] Traitement d\'une requête JSON');
          try {
            dessertData = await parseJson(req);
            console.log(' [API Desserts] Données reçues:', dessertData);
          } catch (error) {
            console.error(' [API Desserts] Erreur parsing JSON:', error);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }
        }

        try {
          const validatedData = dessertSchema.parse({
            ...dessertData,
            image: imageUrl
          });
          console.log(' [API Desserts] Données validées');

          const updatedDessert = await Dessert.findByIdAndUpdate(
            id,
            validatedData,
            { new: true, runValidators: true }
          );

          if (!updatedDessert) {
            console.log(' [API Desserts] Erreur lors de la mise à jour');
            return res.status(404).json({ message: 'Dessert non trouvé' });
          }

          console.log(' [API Desserts] Dessert mis à jour avec succès');
          return res.status(200).json(updatedDessert);
        } catch (validationError) {
          if (validationError instanceof ZodError) {
            console.error(' [API Desserts] Erreur de validation:', validationError.errors);
            return res.status(400).json({
              message: 'Données invalides',
              errors: validationError.errors
            });
          }
          throw validationError;
        }
      }

      case 'DELETE': {
        console.log(' [API Desserts] Tentative de suppression du dessert:', id);
        try {
          const dessert = await Dessert.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
          );
          
          if (!dessert) {
            console.log(' [API Desserts] Dessert non trouvé pour suppression:', id);
            return res.status(404).json({ message: 'Dessert non trouvé' });
          }
          console.log(' [API Desserts] Dessert avant suppression:', dessert);
          console.log(' [API Desserts] Suppression du dessert:', id);
          console.log(' [API Desserts] Dessert supprimé avec succès:', id);
          return res.status(200).json({ message: 'Dessert supprimé avec succès' });
        } catch (error) {
          console.error(' [API Desserts] Erreur lors de la suppression:', error);
          throw error;
        }
      }

      default:
        console.log(' [API Desserts] Méthode non autorisée:', req.method);
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(' [API Desserts] Erreur serveur:', error);
    return res.status(500).json({ message: 'Erreur serveur interne' });
  }
}

export default withAdmin(handler);
