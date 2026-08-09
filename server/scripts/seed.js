import { connectDatabase } from '../db.js';
import { ProductListing } from '../models/ProductListing.js';
import { User } from '../models/User.js';
import { seedListings, seedUsers } from '../data/seedData.js';
import { assertCriticalConfig } from '../config.js';

async function seed() {
  assertCriticalConfig();
  await connectDatabase();

  console.log('Connected to MongoDB. Seeding data...');

  for (const userData of seedUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      await User.create(userData);
      console.log(`Created user: ${userData.email}`);
    } else {
      console.log(`User exists: ${userData.email}`);
    }
  }

  for (const listingData of seedListings) {
    const existing = await ProductListing.findOne({
      plantName: listingData.plantName,
      productType: listingData.productType,
    });

    if (!existing) {
      await ProductListing.create(listingData);
      console.log(`Created listing: ${listingData.plantName} / ${listingData.productType}`);
    } else {
      console.log(`Listing exists: ${listingData.plantName} / ${listingData.productType}`);
    }
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
