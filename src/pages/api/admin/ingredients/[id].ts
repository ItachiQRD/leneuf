// pages/api/ingredients/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { withAdmin } from '@/utils/api';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';
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
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await dbConnect();

    switch (req.method) {
      case 'GET': {
        const ingredient = await Ingredient.findOne({ _id: id, active: true });
        if (!ingredient) {
          return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }
        return res.status(200).json(ingredient);
      }

      case 'PUT': {
        const { fields, files } = await parseForm(req) as any;
        let ingredientData;

        try {
          const dataString = Array.isArray(fields.data) ? fields.data[0] : fields.data;
          if (!dataString) {
            return res.status(400).json({ message: 'Données manquantes' });
          }
          ingredientData = JSON.parse(dataString);
        } catch (error) {
          return res.status(400).json({ message: 'Données JSON invalides' });
        }

        let imageUrl = ingredientData.image;
        if (files.image) {
          try {
            const uploadedFile = files.image[0] || files.image;
            const fileName = path.basename(uploadedFile.filepath);
            imageUrl = `/uploads/ingredients/${fileName}`;

            // Supprimer l'ancienne image si elle existe
            if (ingredientData.image) {
              const oldImagePath = path.join(
                process.cwd(),
                'public',
                ingredientData.image.replace(/^\//, '')
              );
              if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
              }
            }
          } catch (error) {
            console.error('Erreur lors du traitement de l\'image:', error);
            return res.status(400).json({ message: 'Erreur lors du traitement de l\'image' });
          }
        }

        try {
          // Récupérer l'ingrédient existant
          const existingIngredient = await Ingredient.findById(id);
          if (!existingIngredient) {
            return res.status(404).json({ message: 'Ingrédient non trouvé' });
          }

          // Valider les données avec le schema
          const validatedData = IngredientSchema.parse({
            name: ingredientData.name,
            description: ingredientData.description || existingIngredient.description || '',
            type: ingredientData.type,
            price: ingredientData.price,
            image: imageUrl || existingIngredient.image,
            isAvailable: ingredientData.isAvailable ?? existingIngredient.isAvailable,
            isSpicy: ingredientData.isSpicy ?? existingIngredient.isSpicy,
            isVegetarian: ingredientData.isVegetarian ?? existingIngredient.isVegetarian,
            allergens: ingredientData.allergens || existingIngredient.allergens,
            orderIndex: ingredientData.orderIndex ?? existingIngredient.orderIndex
          });

          // Mettre à jour l'ingrédient
          const updatedIngredient = await Ingredient.findByIdAndUpdate(
            id,
            validatedData,
            { new: true, runValidators: true }
          );

          return res.status(200).json(updatedIngredient);
        } catch (error) {
          if (error instanceof ZodError) {
            console.error('Erreur de validation:', error.errors);
            return res.status(400).json({
              message: 'Données invalides',
              errors: error.errors
            });
          }
          throw error;
        }
      }

      case 'DELETE': {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
          return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }

        // Supprimer l'image si elle existe
        if (ingredient.image) {
          const imagePath = path.join(
            process.cwd(),
            'public',
            ingredient.image.replace(/^\//, '')
          );
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }

        // Supprimer définitivement de la base de données
        await Ingredient.findByIdAndDelete(id);
        console.log(' [API Ingredients] Ingrédient supprimé définitivement de la base de données');
        return res.status(200).json({ message: 'Ingrédient supprimé avec succès' });
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
