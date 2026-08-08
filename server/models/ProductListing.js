import mongoose from 'mongoose';

const ProductListingSchema = new mongoose.Schema(
  {
    plantName: { type: String, required: true, trim: true, maxlength: 160 },
    plantEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    availableQuantityTons: { type: Number, required: true, min: 0 },
    markupPricePerTon: { type: Number, required: true, min: 0 },
    labCertificateUrl: { type: String, required: true, trim: true, maxlength: 2048 },
    productType: { type: String, required: true, trim: true, maxlength: 80 },
    dispatchState: { type: String, required: true, trim: true, maxlength: 80 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductListing =
  mongoose.models.ProductListing || mongoose.model('ProductListing', ProductListingSchema);
