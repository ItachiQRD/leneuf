# Relier un domaine OVH à votre VPS

Ce guide explique comment faire pointer votre nom de domaine (géré chez OVH) vers votre VPS, pour que le site soit accessible via `https://votredomaine.com` au lieu de l’IP.

---

## Prérequis

- Un **domaine** géré chez OVH (ex. `leneuf.fr`, `leneuf.com`)
- Un **VPS** avec une IP publique fixe (ex. `51.xxx.xxx.xxx`)
- Le site tourne sur le VPS (Nginx + app sur le port 3000, comme dans `DEPLOY-VPS.md`)

---

## 1. Récupérer l’IP de votre VPS

Sur le VPS en SSH :

```bash
curl -4 ifconfig.me
```

Ou regarder l’IP dans le manager OVH (VPS > Détails du VPS). Notez cette IP (ex. `51.210.xxx.xxx`).

---

## 2. Configurer la zone DNS chez OVH

### Accéder à la zone DNS

1. Connectez-vous sur [https://www.ovh.com/manager](https://www.ovh.com/manager)
2. **Web Cloud** → **Noms de domaine**
3. Cliquez sur votre domaine (ex. `leneuf.fr`)
4. Onglet **Zone DNS** (ou **DNS** selon l’interface)

### Ajouter ou modifier les enregistrements

Vous devez faire pointer le domaine (et souvent `www`) vers l’IP du VPS.

| Type | Sous-domaine | Cible / Valeur | TTL |
|------|--------------|----------------|-----|
| **A** | (vide ou `@`) | **IP de votre VPS** | 300 ou 3600 |
| **A** | `www` | **IP de votre VPS** | 300 ou 3600 |

- **Sous-domaine vide ou `@`** = le domaine principal (`votredomaine.com`)
- **Sous-domaine `www`** = `www.votredomaine.com`
- **Cible** = l’IP du VPS (ex. `51.210.xxx.xxx`)

**Exemple pour `leneuf.fr` :**

- Enregistrement 1 : Type **A**, Sous-domaine **@** (ou vide), Cible **51.210.xxx.xxx**
- Enregistrement 2 : Type **A**, Sous-domaine **www**, Cible **51.210.xxx.xxx**

Si des enregistrements **A** ou **CNAME** existent déjà pour `@` ou `www`, **modifiez-les** pour mettre l’IP du VPS (pour A) ou supprimez le CNAME et mettez un A vers l’IP.

### Supprimer l’enregistrement AAAA (IPv6) si Certbot échoue

Si Let’s Encrypt valide en **IPv6** et que votre domaine a un enregistrement **AAAA** pointant vers un autre serveur (ex. hébergement OVH), Certbot recevra une **404** sur le défi ACME et l’émission du certificat échouera.

**Solution :** Dans la zone DNS OVH, **supprimez** les enregistrements de type **AAAA** pour le sous-domaine **@** (ou vide) et pour **www**. Gardez uniquement les **A** vers l’IP de votre VPS. Attendez 5–10 min puis relancez :

```bash
sudo certbot --nginx -d pizza-leneuf.fr -d www.pizza-leneuf.fr
```

### (Optionnel) Redirection www → sans www

Si vous voulez que `www.leneuf.fr` redirige vers `leneuf.fr` :

- Soit un enregistrement **A** pour `www` vers la même IP (Nginx gère la redirection, voir plus bas)
- Soit utiliser la **redirection OVH** : Onglet **Redirections** du domaine, créer une redirection `www` → `https://leneuf.fr`

Sauvegardez la zone DNS. La propagation peut prendre **5 minutes à 24–48 h**.

---

## 3. Vérifier la propagation DNS

Sur votre PC ou le VPS :

```bash
# Remplacer leneuf.fr par votre domaine
nslookup leneuf.fr
nslookup www.leneuf.fr
```

Ou : [https://dnschecker.org](https://dnschecker.org) → entrez votre domaine et vérifiez que l’IP affichée est celle du VPS.

---

## 4. Configurer Nginx sur le VPS pour le domaine

Une fois le DNS pointé vers le VPS, Nginx doit répondre pour ce nom.

En SSH sur le VPS :

```bash
sudo nano /etc/nginx/sites-available/leneuf-website
```

Mettez le **bon nom de domaine** dans `server_name` :

```nginx
server {
    listen 80;
    server_name leneuf.fr www.leneuf.fr;
    # ou votre domaine : votredomaine.com www.votredomaine.com

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

Puis :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Test : ouvrez `http://votredomaine.com` dans le navigateur (en attendant le SSL).

---

## 5. Activer le SSL (HTTPS) avec Let’s Encrypt

Sur le VPS :

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d leneuf.fr -d www.leneuf.fr
```

Remplacer `leneuf.fr` et `www.leneuf.fr` par votre domaine. Suivez les questions (email, accord). Après ça, Nginx aura une config HTTPS automatique et `https://votredomaine.com` fonctionnera.

---

## 6. (Optionnel) Reverse DNS (PTR) chez OVH

Utile pour les envois d’emails depuis le VPS (ex. notifications). Dans le manager OVH :

1. **Bare Metal Cloud** ou **Hosted Private Cloud** → votre **VPS**
2. **Réseau** ou **IP** → reverse DNS (PTR)
3. Indiquez un nom cohérent, ex. : `vps.leneuf.fr` ou `mail.leneuf.fr`

Cela n’est pas nécessaire pour faire « relier le domaine au VPS » ; c’est pour le courrier et la réputation IP.

---

## 7. Mettre à jour les variables d’environnement

Dans `~/leneuf-website/.env` sur le VPS, mettez l’URL de production :

```env
NEXTAUTH_URL=https://leneuf.fr
# ou https://votredomaine.com
```

Puis redémarrer l’app :

```bash
cd ~/leneuf-website
pm2 restart leneuf-website
```

---

## Récapitulatif

| Étape | Où | Action |
|-------|----|--------|
| 1 | VPS | Noter l’IP publique du VPS |
| 2 | OVH Manager → Domaine → Zone DNS | A @ → IP du VPS, A www → IP du VPS |
| 3 | PC / VPS | Vérifier avec `nslookup` ou dnschecker.org |
| 4 | VPS | Nginx : `server_name votredomaine.com www.votredomaine.com` |
| 5 | VPS | `certbot --nginx -d domaine.com -d www.domaine.com` |
| 6 | VPS | `.env` : `NEXTAUTH_URL=https://votredomaine.com` puis `pm2 restart` |

Après propagation DNS et SSL, votre hébergement OVH (domaine) est **relié** au VPS : le domaine pointe vers le VPS et le site est servi depuis celui-ci.
