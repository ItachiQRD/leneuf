// pages/api/ingredients/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { withAdmin } from '@/utils/api';
import { connectDB } from '@/lib/mongodb';
import Ingredient from '@/models/Ingredient';
import { imageService } from '@/services/imageService';
import { IngredientSchema } from '@/types/ingredient';
import { ZodError } from 'zod';
import path from 'path';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

async function parseForm(req: NextApiRequest) {
  // Créer le dossier d'upload s'il n'existe pas
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'ingredients');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filename: (name, ext) => `${Date.now()}${ext}`, // Nom de fichier unique
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    if (req.method === 'POST') {
      const { fields, files } = await parseForm(req) as any;
      let imageUrl = '';
      let ingredientData;

      try {
        ingredientData = JSON.parse(fields.data);
      } catch (error) {
        return res.status(400).json({ message: 'Données JSON invalides' });
      }

      // Traiter l'image si elle existe
      if (files.image) {
        try {
          const uploadedFile = files.image[0] || files.image;
          const fileName = path.basename(uploadedFile.filepath);
          imageUrl = `/uploads/ingredients/${fileName}`;
        } catch (error) {
          console.error('Erreur lors du traitement de l\'image:', error);
          return res.status(400).json({ message: 'Erreur lors du traitement de l\'image' });
        }
      }

      try {
        // Valider les données avec le schema
        const validatedData = IngredientSchema.parse({
          ...ingredientData,
          description: ingredientData.description || '',
          image: imageUrl || ingredientData.image || '',
          isAvailable: ingredientData.isAvailable ?? true,
          isSpicy: ingredientData.isSpicy ?? false,
          isVegetarian: ingredientData.isVegetarian ?? false,
          allergens: ingredientData.allergens || [],
          orderIndex: ingredientData.orderIndex || 0
        });

        // Créer l'ingrédient dans la base de données
        const ingredient = await Ingredient.create(validatedData);

        return res.status(201).json(ingredient);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            message: 'Données invalides',
            errors: error.errors
          });
        }
        throw error;
      }
    }

    if (req.method === 'GET') {
      const ingredients = await Ingredient.find({ active: { $ne: false } }).sort({ createdAt: -1 });
      return res.status(200).json(ingredients);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Une erreur est survenue' 
    });
  }
}

export default withAdmin(handler);