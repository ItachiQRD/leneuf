# Configuration Cloudinary pour l'upload d'images

## Problème résolu

L'upload d'images via les API routes Vercel était limité à 4.5MB (limite de payload des fonctions serverless). Pour permettre des uploads jusqu'à 10MB, l'application utilise deux méthodes :

1. **Upload direct client** (recommandé pour fichiers > 4.5MB) : Upload direct depuis le navigateur vers Cloudinary
2. **Upload via API route** (pour fichiers ≤ 4.5MB) : Upload via `/api/upload-cloudinary` qui utilise les variables serveur

## Configuration actuelle

Vous avez déjà configuré dans Vercel :
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

Ces variables fonctionnent pour l'upload via API route (fichiers ≤ 4.5MB).

## Pour activer l'upload direct client (fichiers > 4.5MB)

### Étape 1 : Créer un Upload Preset dans Cloudinary

1. Connectez-vous à votre compte Cloudinary : https://cloudinary.com/console
2. Allez dans **Settings** > **Upload** (onglet en haut)
3. Faites défiler jusqu'à la section **Upload presets**
4. Cliquez sur **Add upload preset**
5. Configurez le preset :
   - **Preset name** : `fast-food-upload` (ou un nom de votre choix)
   - **Signing mode** : Sélectionnez **Unsigned** ⚠️ (IMPORTANT : doit être unsigned pour l'upload client)
   - **Folder** : `fast-food-app/` (optionnel)
   - **Format** : `webp` (recommandé)
   - **Transformation** : Optionnel
6. Cliquez sur **Save**

### Étape 2 : Ajouter les variables dans Vercel

Ajoutez ces **deux nouvelles variables** dans Vercel (Settings > Environment Variables) :

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = [votre_cloud_name] (même valeur que CLOUDINARY_CLOUD_NAME)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = [nom_du_preset] (ex: fast-food-upload)
```

⚠️ **Important** : Les variables doivent commencer par `NEXT_PUBLIC_` pour être accessibles côté client.

### Étape 3 : Redéployer

Après avoir ajouté les variables, redéployez votre application sur Vercel.

## Comment ça fonctionne maintenant

- **Fichiers ≤ 4.5MB** : Utilise automatiquement `/api/upload-cloudinary` avec vos variables serveur existantes
- **Fichiers > 4.5MB** : 
  - Si `NEXT_PUBLIC_CLOUDINARY_*` sont configurés → Upload direct client
  - Sinon → Erreur avec message explicatif

## Avantages de l'upload direct client

- ✅ Pas de limite de taille de fichier (jusqu'à 10MB)
- ✅ Upload direct depuis le client, plus rapide
- ✅ Pas de charge sur les API routes Vercel
- ✅ Meilleure expérience utilisateur avec barre de progression

## Notes importantes

- L'upload preset doit être configuré en mode **Unsigned** pour fonctionner depuis le client
- Les images sont automatiquement optimisées et converties en WebP
- Les images sont organisées par catégorie dans Cloudinary (`fast-food-app/foods`, `fast-food-app/drinks`, etc.)
