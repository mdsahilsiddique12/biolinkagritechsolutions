import dotenv from 'dotenv';

dotenv.config();

const splitCsv = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigins: splitCsv(process.env.CLIENT_ORIGIN || 'http://localhost:5173'),
  emailProvider: process.env.EMAIL_PROVIDER || 'gmail',
  emailFromName: process.env.EMAIL_FROM_NAME || 'BioLink Agritech',
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS,
  gmailUser: process.env.GMAIL_USER,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  brevoUser: process.env.BREVO_SMTP_USER,
  brevoKey: process.env.BREVO_SMTP_KEY,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 465),
  smtpSecure: String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true',
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};

export function assertCriticalConfig() {
  const missing = [];

  if (!config.mongoUri) missing.push('MONGO_URI');
  if (!config.jwtSecret) missing.push('JWT_SECRET');

  if (config.emailProvider === 'gmail') {
    if (!config.gmailUser) missing.push('GMAIL_USER');
    if (!config.gmailAppPassword) missing.push('GMAIL_APP_PASSWORD');
  }

  if (config.emailProvider === 'brevo') {
    if (!config.brevoUser) missing.push('BREVO_SMTP_USER');
    if (!config.brevoKey) missing.push('BREVO_SMTP_KEY');
  }

  if (config.emailProvider === 'smtp') {
    if (!config.smtpHost) missing.push('SMTP_HOST');
    if (!config.smtpUser) missing.push('SMTP_USER');
    if (!config.smtpPass) missing.push('SMTP_PASS');
  }

  if (!config.emailFromAddress) {
    missing.push('EMAIL_FROM_ADDRESS');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
