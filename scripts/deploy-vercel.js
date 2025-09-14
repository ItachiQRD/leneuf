#!/usr/bin/env node

/**
 * Script de déploiement Vercel
 * Utilise l'API Vercel pour déployer automatiquement
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement Vercel - Fast Food App');
console.log('=====================================');

// Vérifier que Vercel CLI est installé
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI détecté');
} catch (error) {
  console.error('❌ Vercel CLI non trouvé. Installez-le avec: npm i -g vercel');
  process.exit(1);
}

// Vérifier les variables d'environnement
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingVars.join(', '));
  console.log('💡 Créez un fichier .env.local avec ces variables ou configurez-les dans Vercel');
  process.exit(1);
}

console.log('✅ Variables d\'environnement vérifiées');

// Vérifier que le build fonctionne
console.log('🔨 Test du build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build réussi');
} catch (error) {
  console.error('❌ Erreur lors du build');
  process.exit(1);
}

// Déployer sur Vercel
console.log('🚀 Déploiement sur Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Déploiement réussi !');
} catch (error) {
  console.error('❌ Erreur lors du déploiement');
  process.exit(1);
}

console.log('🎉 Déploiement terminé !');
console.log('📊 Vérifiez votre application sur https://vercel.com/dashboard');
