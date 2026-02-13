# Déploiement Le 9 – VPS (SSH)

Guide pour installer le site dans le dossier **leneuf-website** sur un VPS, en ligne de commande avec SSH.

---

## Prérequis

- Accès SSH au VPS : `utilisateur@ip_du_serveur` (et clé ou mot de passe)
- Un dépôt Git (GitHub/GitLab) contenant le projet, **ou** vous enverrez les fichiers depuis votre PC

---

## 1. Connexion au VPS

Sur votre machine (PowerShell ou terminal) :

```bash
ssh utilisateur@IP_DU_SERVEUR
```

Exemple : `ssh root@51.xxx.xxx.xxx` ou `ssh ubuntu@51.xxx.xxx.xxx`

---

## 2. Mise à jour du système (recommandé)

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 3. Installer Node.js (LTS)

**Option A – Via NodeSource (recommandé) :**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

**Option B – Via NVM :**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc   # ou source ~/.zshrc
nvm install 20
nvm use 20
node -v
```

---

## 4. Créer le dossier et récupérer le projet

### Option A – Cloner depuis Git (si le projet est sur GitHub/GitLab)

```bash
cd ~
# Si vous n'avez pas de clé SSH sur le VPS, utilisez l'URL HTTPS du repo
git clone https://github.com/VOTRE_USER/VOTRE_REPO.git leneuf-website
cd leneuf-website
```

### Option B – Envoyer le projet depuis votre PC (sans Git sur le serveur)

Sur **votre PC** (dans le dossier du projet, ex. `fast-food-app`) :

```bash
# Remplacez UTILISATEUR et IP par vos identifiants SSH
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ utilisateur@IP_DU_SERVEUR:~/leneuf-website/
```

Ou avec **scp** (créer d’abord le dossier sur le VPS) :

Sur le **VPS** :

```bash
mkdir -p ~/leneuf-website
```

Sur votre **PC** :

```bash
scp -r ./* utilisateur@IP_DU_SERVEUR:~/leneuf-website/
```

(Puis exclure manuellement `node_modules` et `.next` si besoin, ou les supprimer après coup sur le VPS.)

---

## 5. Sur le VPS : aller dans le dossier

```bash
cd ~/leneuf-website
ls -la
```

Vous devez voir `package.json`, `src/`, `public/`, etc.

---

## 6. Variables d’environnement (.env)

Créer le fichier `.env` (et `.env.local` si vous l’utilisez) avec les mêmes variables que en local.

```bash
nano .env
```

Exemple (à adapter avec vos vraies valeurs) :

```env
MONGODB_URI=mongodb+srv://user:password@cluster.xxxxx.mongodb.net/lenef?retryWrites=true&w=majority
NEXTAUTH_SECRET=votre_secret_long_et_aleatoire
NEXTAUTH_URL=https://votredomaine.com
NODE_ENV=production
# Cloudinary (si utilisé)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

Sauvegarder : `Ctrl+O`, Entrée, puis `Ctrl+X`.

---

## 7. Installer les dépendances et builder

```bash
cd ~/leneuf-website
npm install
npm run build
```

En cas d’erreur mémoire pendant le build :

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

## 8. Tester en local sur le VPS

```bash
npm start
```

Le site tourne sur le port 3000. Tester avec : `http://IP_DU_SERVEUR:3000`.  
Arrêter avec `Ctrl+C`.

---

## 9. Lancer en arrière-plan avec PM2

Installer PM2 :

```bash
sudo npm install -g pm2
```

Lancer l’app :

```bash
cd ~/leneuf-website
pm2 start npm --name "leneuf-website" -- start
```

Commandes utiles :

```bash
pm2 status
pm2 logs leneuf-website
pm2 restart leneuf-website
pm2 stop leneuf-website
```

Démarrage automatique au redémarrage du serveur :

```bash
pm2 startup
# Exécuter la commande que PM2 affiche (souvent avec sudo)
pm2 save
```

---

## 10. Nginx en reverse proxy (recommandé)

Installer Nginx :

```bash
sudo apt install -y nginx
```

Créer un site :

```bash
sudo nano /etc/nginx/sites-available/leneuf-website
```

Contenu (remplacer `votredomaine.com` et éventuellement l’IP) :

```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    # Si vous n'avez pas encore de domaine, mettez _ ou l'IP du VPS

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer le site et recharger Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/leneuf-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Si vous n’avez pas de domaine, vous pouvez accéder au site avec `http://IP_DU_SERVEUR` (port 80).

---

## 11. SSL avec Let’s Encrypt (optionnel, si vous avez un domaine)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
```

Renouvellement automatique :

```bash
sudo certbot renew --dry-run
```

---

## 12. Mises à jour futures

Après avoir poussé du nouveau code sur Git ou envoyé les fichiers :

**Si déploiement par Git :**

```bash
cd ~/leneuf-website
git pull
npm install
npm run build
pm2 restart leneuf-website
```

**Si déploiement par rsync depuis votre PC :**

Sur le PC :

```bash
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ utilisateur@IP_DU_SERVEUR:~/leneuf-website/
```

Sur le VPS :

```bash
cd ~/leneuf-website
npm install
npm run build
pm2 restart leneuf-website
```

---

## Récapitulatif des commandes (ordre)

| Étape | Commande |
|-------|----------|
| Connexion | `ssh utilisateur@IP_DU_SERVEUR` |
| Mise à jour | `sudo apt update && sudo apt upgrade -y` |
| Node.js | `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo -E bash -` puis `sudo apt install -y nodejs` |
| Dossier + projet | Git : `git clone URL leneuf-website` ou depuis PC : `rsync ...` (voir §4) |
| Aller dans le projet | `cd ~/leneuf-website` |
| Fichier env | `nano .env` (puis sauvegarder) |
| Build | `npm install && npm run build` |
| Lancer | `pm2 start npm --name "leneuf-website" -- start` |
| Persistance | `pm2 startup` puis `pm2 save` |
| Nginx | Créer le fichier dans `sites-available`, activer, `sudo nginx -t` puis `sudo systemctl reload nginx` |

---

## Dépannage

- **Port 3000 déjà utilisé :** `sudo lsof -i :3000` puis tuer le processus ou changer le port dans un script PM2.
- **Erreur MongoDB :** vérifier `MONGODB_URI` dans `.env` et que l’IP du VPS est autorisée dans MongoDB Atlas (Network Access).
- **Logs :** `pm2 logs leneuf-website` ou `journalctl -u nginx -f` pour Nginx.
