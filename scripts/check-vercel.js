#!/usr/bin/env node

/**
 * Script de vérification avant déploiement Vercel
 * Vérifie que tout est prêt pour le déploiement
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification Vercel - Fast Food App');
console.log('======================================');

// Vérifier les fichiers de configuration
const configFiles = [
  'vercel.json',
  'next.config.js',
  'package.json',
  '.vercelignore'
];

console.log('📁 Vérification des fichiers de configuration...');
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// Vérifier la structure des dossiers
const requiredDirs = [
  'src/pages/api',
  'public',
  'src/components',
  'src/contexts'
];

console.log('\n📂 Vérification de la structure...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ manquant`);
  }
});

// Vérifier les dépendances critiques
console.log('\n📦 Vérification des dépendances...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const criticalDeps = ['next', 'react', 'mongoose', 'formidable', 'sharp'];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} manquant`);
  }
});

// Vérifier la configuration Next.js
console.log('\n⚙️ Vérification de la configuration Next.js...');
const nextConfig = require('../next.config.js');
if (nextConfig.output === 'standalone') {
  console.log('✅ Configuration standalone activée');
} else {
  console.log('⚠️ Configuration standalone non activée (recommandé pour Vercel)');
}

// Vérifier les scripts
console.log('\n🔧 Vérification des scripts...');
const scripts = packageJson.scripts;
if (scripts['vercel-build']) {
  console.log('✅ Script vercel-build défini');
} else {
  console.log('❌ Script vercel-build manquant');
}

if (scripts['deploy']) {
  console.log('✅ Script deploy défini');
} else {
  console.log('❌ Script deploy manquant');
}

console.log('\n🎯 Résumé:');
console.log('- Vérifiez que MONGODB_URI est configuré');
console.log('- Vérifiez que JWT_SECRET est configuré');
console.log('- Testez le build local: npm run build');
console.log('- Déployez avec: npm run deploy');

console.log('\n✨ Vérification terminée !');
