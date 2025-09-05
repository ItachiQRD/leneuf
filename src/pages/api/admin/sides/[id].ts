import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { adminMiddleware } from '@/middleware/adminMiddleware';
import { connectDB } from '@/lib/mongodb';
import Side from '@/models/Side';
import { imageService } from '@/services/imageService';
import { sideSchema } from '@/types/side';
import fs from 'fs/promises';
import { FormidableFileWithPath } from '@/types/formidable';

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

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const side = await Side.findOne({ _id: id, active: true });
        if (!side) {
          return res.status(404).json({ message: 'Side non trouvé' });
        }
        return res.status(200).json(side);
      } catch (error) {
        console.error('GET Error:', error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du side' });
      }

    case 'PUT':
      try {
        const form = formidable({
          uploadDir: './public/uploads',
          keepExtensions: true,
          maxFileSize: 5 * 1024 * 1024,
        });

        const [fields, files] = await new Promise<[formidable.Fields<string>, formidable.Files<string>]>((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve([fields, files]);
          });
        });

        if (!fields.data) {
          return res.status(400).json({ message: 'Les données sont requises' });
        }

        let sideData;
        try {
          sideData = JSON.parse(fields.data.toString());
        } catch (error) {
          return res.status(400).json({ message: 'Les données JSON sont invalides' });
        }

        // Traiter l'image si présente
        let imageUrl = sideData.image;
        const imageFile = files.image && !Array.isArray(files.image) ? files.image : null;
        
        if (files.image) {
          const imageFile = files.image as unknown as FormidableFileWithPath;
          
          try {
            const buffer = await fs.readFile(imageFile.filepath);
            const processedImage = await imageService.processImage({
              fieldname: 'image',
              originalname: imageFile.originalFilename || 'untitled',
              encoding: '7bit',
              mimetype: imageFile.mimetype || 'image/jpeg',
              buffer,
              size: imageFile.size
            });
            imageUrl = processedImage.originalPath;
        
            // Nettoyage
            await fs.unlink(imageFile.filepath).catch(console.error);
          } catch (imageError) {
            console.error('Image Processing Error:', imageError);
            return res.status(400).json({ message: 'Erreur lors du traitement de l\'image' });
          }
        }

        // Validation des données
        try {
          const validatedData = sideSchema.parse({
            ...sideData,
            image: imageUrl
          });

          // Mise à jour
          const updatedSide = await Side.findByIdAndUpdate(
            id,
            { ...validatedData },
            { new: true, runValidators: true }
          );

          if (!updatedSide) {
            return res.status(404).json({ message: 'Side non trouvé' });
          }

          return res.status(200).json(updatedSide);
        } catch (error) {
          return res.status(400).json({
            message: 'Données invalides',
            errors: error.errors || [{ message: 'Erreur de validation' }]
          });
        }
      } catch (error) {
        console.error('PUT Error:', error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du side' });
      }

    case 'DELETE':
      try {
        const side = await Side.findByIdAndUpdate(
          id,
          { active: false },
          { new: true }
        );
        
        if (!side) {
          return res.status(404).json({ message: 'Side non trouvé' });
        }
        
        return res.status(200).json({ message: 'Side supprimé avec succès' });
      } catch (error) {
        console.error('DELETE Error:', error);
        return res.status(500).json({ message: 'Erreur lors de la suppression du side' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default adminMiddleware(handler);