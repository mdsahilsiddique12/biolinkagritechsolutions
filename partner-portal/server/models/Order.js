import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantityOrderedTons: { type: Number, required: true, min: 15 },
    manureCost: { type: Number, required: true, min: 0 },
    estimatedFreightCost: { type: Number, required: true, min: 0 },
    transactionFee: { type: Number, required: true, min: 0 },
    totalPaid: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      default: 'ESCROW_HELD',
      required: true,
    },
    trackingId: { type: String, unique: true, required: true },
    deliveryStatus: { type: String, default: 'order-confirmed', trim: true },

    referralId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral' },
    referralCode: { type: String, trim: true, maxlength: 30 },
    referralPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    referralDiscount: { type: Number, default: 0, min: 0 },
    commissionRuleSnapshot: { type: String, trim: true, maxlength: 120 },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
