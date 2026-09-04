/**
 * Seed Script — Create KrishakJan Partner + Referral Code KJ01
 *
 * Run: node partner-portal/server/scripts/seedPartners.js
 *
 * Default credentials:
 *   Email:    krishakjan@biolinkagri.in
 *   Password: KrishakJan@2026
 *   Code:     KJ01
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Partner } from '../models/Partner.js';
import { ReferralCode } from '../models/ReferralCode.js';

dotenv.config();

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Missing MONGO_URI environment variable.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  // ── KrishakJan Partner ──
  let partner = await Partner.findOne({ email: 'krishakjan@biolinkagri.in' });
  if (!partner) {
    partner = await Partner.create({
      name: 'KrishakJan',
      email: 'krishakjan@biolinkagri.in',
      password: 'KrishakJan@2026',
      phone: '+91-9000000001',
      company: 'KrishakJan Solutions',
      partnerType: 'strategic_partner',
      status: 'active',
      attributionWindowDays: 365,
    });
    console.log('✅ Created partner: KrishakJan');
  } else {
    console.log('ℹ️  Partner KrishakJan already exists. Skipping.');
  }

  // ── Referral Code KJ01 ──
  let code = await ReferralCode.findOne({ code: 'KJ01' });
  if (!code) {
    code = await ReferralCode.create({
      code: 'KJ01',
      partnerId: partner._id,
      discountType: 'fixed_per_mt',
      discountValue: 100,       // Farmer gets ₹100/MT discount
      commissionType: 'fixed_per_mt',
      commissionValue: 300,     // Partner earns ₹300/MT commission
      active: true,
    });
    console.log('✅ Created referral code: KJ01 (Discount: ₹100/MT, Commission: ₹300/MT)');
  } else {
    console.log('ℹ️  Referral code KJ01 already exists. Skipping.');
  }

  console.log('\n── Partner Login Credentials ──');
  console.log('  Email:    krishakjan@biolinkagri.in');
  console.log('  Password: KrishakJan@2026');
  console.log('  Code:     KJ01');
  console.log('──────────────────────────────\n');

  await mongoose.disconnect();
  console.log('Done. Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
