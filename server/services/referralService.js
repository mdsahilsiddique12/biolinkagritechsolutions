import mongoose from 'mongoose';
import { Partner } from '../models/Partner.js';
import { ReferralCode } from '../models/ReferralCode.js';
import { Referral } from '../models/Referral.js';
import { CommissionLedger } from '../models/CommissionLedger.js';

export async function processReferralAttribution({ farmerName, farmerEmail, farmerMobile, referralCode, volume, grossAmount }) {
  const code = (referralCode || 'KJ01').trim().toUpperCase().replace(/\s+/g, '');
  const isDbConnected = mongoose.connection.readyState >= 1;

  if (!isDbConnected) return null;

  try {
    let refCode = await ReferralCode.findOne({
      code: { $regex: new RegExp(`^${code}$`, 'i') },
      active: true,
    }).populate('partnerId');

    let partner = refCode ? refCode.partnerId : null;

    if (!partner) {
      partner = await Partner.findOne({
        $or: [
          { email: 'ekrishakjan@gmail.com' },
          { email: 'krishakjan@biolinkagri.in' },
          { email: 'growinagri@biolinkagri.in' },
        ],
      });
      if (!partner) {
        partner = await Partner.create({
          name: 'KrishakJan',
          email: 'ekrishakjan@gmail.com',
          password: 'KrishakJan@2026',
          phone: '+91-9000000001',
          company: 'KrishakJan Solutions',
          partnerType: 'strategic_partner',
          status: 'active',
          attributionWindowDays: 365,
        });
      }

      refCode = await ReferralCode.findOne({ code: { $regex: /^KJ01$/i } });
      if (!refCode) {
        refCode = await ReferralCode.create({
          code: 'KJ01',
          partnerId: partner._id,
          discountType: 'fixed_per_mt',
          discountValue: 100,
          commissionType: 'fixed_per_mt',
          commissionValue: 300,
          active: true,
        });
      }
    }

    if (!partner || !refCode) return null;

    const farmerMobileKey = farmerMobile || farmerEmail || `mobile-${Date.now()}`;

    // 1. Create active Referral record in MongoDB
    const referral = await Referral.create({
      farmerName: farmerName || 'Farmer Client',
      farmerMobile: farmerMobile || farmerMobileKey,
      farmerEmail: farmerEmail || '',
      partnerId: partner._id,
      referralCodeId: refCode._id,
      attributedAt: new Date(),
      attributionSource: 'code',
      status: 'active',
    });

    // 2. Calculate values
    const mt = Number(volume || 15);
    const gross = Number(grossAmount || mt * 7000 + 14000);
    const discount = mt * 100;
    const net = Math.max(0, gross - discount);
    const commission = mt * 300;
    const orderNum = `ORD-${Date.now().toString().slice(-6)}`;

    // 3. Create CommissionLedger entry in MongoDB
    const ledger = await CommissionLedger.create({
      partnerId: partner._id,
      orderNumber: orderNum,
      quantityMT: mt,
      grossAmount: gross,
      discountAmount: discount,
      netAmount: net,
      commissionRule: '₹300/MT',
      commissionAmount: commission,
      status: 'eligible',
      eligibleAt: new Date(),
      notes: `Referred farmer booking: ${farmerName} (${farmerMobile || farmerEmail})`,
    });

    console.log(`Successfully created Referral (${referral._id}) & CommissionLedger (${ledger._id}) in MongoDB for ${farmerName} (${code})`);
    return { referral, ledger };
  } catch (err) {
    console.warn('Process referral attribution error:', err.message);
    return null;
  }
}
