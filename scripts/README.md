# Scripts de Seed pour Pizza Le Neuf

Ce dossier contient tous les scripts de seed pour peupler la base de données avec les produits du menu **Pizza Le Neuf**.

## 🚀 Scripts Disponibles

### Scripts Individuels

- **`seedSalads.js`** - Ajoute 5 salades (7€ chacune)
- **`seedPlates.js`** - Ajoute 3 assiettes (10-12€)
- **`seedPaninis.js`** - Ajoute 8 paninis (6.50€ + frites + boisson)
- **`seedTexMex.js`** - Ajoute 8 plats tex-mex épicés
- **`seedFriesAndDrinks.js`** - Ajoute 2 frites et 5 boissons

### Script Principal

- **`seedAllFoods.js`** - Exécute tous les scripts de seed en une fois

## 📋 Commandes NPM

```bash
# Seed individuel
npm run seed-salads      # Ajouter les salades
npm run seed-plates      # Ajouter les assiettes
npm run seed-paninis     # Ajouter les paninis
npm run seed-texmex      # Ajouter les plats tex-mex
npm run seed-fries-drinks # Ajouter frites et boissons

# Seed complet
npm run seed-all-foods   # Ajouter tous les produits
```

## 🍽️ Menu Pizza Le Neuf

### Salades (5 plats - 7€ chacune)
- **Le Neuf** - Salade verte, tomate, olives, poulet
- **Royale** - Salade verte, tomate, avocat, crevettes
- **Niçoise** - Salade verte, tomate, thon, olives
- **Norvégienne** - Salade verte, tomate, pomme de terre, saumon
- **Chèvre Chaud** - Salade verte, tomate, poulet, chèvre sur toast

### Assiettes (3 plats - servis avec pain)
- **Kebab** - 10€ - Viande de kebab, salade, tomate, oignon, sauce blanche
- **Poulet** - 10€ - Poulet grillé, salade, tomate, oignon, sauce
- **Mixte** - 12€ - Poulet + Kebab, salade, tomate, oignon, sauce

### Paninis (8 plats - 6.50€ + FRITE + BOISSON 33CL)
- **Kebab** - Viande de kebab, salade, tomate, oignon, sauce blanche
- **Fromage** - Fromage, tomate, salade
- **Chèvre Miel** - Chèvre, miel, salade
- **Jambon** - Jambon, fromage, tomate, salade
- **Poulet** - Poulet grillé, salade, tomate, oignon, sauce
- **Viande Hachée** - Viande hachée, fromage, tomate, salade, sauce
- **Saumon** - Saumon, salade, tomate, sauce
- **Thon** - Thon, tomate, salade, sauce

### Frites (2 tailles)
- **Frites** - 3.50€
- **Frites Grande** - 5.00€

### Boissons (5 options)
- **Coca-Cola 33cl** - 2.50€
- **Coca-Cola 50cl** - 3.50€
- **Eau 50cl** - 2.00€
- **Jus d'Orange 25cl** - 2.80€
- **Jus de Pomme 25cl** - 2.80€

### Plats Tex-Mex (8 plats)
- Burrito Poulet - 11.90€
- Quesadilla Végétarienne - 9.90€
- Nachos Supreme - 8.90€
- Tacos de Bœuf - 10.50€
- Bowl Tex-Mex - 12.90€
- Chili Con Carne - 9.90€
- Fajitas de Poulet - 13.90€
- Enchiladas Végétariennes - 11.50€

## 🔧 Configuration

Les scripts utilisent la variable d'environnement `MONGODB_URI` ou se connectent par défaut à `mongodb://localhost:27017/fastfood`.

## ⚠️ Important

- Les scripts suppriment d'abord tous les plats existants du type correspondant
- Assurez-vous que votre base de données est accessible
- Les images référencées doivent exister dans le dossier `/public/uploads/foods/`

## 📊 Total

**31 produits** du menu Pizza Le Neuf seront ajoutés à votre base de données, répartis en 6 catégories différentes.
