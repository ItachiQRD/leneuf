# Déploiement sur Vercel - Fast Food App

## 🚀 Configuration Vercel

### 1. Prérequis
- Compte Vercel
- Base de données MongoDB (MongoDB Atlas recommandé)
- Variables d'environnement configurées

### 2. Variables d'environnement requises

Dans le dashboard Vercel, ajoutez ces variables :

```bash
# Base de données
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fast-food-app

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# URL de base (sera automatiquement définie par Vercel)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### 3. Déploiement

#### Option A: Via l'interface Vercel
1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement Next.js
3. Ajoutez les variables d'environnement
4. Déployez !

#### Option B: Via CLI Vercel
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

### 4. Configuration spécifique

#### Base de données
- Utilisez **MongoDB Atlas** pour la production
- Configurez les IPs autorisées (0.0.0.0/0 pour Vercel)
- Activez l'authentification

#### Images
- Les images sont stockées dans `/public/uploads/`
- Vercel gère automatiquement l'optimisation
- Configuration Sharp incluse

#### API Routes
- Toutes les routes API sont dans `/pages/api/`
- Timeout configuré à 30s maximum
- Body parser limité à 10MB

### 5. Optimisations Vercel

#### Performance
- ✅ Images optimisées automatiquement
- ✅ Compression gzip/brotli
- ✅ CDN global
- ✅ Cache intelligent

#### Sécurité
- ✅ HTTPS automatique
- ✅ Headers de sécurité
- ✅ Variables d'environnement sécurisées

### 6. Monitoring

#### Vercel Analytics
- Activer dans le dashboard Vercel
- Métriques de performance
- Erreurs en temps réel

#### Logs
```bash
# Voir les logs
vercel logs

# Logs en temps réel
vercel logs --follow
```

### 7. Domaines personnalisés

1. Dans le dashboard Vercel
2. Settings > Domains
3. Ajouter votre domaine
4. Configurer les DNS

### 8. Dépannage

#### Erreurs communes
- **Build failed** : Vérifiez les variables d'environnement
- **Database connection** : Vérifiez MONGODB_URI
- **Images not loading** : Vérifiez les chemins dans `/public/`

#### Debug
```bash
# Build local
npm run build

# Test local
npm run start

# Logs détaillés
vercel logs --debug
```

### 9. Mise à jour

```bash
# Pull les dernières modifications
git pull origin main

# Redéployer
vercel --prod
```

## 📊 Performance attendue

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

## 🔧 Commandes utiles

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Test de production local
npm run start

# Déploiement Vercel
vercel

# Logs en temps réel
vercel logs --follow
```

## 📝 Notes importantes

1. **MongoDB Atlas** est recommandé pour la production
2. **Variables d'environnement** doivent être configurées dans Vercel
3. **Images** sont optimisées automatiquement
4. **API routes** ont un timeout de 30s maximum
5. **Build** utilise la configuration `output: 'standalone'`
