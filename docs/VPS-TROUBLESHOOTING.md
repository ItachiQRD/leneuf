# Dépannage VPS : site inaccessible ou page par défaut

---

## Certbot : « Invalid response … 404 » sur /.well-known/acme-challenge/…

Si l’erreur mentionne une adresse **IPv6** (ex. `2001:41d0:...`) et un **404**, Let’s Encrypt valide via IPv6 et atteint un **autre** serveur (souvent l’hébergement OVH), qui ne sert pas les fichiers du défi.

**Solution :** Dans OVH → **Zone DNS** du domaine, **supprimez les enregistrements AAAA** pour `@` et `www`. Gardez uniquement les **A** vers l’IP de votre VPS (ex. 51.255.195.126). Attendez 5–10 min puis relancez :

```bash
sudo certbot --nginx -d pizza-leneuf.fr -d www.pizza-leneuf.fr
```

---

Si vous voyez « site inaccessible » ou la page par défaut de l’hébergeur, suivez ces étapes **sur le VPS en SSH**.

---

## 1. Vérifier que l’application tourne

```bash
pm2 status
```

Vous devez voir `leneuf-website` (ou le nom de votre app) avec le statut **online**.

- Si **stopped** ou **errored** : `pm2 restart leneuf-website` puis `pm2 logs leneuf-website` pour voir l’erreur.
- Si l’app n’existe pas : `cd ~/leneuf-website` puis `pm2 start npm --name "leneuf-website" -- start`.

**Test local sur le VPS :**

```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000
```

Vous devez avoir **200**. Si vous avez « Connection refused », l’app n’écoute pas sur le port 3000.

---

## 2. Voir quel site Nginx utilise par défaut

Souvent un **site par défaut** (default) prend toutes les requêtes. Il faut le désactiver et garder seulement le vôtre.

```bash
ls -la /etc/nginx/sites-enabled/
```

Vous verrez par exemple :
- `default` → site par défaut (page « Welcome to nginx » ou hébergeur)
- `leneuf-website` → votre site (si vous l’avez activé)

**Désactiver le site par défaut :**

```bash
sudo rm /etc/nginx/sites-enabled/default
```

**Vérifier que votre config est bien activée :**

```bash
ls -la /etc/nginx/sites-enabled/
```

Il doit y avoir un lien vers votre config (ex. `leneuf-website`). Si ce n’est pas le cas :

```bash
sudo ln -s /etc/nginx/sites-available/leneuf-website /etc/nginx/sites-enabled/
```

---

## 3. Vérifier le contenu de votre config Nginx

```bash
sudo cat /etc/nginx/sites-available/leneuf-website
```

La config doit ressembler à ça (avec **votre** domaine) :

```nginx
server {
    listen 80;
    server_name pizza-leneuf.fr www.pizza-leneuf.fr;

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

À vérifier :
- **server_name** contient bien `pizza-leneuf.fr` et `www.pizza-leneuf.fr` (sans faute).
- **proxy_pass** est bien `http://127.0.0.1:3000;` (avec le `;`).

Si vous aviez déjà fait Certbot, vous pouvez avoir un second bloc `server { listen 443 ssl; ... }`. C’est normal, ne le supprimez pas.

Corriger si besoin :

```bash
sudo nano /etc/nginx/sites-available/leneuf-website
```

Puis tester et recharger Nginx :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Pare-feu (ports 80 et 443 ouverts)

```bash
sudo ufw status
```

Si le pare-feu est **active**, les ports 80 et 443 doivent être autorisés :

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow OpenSSH
sudo ufw reload
```

---

## 5. Tester depuis le VPS

```bash
# Test port 80 (HTTP)
curl -I -H "Host: pizza-leneuf.fr" http://127.0.0.1/

# Si vous avez HTTPS
curl -I -k -H "Host: pizza-leneuf.fr" https://127.0.0.1/
```

Vous devez voir une réponse **HTTP/1.1 200** (ou 301/302) et pas « 502 » ou « 404 ». Si c’est 502, Nginx ne joint pas l’app (vérifier le port 3000 et PM2).

---

## 6. Récapitulatif des commandes (à exécuter dans l’ordre)

```bash
# 1. App running
pm2 status
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000
# doit afficher 200

# 2. Enlever le site par défaut
sudo rm -f /etc/nginx/sites-enabled/default

# 3. Activer votre site
sudo ln -sf /etc/nginx/sites-available/leneuf-website /etc/nginx/sites-enabled/

# 4. Vérifier la config (server_name = pizza-leneuf.fr www.pizza-leneuf.fr)
sudo nano /etc/nginx/sites-available/leneuf-website

# 5. Tester et recharger Nginx
sudo nginx -t && sudo systemctl reload nginx

# 6. Pare-feu
sudo ufw allow 80
sudo ufw allow 443
sudo ufw reload
```

Ensuite retester dans le navigateur : **http://pizza-leneuf.fr** puis **https://pizza-leneuf.fr**.

---

## 7. Si ça ne marche toujours pas

- **Logs Nginx (erreurs) :**  
  `sudo tail -50 /var/log/nginx/error.log`

- **Logs de l’app :**  
  `pm2 logs leneuf-website --lines 50`

- **Qui écoute sur 80 et 3000 :**  
  `sudo ss -tlnp | grep -E ':80|:3000'`

Envoyez ces sorties si vous voulez qu’on analyse l’erreur précise.
