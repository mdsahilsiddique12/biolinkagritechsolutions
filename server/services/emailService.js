import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporter;

function createTransport() {
  if (config.emailProvider === 'gmail') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
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
    // Verify in background to prevent blocking serverless function cold starts
    transporter.verify().catch((err) => {
      console.error('❌ Mailer verification failed:', err.message);
    });
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
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Hello Sahil,</p>
      <p>A new customer inquiry has been submitted via the contact form on biolinkagri.in:</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
      <p><strong>Message:</strong></p>
      <p style="background: #f7fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #cbd5e0;">${message}</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 0.85em; color: #718096;">Sent automatically from BioLink Agritech System</p>
    </div>
  `;
}

export function buildContactAutoReply({ name }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to us. We have received your inquiry and our team will get back to you within 24 business hours.</p>
      <p>If you have any urgent queries, feel free to reply directly to this email or reach us on WhatsApp at +91 9006847527.</p>
      <p>Best regards,<br>
      <strong>Sahil Siddique</strong><br>
      Founder & MD, BioLink Agritech Solutions<br>
      <a href="https://biolinkagri.in" style="color: #10b981; text-decoration: none;">biolinkagri.in</a></p>
    </div>
  `;
}

export function buildQuoteEmail({ name, product, volume, pincode, quote }) {
  const displayProduct = String(product).replace(/-/g, ' ').toUpperCase();
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Dear ${name},</p>
      <p>Thank you for using the BioLink Instant Quote Engine. Below is the custom estimate calculated for your bulk request:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f7fafc; border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Product Quantity:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">${volume} Metric Tons (MT)</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Price of Manure (Base):</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">Rs. ${quote.manureCost.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Delivery Charges (Freight):</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">Rs. ${quote.freightCost.toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: #edf2f7;">
          <td style="padding: 12px 15px; font-weight: bold; color: #2d3748;">Delivered Price Per Ton:</td>
          <td style="padding: 12px 15px; font-weight: bold; color: #10b981; text-align: right;">Rs. ${quote.pricePerTon.toLocaleString('en-IN')} / MT</td>
        </tr>
        <tr style="background: #e2e8f0;">
          <td style="padding: 12px 15px; font-weight: bold; color: #2d3748; font-size: 1.1em;">Total Estimate:</td>
          <td style="padding: 12px 15px; font-weight: bold; color: #10b981; text-align: right; font-size: 1.2em;">Rs. ${quote.total.toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <p style="color: #c53030; font-size: 0.9em; font-weight: bold; background: #fff5f5; padding: 12px; border-radius: 6px; border-left: 4px solid #f56565;">
        *Disclaimer: The price is dynamic and is not the final price. All values are estimated and subject to variance based on live weighbridge clearance and dynamic logistics rates at the time of loading.
      </p>

      <p>Our logistics team is currently cross-referencing live inventory matching your destination state. We will reach out on WhatsApp to finalize the formal FTL schedule.</p>
      
      <p>Warm regards,<br>
      <strong>Sahil Siddique</strong><br>
      Founder & MD, BioLink Agritech Solutions<br>
      Patna, Bihar | +91 8581868466</p>
    </div>
  `;
}

export function buildNotifyEmail({ productName }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Hello,</p>
      <p>You have been added to the early access notification list for <strong>${productName}</strong>.</p>
      <p>We will let you know as soon as retail packages are ready for booking in your region.</p>
      <p>Best regards,<br>
      BioLink Agritech Team</p>
    </div>
  `;
}

export function buildBuyerReceipt({ buyerName, listing, quantityTons, order }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Dear ${buyerName},</p>
      <p>Your bulk bio-input order has been registered successfully, and the payment is held in the secure quality escrow account.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f7fafc; border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Order ID:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">${order.trackingId}</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Source Plant:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">${listing.plantName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Quantity:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">${quantityTons} Metric Tons (MT)</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Manure Cost:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">Rs. ${order.manureCost.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #4a5568;">Est. Freight:</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;">Rs. ${order.estimatedFreightCost.toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: #e2e8f0;">
          <td style="padding: 12px 15px; font-weight: bold; color: #2d3748; font-size: 1.1em;">Total Paid:</td>
          <td style="padding: 12px 15px; font-weight: bold; color: #10b981; text-align: right; font-size: 1.2em;">Rs. ${order.totalPaid.toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <p style="color: #c53030; font-size: 0.9em; font-weight: bold; background: #fff5f5; padding: 12px; border-radius: 6px; border-left: 4px solid #f56565;">
        *Disclaimer: The price is dynamic and is not the final price. The final freight rates will be calculated at the weighbridge during physical dispatch.
      </p>

      <p>Review your batch quality compliance lab certificate here:<br>
      <a href="${listing.labCertificateUrl}" style="color: #10b981; font-weight: bold; text-decoration: underline;">View Lab Certificate PDF</a></p>

      <p>Funds will be held securely in escrow and released to the CBG plant only after you inspect the consignment at your site and confirm quality checks (moisture &lt;30%, batch clean).</p>

      <p>Warm regards,<br>
      <strong>Sahil Siddique</strong><br>
      Founder & MD, BioLink Agritech Solutions</p>
    </div>
  `;
}

export function buildPlantNotification({ buyer, listing, quantityTons, order }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Hello Plant Partner,</p>
      <p>A new bulk order has been assigned to your facility for fulfillment:</p>
      <ul>
        <li><strong>Tracking ID:</strong> ${order.trackingId}</li>
        <li><strong>Quantity:</strong> ${quantityTons} Tons</li>
        <li><strong>Buyer:</strong> ${buyer.name}</li>
        <li><strong>Delivery Address:</strong> ${order.deliveryAddress}</li>
      </ul>
      <p>Confirm the batch matches this certificate URL: <a href="${listing.labCertificateUrl}">${listing.labCertificateUrl}</a></p>
      <p>Please note: Escrow funds will be released to your account once the buyer signs off on site quality clearance.</p>
    </div>
  `;
}

export function buildQAClearanceEmail({ buyerName, trackingId, quantityTons, settleUrl }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Dear ${buyerName},</p>
      <p>Your consignment <strong>${trackingId}</strong> (${quantityTons} MT) has arrived at your destination site.</p>
      <p>Please verify that the batch meets FCO standards (moisture &lt;30%, clean mechanical screening, no debris) and click the link below to authorize release of payment from escrow to the plant:</p>
      
      <p style="margin: 25px 0;">
        <a href="${settleUrl}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Confirm Quality &amp; Release Funds
        </a>
      </p>

      <p>If you find any quality discrepancies, do not click the link. Reply directly to this email detailing the issues, and our escrow desk will freeze the funds and start a dispute review.</p>
      
      <p>Best regards,<br>
      BioLink Support Team</p>
    </div>
  `;
}

export function buildSettlementConfirmEmail({ recipientName, trackingId, totalPaid, type }) {
  const context = type === 'buyer'
    ? 'Your payment release authorization has been processed. The supplying plant has been paid.'
    : 'The buyer has confirmed quality clearance at the site. The escrow funds have been released to your account.';

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px;">
      <p>Dear ${recipientName},</p>
      <p>${context}</p>
      <ul>
        <li><strong>Tracking ID:</strong> ${trackingId}</li>
        <li><strong>Amount Settled:</strong> Rs. ${totalPaid.toLocaleString('en-IN')}</li>
        <li><strong>Status:</strong> SETTLED ✓</li>
      </ul>
      <p>Thank you for using the BioLink Agritech platform.</p>
      <p>Warm regards,<br>
      Sahil Siddique</p>
    </div>
  `;
}
