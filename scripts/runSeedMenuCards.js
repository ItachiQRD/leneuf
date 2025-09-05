const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Lancement du seed des cartes de menu...');

// Exécuter le script de seed existant
exec('npx ts-node scripts/seed.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erreur lors de l\'exécution du seed:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Avertissements:', stderr);
  }
  
  console.log('✅ Seed terminé avec succès !');
  console.log(stdout);
});
