import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporter;

function createTransport() {
  if (config.emailProvider === 'gmail') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
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
  const displayProduct = String(product).replace(/-/g, ' ').toUpperCase();
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f6f5;font-family:Arial,sans-serif;color:#25352d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(7,93,53,0.08);">
          <!-- HEADER -->
          <tr style="background-color:#075d35;">
            <td style="padding:20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="55">
                    <img src="https://biolinkagri.in/logo.png" width="48" height="48" alt="BioLink" style="display:block;border-radius:8px;background-color:#ffffff;border:0;">
                  </td>
                  <td style="padding-left:15px;vertical-align:middle;">
                    <div style="font-size:20px;font-weight:bold;color:#ffffff;line-height:1.2;">BioLink Agritech</div>
                    <div style="font-size:9px;color:#d8f0e1;letter-spacing:1px;margin-top:3px;text-transform:uppercase;">Circular Agricultural Inputs • Institutional B2B</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CONTENT -->
          <tr>
            <td style="padding:40px 35px;">
              <h2 style="font-size:22px;color:#075d35;margin-top:0;margin-bottom:15px;font-weight:bold;">Your Institutional Quote is Ready</h2>
              <p style="font-size:15px;line-height:1.6;color:#333333;margin-bottom:20px;">Dear ${name},</p>
              <p style="font-size:15px;line-height:1.6;color:#333333;margin-bottom:25px;">Thank you for using the BioLink Instant Quote Engine. We have processed your bulk supply inquiry for <strong>${displayProduct}</strong> matching pincode <strong>${pincode}</strong>.</p>
              
              <!-- PRICING SUMMARY -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5faf6;border:1px solid #d1ebd8;border-radius:8px;padding:20px;margin-bottom:25px;">
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;">Product Quantity:</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#25352d;">${volume} Metric Tons (MT)</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;">Price of Manure (Base):</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#25352d;">Rs. ${quote.manureCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:15px;font-size:14px;color:#555555;">Delivery Charges (Freight):</td>
                  <td align="right" style="padding-bottom:15px;font-weight:bold;font-size:14px;color:#25352d;">Rs. ${quote.freightCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr style="border-top:1px solid #d1ebd8;">
                  <td style="padding-top:15px;font-size:14px;font-weight:bold;color:#075d35;">Delivered Price Per Ton:</td>
                  <td align="right" style="padding-top:15px;font-weight:bold;font-size:14px;color:#075d35;">Rs. ${quote.pricePerTon.toLocaleString('en-IN')} / MT</td>
                </tr>
                <tr>
                  <td style="padding-top:10px;font-size:16px;font-weight:bold;color:#075d35;">Total Estimate:</td>
                  <td align="right" style="padding-top:10px;font-weight:bold;font-size:18px;color:#075d35;">Rs. ${quote.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <div style="background-color:#fff7f0;border-left:4px solid #f0a04b;padding:12px 16px;border-radius:0 8px 8px 0;font-size:12px;color:#6e5b4b;line-height:1.5;margin-bottom:25px;">
                <strong>*Please Note:</strong> All values are estimated and subject to change based on actual highway weighbridge clearances and dynamic logistics rates at the time of loading.
              </div>

              <p style="font-size:14px;line-height:1.6;color:#666666;">Our logistics allocation team is cross-referencing live GOBARdhan plant inventory matching your location. We will dispatch an official FTL quote via WhatsApp shortly.</p>
              
              <table width="100%" style="margin-top:30px;">
                <tr>
                  <td>
                    <div style="font-size:14px;color:#333333;">Warm regards,</div>
                    <div style="font-size:15px;font-weight:bold;color:#075d35;margin-top:5px;">Sahil Siddique</div>
                    <div style="font-size:12px;color:#666666;">Founder & MD • BioLink Agri</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr style="background-color:#1e2d24;text-align:center;">
            <td style="padding:20px 30px;font-size:11px;color:#d8f0e1;line-height:1.6;">
              <div>BioLink Agritech • Patna legal jurisdiction • GST Exempt (Micro Bio-Manure Enterprise)</div>
              <div style="margin-top:5px;color:#7d9e8b;">info@biolinkagri.in • +91 8581868466 • Patna, Bihar</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f6f5;font-family:Arial,sans-serif;color:#25352d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(7,93,53,0.08);">
          <!-- HEADER -->
          <tr style="background-color:#075d35;">
            <td style="padding:20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="55">
                    <img src="https://biolinkagri.in/logo.png" width="48" height="48" alt="BioLink" style="display:block;border-radius:8px;background-color:#ffffff;border:0;">
                  </td>
                  <td style="padding-left:15px;vertical-align:middle;">
                    <div style="font-size:20px;font-weight:bold;color:#ffffff;line-height:1.2;">BioLink Agritech</div>
                    <div style="font-size:9px;color:#d8f0e1;letter-spacing:1px;margin-top:3px;text-transform:uppercase;">Circular Agricultural Inputs • Institutional B2B</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CONTENT -->
          <tr>
            <td style="padding:40px 35px;">
              <h2 style="font-size:22px;color:#075d35;margin-top:0;margin-bottom:15px;font-weight:bold;">Order Confirmed — Funds Held in Escrow</h2>
              <p style="font-size:15px;line-height:1.6;color:#333333;margin-bottom:20px;">Dear ${buyerName},</p>
              <p style="font-size:15px;line-height:1.6;color:#333333;margin-bottom:20px;">We have successfully registered your bulk input order. Your payment is safely locked inside our <strong>72-hour escrow account</strong>.</p>
              
              <div style="background-color:#fffdf0;border:1px dashed #e8d08c;padding:15px;border-radius:8px;margin-bottom:25px;font-size:14px;line-height:1.5;color:#6b5a31;">
                <strong>Escrow Protection Protocol:</strong> BioLink holds payment custody securely. Funds will only be released to the supplying plant after you verify moisture content (&lt;30%) and clear dispatch quality checks at your receiving site.
              </div>

              <!-- ORDER DETAILS -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5faf6;border:1px solid #d1ebd8;border-radius:8px;padding:20px;margin-bottom:25px;">
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;font-weight:bold;">Order / Tracking ID:</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#075d35;">${order.trackingId}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;">Consignment Status:</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#e88a1a;">ESCROW_HELD</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;">Source Plant Partner:</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#25352d;">${listing.plantName}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;">Total Quantity:</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#25352d;">${quantityTons} Metric Tons (MT)</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;">Manure Cost:</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#25352d;">Rs. ${order.manureCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:14px;color:#555555;">Est. Freight Cost:</td>
                  <td align="right" style="padding-bottom:10px;font-weight:bold;font-size:14px;color:#25352d;">Rs. ${order.estimatedFreightCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:15px;font-size:14px;color:#555555;border-bottom:1px solid #d1ebd8;">Transaction Fee:</td>
                  <td align="right" style="padding-bottom:15px;font-weight:bold;font-size:14px;color:#25352d;border-bottom:1px solid #d1ebd8;">Rs. ${order.transactionFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding-top:15px;font-size:16px;font-weight:bold;color:#075d35;">Total Amount Paid:</td>
                  <td align="right" style="padding-top:15px;font-weight:bold;font-size:18px;color:#075d35;">Rs. ${order.totalPaid.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <p style="font-size:14px;line-height:1.6;color:#333333;margin-bottom:25px;">You can review the organic batch validation certificate here:<br>
                <a href="${listing.labCertificateUrl}" target="_blank" style="display:inline-block;margin-top:10px;color:#075d35;font-weight:bold;text-decoration:underline;">Download Laboratory Batch Certificate (PDF)</a>
              </p>

              <div style="background-color:#fff7f0;border-left:4px solid #f0a04b;padding:12px 16px;border-radius:0 8px 8px 0;font-size:12px;color:#6e5b4b;line-height:1.5;margin-bottom:25px;">
                <strong>Notice:</strong> Once your consignment is dispatched and crosses state tolls, you will receive a separate automated delivery notification containing the quality inspection release link.
              </div>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr style="background-color:#1e2d24;text-align:center;">
            <td style="padding:20px 30px;font-size:11px;color:#d8f0e1;line-height:1.6;">
              <div>BioLink Agritech • Patna legal jurisdiction • GST Exempt (Micro Bio-Manure Enterprise)</div>
              <div style="margin-top:5px;color:#7d9e8b;">info@biolinkagri.in • +91 8581868466 • Patna, Bihar</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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

