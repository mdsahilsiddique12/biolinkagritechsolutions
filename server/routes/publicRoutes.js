import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { config } from '../config.js';
import { Inquiry } from '../models/Inquiry.js';
import { Order } from '../models/Order.js';
import { ProductListing } from '../models/ProductListing.js';
import { ReferralCode } from '../models/ReferralCode.js';
import {
  buildContactAutoReply,
  buildContactEmail,
  buildNotifyEmail,
  buildQuoteEmail,
  sendSystemEmail,
} from '../services/emailService.js';
import { calculateQuote } from '../utils/quoteEngine.js';
import { getDemoTrackingRecord } from '../utils/trackingDemo.js';
import {
  contactSchema,
  quoteCalculationSchema,
  quoteClaimSchema,
  retailNotifySchema,
  trackingSchema,
} from '../utils/validators.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get(
  '/listings',
  asyncHandler(async (_req, res) => {
    const listings = await ProductListing.find({
      isActive: true,
      availableQuantityTons: { $gt: 0 },
    }).sort({ updatedAt: -1 });

    res.json(listings);
  })
);

router.post(
  '/contact',
  asyncHandler(async (req, res) => {
    const payload = contactSchema.parse(req.body);

    await Inquiry.create({
      kind: 'contact',
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      enquiryType: payload.enquiryType,
      message: payload.message,
    });

    await Promise.all([
      sendSystemEmail({
        to: 'info@biolinkagri.in',
        subject: `New contact enquiry: ${payload.enquiryType}`,
        html: buildContactEmail(payload),
        replyTo: payload.email,
      }),
      sendSystemEmail({
        to: payload.email,
        subject: 'We received your BioLink enquiry',
        html: buildContactAutoReply(payload),
      }),
    ]);

    res.status(201).json({ message: 'Your message has been sent.' });
  })
);

router.post(
  '/contact/submit',
  asyncHandler(async (req, res) => {
    const { clientName, clientEmail, subject, targetTonnage, description, companyTitle } = req.body;

    if (!clientName || !clientEmail || !subject || !description) {
      return res.status(400).json({ error: "Missing required contact fields: clientName, clientEmail, subject, description" });
    }

    await Inquiry.create({
      kind: 'contact',
      name: clientName,
      email: clientEmail,
      enquiryType: subject,
      volume: targetTonnage ? Number(targetTonnage) : undefined,
      message: description,
      metadata: {
        companyTitle: companyTitle || '',
      }
    });

    const alertHtmlContent = `
        <h2>New Institutional Inquiry Routed via biolinkagri.in</h2>
        <p><b>Prospect Identity:</b> ${clientName} (${clientEmail})</p>
        <p><b>Company/Estate Title:</b> ${companyTitle || 'N/A'}</p>
        <p><b>Target Volumetric Scale:</b> ${targetTonnage || 'N/A'} Metric Tonnes</p>
        <p><b>Context Category:</b> ${subject}</p>
        <p><b>Message Content:</b> ${description}</p>
    `;

    const clientReceiptHtml = `
        <h3>Hello ${clientName},</h3>
        <p>Thank you for reaching out to the <b>BioLink Agri</b> procurement desk.</p>
        <p>Your institutional bulk query regarding <b>"${subject}"</b> has been logged securely into our regional routing queue. Our supply chain allocation team will cross-reference live GOBARdhan plant inventory datasets matching your target location and dispatch an all-inclusive 15-tonne FTL quote via WhatsApp within 24 hours.</p>
        <p>Regards,</p>
        <p><b>BioLink Agri Support Desk</b><br/>Patna, Bihar, India<br/>🌐 biolinkagri.in</p>
    `;

    await Promise.allSettled([
      sendSystemEmail({
        to: 'info@biolinkagri.in',
        subject: `🚨 [MARKETPLACE INQUIRY]: ${subject}`,
        html: alertHtmlContent,
        replyTo: clientEmail,
      }),
      sendSystemEmail({
        to: clientEmail,
        subject: "We have received your bulk agri-input request - BioLink Agri",
        html: clientReceiptHtml,
      }),
    ]);

    res.status(200).json({ status: "Success", message: "Inquiry processed. Verification receipts dispatched automatically." });
  })
);

router.post(
  '/quotes/calculate',
  asyncHandler(async (req, res) => {
    const payload = quoteCalculationSchema.parse(req.body);
    const quote = calculateQuote(payload);

    // ── Referral discount calculation (server-side only) ──
    let referralInfo = null;
    if (payload.referralCode) {
      const code = payload.referralCode.trim().toUpperCase().replace(/\s+/g, '');
      const refCode = await ReferralCode.findOne({ code, active: true })
        .populate('partnerId', 'name company status')
        .lean();

      const tons = Number(payload.volume);

      if (refCode && refCode.partnerId && refCode.partnerId.status === 'active') {
        let discountAmount = 0;
        if (refCode.discountType === 'fixed_per_mt') {
          discountAmount = Math.round(refCode.discountValue * tons);
        } else if (refCode.discountType === 'percentage_of_net') {
          discountAmount = Math.round(quote.total * (refCode.discountValue / 100));
        } else if (refCode.discountType === 'flat') {
          discountAmount = Math.round(refCode.discountValue);
        }

        referralInfo = {
          code: refCode.code,
          partnerName: refCode.partnerId.name,
          company: refCode.partnerId.company || '',
          discountType: refCode.discountType,
          discountValue: refCode.discountValue,
          discountAmount,
          finalTotal: Math.max(0, quote.total - discountAmount),
        };
      } else if (code === 'KJ01' || code === 'KRISHAKJAN' || code === 'GROWIN01' || code === 'GROWINAGRI') {
        const discountAmount = Math.round(100 * tons);
        referralInfo = {
          code: 'KJ01',
          partnerName: 'KrishakJan',
          company: 'KrishakJan Solutions',
          discountType: 'fixed_per_mt',
          discountValue: 100,
          discountAmount,
          finalTotal: Math.max(0, quote.total - discountAmount),
        };
      }
    }

    res.status(201).json({
      quote,
      referral: referralInfo,
      summary: {
        product: payload.product,
        volume: payload.volume,
        pincode: payload.pincode,
      },
    });
  })
);

import { recordLiveBooking } from './partnerRoutes.js';
import { processReferralAttribution } from '../services/referralService.js';

router.post(
  '/quotes/:quoteId/claim',
  asyncHandler(async (req, res) => {
    const payload = quoteClaimSchema.parse(req.body);
    const quoteId = req.params.quoteId;
    const draft = {
      product: payload.product,
      volume: payload.volume,
      pincode: payload.pincode,
      quote: calculateQuote(payload),
    };

    // Record referral attribution live in partner ledger & MongoDB tables
    const refCodeStr = payload.referralCode || 'KJ01';
    
    recordLiveBooking({
      farmerName: payload.name,
      farmerEmail: payload.email,
      farmerMobile: payload.whatsapp,
      referralCode: refCodeStr,
      volume: payload.volume,
      grossAmount: draft.quote.total,
      discountAmount: Number(payload.volume || 15) * 100,
    });

    await processReferralAttribution({
      farmerName: payload.name,
      farmerEmail: payload.email,
      farmerMobile: payload.whatsapp,
      referralCode: refCodeStr,
      volume: payload.volume,
      grossAmount: draft.quote.total,
    });

    await Inquiry.create({
      kind: 'quote_request',
      name: payload.name,
      email: payload.email,
      whatsapp: payload.whatsapp,
      product: draft.product,
      volume: draft.volume,
      pincode: draft.pincode,
      quoteId,
      quoteAmount: draft.quote.total,
      metadata: {
        company: payload.company || '',
        quote: draft.quote,
        referralCode: payload.referralCode || 'KJ01',
      },
    });

    await Promise.allSettled([
      sendSystemEmail({
        to: payload.email,
        subject: 'Your BioLink institutional quote',
        html: buildQuoteEmail({
          name: payload.name,
          product: draft.product,
          volume: draft.volume,
          pincode: draft.pincode,
          quote: draft.quote,
        }),
      }),
      sendSystemEmail({
        to: 'info@biolinkagri.in',
        subject: `New quote lead: ${draft.product} / ${draft.volume} MT`,
        html: `
          <h2>New Quote Lead</h2>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>WhatsApp:</strong> ${payload.whatsapp}</p>
          <p><strong>Product:</strong> ${draft.product}</p>
          <p><strong>Volume:</strong> ${draft.volume} MT</p>
          <p><strong>Pincode:</strong> ${draft.pincode}</p>
          <p><strong>Total Quote:</strong> Rs. ${draft.quote.total.toLocaleString('en-IN')}</p>
        `,
        replyTo: payload.email,
      }),
    ]);

    res.status(201).json({ message: 'Quotation sent successfully.', quote: draft.quote });
  })
);

router.post(
  '/retail/notify',
  asyncHandler(async (req, res) => {
    const payload = retailNotifySchema.parse(req.body);

    await Inquiry.create({
      kind: 'launch_notify',
      email: payload.email,
      productName: payload.productName,
      metadata: {
        productId: payload.productId,
      },
    });

    await Promise.allSettled([
      sendSystemEmail({
        to: payload.email,
        subject: `Retail launch alert confirmed for ${payload.productName}`,
        html: buildNotifyEmail(payload),
      }),
      sendSystemEmail({
        to: config.emailFromAddress,
        subject: `Retail notify signup: ${payload.productName}`,
        html: `
          <h2>Retail Launch Signup</h2>
          <p><strong>Product:</strong> ${payload.productName}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
        `,
        replyTo: payload.email,
      }),
    ]);

    res.status(201).json({ message: 'You are on the launch notification list.' });
  })
);

router.get(
  '/tracking/:trackingId',
  asyncHandler(async (req, res) => {
    const { trackingId } = trackingSchema.parse(req.params);
    const demoRecord = getDemoTrackingRecord(trackingId);

    if (demoRecord) {
      res.json(demoRecord);
      return;
    }

    const order = await Order.findOne({ trackingId }).populate('listingId');
    if (!order) {
      res.status(404).json({ message: 'Tracking ID not found.' });
      return;
    }

    const listing = order.listingId;
    res.json({
      trackingId: order.trackingId,
      product: listing?.productType || 'Bio-manure consignment',
      volume: `${order.quantityOrderedTons} Metric Tons`,
      origin: listing ? `${listing.plantName}, ${listing.dispatchState}` : 'Plant source unavailable',
      destination: order.deliveryAddress,
      status: order.deliveryStatus,
      steps: order.trackingEvents.map((event) => ({
        label: event.label,
        detail: event.detail,
        time: event.timeLabel,
        done: event.done,
        active: event.active,
      })),
    });
  })
);

export default router;
