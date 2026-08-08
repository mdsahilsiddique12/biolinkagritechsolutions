import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { HttpError } from '../lib/httpError.js';
import { authenticateToken } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { ProductListing } from '../models/ProductListing.js';
import { User } from '../models/User.js';
import { buildBuyerReceipt, buildPlantNotification, sendSystemEmail } from '../services/emailService.js';
import { orderSchema } from '../utils/validators.js';

const router = express.Router();

function makeTrackingId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `BL-${stamp}-${randomPart}`;
}

router.post(
  '/create',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const payload = orderSchema.parse(req.body);

    const listing = await ProductListing.findOneAndUpdate(
      {
        _id: payload.listingId,
        isActive: true,
        availableQuantityTons: { $gte: payload.quantityTons },
      },
      {
        $inc: { availableQuantityTons: -payload.quantityTons },
      },
      { new: true }
    );

    if (!listing) {
      throw new HttpError(400, 'Requested quantity is no longer available.');
    }

    const buyer = await User.findById(req.user.id);
    if (!buyer) {
      throw new HttpError(404, 'Buyer account not found.');
    }

    const manureCost = listing.markupPricePerTon * payload.quantityTons;
    const estimatedFreightCost = payload.distanceKm * 35;
    const transactionFee = Math.round(manureCost * 0.025);
    const totalPaid = manureCost + estimatedFreightCost + transactionFee;

    const order = await Order.create({
      buyerId: buyer._id,
      listingId: listing._id,
      quantityOrderedTons: payload.quantityTons,
      manureCost,
      estimatedFreightCost,
      transactionFee,
      totalPaid,
      trackingId: makeTrackingId(),
      deliveryStatus: 'order-confirmed',
      deliveryAddress: payload.deliveryAddress,
      distanceKm: payload.distanceKm,
      trackingEvents: [
        {
          label: 'Order Confirmed',
          detail: 'Purchase order verified and payment received',
          timeLabel: new Date().toLocaleString('en-IN'),
          done: true,
          active: false,
        },
      ],
    });

    await Promise.all([
      sendSystemEmail({
        to: buyer.email,
        subject: 'Invoice and lab certificate - BioLink Agritech',
        html: buildBuyerReceipt({
          buyerName: buyer.name,
          listing,
          quantityTons: payload.quantityTons,
          order,
        }),
      }),
      sendSystemEmail({
        to: listing.plantEmail,
        subject: 'Fulfillment order request - action required',
        html: buildPlantNotification({
          buyer,
          listing,
          quantityTons: payload.quantityTons,
          order,
        }),
      }),
    ]);

    res.status(201).json({
      status: 'success',
      orderId: order._id,
      trackingId: order.trackingId,
      certificate: listing.labCertificateUrl,
      totalPaid,
    });
  })
);

export default router;
