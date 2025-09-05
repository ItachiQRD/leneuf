// pages/api/admin/sauces/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { withAdmin } from '@/utils/api';
import { connectDB } from '@/lib/mongodb';
import Sauce from '@/models/Sauce';
import { imageService } from '@/services/imageService';
import { sauceSchema } from '@/types/sauce';
import { ZodError } from 'zod';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await connectDB();

    switch (req.method) {
      case 'GET': {
        const sauce = await Sauce.findOne({ _id: id, active: true });
        if (!sauce) {
          return res.status(404).json({ message: 'Sauce non trouvée' });
        }
        return res.status(200).json(sauce);
      }

      case 'PUT': {
        const { fields, files } = await parseForm(req) as any;
        let sauceData;

        try {
          sauceData = JSON.parse(fields.data);
        } catch (error) {
          return res.status(400).json({ message: 'Données JSON invalides' });
        }

        let imageUrl = sauceData.image;
        if (files.image) {
          try {
            const uploadedFile = files.image[0] || files.image;
            const processedImage = await imageService.processImage(uploadedFile);
            imageUrl = processedImage.large;
          } catch (error) {
            return res.status(400).json({ message: 'Erreur lors du traitement de l\'image' });
          }
        }

        try {
          const validatedData = sauceSchema.parse({
            ...sauceData,
            image: imageUrl
          });

          const updatedSauce = await Sauce.findByIdAndUpdate(
            id,
            { ...validatedData },
            { new: true, runValidators: true }
          );

          if (!updatedSauce) {
            return res.status(404).json({ message: 'Sauce non trouvée' });
          }

          return res.status(200).json(updatedSauce);
        } catch (validationError) {
          if (validationError instanceof ZodError) {
            return res.status(400).json({
              message: 'Données invalides',
              errors: validationError.errors
            });
          }
          throw validationError;
        }
      }

      case 'DELETE': {
        const sauce = await Sauce.findByIdAndUpdate(
          id,
          { active: false },
          { new: true }
        );
        
        if (!sauce) {
          return res.status(404).json({ message: 'Sauce non trouvée' });
        }
        
        return res.status(200).json({ message: 'Sauce supprimée avec succès' });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Une erreur est survenue' 
    });
  }
}

export default withAdmin(handler);