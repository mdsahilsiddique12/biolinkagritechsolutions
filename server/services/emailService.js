import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporter;

function createTransport() {
  if (config.emailProvider === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 3,
      auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword,
      },
    });
  }

  if (config.emailProvider === 'brevo') {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 5,
      auth: {
        user: config.brevoUser,
        pass: config.brevoKey,
      },
    });
  }

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    pool: true,
    maxConnections: 5,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });
}

export async function getMailer() {
  if (!transporter) {
    transporter = createTransport();
    await transporter.verify();
  }

  return transporter;
}

function safeHeader(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

export async function sendSystemEmail({ to, subject, html, replyTo }) {
  const mailer = await getMailer();

  await mailer.sendMail({
    from: `"${safeHeader(config.emailFromName)}" <${safeHeader(config.emailFromAddress)}>`,
    to: safeHeader(to),
    subject: safeHeader(subject),
    html,
    ...(replyTo ? { replyTo: safeHeader(replyTo) } : {}),
  });
}

export function buildContactEmail({ name, email, phone, enquiryType, message }) {
  return `
    <h2>New Contact Enquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;
}

export function buildContactAutoReply({ name }) {
  return `
    <h2>Thanks for reaching out, ${name}.</h2>
    <p>We have received your enquiry and our team will respond within 24 business hours.</p>
    <p>BioLink Agritech keeps all submissions private and uses them only to respond to your request.</p>
  `;
}

export function buildQuoteEmail({ name, product, volume, pincode, quote }) {
  return `
    <h2>Your Institutional Quote Is Ready</h2>
    <p>Hello ${name}, here is your requested quote summary.</p>
    <ul>
      <li><strong>Product:</strong> ${product}</li>
      <li><strong>Volume:</strong> ${volume} Metric Tons</li>
      <li><strong>Pincode:</strong> ${pincode}</li>
      <li><strong>Manure Cost:</strong> Rs. ${quote.manureCost.toLocaleString('en-IN')}</li>
      <li><strong>Freight Cost:</strong> Rs. ${quote.freightCost.toLocaleString('en-IN')}</li>
      <li><strong>Handling Fee:</strong> Rs. ${quote.handlingFee.toLocaleString('en-IN')}</li>
      <li><strong>Total:</strong> Rs. ${quote.total.toLocaleString('en-IN')}</li>
    </ul>
    <p>Our institutional team will follow up on WhatsApp shortly.</p>
  `;
}

export function buildNotifyEmail({ productName }) {
  return `
    <h2>Retail Launch Alert Confirmed</h2>
    <p>You are on the early access list for <strong>${productName}</strong>.</p>
    <p>We will notify you as soon as this retail product goes live.</p>
  `;
}

export function buildBuyerReceipt({ buyerName, listing, quantityTons, order }) {
  return `
    <h2>Order Placed Successfully</h2>
    <p>Dear ${buyerName}, your order has been confirmed.</p>
    <ul>
      <li><strong>Tracking ID:</strong> ${order.trackingId}</li>
      <li><strong>Source Plant:</strong> ${listing.plantName}</li>
      <li><strong>Quantity:</strong> ${quantityTons} Metric Tons</li>
      <li><strong>Transaction Fee:</strong> Rs. ${order.transactionFee.toLocaleString('en-IN')}</li>
      <li><strong>Total Paid:</strong> Rs. ${order.totalPaid.toLocaleString('en-IN')}</li>
    </ul>
    <p><a href="${listing.labCertificateUrl}" target="_blank" rel="noreferrer">Download the lab certificate</a></p>
  `;
}

export function buildPlantNotification({ buyer, listing, quantityTons, order }) {
  return `
    <h2>Fulfillment Alert</h2>
    <p>A new order has been assigned to ${listing.plantName}.</p>
    <ul>
      <li><strong>Tracking ID:</strong> ${order.trackingId}</li>
      <li><strong>Pickup Quantity:</strong> ${quantityTons} Tons</li>
      <li><strong>Buyer:</strong> ${buyer.name}</li>
      <li><strong>Phone:</strong> ${buyer.phone || 'N/A'}</li>
      <li><strong>Delivery Address:</strong> ${order.deliveryAddress}</li>
    </ul>
    <p>Ensure the dispatched batch matches this certificate URL: ${listing.labCertificateUrl}</p>
  `;
}
