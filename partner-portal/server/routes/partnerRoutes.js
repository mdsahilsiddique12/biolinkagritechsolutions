import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticatePartnerToken } from '../middleware/auth.js';
import { Partner } from '../models/Partner.js';
import { ReferralCode } from '../models/ReferralCode.js';
import { Referral } from '../models/Referral.js';
import { CommissionLedger } from '../models/CommissionLedger.js';
import { Order } from '../models/Order.js';
import { config } from '../config.js';
import {
  partnerLoginSchema,
  partnerPasswordChangeSchema,
} from '../utils/validators.js';

const router = express.Router();

// Helper wrapper for async routes
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// POST /login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const payload = partnerLoginSchema.parse(req.body);
    const partner = await Partner.findOne({ email: payload.email });

    if (!partner || !(await partner.comparePassword(payload.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (partner.status !== 'active') {
      return res.status(403).json({ message: 'Your partner account is currently suspended. Contact admin.' });
    }

    const token = jwt.sign(
      { id: partner._id.toString(), role: 'partner' },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const codes = await ReferralCode.find({ partnerId: partner._id, active: true });

    res.json({
      token,
      partner: {
        id: partner._id,
        name: partner.name,
        email: partner.email,
        company: partner.company,
        partnerType: partner.partnerType,
        status: partner.status,
        codes: codes.map((c) => c.code),
      },
    });
  })
);

// GET /public/codes
router.get(
  '/public/codes',
  asyncHandler(async (_req, res) => {
    const codes = await ReferralCode.find({ active: true })
      .populate('partnerId', 'name company partnerType status')
      .lean();

    const activeCodes = codes
      .filter((c) => c.partnerId && c.partnerId.status === 'active')
      .map((c) => ({
        code: c.code,
        partnerName: c.partnerId.name,
        company: c.partnerId.company || '',
        partnerType: c.partnerId.partnerType,
        discountType: c.discountType,
        discountValue: c.discountValue,
      }));

    res.json(activeCodes);
  })
);

// GET /public/validate/:code
router.get(
  '/public/validate/:code',
  asyncHandler(async (req, res) => {
    const code = (req.params.code || '').trim().toUpperCase();
    if (!code || code.length < 2) {
      return res.status(400).json({ message: 'Invalid referral code.' });
    }

    const referralCode = await ReferralCode.findOne({ code, active: true })
      .populate('partnerId', 'name company status')
      .lean();

    if (!referralCode || !referralCode.partnerId || referralCode.partnerId.status !== 'active') {
      return res.status(404).json({ message: 'Referral code not found or inactive.' });
    }

    res.json({
      valid: true,
      code: referralCode.code,
      partnerName: referralCode.partnerId.name,
      company: referralCode.partnerId.company || '',
      discountType: referralCode.discountType,
      discountValue: referralCode.discountValue,
    });
  })
);

// GET /me
router.get(
  '/me',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const partner = await Partner.findById(req.partner.id).select('-password').lean();
    if (!partner) return res.status(404).json({ message: 'Partner not found.' });

    const codes = await ReferralCode.find({ partnerId: partner._id }).lean();

    res.json({
      ...partner,
      referralCodes: codes.map((c) => ({
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        commissionType: c.commissionType,
        commissionValue: c.commissionValue,
        active: c.active,
      })),
    });
  })
);

// GET /me/dashboard
router.get(
  '/me/dashboard',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;

    const totalFarmers = await Referral.countDocuments({ partnerId });
    const activeFarmers = await Referral.countDocuments({ partnerId, status: 'active' });

    const orders = await Order.find({ referralPartnerId: partnerId }).lean();
    const totalOrders = orders.length;
    const totalMT = orders.reduce((sum, o) => sum + (o.quantityOrderedTons || 0), 0);
    const grossSales = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0);
    const totalDiscounts = orders.reduce((sum, o) => sum + (o.referralDiscount || 0), 0);

    const commissions = await CommissionLedger.find({ partnerId }).lean();
    const totalCommission = commissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const eligibleCommission = commissions
      .filter((c) => c.status === 'eligible' || c.status === 'paid')
      .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const paidCommission = commissions
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const pendingCommission = commissions
      .filter((c) => c.status === 'pending' || c.status === 'eligible')
      .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

    res.json({
      totalFarmers,
      activeFarmers,
      totalOrders,
      totalMT: Math.round(totalMT * 100) / 100,
      grossSales,
      totalDiscounts,
      totalCommission,
      eligibleCommission,
      paidCommission,
      pendingCommission,
    });
  })
);

// GET /me/referrals
router.get(
  '/me/referrals',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;

    const referrals = await Referral.find({ partnerId })
      .populate('referralCodeId', 'code')
      .sort({ attributedAt: -1 })
      .lean();

    const enriched = await Promise.all(
      referrals.map(async (ref) => {
        const farmerOrders = await Order.find({
          referralPartnerId: partnerId,
          referralId: ref._id,
        }).lean();

        const totalOrders = farmerOrders.length;
        const totalMT = farmerOrders.reduce((s, o) => s + (o.quantityOrderedTons || 0), 0);
        const totalRevenue = farmerOrders.reduce((s, o) => s + (o.totalPaid || 0), 0);

        const orderIds = farmerOrders.map((o) => o._id);
        const commissionEntries = await CommissionLedger.find({
          partnerId,
          orderId: { $in: orderIds },
        }).lean();
        const totalCommission = commissionEntries.reduce((s, c) => s + (c.commissionAmount || 0), 0);

        return {
          id: ref._id,
          farmerName: ref.farmerName,
          farmerMobile: ref.farmerMobile ? `${ref.farmerMobile.slice(0, 3)}****${ref.farmerMobile.slice(-3)}` : '',
          referralCode: ref.referralCodeId?.code || '',
          attributedAt: ref.attributedAt,
          attributionSource: ref.attributionSource,
          status: ref.status,
          totalOrders,
          totalMT: Math.round(totalMT * 100) / 100,
          totalRevenue,
          totalCommission,
        };
      })
    );

    res.json(enriched);
  })
);

// GET /me/commissions
router.get(
  '/me/commissions',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;

    const entries = await CommissionLedger.find({ partnerId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      entries.map((e) => ({
        id: e._id,
        orderNumber: e.orderNumber,
        quantityMT: e.quantityMT,
        grossAmount: e.grossAmount,
        discountAmount: e.discountAmount,
        netAmount: e.netAmount,
        commissionRule: e.commissionRule,
        commissionAmount: e.commissionAmount,
        status: e.status,
        eligibleAt: e.eligibleAt,
        paidAt: e.paidAt,
        createdAt: e.createdAt,
      }))
    );
  })
);

// PATCH /me/password
router.patch(
  '/me/password',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const payload = partnerPasswordChangeSchema.parse(req.body);
    const partner = await Partner.findById(req.partner.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found.' });

    const isMatch = await partner.comparePassword(payload.currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    partner.password = payload.newPassword;
    await partner.save();

    res.json({ message: 'Password updated successfully.' });
  })
);

export default router;
