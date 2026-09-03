import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema(
  {
    farmerName: { type: String, trim: true, maxlength: 120 },
    farmerMobile: { type: String, trim: true, maxlength: 30, index: true },
    farmerEmail: { type: String, trim: true, lowercase: true, maxlength: 180 },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
      index: true,
    },
    referralCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReferralCode',
      required: true,
    },
    attributedAt: { type: Date, default: Date.now },
    attributionSource: {
      type: String,
      enum: ['link', 'code', 'manual', 'admin'],
      default: 'code',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index: one active referral per farmer-partner pair
ReferralSchema.index({ farmerMobile: 1, partnerId: 1 }, { unique: true, sparse: true });

export const Referral =
  mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);
