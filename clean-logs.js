const fs = require('fs');
const path = require('path');

// Liste des fichiers à nettoyer
const filesToClean = [
  'src/pages/api/admin/foods/index.ts',
  'src/pages/api/admin/drinks/index.ts',
  'src/pages/api/admin/desserts/index.ts',
  'src/pages/api/admin/sauces/index.ts',
  'src/pages/api/admin/ingredients/index.ts',
  'src/pages/api/admin/sides/index.ts',
  'src/pages/api/admin/foods/[id].ts',
  'src/pages/api/admin/drinks/[id].ts',
  'src/pages/api/admin/sides/[id].ts',
  'src/pages/api/admin/desserts/[id].ts',
  'src/pages/api/upload/index.ts'
];

// Patterns de logs à supprimer
const logPatterns = [
  /console\.log\([^)]*API [^)]*\);/g,
  /console\.log\([^)]*\[API [^\]]*\][^)]*\);/g,
  /console\.log\([^)]*DÉBUT[^)]*\);/g,
  /console\.log\([^)]*FIN[^)]*\);/g,
  /console\.log\([^)]*Headers reçus[^)]*\);/g,
  /console\.log\([^)]*Content-Type[^)]*\);/g,
  /console\.log\([^)]*Parsing du formulaire[^)]*\);/g,
  /console\.log\([^)]*Champs reçus[^)]*\);/g,
  /console\.log\([^)]*Fichiers reçus[^)]*\);/g,
  /console\.log\([^)]*Données parsées[^)]*\);/g,
  /console\.log\([^)]*Traitement de l'image[^)]*\);/g,
  /console\.log\([^)]*Image uploadée[^)]*\);/g,
  /console\.log\([^)]*Données avant validation[^)]*\);/g,
  /console\.log\([^)]*Vérification des champs[^)]*\);/g,
  /console\.log\([^)]*Données validées[^)]*\);/g,
  /console\.log\([^)]*créé avec succès[^)]*\);/g,
  /console\.log\([^)]*mis à jour avec succès[^)]*\);/g,
  /console\.log\([^)]*Méthode reçue[^)]*\);/g,
  /console\.log\([^)]*URL[^)]*\);/g,
  /console\.log\([^)]*Récupération[^)]*\);/g,
  /console\.log\([^)]*Plats récupérés[^)]*\);/g,
  /console\.log\([^)]*Création[^)]*\);/g,
  /console\.log\([^)]*Mise à jour[^)]*\);/g,
  /console\.log\([^)]*Types des champs[^)]*\);/g,
  /console\.log\([^)]*Méthode non autorisée[^)]*\);/g,
  /console\.log\([^)]*Upload API[^)]*\);/g,
  /console\.log\([^)]*Début upload[^)]*\);/g,
  /console\.log\([^)]*Type MIME[^)]*\);/g,
  /console\.log\([^)]*Champs reçus[^)]*\);/g,
  /console\.log\([^)]*Fichiers reçus[^)]*\);/g,
  /console\.log\([^)]*Fichier reçu[^)]*\);/g,
  /console\.log\([^)]*Upload vers[^)]*\);/g,
  /console\.log\([^)]*Upload réussi[^)]*\);/g,
  /console\.log\([^)]*Environnement[^)]*\);/g,
  /console\.log\([^)]*Cloudinary[^)]*\);/g,
  /console\.log\([^)]*Gmail[^)]*\);/g,
  /console\.log\([^)]*local[^)]*\);/g
];

// Fonction pour nettoyer un fichier
function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalLength = content.length;
    
    // Supprimer les patterns de logs
    logPatterns.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    // Supprimer les lignes vides multiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Supprimer les espaces en fin de ligne
    content = content.replace(/[ \t]+$/gm, '');
    
    if (content.length !== originalLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Nettoyé: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  Aucun changement: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return false;
  }
}

// Nettoyer tous les fichiers
console.log('🧹 Nettoyage des logs de debug...\n');

let cleanedCount = 0;
filesToClean.forEach(file => {
  if (fs.existsSync(file)) {
    if (cleanFile(file)) {
      cleanedCount++;
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
  }
});

console.log(`\n✨ Nettoyage terminé! ${cleanedCount} fichiers modifiés.`);
