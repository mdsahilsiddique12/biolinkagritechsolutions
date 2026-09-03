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
  console.log('Connected to MongoDB for Partner Portal seed.');

  let partner = await Partner.findOne({ email: 'growinagri@biolinkagri.in' });
  if (!partner) {
    partner = await Partner.create({
      name: 'GrowinAgri',
      email: 'growinagri@biolinkagri.in',
      password: 'GrowinAgri@2026',
      phone: '+91-9000000001',
      company: 'GrowinAgri Solutions',
      partnerType: 'strategic_partner',
      status: 'active',
      attributionWindowDays: 365,
    });
    console.log('✅ Created partner: GrowinAgri');
  } else {
    console.log('ℹ️  Partner GrowinAgri already exists. Skipping.');
  }

  let code = await ReferralCode.findOne({ code: 'GROWIN01' });
  if (!code) {
    code = await ReferralCode.create({
      code: 'GROWIN01',
      partnerId: partner._id,
      discountType: 'fixed_per_mt',
      discountValue: 100,
      commissionType: 'fixed_per_mt',
      commissionValue: 300,
      active: true,
    });
    console.log('✅ Created referral code: GROWIN01');
  } else {
    console.log('ℹ️  Referral code GROWIN01 already exists. Skipping.');
  }

  console.log('\n── Partner Login Credentials ──');
  console.log('  Email:    growinagri@biolinkagri.in');
  console.log('  Password: GrowinAgri@2026');
  console.log('  Code:     GROWIN01');
  console.log('──────────────────────────────\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
