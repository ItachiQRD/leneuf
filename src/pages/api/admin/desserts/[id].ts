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
    maxFileSize: 10 * 1024 * 1024, // 10MB
    keepExtensions: true,
  });

  const [fields, files] = await form.parse(req);
  return { fields, files };
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
          let updateData;

          // Vérifier si c'est du FormData ou du JSON
          const contentType = req.headers['content-type'];
          let files: any = {};

          if (contentType && contentType.includes('multipart/form-data')) {
            // FormData
            const { fields, files: parsedFiles } = await parseForm(req);
            files = parsedFiles;
            try {
              const dataString = Array.isArray(fields.data) ? fields.data[0] : fields.data;
              if (!dataString) {
                return res.status(400).json({ message: 'Données manquantes' });
              }
              updateData = JSON.parse(dataString);
            } catch (error) {
              return res.status(400).json({ message: 'Données JSON invalides' });
            }
          } else {
            // JSON direct
            updateData = req.body;
          }

          // Gérer l'upload d'image si une nouvelle image est fournie
          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              const imageUrl = await imageService.uploadToCloudinary(imageFile, 'desserts');
              updateData.image = imageUrl;
            } catch (error) {
              console.error('Erreur upload image:', error);
              return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
            }
          }

          // Nettoyer les données (convertir les strings en numbers)
          const cleanData = {
            ...updateData,
            price: typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price,
            sizes: updateData.sizes ? updateData.sizes.map((size: any) => ({
              ...size,
              price: typeof size.price === 'string' ? parseFloat(size.price) : size.price
            })) : updateData.sizes
          };

          const dessert = await Dessert.findByIdAndUpdate(id, cleanData, { new: true });

          if (!dessert) {
            return res.status(404).json({ message: 'Dessert non trouvé' });
          }

          return res.status(200).json(dessert);
        } catch (error) {
          console.error('Erreur lors de la mise à jour du dessert:', error);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour du dessert' });
        }

      case 'DELETE':
        try {

          const dessert = await Dessert.findByIdAndDelete(id);

          if (!dessert) {
            return res.status(404).json({ message: 'Dessert non trouvé' });
          }

          return res.status(200).json({ message: 'Dessert supprimé avec succès' });
        } catch (error) {
          console.error('Erreur lors de la suppression du dessert:', error);
          return res.status(500).json({ message: 'Erreur lors de la suppression du dessert' });
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
