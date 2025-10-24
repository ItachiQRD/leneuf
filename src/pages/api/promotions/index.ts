import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Promotion from '@/models/Promotion';
import formidable from 'formidable';
import { imageService } from '@/lib/imageService';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const { active, category } = req.query;
      
      let query: any = {};
      
      if (active === 'true') {
        const now = new Date();
        query = {
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now }
        };
      }
      
      if (category) {
        query.applicableCategories = { $in: [category] };
      }

      const promotions = await Promotion.find(query).sort({ createdAt: -1 });
      res.status(200).json({ success: true, promotions });
    } 
    else if (req.method === 'POST') {
      const form = formidable();
      const [fields, files] = await form.parse(req);

      const data = JSON.parse(fields.data?.[0] || '{}');

      // Gérer l'upload d'image si fournie
      if (files.image) {
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
        try {
          const imageUrl = await imageService.uploadToCloudinary(imageFile, 'promotions', data.name);
          data.image = imageUrl;
        } catch (error) {
          console.error('Erreur upload image promotion:', error);
          return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
        }
      }

      const promotion = new Promotion({
        ...data,
        usedCount: 0
      });

      const savedPromotion = await promotion.save();
      res.status(201).json({ success: true, promotion: savedPromotion });
    } 
    else if (req.method === 'PUT') {
      const form = formidable();
      const [fields, files] = await form.parse(req);

      const data = JSON.parse(fields.data?.[0] || '{}');
      const { _id, ...updateData } = data;

      // Gérer l'upload d'image si fournie
      if (files.image) {
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
        try {
          const imageUrl = await imageService.uploadToCloudinary(imageFile, 'promotions', data.name);
          updateData.image = imageUrl;
        } catch (error) {
          console.error('Erreur upload image promotion:', error);
          return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
        }
      }

      const updatedPromotion = await Promotion.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedPromotion) {
        return res.status(404).json({ message: 'Promotion non trouvée' });
      }

      res.status(200).json({ success: true, promotion: updatedPromotion });
    } 
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      const deletedPromotion = await Promotion.findByIdAndDelete(id);

      if (!deletedPromotion) {
        return res.status(404).json({ message: 'Promotion non trouvée' });
      }

      res.status(200).json({ success: true, message: 'Promotion supprimée avec succès' });
    } 
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Erreur API promotions:', error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}
