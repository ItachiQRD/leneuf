import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';

// Désactiver le bodyParser par défaut de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const ingredients = await Ingredient.find({ deletedAt: { $exists: false } });
        res.status(200).json(ingredients);
      } catch (error) {
        console.error('Erreur lors de la récupération des ingrédients:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      break;

    case 'POST':
      try {
        // Configuration de formidable pour gérer les uploads
        const form = formidable({
          maxFileSize: 10 * 1024 * 1024, // 10MB
          keepExtensions: true,
        });

        const [fields, files] = await form.parse(req);
        
        // Extraire les données JSON
        let ingredientData = {};
        if (fields.data && fields.data[0]) {
          try {
            ingredientData = JSON.parse(fields.data[0]);
          } catch (parseError) {
            console.error('Erreur parsing data:', parseError);
            return res.status(400).json({ message: 'Données JSON invalides' });
          }
        }
        
        if (!ingredientData || typeof ingredientData !== 'object') {
          return res.status(400).json({ message: 'Données invalides' });
        }

        // Validation des champs requis
        const data = ingredientData as any;
        if (!data.name) {
          return res.status(400).json({ message: 'Le nom est requis' });
        }
        if (!data.type) {
          return res.status(400).json({ message: 'Le type est requis' });
        }
        if (data.price === undefined || data.price === null) {
          return res.status(400).json({ message: 'Le prix est requis' });
        }

        // Gestion de l'image
        let imageUrl = '';
        if (files.image && files.image[0]) {
          try {
            imageUrl = await imageService.uploadImage(files.image[0], 'ingredients');
          } catch (imageError) {
            console.error('Erreur upload image:', imageError);
            return res.status(400).json({ message: 'Erreur lors de l\'upload de l\'image' });
          }
        } else if (data.image && typeof data.image === 'string') {
          // Si c'est déjà une URL (pour les mises à jour)
          imageUrl = data.image;
        } else {
          return res.status(400).json({ message: 'L\'image est requise' });
        }

        // Conversion des types
        const validatedData = {
          ...data,
          image: imageUrl,
          price: parseFloat(data.price),
          orderIndex: parseInt(data.orderIndex) || 0,
          isAvailable: Boolean(data.isAvailable),
          isSpicy: Boolean(data.isSpicy),
          isVegetarian: Boolean(data.isVegetarian),
          allergens: Array.isArray(data.allergens) ? data.allergens : []
        };
        
        const ingredient = new Ingredient(validatedData);
        await ingredient.save();
        res.status(201).json(ingredient);
      } catch (error) {
        console.error('Erreur lors de la création de l\'ingrédient:', error);
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(400).json({ message: 'Erreur lors de la création de l\'ingrédient' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default withAdmin(handler);
