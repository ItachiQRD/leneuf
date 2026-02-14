# Référence des images – Menu & Commander

## Modifications effectuées

- **Page menu (catégories)**  
  - Desserts → `/images/menu/dessert.jpg`  
  - Salades & assiettes → `/images/menu/sides.jpg`  
  - Sandwichs → `/images/menu/sandwich.jpg`  

- **Formulaire Tacos/Bowl (Commander)**  
  - Choix Tacos → `/images/menu/format-tacos.jpg`  
  - Choix Bowl → `/images/menu/format-bowl.jpg`  
  - Image du produit tacos/bowl (récap) → `format-tacos.jpg` / `format-bowl.jpg`  

- **Panini (Commander)**  
  - Emoji 🥪 remplacé par `/images/menu/panini.jpeg` (desktop et mobile).  

- **SVG**  
  - Les seuls SVG du projet sont `placeholder.svg` et `placeholder-food.svg`, tous deux utilisés comme fallback. Aucun SVG inutilisé à supprimer.  

---

## Images non utilisées (présentes dans `public/images` mais jamais référencées)

| Fichier | Dossier |
|--------|---------|
| `bowl.jpeg` | `images/menu/` |
| `frites.jpeg` | `images/menu/` |
| `Tacos-Bowl.jpg` | `images/menu/` |
| `l.jpg` | `images/menu/sizes/` |
| `m.jpg` | `images/menu/sizes/` |
| `xl.jpg` | `images/menu/sizes/` |
| `admiralsgroup5setup.exe` | `images/a-propos/` (fichier non image, à supprimer ou déplacer) |

---

## Images manquantes (référencées dans le code mais absentes de `public`)

### API tacos-options (`src/pages/api/products/tacos-options.ts`)

- `/images/meat-poulet.jpg`
- `/images/meat-boeuf.jpg`
- `/images/meat-porc.jpg`
- `/images/meat-agneau.jpg`
- `/images/meat-poisson.jpg`
- `/images/meat-vegetarien.jpg`  

→ Créer un dossier `public/images/meat/` et y ajouter ces fichiers, ou changer le code pour utiliser des images existantes / placeholders.

### API ingredients tex-mex (`src/pages/api/ingredients/texmex.ts`)

- `/images/ingredients/nuggets.jpg`
- `/images/ingredients/tenders.jpg`
- `/images/ingredients/mozza-sticks.jpg`
- `/images/ingredients/hot-wings.jpg`  

→ Créer `public/images/ingredients/` et y ajouter ces fichiers, ou adapter les chemins (ex. utiliser des images dans `ptite-faim` si c’est le même visuel).

### API boissons (`src/pages/api/products/boissons.ts`)

- `/images/boissons/coca-cola.jpg`
- `/images/boissons/eau.jpg`
- `/images/boissons/jus-orange.jpg`
- `/images/boissons/jus-pomme.jpg`
- `/images/boissons/fanta.jpg`  

→ Créer `public/images/boissons/` et y ajouter ces fichiers, ou faire pointer vers des placeholders.

---

## Résumé

- **Images non utilisées** : 6 images + 1 fichier `.exe` (voir tableau ci‑dessus). Vous pouvez les supprimer ou les garder pour un usage futur.
- **Images manquantes** : 15 chemins référencés dans les APIs (viandes tacos, ingrédients tex-mex, boissons). À créer ou remplacer par des assets existants / placeholders.
- **SVG** : Aucun SVG inutilisé ; `placeholder.svg` et `placeholder-food.svg` sont utilisés.
