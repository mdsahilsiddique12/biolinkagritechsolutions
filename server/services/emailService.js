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
  if (config.emailProvider === 'console') {
    return {
      sendMail: async (options) => {
        console.log('\n============================================================');
        console.log('📬 [DEVELOPMENT EMAIL LOG]');
        console.log(`From:    ${options.from}`);
        console.log(`To:      ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log('------------------------------------------------------------');
        // Simple HTML to text converter for console readability
        const cleanText = (options.html || '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        console.log(cleanText.slice(0, 300) + (cleanText.length > 300 ? '...' : ''));
        console.log('============================================================\n');
        return { messageId: 'console-stub-id' };
      },
      verify: async () => true,
    };
  }

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
    from: `"${safeHeader(config.emailFromName)}" <${safeHeader(config.emailFromAddress || 'noreply@localhost')}>`,
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
    <h2>Order Confirmed — Funds Held in Escrow</h2>
    <p>Dear ${buyerName}, your order has been confirmed and your payment is securely held in escrow.</p>
    <p><strong>Funds will NOT be released to the supplying plant until you verify the quality of the received consignment.</strong></p>
    <ul>
      <li><strong>Tracking ID:</strong> ${order.trackingId}</li>
      <li><strong>Status:</strong> ESCROW_HELD</li>
      <li><strong>Source Plant:</strong> ${listing.plantName}</li>
      <li><strong>Quantity:</strong> ${quantityTons} Metric Tons</li>
      <li><strong>Manure Cost:</strong> Rs. ${order.manureCost.toLocaleString('en-IN')}</li>
      <li><strong>Freight Cost:</strong> Rs. ${order.estimatedFreightCost.toLocaleString('en-IN')}</li>
      <li><strong>Transaction Fee:</strong> Rs. ${order.transactionFee.toLocaleString('en-IN')}</li>
      <li><strong>Total Paid:</strong> Rs. ${order.totalPaid.toLocaleString('en-IN')}</li>
    </ul>
    <p><a href="${listing.labCertificateUrl}" target="_blank" rel="noreferrer">Download the lab certificate</a></p>
    <hr/>
    <p style="color:#666;font-size:12px;">Once your consignment is delivered, you will receive a separate email with a secure link to confirm quality clearance or raise a dispute.</p>
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
    <hr/>
    <p style="color:#666;font-size:12px;">Payment will be released to you ONLY after the buyer confirms quality clearance (moisture &lt;30%, batch clean).</p>
  `;
}

/**
 * QA Clearance Email — sent to the buyer when the consignment is
 * delivered and status moves to QA_PENDING.
 * Contains a one-time secure link with a cryptographic token.
 */
export function buildQAClearanceEmail({ buyerName, trackingId, quantityTons, settleUrl }) {
  return `
    <h2>Quality Clearance Required</h2>
    <p>Dear ${buyerName},</p>
    <p>Your consignment <strong>${trackingId}</strong> (${quantityTons} MT) has been delivered at your site.</p>
    <p>Please inspect the batch and verify the following before releasing payment:</p>
    <ul>
      <li>Moisture content is below 30%</li>
      <li>Batch is free of contamination and trash</li>
      <li>NPK values match the lab certificate</li>
    </ul>
    <p><strong>If the quality is satisfactory</strong>, click the button below to release funds to the supplying plant:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${settleUrl}" style="display:inline-block;padding:14px 28px;background:#00ff88;color:#1a1a1a;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">
        ✓ Confirm Quality &amp; Release Funds
      </a>
    </p>
    <p><strong>If the quality is NOT satisfactory</strong>, reply to this email with details and we will initiate a dispute and hold your funds in escrow.</p>
    <hr/>
    <p style="color:#c00;font-size:12px;"><strong>Security Notice:</strong> This link contains a unique cryptographic token valid for 7 days. Do NOT share this link with anyone. It authorizes the release of Rs. ${(quantityTons * 2000).toLocaleString('en-IN')}+ from escrow.</p>
  `;
}

/**
 * Settlement Confirmation — sent to both buyer and plant when
 * the order transitions to SETTLED and funds are released.
 */
export function buildSettlementConfirmEmail({ recipientName, trackingId, totalPaid, type }) {
  const context = type === 'buyer'
    ? 'Your payment has been released to the supplying plant. Thank you for your quality verification.'
    : 'The buyer has confirmed quality clearance. Payment has been authorized for release to your account.';

  return `
    <h2>Settlement Complete</h2>
    <p>Dear ${recipientName},</p>
    <p>${context}</p>
    <ul>
      <li><strong>Tracking ID:</strong> ${trackingId}</li>
      <li><strong>Amount:</strong> Rs. ${totalPaid.toLocaleString('en-IN')}</li>
      <li><strong>Status:</strong> SETTLED ✓</li>
    </ul>
    <p>This transaction is now closed. Thank you for using BioLink Agritech.</p>
  `;
}

