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

1. Dans le menu, allez à **APIs & Services** > **Library**
2. Recherchez "Gmail API"
3. Cliquez sur **Gmail API** et activez-la

### 3. **Créer des identifiants OAuth2**

1. Allez à **APIs & Services** > **Credentials**
2. Cliquez sur **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Sélectionnez **Web application**
4. Ajoutez `http://localhost:3000` dans **Authorized redirect URIs**
5. Cliquez sur **Create**
6. Copiez le **Client ID** et **Client Secret**

### 4. **Obtenir le refresh token**

1. **Modifiez temporairement** `scripts/getGmailToken.js` :
   ```javascript
   const CLIENT_ID = 'votre_client_id_ici';
   const CLIENT_SECRET = 'votre_client_secret_ici';
   ```

2. **Exécutez le script** :
   ```bash
   node scripts/getGmailToken.js
   ```

3. **Suivez les instructions** pour obtenir le refresh token

4. **Remettez les placeholders** dans le script :
   ```javascript
   const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
   const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
   ```

### 5. **Configurer les variables d'environnement**

Créez ou modifiez votre `.env.local` :

```env
# Configuration Gmail
GMAIL_CLIENT_ID=votre_client_id_obtenu
GMAIL_CLIENT_SECRET=votre_client_secret_obtenu
GMAIL_REFRESH_TOKEN=votre_refresh_token_obtenu
GMAIL_USER_EMAIL=votre_email@gmail.com

# Autres variables
MONGODB_URI=mongodb://localhost:27017/fastfood
JWT_SECRET=your_jwt_secret_here
```

## 🧪 Test de la configuration

### 1. **Tester en local**

```bash
npm run dev
```

Créez un produit avec une image. L'image sera stockée localement.

### 2. **Tester sur Vercel**

1. **Ajoutez les variables d'environnement** dans Vercel :
   - Allez dans votre projet Vercel
   - Settings > Environment Variables
   - Ajoutez toutes les variables GMAIL_*

2. **Déployez** :
   ```bash
   vercel --prod
   ```

3. **Testez** : Créez un produit avec une image. L'image sera uploadée vers Gmail !

## 🔍 Comment ça fonctionne

### **En local :**
- Images stockées dans `/public/uploads/`
- Accès direct via URL `/uploads/category/filename.webp`

### **Sur Vercel :**
- Images uploadées vers Gmail comme pièces jointes
- Accès via API `/api/gmail-image/messageId/filename`
- Images servies depuis Gmail avec cache

## 🚨 Dépannage

### **Erreur "Invalid credentials"**
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que le refresh token est valide

### **Erreur "Quota exceeded"**
- Gmail API a des limites : 100 emails/jour en mode gratuit
- Pour plus de volume, activez la facturation

### **Images ne s'affichent pas**
- Vérifiez que l'API Gmail fonctionne
- Vérifiez les logs Vercel pour les erreurs

## 📊 Avantages de cette solution

- ✅ **15 GB gratuits** de stockage Gmail
- ✅ **Infrastructure Google** ultra-fiable
- ✅ **Sécurisé** : Images privées dans votre Gmail
- ✅ **Scalable** : Pas de limite de bande passante
- ✅ **Backup automatique** : Sauvegarde dans Gmail
- ✅ **Compatible Vercel** : Fonctionne sans configuration serveur

## 🔄 Migration depuis Base64

Si vous avez déjà des images en Base64, elles continueront de fonctionner. Les nouvelles images seront automatiquement uploadées vers Gmail sur Vercel.

## 📝 Notes importantes

- Les images sont stockées comme pièces jointes d'emails
- Chaque image = 1 email dans votre Gmail
- Les emails ont le sujet `[LeNeuf] Image Upload - category/filename`
- Vous pouvez les organiser dans des dossiers Gmail si nécessaire
