import mongoose from 'mongoose';

const CommissionLedgerSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
      index: true,
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    orderNumber: { type: String, trim: true, maxlength: 40 },
    quantityMT: { type: Number, min: 0 },
    grossAmount: { type: Number, min: 0 },
    discountAmount: { type: Number, min: 0, default: 0 },
    netAmount: { type: Number, min: 0 },
    commissionRule: { type: String, trim: true, maxlength: 120 },
    basisAmount: { type: Number, min: 0 },
    commissionAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'eligible', 'paid', 'cancelled'],
      default: 'pending',
      required: true,
    },
    eligibleAt: { type: Date },
    paidAt: { type: Date },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export const CommissionLedger =
  mongoose.models.CommissionLedger || mongoose.model('CommissionLedger', CommissionLedgerSchema);
