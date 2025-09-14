import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
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
  await connectDB();

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
        if (!ingredientData.name) {
          return res.status(400).json({ message: 'Le nom est requis' });
        }
        if (!ingredientData.type) {
          return res.status(400).json({ message: 'Le type est requis' });
        }
        if (ingredientData.price === undefined || ingredientData.price === null) {
          return res.status(400).json({ message: 'Le prix est requis' });
        }

        // Gestion de l'image
        let imageUrl = '';
        if (files.image && files.image[0]) {
          try {
            const imageResult = await imageService.uploadImage(files.image[0], 'ingredients');
            imageUrl = imageResult.url;
          } catch (imageError) {
            console.error('Erreur upload image:', imageError);
            return res.status(400).json({ message: 'Erreur lors de l\'upload de l\'image' });
          }
        } else if (ingredientData.image && typeof ingredientData.image === 'string') {
          // Si c'est déjà une URL (pour les mises à jour)
          imageUrl = ingredientData.image;
        } else {
          return res.status(400).json({ message: 'L\'image est requise' });
        }

        // Conversion des types
        const validatedData = {
          ...ingredientData,
          image: imageUrl,
          price: parseFloat(ingredientData.price),
          orderIndex: parseInt(ingredientData.orderIndex) || 0,
          isAvailable: Boolean(ingredientData.isAvailable),
          isSpicy: Boolean(ingredientData.isSpicy),
          isVegetarian: Boolean(ingredientData.isVegetarian),
          allergens: Array.isArray(ingredientData.allergens) ? ingredientData.allergens : []
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
