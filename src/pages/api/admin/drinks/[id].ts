import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';
import { withAdmin } from '@/utils/api';
import formidable from 'formidable';
import { imageService } from '@/services/imageService';

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
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          console.log(' [API Drinks] PUT reçu pour ID:', id);
          
          // Vérifier le Content-Type pour déterminer le type de données
          const contentType = req.headers['content-type'];
          
          let updateData;

          if (contentType && contentType.includes('multipart/form-data')) {
            // FormData avec image
            const form = formidable({
              keepExtensions: true,
              maxFileSize: 5 * 1024 * 1024, // 5MB
            });

            const { fields, files } = await new Promise((resolve, reject) => {
              form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
              });
            }) as any;
            
            try {
              const dataString = Array.isArray(fields.data) ? fields.data[0] : fields.data;
              if (!dataString) {
                return res.status(400).json({ message: 'Données manquantes' });
              }
              updateData = JSON.parse(dataString);
              console.log(' [API Drinks] Données parsées depuis FormData:', updateData);
            } catch (error) {
              console.error(' [API Drinks] Erreur parsing data:', error);
              return res.status(400).json({ message: 'Données JSON invalides' });
            }

            // Gérer l'upload d'image si une nouvelle est fournie
            if (files.image) {
              const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
              try {
                const imageUrl = await imageService.uploadSingleHighQualityImage(imageFile, 'drinks');
                updateData.image = imageUrl;
                console.log(' [API Drinks] Nouvelle image uploadée:', imageUrl);
              } catch (error) {
                console.error(' [API Drinks] Erreur upload image:', error);
                return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
              }
            }
          } else {
            // JSON direct
            updateData = req.body;
            console.log(' [API Drinks] Données JSON directes:', updateData);
          }
          
          // Validation des champs obligatoires
          if (updateData.name && !updateData.name.trim()) {
            return res.status(400).json({ message: 'Le nom ne peut pas être vide' });
          }
          if (updateData.sizes && (!Array.isArray(updateData.sizes) || updateData.sizes.length === 0)) {
            return res.status(400).json({ message: 'Au moins une taille est requise' });
          }
          if (updateData.nutritionalInfo && (!updateData.nutritionalInfo.calories && updateData.nutritionalInfo.calories !== 0)) {
            return res.status(400).json({ message: 'Les informations nutritionnelles sont requises' });
          }
          
          const drink = await Drink.findByIdAndUpdate(id, updateData, { new: true });
          
          if (!drink) {
            return res.status(404).json({ message: 'Boisson non trouvée' });
          }
          
          console.log(' [API Drinks] Boisson mise à jour avec succès');
          return res.status(200).json(drink);
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la boisson:', error);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour de la boisson' });
        }

      case 'DELETE':
        try {
          console.log(' [API Drinks] Suppression de la boisson ID:', id);
          
          const drink = await Drink.findByIdAndDelete(id);
          
          if (!drink) {
            return res.status(404).json({ message: 'Boisson non trouvée' });
          }
          
          console.log(' [API Drinks] Boisson supprimée définitivement de la base de données');
          return res.status(200).json({ message: 'Boisson supprimée avec succès' });
        } catch (error) {
          console.error('Erreur lors de la suppression de la boisson:', error);
          return res.status(500).json({ message: 'Erreur lors de la suppression de la boisson' });
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
