import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';

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
        const drinks = await Drink.find({ active: true });
        res.status(200).json(drinks);
      } catch (error) {
        console.error('Erreur lors de la récupération des boissons:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        console.log(' [API Drinks] POST reçu');
        
        // Vérifier le Content-Type pour déterminer le type de données
        const contentType = req.headers['content-type'];
        
        let drinkData;

        if (contentType && contentType.includes('multipart/form-data')) {
          // FormData avec image
          const { fields, files } = await parseForm(req) as any;
          
          try {
            const dataString = Array.isArray(fields.data) ? fields.data[0] : fields.data;
            if (!dataString) {
              return res.status(400).json({ message: 'Données manquantes' });
            }
            drinkData = JSON.parse(dataString);
            console.log(' [API Drinks] Données parsées depuis FormData:', drinkData);
          } catch (error) {
            console.error(' [API Drinks] Erreur parsing data:', error);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }

          // Gérer l'upload d'image
          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadImage(imageFile, 'drinks');
              drinkData.image = imageUrl;
              console.log(' [API Drinks] Image uploadée:', imageUrl);
            } catch (error) {
              console.error(' [API Drinks] Erreur upload image:', error);
              return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
            }
          } else if (!drinkData.image || drinkData.image.trim() === '') {
            return res.status(400).json({ message: 'Une image est requise' });
          }
        } else {
          // JSON direct
          drinkData = req.body;
          console.log(' [API Drinks] Données JSON directes:', drinkData);
          
          if (!drinkData.image || drinkData.image.trim() === '') {
            return res.status(400).json({ message: 'Une image est requise' });
          }
        }
        
        if (!drinkData || typeof drinkData !== 'object') {
          return res.status(400).json({ message: 'Données invalides' });
        }
        
        // Validation des champs obligatoires
        if (!drinkData.name) {
          return res.status(400).json({ message: 'Le nom est requis' });
        }
        if (!drinkData.type) {
          return res.status(400).json({ message: 'Le type est requis' });
        }
        if (!drinkData.sizes || drinkData.sizes.length === 0) {
          return res.status(400).json({ message: 'Au moins une taille est requise' });
        }
        if (!drinkData.nutritionalInfo) {
          return res.status(400).json({ message: 'Les informations nutritionnelles sont requises' });
        }

        console.log(' [API Drinks] Données nettoyées:', drinkData);
        
        // Utiliser create() au lieu de new + save() pour une meilleure validation
        const drink = await Drink.create(drinkData);
        console.log(' [API Drinks] Boisson créée avec succès');
        res.status(201).json(drink);
      } catch (error) {
        console.error(' [API Drinks] Erreur lors de la création de la boisson:', error);
        return res.status(400).json({ 
          message: 'Erreur lors de la création de la boisson',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default withAdmin(handler);
