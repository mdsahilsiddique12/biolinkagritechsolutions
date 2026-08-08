import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ['contact', 'quote_request', 'launch_notify'],
      required: true,
    },
    name: { type: String, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    phone: { type: String, trim: true, maxlength: 30 },
    enquiryType: { type: String, trim: true, maxlength: 80 },
    message: { type: String, trim: true, maxlength: 4000 },
    product: { type: String, trim: true, maxlength: 120 },
    productName: { type: String, trim: true, maxlength: 160 },
    volume: { type: Number, min: 0 },
    pincode: { type: String, trim: true, maxlength: 12 },
    whatsapp: { type: String, trim: true, maxlength: 30 },
    quoteId: { type: String, trim: true, maxlength: 60 },
    quoteAmount: { type: Number, min: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

InquirySchema.index({ kind: 1, email: 1, createdAt: -1 });

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
