import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Sauce from '@/models/Sauce';
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
        const sauces = await Sauce.find({ active: true });
        res.status(200).json(sauces);
      } catch (error) {
        console.error('Erreur lors de la récupération des sauces:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        console.log(' [API Sauces] POST reçu');
        
        // Vérifier le Content-Type pour déterminer le type de données
        const contentType = req.headers['content-type'];
        
        let sauceData;

        if (contentType && contentType.includes('multipart/form-data')) {
          // FormData avec image
          const { fields, files } = await parseForm(req) as any;
          
          try {
            const dataString = Array.isArray(fields.data) ? fields.data[0] : fields.data;
            if (!dataString) {
              return res.status(400).json({ message: 'Données manquantes' });
            }
            sauceData = JSON.parse(dataString);
            console.log(' [API Sauces] Données parsées depuis FormData:', sauceData);
          } catch (error) {
            console.error(' [API Sauces] Erreur parsing data:', error);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }

          // Gérer l'upload d'image
          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadSingleHighQualityImage(imageFile, 'sauces');
              sauceData.image = imageUrl;
              console.log(' [API Sauces] Image uploadée:', imageUrl);
            } catch (error) {
              console.error(' [API Sauces] Erreur upload image:', error);
              return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
            }
          } else if (!sauceData.image || sauceData.image.trim() === '') {
            return res.status(400).json({ message: 'Une image est requise' });
          }
        } else {
          // JSON direct
          sauceData = req.body;
          console.log(' [API Sauces] Données JSON directes:', sauceData);
          
          if (!sauceData.image || sauceData.image.trim() === '') {
            return res.status(400).json({ message: 'Une image est requise' });
          }
        }
        
        if (!sauceData || typeof sauceData !== 'object') {
          return res.status(400).json({ message: 'Données invalides' });
        }
        
        // Validation des champs obligatoires
        if (!sauceData.name) {
          return res.status(400).json({ message: 'Le nom est requis' });
        }
        if (!sauceData.type) {
          return res.status(400).json({ message: 'Le type est requis' });
        }
        if (!sauceData.description) {
          return res.status(400).json({ message: 'La description est requise' });
        }
        if (!sauceData.price && sauceData.price !== 0) {
          return res.status(400).json({ message: 'Le prix est requis' });
        }
        if (!sauceData.image) {
          return res.status(400).json({ message: 'L\'image est requise' });
        }
        if (!sauceData.nutritionalInfo) {
          return res.status(400).json({ message: 'Les informations nutritionnelles sont requises' });
        }
        if (!sauceData.spicyLevel) {
          return res.status(400).json({ message: 'Le niveau de piquant est requis' });
        }

        console.log(' [API Sauces] Données nettoyées:', sauceData);
        console.log(' [API Sauces] Types des champs:');
        Object.entries(sauceData).forEach(([key, value]) => {
          console.log(`  ${key}: ${typeof value} = ${JSON.stringify(value)}`);
        });
        
        const sauce = await Sauce.create(sauceData);
        console.log(' [API Sauces] Sauce créée avec succès');
        res.status(201).json(sauce);
      } catch (error) {
        console.error(' [API Sauces] Erreur lors de la création de la sauce:', error);
        return res.status(400).json({ 
          message: 'Erreur lors de la création de la sauce',
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
