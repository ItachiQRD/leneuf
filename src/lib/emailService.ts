// src/lib/emailService.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  // Notez que nous utilisons maintenant /auth/verify-email au lieu de /api/auth/verify-email
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Vérification de votre compte FastFood',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Bienvenue sur FastFood !</h2>
        <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Vérifier mon email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 24 heures.</p>
        <p style="color: #666; font-size: 14px;">Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};