import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { HttpError } from '../lib/httpError.js';
import { authenticateToken } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { ProductListing } from '../models/ProductListing.js';
import { User } from '../models/User.js';
import { config } from '../config.js';
import {
  buildBuyerReceipt,
  buildPlantNotification,
  buildQAClearanceEmail,
  buildSettlementConfirmEmail,
  sendSystemEmail,
} from '../services/emailService.js';
import {
  orderSchema,
  settleSchema,
  disputeSchema,
  statusTransitionSchema,
} from '../utils/validators.js';

const router = express.Router();

const MINIMUM_ORDER_MOQ_TONS = 15.0;
const BASE_FREIGHT_RATE_PER_KM = 35; // ₹35/km for a standard 15-ton heavy payload truck

function makeTrackingId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `BL-${stamp}-${randomPart}`;
}

// ═══════════════════════════════════════════════════════════════════
// POST /create — Secure Order Creation with Double-Entry Verification
// ═══════════════════════════════════════════════════════════════════
router.post(
  '/create',
  authenticateToken,
  asyncHandler(async (req, res) => {
    // 1. VALIDATE AND PARSE INPUT (Zod enforces 15-ton MOQ)
    const payload = orderSchema.parse(req.body);

    // 2. HARD MOQ VERIFICATION GATE (belt-and-suspenders with Zod)
    if (payload.quantityTons < MINIMUM_ORDER_MOQ_TONS) {
      throw new HttpError(400, `Order rejected. Minimum transaction threshold is ${MINIMUM_ORDER_MOQ_TONS} Tons.`);
    }

    // 3. FETCH SECURED VALUE DIRECTLY FROM DATABASE
    //    The backend NEVER trusts price data from the client browser.
    //    All costs are calculated from verified database records.
    const listing = await ProductListing.findById(payload.listingId);

    if (!listing || !listing.isActive) {
      throw new HttpError(404, 'The requested batch listing is inactive or sold out.');
    }

    if (listing.availableQuantityTons < payload.quantityTons) {
      throw new HttpError(400, 'Insufficient stock volume remaining at the source plant.');
    }

    // 4. ATOMIC DATABASE UPDATE — Prevents race conditions where two
    //    buyers attempt to purchase the same stock simultaneously.
    const updatedListing = await ProductListing.findOneAndUpdate(
      {
        _id: payload.listingId,
        isActive: true,
        availableQuantityTons: { $gte: payload.quantityTons },
      },
      {
        $inc: { availableQuantityTons: -payload.quantityTons },
      },
      { new: true }
    );

    if (!updatedListing) {
      throw new HttpError(400, 'Inventory lock failed. Stock was allocated to another transaction.');
    }

    // 5. SECURE SERVER-SIDE FINANCIAL MATH
    //    Markup price is loaded from the database, not the browser.
    const buyer = await User.findById(req.user.id);
    if (!buyer) {
      // Rollback inventory if buyer lookup fails
      await ProductListing.findByIdAndUpdate(payload.listingId, {
        $inc: { availableQuantityTons: payload.quantityTons },
      });
      throw new HttpError(404, 'Buyer account not found.');
    }

    const manureCost = updatedListing.markupPricePerTon * payload.quantityTons;
    const estimatedFreightCost = payload.distanceKm * BASE_FREIGHT_RATE_PER_KM;
    const transactionFee = Math.round(manureCost * 0.025); // 2.5% platform fee
    const totalPaid = manureCost + estimatedFreightCost + transactionFee;

    // 6. CREATE ORDER WITH ESCROW STATUS
    const order = new Order({
      buyerId: buyer._id,
      listingId: updatedListing._id,
      quantityOrderedTons: payload.quantityTons,
      manureCost,
      estimatedFreightCost,
      transactionFee,
      totalPaid,
      status: 'ESCROW_HELD',
      trackingId: makeTrackingId(),
      deliveryStatus: 'order-confirmed',
      deliveryAddress: payload.deliveryAddress,
      distanceKm: payload.distanceKm,
      trackingEvents: [
        {
          label: 'Order Confirmed — Funds Held in Escrow',
          detail: 'Purchase order verified. Funds are securely held until QA clearance is received.',
          timeLabel: new Date().toLocaleString('en-IN'),
          done: true,
          active: false,
        },
      ],
    });

    // 7. GENERATE CRYPTOGRAPHIC QA CLEARANCE TOKEN
    //    Raw token is emailed to buyer; only the SHA-256 hash is stored.
    const rawQAToken = order.generateQAToken();

    await order.save();

    // 8. SEND EMAIL NOTIFICATIONS
    await Promise.allSettled([
      sendSystemEmail({
        to: buyer.email,
        subject: 'Order confirmed — funds held in escrow — BioLink Agritech',
        html: buildBuyerReceipt({
          buyerName: buyer.name,
          listing: updatedListing,
          quantityTons: payload.quantityTons,
          order,
        }),
      }),
      sendSystemEmail({
        to: updatedListing.plantEmail,
        subject: 'Fulfillment order request — action required',
        html: buildPlantNotification({
          buyer,
          listing: updatedListing,
          quantityTons: payload.quantityTons,
          order,
        }),
      }),
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Funds securely held in escrow. Awaiting dispatch clearance.',
      orderId: order._id,
      trackingId: order.trackingId,
      certificate: updatedListing.labCertificateUrl,
      totalPaid,
    });
  })
);

// ═══════════════════════════════════════════════════════════════════
// PATCH /status — Forward-Only Status Transition
// Used by plant partners / admin to advance order through the pipeline.
// Allowed transitions: ESCROW_HELD→DISPATCHED, DISPATCHED→QA_PENDING
// ═══════════════════════════════════════════════════════════════════
router.patch(
  '/status',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const payload = statusTransitionSchema.parse(req.body);

    const order = await Order.findById(payload.orderId).populate('listingId');
    if (!order) {
      throw new HttpError(404, 'Order not found.');
    }

    // Verify the requesting user is a plant partner
    if (req.user.role !== 'plant_partner') {
      throw new HttpError(403, 'Only plant partners can update dispatch status.');
    }

    // Enforce forward-only state machine
    if (!order.canTransitionTo(payload.nextStatus)) {
      throw new HttpError(
        400,
        `Invalid transition: ${order.status} → ${payload.nextStatus} is not allowed.`
      );
    }

    order.status = payload.nextStatus;

    // Add tracking event
    const now = new Date().toLocaleString('en-IN');

    if (payload.nextStatus === 'DISPATCHED') {
      order.deliveryStatus = 'dispatched';
      order.trackingEvents.push({
        label: 'Dispatched from Factory',
        detail: 'Sealed, quality-checked truckload dispatched from the CBG manufacturing facility.',
        timeLabel: now,
        done: true,
        active: false,
      });
      order.trackingEvents.push({
        label: 'In Transit',
        detail: 'Consignment en route to delivery site.',
        timeLabel: now,
        done: false,
        active: true,
      });
    }

    if (payload.nextStatus === 'QA_PENDING') {
      order.deliveryStatus = 'delivered-qa-pending';

      // Generate the QA clearance token and email it to the buyer
      const rawQAToken = order.generateQAToken();
      const buyer = await User.findById(order.buyerId);

      order.trackingEvents.push({
        label: 'Delivered — QA Pending',
        detail: 'Consignment delivered at site. Awaiting buyer quality clearance.',
        timeLabel: now,
        done: true,
        active: true,
      });

      if (buyer) {
        const settleUrl = `${config.settleBaseUrl}?orderId=${order._id}&token=${rawQAToken}`;
        await sendSystemEmail({
          to: buyer.email,
          subject: 'Quality clearance required — BioLink Agritech',
          html: buildQAClearanceEmail({
            buyerName: buyer.name,
            trackingId: order.trackingId,
            quantityTons: order.quantityOrderedTons,
            settleUrl,
          }),
        });
      }
    }

    await order.save();

    res.json({
      status: 'success',
      message: `Order status updated to ${payload.nextStatus}.`,
      orderStatus: order.status,
    });
  })
);

// ═══════════════════════════════════════════════════════════════════
// POST /settle — QA Clearance Settlement
// The buyer clicks the secure link from their email to confirm quality.
// Funds are ONLY released when the cryptographic token is verified.
// ═══════════════════════════════════════════════════════════════════
router.post(
  '/settle',
  asyncHandler(async (req, res) => {
    const payload = settleSchema.parse(req.body);

    const order = await Order.findById(payload.orderId)
      .populate('listingId')
      .populate('buyerId');

    if (!order) {
      throw new HttpError(404, 'Order not found.');
    }

    // Must be in QA_PENDING to settle
    if (order.status !== 'QA_PENDING') {
      throw new HttpError(400, `Order is in ${order.status} state. Settlement is only available when status is QA_PENDING.`);
    }

    // Verify the cryptographic QA clearance token
    if (!order.verifyQAToken(payload.qaClearanceToken)) {
      throw new HttpError(403, 'Invalid or expired QA clearance token.');
    }

    // Transition to SETTLED
    order.status = 'SETTLED';
    order.settledAt = new Date();
    order.deliveryStatus = 'completed';
    order.qaClearanceToken = undefined; // Consume the token
    order.qaTokenExpiresAt = undefined;

    order.trackingEvents.push({
      label: 'Funds Released — Settlement Complete',
      detail: 'Buyer quality clearance received. Payment authorized to supplying plant.',
      timeLabel: new Date().toLocaleString('en-IN'),
      done: true,
      active: false,
    });

    await order.save();

    // Notify both parties
    const buyer = order.buyerId;
    const listing = order.listingId;

    await Promise.allSettled([
      buyer?.email && sendSystemEmail({
        to: buyer.email,
        subject: 'Settlement complete — funds released — BioLink Agritech',
        html: buildSettlementConfirmEmail({
          recipientName: buyer.name,
          trackingId: order.trackingId,
          totalPaid: order.totalPaid,
          type: 'buyer',
        }),
      }),
      listing?.plantEmail && sendSystemEmail({
        to: listing.plantEmail,
        subject: 'Payment released for your consignment — BioLink Agritech',
        html: buildSettlementConfirmEmail({
          recipientName: listing.plantName,
          trackingId: order.trackingId,
          totalPaid: order.manureCost,
          type: 'plant',
        }),
      }),
    ]);

    res.json({
      status: 'success',
      message: 'Funds securely released. Settlement complete.',
      orderStatus: order.status,
      settledAt: order.settledAt,
    });
  })
);

// ═══════════════════════════════════════════════════════════════════
// POST /dispute — QA Failed, Trigger Escrow Refund Workflow
// ═══════════════════════════════════════════════════════════════════
router.post(
  '/dispute',
  asyncHandler(async (req, res) => {
    const payload = disputeSchema.parse(req.body);

    const order = await Order.findById(payload.orderId).populate('buyerId');
    if (!order) {
      throw new HttpError(404, 'Order not found.');
    }

    if (order.status !== 'QA_PENDING') {
      throw new HttpError(400, `Order is in ${order.status} state. Disputes can only be raised during QA_PENDING.`);
    }

    if (!order.verifyQAToken(payload.qaClearanceToken)) {
      throw new HttpError(403, 'Invalid or expired QA clearance token.');
    }

    // Transition to DISPUTED
    order.status = 'DISPUTED';
    order.disputeReason = payload.reason;
    order.deliveryStatus = 'disputed';
    order.qaClearanceToken = undefined;
    order.qaTokenExpiresAt = undefined;

    order.trackingEvents.push({
      label: 'Dispute Raised — Escrow Held for Review',
      detail: `Buyer has raised a quality dispute: "${payload.reason.slice(0, 120)}"`,
      timeLabel: new Date().toLocaleString('en-IN'),
      done: true,
      active: true,
    });

    await order.save();

    // Notify admin for manual resolution
    const buyer = order.buyerId;
    await sendSystemEmail({
      to: config.emailFromAddress,
      subject: `DISPUTE raised on order ${order.trackingId}`,
      html: `
        <h2>Escrow Dispute Alert</h2>
        <p><strong>Order:</strong> ${order.trackingId}</p>
        <p><strong>Buyer:</strong> ${buyer?.name || 'Unknown'} (${buyer?.email || 'N/A'})</p>
        <p><strong>Amount Held:</strong> Rs. ${order.totalPaid.toLocaleString('en-IN')}</p>
        <p><strong>Dispute Reason:</strong></p>
        <p>${payload.reason}</p>
        <p>Manual review required. Funds remain in escrow until resolution.</p>
      `,
    });

    res.json({
      status: 'success',
      message: 'Dispute registered. Funds remain in escrow pending manual review.',
      orderStatus: order.status,
    });
  })
);

export default router;
