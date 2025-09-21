import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface GmailConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userEmail: string;
}

interface UploadResult {
  success: boolean;
  imageUrl?: string;
  messageId?: string;
  error?: string;
}

export class GmailStorageService {
  private oauth2Client: OAuth2Client;
  private gmail: any;
  private config: GmailConfig;

  constructor() {
    this.config = {
      clientId: process.env.GMAIL_CLIENT_ID || '',
      clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
      refreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
      userEmail: process.env.GMAIL_USER_EMAIL || ''
    };

    this.oauth2Client = new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      'http://localhost:3000'
    );

    this.oauth2Client.setCredentials({
      refresh_token: this.config.refreshToken
    });

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  /**
   * Upload une image vers Gmail et retourne l'URL d'accès
   */
  async uploadImage(imageBuffer: Buffer, filename: string, category: string = 'foods'): Promise<UploadResult> {
    try {
      console.log(`[GmailStorage] Uploading image: ${filename} (${imageBuffer.length} bytes)`);

      // Créer un email avec l'image en pièce jointe
      const message = await this.createImageEmail(imageBuffer, filename, category);
      
      // Envoyer l'email
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message
        }
      });

      const messageId = response.data.id;
      console.log(`[GmailStorage] Image uploaded successfully. Message ID: ${messageId}`);

      // Générer l'URL d'accès à l'image
      const imageUrl = this.generateImageUrl(messageId, filename);

      return {
        success: true,
        imageUrl,
        messageId
      };

    } catch (error) {
      console.error('[GmailStorage] Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Récupère une image depuis Gmail
   */
  async getImage(messageId: string, filename: string): Promise<Buffer | null> {
    try {
      const message = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const attachments = message.data.payload?.parts?.filter(
        (part: any) => part.filename === filename
      );

      if (!attachments || attachments.length === 0) {
        return null;
      }

      const attachment = attachments[0];
      const attachmentId = attachment.body.attachmentId;

      const attachmentData = await this.gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: attachmentId
      });

      // Décoder la donnée base64
      const data = Buffer.from(attachmentData.data.data, 'base64');
      return data;

    } catch (error) {
      console.error('[GmailStorage] Get image error:', error);
      return null;
    }
  }

  /**
   * Supprime une image (supprime l'email)
   */
  async deleteImage(messageId: string): Promise<boolean> {
    try {
      await this.gmail.users.messages.delete({
        userId: 'me',
        id: messageId
      });

      console.log(`[GmailStorage] Image deleted successfully. Message ID: ${messageId}`);
      return true;

    } catch (error) {
      console.error('[GmailStorage] Delete image error:', error);
      return false;
    }
  }

  /**
   * Crée un email avec l'image en pièce jointe
   */
  private async createImageEmail(imageBuffer: Buffer, filename: string, category: string): Promise<string> {
    const boundary = '----=_Part_' + Math.random().toString(36).substr(2, 9);
    const subject = `[LeNeuf] Image Upload - ${category}/${filename}`;
    
    // Encoder l'image en base64
    const imageBase64 = imageBuffer.toString('base64');
    
    // Créer le contenu de l'email
    const emailContent = [
      `To: ${this.config.userEmail}`,
      `From: ${this.config.userEmail}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      `Image upload for Le Neuf website - ${category}/${filename}`,
      `Uploaded at: ${new Date().toISOString()}`,
      '',
      `--${boundary}`,
      `Content-Type: image/webp; name="${filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${filename}"`,
      '',
      imageBase64,
      '',
      `--${boundary}--`
    ].join('\n');

    // Encoder en base64url
    const encodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return encodedEmail;
  }

  /**
   * Génère l'URL d'accès à l'image
   */
  private generateImageUrl(messageId: string, filename: string): string {
    return `/api/gmail-image/${messageId}/${filename}`;
  }

  /**
   * Vérifie si la configuration Gmail est valide
   */
  async validateConfig(): Promise<boolean> {
    try {
      await this.gmail.users.getProfile({ userId: 'me' });
      return true;
    } catch (error) {
      console.error('[GmailStorage] Config validation failed:', error);
      return false;
    }
  }
}

export const gmailStorage = new GmailStorageService();
