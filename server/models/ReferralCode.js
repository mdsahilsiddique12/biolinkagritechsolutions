import mongoose from 'mongoose';

const ReferralCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
      maxlength: 30,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
      index: true,
    },
    // What the FARMER gets (discount)
    discountType: {
      type: String,
      enum: ['fixed_per_mt', 'percentage_of_net', 'flat'],
      default: 'fixed_per_mt',
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },

    // What the PARTNER earns (commission) — separate from discount
    commissionType: {
      type: String,
      enum: ['fixed_per_mt', 'percentage_of_net', 'percentage_of_margin'],
      default: 'fixed_per_mt',
      required: true,
    },
    commissionValue: { type: Number, required: true, min: 0 },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReferralCode =
  mongoose.models.ReferralCode || mongoose.model('ReferralCode', ReferralCodeSchema);
