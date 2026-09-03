import express from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../lib/asyncHandler.js';
import { HttpError } from '../lib/httpError.js';
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

// ═══════════════════════════════════════════════════════════════════
// POST /login — Partner-specific JWT authentication
// Completely isolated from buyer/plant_partner auth flow.
// ═══════════════════════════════════════════════════════════════════
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const payload = partnerLoginSchema.parse(req.body);
    let partner = await Partner.findOne({ email: payload.email.toLowerCase() });

    // Auto-create Growin Agri partner if first login before seed
    if (!partner && payload.email.toLowerCase() === 'growinagri@biolinkagri.in' && payload.password === 'GrowinAgri@2026') {
      partner = await Partner.create({
        name: 'Growin Agri',
        email: 'growinagri@biolinkagri.in',
        password: 'GrowinAgri@2026',
        phone: '+91-9000000001',
        company: 'GrowinAgri Solutions',
        partnerType: 'strategic_partner',
        status: 'active',
        attributionWindowDays: 365,
      });

      await ReferralCode.create({
        code: 'GROWIN01',
        partnerId: partner._id,
        discountType: 'fixed_per_mt',
        discountValue: 100,
        commissionType: 'fixed_per_mt',
        commissionValue: 300,
        active: true,
      });
    }

    if (!partner || !(await partner.comparePassword(payload.password))) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    if (partner.status !== 'active') {
      throw new HttpError(403, 'Your partner account is currently suspended. Contact admin.');
    }

    const token = jwt.sign(
      { id: partner._id.toString(), role: 'partner' },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Fetch their referral codes
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
        codes: codes.length > 0 ? codes.map((c) => c.code) : ['GROWIN01'],
      },
    });
  })
);

// ═══════════════════════════════════════════════════════════════════
// PUBLIC: GET /public/codes — Active partner names + codes
// Used by the farmer referral dropdown on the quote calculator.
// ═══════════════════════════════════════════════════════════════════
router.get(
  '/public/codes',
  asyncHandler(async (_req, res) => {
    const codes = await ReferralCode.find({ active: true })
      .populate('partnerId', 'name company partnerType status')
      .lean();

    let activeCodes = codes
      .filter((c) => c.partnerId && c.partnerId.status === 'active')
      .map((c) => ({
        code: c.code,
        partnerName: c.partnerId.name,
        company: c.partnerId.company || '',
        partnerType: c.partnerId.partnerType,
        discountType: c.discountType,
        discountValue: c.discountValue,
      }));

    if (activeCodes.length === 0) {
      activeCodes = [
        {
          code: 'GROWIN01',
          partnerName: 'Growin Agri',
          company: 'GrowinAgri Solutions',
          partnerType: 'strategic_partner',
          discountType: 'fixed_per_mt',
          discountValue: 100,
        },
      ];
    }

    res.json(activeCodes);
  })
);

// ═══════════════════════════════════════════════════════════════════
// PUBLIC: GET /public/validate/:code — Validate referral code
// Returns discount info if valid, 404 if not.
// ═══════════════════════════════════════════════════════════════════
router.get(
  '/public/validate/:code',
  asyncHandler(async (req, res) => {
    const rawCode = (req.params.code || '').trim();
    const code = rawCode.toUpperCase().replace(/\s+/g, '');
    if (!code || code.length < 2) {
      throw new HttpError(400, 'Invalid referral code.');
    }

    const referralCode = await ReferralCode.findOne({ code, active: true })
      .populate('partnerId', 'name company status')
      .lean();

    if (referralCode && referralCode.partnerId && referralCode.partnerId.status === 'active') {
      return res.json({
        valid: true,
        code: referralCode.code,
        partnerName: referralCode.partnerId.name,
        company: referralCode.partnerId.company || '',
        discountType: referralCode.discountType,
        discountValue: referralCode.discountValue,
      });
    }

    // Default fallback for GROWIN01 / GROWINAGRI
    if (code === 'GROWIN01' || code === 'GROWINAGRI') {
      return res.json({
        valid: true,
        code: 'GROWIN01',
        partnerName: 'Growin Agri',
        company: 'GrowinAgri Solutions',
        discountType: 'fixed_per_mt',
        discountValue: 100,
      });
    }

    throw new HttpError(404, 'Referral code not found or inactive.');
  })
);

// ═══════════════════════════════════════════════════════════════════
// PARTNER AUTH: GET /me — Partner profile
// ═══════════════════════════════════════════════════════════════════
router.get(
  '/me',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const partner = await Partner.findById(req.partner.id).select('-password').lean();
    if (!partner) throw new HttpError(404, 'Partner not found.');

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

// ═══════════════════════════════════════════════════════════════════
// PARTNER AUTH: GET /me/dashboard — Aggregated stats
// All queries scoped to the authenticated partner's ID only.
// ═══════════════════════════════════════════════════════════════════
router.get(
  '/me/dashboard',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;

    // Total referred farmers
    const totalFarmers = await Referral.countDocuments({ partnerId });
    const activeFarmers = await Referral.countDocuments({ partnerId, status: 'active' });

    // Orders through this partner's referrals
    const orders = await Order.find({ referralPartnerId: partnerId }).lean();
    const totalOrders = orders.length;
    const totalMT = orders.reduce((sum, o) => sum + (o.quantityOrderedTons || 0), 0);
    const grossSales = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0);
    const totalDiscounts = orders.reduce((sum, o) => sum + (o.referralDiscount || 0), 0);

    // Commission aggregates
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

// ═══════════════════════════════════════════════════════════════════
// PARTNER AUTH: GET /me/referrals — List of referred farmers
// ═══════════════════════════════════════════════════════════════════
router.get(
  '/me/referrals',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;

    const referrals = await Referral.find({ partnerId })
      .populate('referralCodeId', 'code')
      .sort({ attributedAt: -1 })
      .lean();

    // For each referral, aggregate their order stats
    const enriched = await Promise.all(
      referrals.map(async (ref) => {
        const farmerOrders = await Order.find({
          referralPartnerId: partnerId,
          referralId: ref._id,
        }).lean();

        const totalOrders = farmerOrders.length;
        const totalMT = farmerOrders.reduce((s, o) => s + (o.quantityOrderedTons || 0), 0);
        const totalRevenue = farmerOrders.reduce((s, o) => s + (o.totalPaid || 0), 0);

        // Commission for this farmer's orders
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

// ═══════════════════════════════════════════════════════════════════
// PARTNER AUTH: GET /me/commissions — Commission ledger entries
// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
// PARTNER AUTH: PATCH /me/password — Change password
// ═══════════════════════════════════════════════════════════════════
router.patch(
  '/me/password',
  authenticatePartnerToken,
  asyncHandler(async (req, res) => {
    const payload = partnerPasswordChangeSchema.parse(req.body);
    const partner = await Partner.findById(req.partner.id);
    if (!partner) throw new HttpError(404, 'Partner not found.');

    const isMatch = await partner.comparePassword(payload.currentPassword);
    if (!isMatch) {
      throw new HttpError(401, 'Current password is incorrect.');
    }

    partner.password = payload.newPassword;
    await partner.save(); // pre-save hook hashes the new password

    res.json({ message: 'Password updated successfully.' });
  })
);

export default router;
