import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema(
  {
    farmerName: { type: String, trim: true, maxlength: 120 },
    farmerMobile: { type: String, trim: true, maxlength: 30, index: true },
    farmerEmail: { type: String, trim: true, lowercase: true, maxlength: 180 },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: false,
      index: true,
    },
    referralCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReferralCode',
      required: false,
    },
    referralCode: { type: String, trim: true, uppercase: true, index: true },
    attributedAt: { type: Date, default: Date.now },
    attributionSource: {
      type: String,
      enum: ['link', 'code', 'manual', 'admin'],
      default: 'code',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'completed', 'pending'],
      default: 'active',
      required: true,
    },
    volume: { type: Number, default: 15 },
    grossAmount: { type: Number },
    discountAmount: { type: Number },
    netAmount: { type: Number },
    commissionAmount: { type: Number },
    product: { type: String },
    pincode: { type: String },
    notes: { type: String },
  },
  { timestamps: true, strict: false }
);

// Index on farmer mobile and partner ID
ReferralSchema.index({ farmerMobile: 1, partnerId: 1 }, { sparse: true });

export const Referral =
  mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);

