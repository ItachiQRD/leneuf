# 🚀 Guide de déploiement Vercel - Fast Food App

## ⚠️ Problèmes identifiés et solutions

### 1. **Stockage de fichiers** ❌
**Problème** : Vercel ne permet pas d'écrire dans le système de fichiers (`/public/uploads/`)

**Solutions** :
- ✅ **Service de stockage cloud** (Recommandé)
- ✅ **URLs temporaires** (Solution temporaire)
- ✅ **Base64 encoding** (Pour les petites images)

### 2. **Timeouts** ⏱️
**Problème** : Les fonctions serverless ont des limites de temps

**Solutions** :
- ✅ **Timeout configuré à 60s** dans `vercel.json`
- ✅ **Retry logic** dans `ProductContext`
- ✅ **Gestion d'erreurs améliorée**

### 3. **FormData et multipart** 📤
**Problème** : Gestion des formulaires avec fichiers

**Solutions** :
- ✅ **API d'upload adaptée** (`/api/upload/index.ts`)
- ✅ **Service Vercel** (`vercelImageService.ts`)
- ✅ **Logs détaillés** pour debugging

## 🔧 Configuration requise

### Variables d'environnement Vercel

```bash
# Base de données
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fast-food-app

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# URL de base
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# Cloudinary (optionnel - pour les vrais uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=fast-food-uploads
```

### Configuration Vercel

Le fichier `vercel.json` est déjà configuré avec :
- ✅ Timeout de 60 secondes
- ✅ Headers CORS
- ✅ Région CDG1 (France)

## 🚀 Déploiement

### 1. **Via l'interface Vercel**
1. Connectez votre repository GitHub
2. Vercel détectera automatiquement Next.js
3. Ajoutez les variables d'environnement
4. Déployez !

### 2. **Via CLI Vercel**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## 🔍 Debugging

### Logs Vercel
```bash
# Voir les logs
vercel logs

# Logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs --function=api/admin/foods
```

### Logs dans le code
Tous les services ont des logs détaillés :
- `[Upload API]` - Upload d'images
- `[ProductContext]` - Gestion des produits
- `[API Foods]` - API des plats
- etc.

## 📋 Checklist de déploiement

### Avant le déploiement
- [ ] Variables d'environnement configurées
- [ ] Base de données MongoDB accessible
- [ ] Tests locaux réussis
- [ ] Build réussi (`npm run build`)

### Après le déploiement
- [ ] Test de connexion à la base de données
- [ ] Test des formulaires (création/édition)
- [ ] Test des uploads d'images
- [ ] Vérification des logs Vercel

## 🛠️ Solutions temporaires

### Pour les images
Actuellement, les images utilisent des URLs placeholder :
```javascript
// Exemple d'URL générée
https://via.placeholder.com/400x300?text=burger-image.jpg
```

### Pour la production
Intégrer un service de stockage cloud :
1. **Cloudinary** (Recommandé)
2. **AWS S3**
3. **Google Cloud Storage**
4. **Vercel Blob** (Nouveau)

## 🚨 Problèmes courants

### 1. **"Function timeout"**
- Vérifier les timeouts dans `vercel.json`
- Optimiser les requêtes de base de données
- Utiliser des requêtes parallèles

### 2. **"Upload failed"**
- Vérifier la taille des fichiers (max 5MB)
- Vérifier les types MIME
- Utiliser le service de stockage cloud

### 3. **"Database connection failed"**
- Vérifier l'URI MongoDB
- Vérifier les IPs autorisées
- Vérifier les credentials

### 4. **"Form submission failed"**
- Vérifier les logs Vercel
- Vérifier la configuration CORS
- Vérifier les headers de requête

## 📞 Support

En cas de problème :
1. Vérifier les logs Vercel
2. Vérifier les logs du navigateur
3. Tester en local d'abord
4. Consulter la documentation Vercel

## 🔄 Mise à jour

Pour mettre à jour l'application :
```bash
# Pull les dernières modifications
git pull origin main

# Déployer
vercel --prod
```

## 📊 Monitoring

### Vercel Analytics
- Activer dans le dashboard Vercel
- Métriques de performance
- Erreurs en temps réel

### Métriques importantes
- Temps de réponse des API
- Taux d'erreur des uploads
- Performance des formulaires
- Connexions à la base de données
