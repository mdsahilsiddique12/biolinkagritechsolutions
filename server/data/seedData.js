export const seedUsers = [
  {
    name: 'Rajesh Procurement',
    email: 'buyer@biolinkagri.com',
    password: 'BuyerPass123!',
    role: 'buyer',
    phone: '+919810000001',
  },
  {
    name: 'Punjab Plant Manager',
    email: 'plant.punjab@biolinkagri.com',
    password: 'PlantPass123!',
    role: 'plant_partner',
    phone: '+919810000002',
  },
];

export const seedListings = [
  {
    plantName: 'Sangrur CBG Plant',
    plantEmail: 'plant.punjab@biolinkagri.com',
    availableQuantityTons: 450,
    markupPricePerTon: 3500,
    labCertificateUrl: 'https://example.com/certificates/sangrur-fom.pdf',
    productType: 'Solid FOM (Granulated)',
    dispatchState: 'Punjab',
    isActive: true,
  },
  {
    plantName: 'Nashik Organic Plant',
    plantEmail: 'plant.maharashtra@biolinkagri.com',
    availableQuantityTons: 220,
    markupPricePerTon: 3650,
    labCertificateUrl: 'https://example.com/certificates/nashik-lfom.pdf',
    productType: 'Liquid Slurry (LFOM)',
    dispatchState: 'Maharashtra',
    isActive: true,
  },
  {
    plantName: 'Anand Bio-Manure Unit',
    plantEmail: 'plant.gujarat@biolinkagri.com',
    availableQuantityTons: 180,
    markupPricePerTon: 6200,
    labCertificateUrl: 'https://example.com/certificates/anand-fom.pdf',
    productType: 'Solid FOM (Granulated)',
    dispatchState: 'Gujarat',
    isActive: true,
  },
];
