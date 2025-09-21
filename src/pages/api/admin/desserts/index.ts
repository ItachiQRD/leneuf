import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Dessert from '@/models/Dessert';
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
        const desserts = await Dessert.find({ active: true });
        res.status(200).json(desserts);
      } catch (error) {
        console.error('Erreur lors de la récupération des desserts:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        console.log(' [API Desserts] POST reçu');
        
        // Vérifier le Content-Type pour déterminer le type de données
        const contentType = req.headers['content-type'];
        
        let dessertData;
        let imageUrl = '';

        if (contentType && contentType.includes('multipart/form-data')) {
          // FormData avec image
          const { fields, files } = await parseForm(req) as any;
          
          try {
            const dataString = Array.isArray(fields.data) ? fields.data[0] : fields.data;
            if (!dataString) {
              return res.status(400).json({ message: 'Données manquantes' });
            }
            dessertData = JSON.parse(dataString);
            console.log(' [API Desserts] Données parsées depuis FormData:', dessertData);
          } catch (error) {
            console.error(' [API Desserts] Erreur parsing data:', error);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }

          // Gérer l'upload d'image
          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              imageUrl = await imageService.uploadImage(imageFile, 'desserts');
              console.log(' [API Desserts] Image uploadée:', imageUrl);
            } catch (error) {
              console.error(' [API Desserts] Erreur upload image:', error);
              return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
            }
          } else {
            return res.status(400).json({ message: 'Une image est requise' });
          }
        } else {
          // JSON direct
          dessertData = req.body;
          console.log(' [API Desserts] Données JSON directes:', dessertData);
          
          if (dessertData.image && typeof dessertData.image === 'string') {
            imageUrl = dessertData.image;
          } else {
            return res.status(400).json({ message: 'Une image est requise' });
          }
        }

        if (!dessertData || typeof dessertData !== 'object') {
          return res.status(400).json({ message: 'Données invalides' });
        }

        // Nettoyer les données (convertir les strings en numbers)
        const cleanData = {
          ...dessertData,
          image: imageUrl,
          price: typeof dessertData.price === 'string' ? parseFloat(dessertData.price) : dessertData.price,
          sizes: dessertData.sizes ? dessertData.sizes.map((size: any) => ({
            ...size,
            price: typeof size.price === 'string' ? parseFloat(size.price) : size.price
          })) : dessertData.sizes || []
        };

        console.log(' [API Desserts] Données nettoyées:', cleanData);

        const dessert = await Dessert.create(cleanData);
        console.log(' [API Desserts] Dessert créé avec succès');
        res.status(201).json(dessert);
      } catch (error) {
        console.error(' [API Desserts] Erreur lors de la création du dessert:', error);
        return res.status(400).json({ 
          message: 'Erreur lors de la création du dessert',
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
