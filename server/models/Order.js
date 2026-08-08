import mongoose from 'mongoose';

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
    quantityOrderedTons: { type: Number, required: true, min: 0.1 },
    manureCost: { type: Number, required: true, min: 0 },
    estimatedFreightCost: { type: Number, required: true, min: 0 },
    transactionFee: { type: Number, required: true, min: 0 },
    totalPaid: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'paid', trim: true },
    trackingId: { type: String, unique: true, required: true },
    deliveryStatus: { type: String, default: 'order-confirmed', trim: true },
    deliveryAddress: { type: String, trim: true, maxlength: 280 },
    distanceKm: { type: Number, required: true, min: 0 },
    trackingEvents: { type: [TrackingEventSchema], default: [] },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
