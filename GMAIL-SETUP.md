# 📧 Configuration Gmail pour le stockage d'images

## 🔧 Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Configuration Gmail pour le stockage d'images
GMAIL_CLIENT_ID=your_gmail_client_id_here
GMAIL_CLIENT_SECRET=your_gmail_client_secret_here
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token_here
GMAIL_USER_EMAIL=your_email@gmail.com
```

## 🚀 Configuration Gmail API

### 1. **Créer un projet Google Cloud**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez l'ID du projet

### 2. **Activer l'API Gmail**

1. Dans le menu, allez dans "APIs & Services" > "Library"
2. Recherchez "Gmail API"
3. Cliquez sur "Gmail API" et activez-la

### 3. **Créer des identifiants OAuth 2.0**

1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth client ID"
3. Sélectionnez "Web application"
4. Ajoutez les URI de redirection :
   - `http://localhost:3000` (pour le développement)
   - `https://votre-domaine.com` (pour la production)
5. Cliquez sur "Create"
6. Copiez le **Client ID** et **Client Secret**

### 4. **Obtenir le Refresh Token**

1. **Installez les dépendances** :
   ```bash
   npm install googleapis google-auth-library
   ```

2. **Créez le script de configuration** :
   ```bash
   # Créez le fichier scripts/getGmailToken.js
   ```

3. **Modifiez le script** avec vos vraies valeurs :
   ```javascript
   const CLIENT_ID = 'votre_client_id_ici';
   const CLIENT_SECRET = 'votre_client_secret_ici';
   ```

4. **Exécutez le script** :
   ```bash
   node scripts/getGmailToken.js
   ```

5. **Suivez les instructions** :
   - Visitez l'URL affichée
   - Autorisez l'application
   - Copiez le code d'autorisation
   - Collez-le dans le terminal

6. **Copiez le refresh token** affiché

### 5. **Configuration finale**

1. **Créez `.env.local`** avec vos valeurs :
   ```env
   GMAIL_CLIENT_ID=votre_client_id
   GMAIL_CLIENT_SECRET=votre_client_secret
   GMAIL_REFRESH_TOKEN=votre_refresh_token
   GMAIL_USER_EMAIL=votre_email@gmail.com
   ```

2. **Redémarrez l'application** :
   ```bash
   npm run dev
   ```

## 🎯 **Comment ça fonctionne**

### **Upload d'images :**
1. L'utilisateur sélectionne une image
2. L'image est traitée avec Sharp (redimensionnement, compression)
3. L'image est envoyée vers Gmail comme pièce jointe d'un email
4. Gmail stocke l'image et retourne un ID de message
5. L'URL de l'image pointe vers `/api/gmail-image/[messageId]/[filename]`

### **Récupération d'images :**
1. L'URL `/api/gmail-image/[messageId]/[filename]` est appelée
2. L'API récupère l'image depuis Gmail
3. L'image est servie avec les bons headers de cache

### **Suppression d'images :**
1. L'ID du message Gmail est extrait de l'URL
2. L'email contenant l'image est supprimé de Gmail

## ⚠️ **IMPORTANT : Stockage Gmail exclusif**

Cette configuration utilise **uniquement Gmail** comme stockage d'images :
- ✅ **Aucun stockage local** : Pas de fichiers dans `/public/uploads/`
- ✅ **Compatible Vercel** : Fonctionne parfaitement sur Vercel
- ✅ **Compatible hébergeurs** : Fonctionne sur tous les hébergeurs
- ✅ **Configuration requise** : Gmail doit être configuré pour fonctionner

## 🔒 **Sécurité**

- ✅ **Images privées** : Stockées dans votre Gmail personnel
- ✅ **Aucune API key** : Utilise OAuth 2.0 sécurisé
- ✅ **Contrôle total** : Vous gérez vos images via Gmail
- ✅ **15 GB gratuits** : Espace de stockage généreux

## 🚨 **Dépannage**

### **Erreur "Gmail non initialisé"**
- Vérifiez que toutes les variables d'environnement sont définies
- Redémarrez l'application après avoir modifié `.env.local`

### **Erreur "Invalid credentials"**
- Vérifiez que le refresh token est correct
- Régénérez le refresh token si nécessaire

### **Erreur "Insufficient permissions"**
- Vérifiez que l'API Gmail est activée
- Vérifiez que les scopes sont corrects dans le script

### **Images ne s'affichent pas**
- Vérifiez que l'API `/api/gmail-image/[messageId]/[filename]` fonctionne
- Vérifiez les logs du serveur pour les erreurs

## 📋 **Avantages du stockage Gmail**

- ✅ **Gratuit** : 15 GB d'espace de stockage
- ✅ **Fiable** : Infrastructure Google ultra-stable
- ✅ **Sécurisé** : Images privées dans votre Gmail
- ✅ **Scalable** : Pas de limite de bande passante
- ✅ **Backup automatique** : Sauvegarde dans Gmail
- ✅ **Aucune configuration serveur** : Fonctionne sur Vercel

## 🎉 **C'est tout !**

Vos images sont maintenant stockées dans Gmail et servies via votre API. 
L'application fonctionne en local et sur Vercel sans configuration supplémentaire !
