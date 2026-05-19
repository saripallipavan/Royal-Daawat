import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, '..', 'email_logs.txt');

// Create transporter if SMTP settings are configured in .env
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass }
    });
  }
  return null;
};

// Write emails to local text log for development/auditing
const logEmailLocally = (to, subject, text) => {
  const timestamp = new Date().toISOString();
  const logMessage = `
========================================
[EMAIL SENT AT: ${timestamp}]
TO: ${to}
SUBJECT: ${subject}
BODY:
${text}
========================================
\n`;
  try {
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
  } catch (err) {
    console.error('Failed to log email locally:', err);
  }
};

export const sendEmail = async ({ to, subject, text }) => {
  console.log(`Sending email to ${to} with subject "${subject}"...`);
  
  // Always log locally first
  logEmailLocally(to, subject, text);

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[SMTP Not Configured] Simulated email logged to email_logs.txt`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Royal Daawat'}" <${process.env.SMTP_FROM_EMAIL || 'no-reply@royaldaawat.com'}>`,
      to,
      subject,
      text
    });
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email via SMTP:', error);
    // Return success: true anyway since we logged it locally and don't want to crash checkout/bookings
    return { success: true, error: error.message };
  }
};
