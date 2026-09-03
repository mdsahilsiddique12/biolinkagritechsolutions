import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 180,
    },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, trim: true, maxlength: 30 },
    company: { type: String, trim: true, maxlength: 200 },
    partnerType: {
      type: String,
      enum: ['strategic_partner', 'fpo', 'individual', 'agent'],
      default: 'individual',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'inactive'],
      default: 'active',
      required: true,
    },
    attributionWindowDays: { type: Number, default: 365, min: 30, max: 1825 },
  },
  { timestamps: true }
);

PartnerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

PartnerSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
