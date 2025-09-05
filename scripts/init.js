// scripts/init.js
const { spawn, exec } = require('child_process');
const { platform } = require('os');

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { 
      stdio: 'inherit',
      shell: true 
    });

    process.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

async function checkMongoDB() {
  return new Promise((resolve) => {
    const command = platform() === 'win32' ? 
      'mongod --version' : 
      'pgrep mongod';

    exec(command, (error) => {
      resolve(!error);
    });
  });
}

async function startMongoDB() {
  const isWindows = platform() === 'win32';
  
  if (isWindows) {
    try {
      await runCommand('net start MongoDB');
      console.log('✅ MongoDB service démarré');
    } catch (error) {
      console.log('⚠️ MongoDB service déjà démarré ou erreur de démarrage');
    }
  } else {
    try {
      const command = platform() === 'darwin' ? 
        'brew services start mongodb-community' : 
        'sudo systemctl start mongod';
      
      await runCommand(command);
      console.log('✅ MongoDB service démarré');
    } catch (error) {
      console.log('⚠️ MongoDB service déjà démarré ou erreur de démarrage');
    }
  }
}

async function initializeProject() {
  try {
    // Vérifier et démarrer MongoDB
    console.log('🔍 Vérification de MongoDB...');
    const isMongoRunning = await checkMongoDB();
    
    if (!isMongoRunning) {
      console.log('🚀 Démarrage de MongoDB...');
      await startMongoDB();
      // Attendre que MongoDB soit prêt
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Initialiser la base de données
    console.log('🌱 Initialisation de la base de données...');
    await runCommand('npx ts-node scripts/seed.ts');

    // Démarrer le serveur Next.js
    console.log('🚀 Démarrage du serveur Next.js...');
    await runCommand('npm run dev');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Lancer l'initialisation
initializeProject();