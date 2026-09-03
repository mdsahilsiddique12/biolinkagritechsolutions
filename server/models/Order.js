import crypto from 'node:crypto';
import mongoose from 'mongoose';

/**
 * Valid status transitions (forward-only state machine):
 *   ESCROW_HELD → DISPATCHED → QA_PENDING → SETTLED
 *                                         → DISPUTED
 */
export const ORDER_STATUSES = [
  'ESCROW_HELD',
  'DISPATCHED',
  'QA_PENDING',
  'SETTLED',
  'DISPUTED',
];

const VALID_TRANSITIONS = {
  ESCROW_HELD: ['DISPATCHED'],
  DISPATCHED: ['QA_PENDING'],
  QA_PENDING: ['SETTLED', 'DISPUTED'],
  SETTLED: [],
  DISPUTED: [],
};

const TrackingEventSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    detail: { type: String, required: true, trim: true, maxlength: 500 },
    timeLabel: { type: String, required: true, trim: true, maxlength: 120 },
    done: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductListing', required: true },
    quantityOrderedTons: { type: Number, required: true, min: 15 },
    manureCost: { type: Number, required: true, min: 0 },
    estimatedFreightCost: { type: Number, required: true, min: 0 },
    transactionFee: { type: Number, required: true, min: 0 },
    totalPaid: { type: Number, required: true, min: 0 },

    // Escrow state machine
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'ESCROW_HELD',
      required: true,
    },

    // QA clearance – cryptographic token emailed to the buyer
    qaClearanceToken: { type: String, index: true },
    qaTokenExpiresAt: { type: Date },

    // Settlement tracking
    settledAt: { type: Date },
    disputeReason: { type: String, trim: true, maxlength: 2000 },

    // Logistics
    trackingId: { type: String, unique: true, required: true },
    deliveryStatus: { type: String, default: 'order-confirmed', trim: true },
    deliveryAddress: { type: String, trim: true, maxlength: 280 },
    distanceKm: { type: Number, required: true, min: 0 },
    trackingEvents: { type: [TrackingEventSchema], default: [] },

    // ── Referral Attribution Snapshot (frozen at order creation) ──
    referralId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral' },
    referralCode: { type: String, trim: true, maxlength: 30 },
    referralPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    referralDiscount: { type: Number, default: 0, min: 0 },
    commissionRuleSnapshot: { type: String, trim: true, maxlength: 120 },
  },
  { timestamps: true }
);

/**
 * Validate that a status transition is allowed by the state machine.
 * Returns true if valid, throws an Error if not.
 */
OrderSchema.methods.canTransitionTo = function canTransitionTo(nextStatus) {
  const allowed = VALID_TRANSITIONS[this.status] || [];
  return allowed.includes(nextStatus);
};

/**
 * Generate a cryptographically secure QA clearance token.
 * Sets a 7-day expiry window.
 */
OrderSchema.methods.generateQAToken = function generateQAToken() {
  const token = crypto.randomBytes(32).toString('hex');
  this.qaClearanceToken = crypto.createHash('sha256').update(token).digest('hex');
  this.qaTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return token; // Return the raw token (email this to buyer, store only the hash)
};

/**
 * Verify a raw QA clearance token against the stored hash.
 */
OrderSchema.methods.verifyQAToken = function verifyQAToken(rawToken) {
  if (!this.qaClearanceToken || !this.qaTokenExpiresAt) return false;
  if (new Date() > this.qaTokenExpiresAt) return false;
  const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return hash === this.qaClearanceToken;
};

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
