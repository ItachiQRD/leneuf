// scripts/seedAllFoods.js - Script principal pour ajouter tous les plats du menu
const { seedSalads } = require('./seedSalads');
const { seedPlates } = require('./seedPlates');
const { seedPaninis } = require('./seedPaninis');
const { seedTexMex } = require('./seedTexMex');
const { seedFriesAndDrinks } = require('./seedFriesAndDrinks');

async function seedAllFoods() {
  console.log('🚀 Démarrage du seed de tous les plats...\n');

  try {
    // Seed des salades
    console.log('🥗 === SEED DES SALADES ===');
    await seedSalads();
    console.log('');

    // Seed des assiettes
    console.log('🍽️ === SEED DES ASSIETTES ===');
    await seedPlates();
    console.log('');

    // Seed des paninis
    console.log('🥪 === SEED DES PANINIS ===');
    await seedPaninis();
    console.log('');

    // Seed des plats tex-mex
    console.log('🌶️ === SEED DES PLATS TEX-MEX ===');
    await seedTexMex();
    console.log('');

    // Seed des frites et boissons
    console.log('🍟🥤 === SEED DES FRITES ET BOISSONS ===');
    await seedFriesAndDrinks();
    console.log('');

    console.log('✅ Tous les plats ont été ajoutés avec succès !');
    console.log('📊 Résumé:');
    console.log('   - 5 salades (7€ chacune)');
    console.log('   - 3 assiettes (10-12€)');
    console.log('   - 8 paninis (6.50€ + frites + boisson)');
    console.log('   - 8 plats tex-mex');
    console.log('   - 2 frites (3.50€ - 5€)');
    console.log('   - 5 boissons (2€ - 3.50€)');
    console.log('   - Total: 31 produits du menu Pizza Le Neuf');

  } catch (error) {
    console.error('❌ Erreur lors du seed global:', error);
  }
}

// Exécuter le script
if (require.main === module) {
  seedAllFoods();
}

module.exports = { seedAllFoods };
