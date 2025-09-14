import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
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
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const desserts = await Dessert.find({ active: true, deletedAt: { $exists: false } });
        res.status(200).json(desserts);
      } catch (error) {
        console.error('Erreur lors de la récupération des desserts:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        const { fields, files } = await parseForm(req) as any;
        let dessertData;

        try {
          dessertData = JSON.parse(fields.data);
        } catch (error) {
          return res.status(400).json({ message: 'Données JSON invalides' });
        }

        // Gérer l'upload d'image si une image est fournie
        if (files.image) {
          const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
          try {
            const imageUrl = await imageService.uploadImage(imageFile, 'desserts');
            dessertData.image = imageUrl;
          } catch (error) {
            console.error('Erreur upload image:', error);
            return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
          }
        } else if (!dessertData.image || dessertData.image.trim() === '') {
          return res.status(400).json({ message: 'Une image est requise' });
        }

        // Nettoyer les données (convertir les strings en numbers)
        const cleanData = {
          ...dessertData,
          price: typeof dessertData.price === 'string' ? parseFloat(dessertData.price) : dessertData.price,
          sizes: dessertData.sizes ? dessertData.sizes.map((size: any) => ({
            ...size,
            price: typeof size.price === 'string' ? parseFloat(size.price) : size.price
          })) : dessertData.sizes
        };

        const dessert = new Dessert(cleanData);
        await dessert.save();
        res.status(201).json(dessert);
      } catch (error) {
        console.error('Erreur lors de la création du dessert:', error);
        return res.status(400).json({ message: 'Erreur lors de la création du dessert' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default withAdmin(handler);
