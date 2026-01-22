# Configuration Cloudinary pour l'upload direct depuis le client

## Problème résolu

L'upload d'images via les API routes Vercel était limité à 4.5MB (limite de payload des fonctions serverless). Pour permettre des uploads jusqu'à 10MB, l'application utilise maintenant l'upload direct vers Cloudinary depuis le client.

## Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Cloudinary - Configuration existante (côté serveur)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Cloudinary - Configuration pour upload client (NEXT_PUBLIC_*)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=votre_upload_preset
```

## Configuration de l'Upload Preset dans Cloudinary

1. Connectez-vous à votre compte Cloudinary
2. Allez dans **Settings** > **Upload**
3. Créez un nouvel **Upload Preset** ou utilisez un existant
4. Configurez le preset :
   - **Signing mode**: `Unsigned` (pour permettre l'upload depuis le client)
   - **Folder**: `fast-food-app/` (optionnel, sera surchargé par le code)
   - **Format**: `webp` (recommandé pour la performance)
   - **Transformation**: Optionnel, peut être configuré dans le preset

## Avantages de cette approche

- ✅ Pas de limite de taille de fichier côté Vercel (jusqu'à 10MB)
- ✅ Upload direct depuis le client, plus rapide
- ✅ Pas de charge sur les API routes Vercel
- ✅ Meilleure expérience utilisateur avec barre de progression

## Notes importantes

- L'upload preset doit être configuré en mode **Unsigned** pour fonctionner depuis le client
- Les images sont automatiquement optimisées et converties en WebP
- Les images sont organisées par catégorie dans Cloudinary (`fast-food-app/foods`, `fast-food-app/drinks`, etc.)
