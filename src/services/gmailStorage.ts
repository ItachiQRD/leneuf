// @ts-ignore
import { google } from 'googleapis';
// @ts-ignore
import { OAuth2Client } from 'google-auth-library';

class GmailStorageService {
  private oauth2Client: OAuth2Client | null = null;
  private gmail: any = null;

  constructor() {
    this.initializeGmail();
  }

  private initializeGmail() {
    try {
      // Vérifier que toutes les variables d'environnement sont présentes
      if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
        throw new Error('Variables d\'environnement Gmail manquantes. Vérifiez votre fichier .env.local');
      }

      this.oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        'http://localhost:3000'
      );

      this.oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      });

      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      console.log('✅ Gmail Storage initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation Gmail:', error);
      throw error;
    }
  }

  /**
   * Upload une image vers Gmail
   */
  async uploadImage(imageBuffer: Buffer, filename: string, mimeType: string): Promise<string> {
    try {
      if (!this.gmail) {
        throw new Error('Gmail non initialisé');
      }

      // Créer un email avec l'image en pièce jointe
      const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
      const emailContent = this.createEmailWithAttachment(imageBuffer, filename, mimeType, boundary);

      const message = {
        raw: Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
      };

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: message,
      });

      console.log('Image uploadée vers Gmail:', response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Erreur upload Gmail:', error);
      throw error;
    }
  }

  /**
   * Récupérer une image depuis Gmail
   */
  async getImage(messageId: string, filename: string): Promise<Buffer> {
    try {
      if (!this.gmail) {
        throw new Error('Gmail non initialisé');
      }

      const message = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      const attachments = message.data.payload.parts?.find((part: any) => 
        part.filename === filename
      );

      if (!attachments) {
        throw new Error('Image non trouvée');
      }

      const attachment = await this.gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: attachments.body.attachmentId,
      });

      return Buffer.from(attachment.data.data, 'base64');
    } catch (error) {
      console.error('Erreur récupération Gmail:', error);
      throw error;
    }
  }

  /**
   * Supprimer une image de Gmail
   */
  async deleteImage(messageId: string): Promise<void> {
    try {
      if (!this.gmail) {
        throw new Error('Gmail non initialisé');
      }

      await this.gmail.users.messages.delete({
        userId: 'me',
        id: messageId,
      });

      console.log('Image supprimée de Gmail:', messageId);
    } catch (error) {
      console.error('Erreur suppression Gmail:', error);
      throw error;
    }
  }

  /**
   * Créer un email avec pièce jointe
   */
  private createEmailWithAttachment(
    imageBuffer: Buffer, 
    filename: string, 
    mimeType: string, 
    boundary: string
  ): string {
    const to = process.env.GMAIL_USER_EMAIL || 'leneuf.site@gmail.com';
    const subject = `Image Upload - ${filename}`;
    
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      'Image uploadée automatiquement par Le Neuf',
      '',
      `--${boundary}`,
      `Content-Type: ${mimeType}`,
      'Content-Disposition: attachment; filename="' + filename + '"',
      'Content-Transfer-Encoding: base64',
      '',
      imageBuffer.toString('base64'),
      '',
      `--${boundary}--`
    ];

    return emailLines.join('\r\n');
  }

  /**
   * Générer une URL pour accéder à l'image
   */
  generateImageUrl(messageId: string, filename: string): string {
    return `/api/gmail-image/${messageId}/${filename}`;
  }
}

export const gmailStorage = new GmailStorageService();
