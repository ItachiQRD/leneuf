import seedMenuData from './seedMenu';

// Exécuter le script de seed
seedMenuData()
  .then(() => {
    console.log('✅ Script de seed terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur lors de l\'exécution du script de seed :', error);
    process.exit(1);
  });