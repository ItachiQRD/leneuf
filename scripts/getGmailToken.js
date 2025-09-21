// scripts/getGmailToken.js
const { google } = require('googleapis');
const readline = require('readline');

// ⚠️ IMPORTANT: Remplacez par vos vraies valeurs avant d'exécuter le script
// Obtenez ces valeurs depuis Google Cloud Console > APIs & Services > Credentials
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'http://localhost:3000'
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('🔗 Autorisez cette application en visitant cette URL:');
console.log(authUrl);
console.log('\n📋 Copiez le code d\'autorisation depuis l\'URL de redirection');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n🔑 Entrez le code d\'autorisation: ', (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('❌ Erreur:', err);
      rl.close();
      return;
    }
    
    console.log('\n✅ Configuration Gmail réussie !');
    console.log('\n📧 Ajoutez ces variables à votre .env.local :');
    console.log(`GMAIL_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GMAIL_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GMAIL_REFRESH_TOKEN=${token.refresh_token}`);
    console.log(`GMAIL_USER_EMAIL=votre_email@gmail.com`);
    
    rl.close();
  });
});
