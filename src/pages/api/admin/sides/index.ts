// pages/api/admin/sides/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Side from '@/models/Side';
import { withAdmin } from '@/utils/api';
import formidable, { Files, Fields } from 'formidable';
import { imageService } from '@/services/imageService';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await connectDB();

    switch (method) {
      case 'GET':
        try {
          const sides = await Side.find({}).sort({ createdAt: -1 });
          res.status(200).json(sides);
        } catch (error) {
          console.error('Error fetching sides:', error);
          res.status(500).json({ message: 'Erreur lors de la récupération des accompagnements' });
        }
        break;

      case 'POST':
        try {
          const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
          });

          const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err);
              resolve([fields, files]);
            });
          });

          const data = fields.data ? JSON.parse(fields.data.toString()) : {};
          let imageUrl = '';

          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              imageUrl = await imageService.uploadImage(imageFile, 'sides');
              data.image = imageUrl;
            } catch (error) {
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          const side = await Side.create({
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            category: data.category,
            image: data.image,
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            allergens: Array.isArray(data.allergens) ? data.allergens : [],
            nutritionalInfo: data.nutritionalInfo || {},
            available: data.available ?? true,
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            vegetarian: data.vegetarian ?? false,
            vegan: data.vegan ?? false,
            preparationTime: parseInt(data.preparationTime) || 0,
          });

          res.status(201).json(side);
        } catch (error) {
          console.error('Error creating side:', error);
          res.status(500).json({ 
            error: 'Error creating side',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      case 'PUT':
        try {
          const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
          });

          const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err);
              resolve([fields, files]);
            });
          });

          const data = fields.data ? JSON.parse(fields.data.toString()) : {};
          let imageUrl = '';

          if (files.image) {
            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
            try {
              // Si c'est une mise à jour, récupérer l'ancienne image pour la supprimer
              const existingSide = await Side.findById(data._id);
              if (existingSide?.image) {
                await imageService.deleteImage(existingSide.image);
              }
              imageUrl = await imageService.uploadImage(imageFile, 'sides');
              data.image = imageUrl;
            } catch (error) {
              throw new Error('Erreur lors du traitement de l\'image');
            }
          }

          const existingSide = await Side.findById(data._id);
          if (!existingSide) {
            return res.status(404).json({ message: 'Accompagnement non trouvé' });
          }

          const updatedSide = await Side.findByIdAndUpdate(
            data._id,
            { 
              name: data.name,
              description: data.description,
              price: parseFloat(data.price),
              category: data.category,
              image: data.image,
              ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
              allergens: Array.isArray(data.allergens) ? data.allergens : [],
              nutritionalInfo: data.nutritionalInfo || {},
              available: data.available ?? true,
              sizes: Array.isArray(data.sizes) ? data.sizes : [],
              vegetarian: data.vegetarian ?? false,
              vegan: data.vegan ?? false,
              preparationTime: parseInt(data.preparationTime) || 0,
            },
            { new: true }
          );

          res.json(updatedSide);
        } catch (error) {
          console.error('Error updating side:', error);
          res.status(500).json({ 
            error: 'Error updating side',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.query;

          const side = await Side.findById(id);
          if (!side) {
            return res.status(404).json({ message: 'Accompagnement non trouvé' });
          }

          if (side.image) {
            await imageService.deleteImage(side.image);
          }

          await Side.findByIdAndDelete(id);
          res.status(200).json({ message: 'Accompagnement supprimé avec succès' });
        } catch (error) {
          console.error('Error deleting side:', error);
          res.status(500).json({ 
            error: 'Error deleting side',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAdmin(handler);