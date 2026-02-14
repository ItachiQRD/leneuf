# Limite d'upload d'images (> 1 Mo)

Si vous ne pouvez pas envoyer des images de plus de 1 Mo (erreur 413 ou "Request Entity Too Large"), la cause est en général **Nginx** sur le VPS, qui limite par défaut le corps des requêtes à 1 Mo.

## Sur le VPS : configurer Nginx

1. Éditez la config Nginx de votre site (ex. `/etc/nginx/sites-available/default` ou le vhost du site) :

   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. Dans le bloc `server` (ou `http` pour l’appliquer partout), ajoutez :

   ```nginx
   client_max_body_size 10M;
   ```

   Exemple dans un `server` :

   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name pizza-leneuf.fr www.pizza-leneuf.fr;

       client_max_body_size 10M;   # autoriser les uploads jusqu'à 10 Mo

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Vérifier et recharger Nginx :

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

Après ça, les uploads d’images jusqu’à 10 Mo devraient fonctionner.
