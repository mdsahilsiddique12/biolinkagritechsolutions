export const testimonials = [
  {
    id: 1,
    name: 'Rajesh Patel',
    role: 'Estate Manager, Nashik Vineyards Cooperative',
    text: 'BioLink transformed our sourcing workflow. We now receive 50 tons of certified FOM monthly, directly dispatched from the plant. The quality consistency is unmatched.',
    rating: 5,
    tons: '50 MT/month',
  },
  {
    id: 2,
    name: 'Dr. Anitha Krishnan',
    role: 'Chief Agronomist, Kerala Spice Board Farms',
    text: 'The lab-certified NPK reports and transparent supply chain gave us the confidence to switch from chemical fertilizers entirely. Our cardamom yield increased by 22%.',
    rating: 5,
    tons: '120 MT/quarter',
  },
  {
    id: 3,
    name: 'Vikram Singh Chauhan',
    role: 'Procurement Head, GreenScape Infrastructure',
    text: 'For our highway greening and landscape projects, BioLink is our sole organic supplier. Their freight integration and advance booking system is seamless.',
    rating: 5,
    tons: '200 MT/project',
  },
  {
    id: 4,
    name: 'Priya Mahajan',
    role: 'Founder, UrbanRoots Terrace Gardens',
    text: 'Their retail bags are beautifully packaged and the quality is outstanding. My urban farming customers love the BioLink Soil Revive Kit. We reorder every month.',
    rating: 5,
    tons: '500 kg/month',
  },
];

export const supplyHubs = [
  { state: 'Punjab', tons: 450, status: 'active', lat: '30.9°N', lng: '75.8°E' },
  { state: 'Maharashtra', tons: 200, status: 'active', lat: '19.7°N', lng: '75.7°E' },
  { state: 'Gujarat', tons: 320, status: 'active', lat: '22.3°N', lng: '71.8°E' },
  { state: 'Haryana', tons: 180, status: 'active', lat: '29.0°N', lng: '76.1°E' },
  { state: 'Uttar Pradesh', tons: 275, status: 'active', lat: '26.8°N', lng: '80.9°E' },
  { state: 'Karnataka', tons: 150, status: 'limited', lat: '15.3°N', lng: '75.7°E' },
];

export const certifications = [
  { name: 'FCO Compliant', description: 'Fertilizer Control Order (1985) Certified' },
  { name: 'NPOP Certified', description: 'National Programme for Organic Production' },
  { name: 'SATAT Partner', description: 'Government SATAT Initiative Network' },
  { name: 'ISO 9001:2015', description: 'Quality Management Systems Certified' },
];

export const stats = [
  { value: 500, suffix: '+', label: 'Tons Moved Monthly', icon: 'Truck' },
  { value: 12, suffix: '+', label: 'Partner BGP Plants', icon: 'Factory' },
  { value: 98, suffix: '%', label: 'On-Time Delivery', icon: 'Clock' },
  { value: 0, suffix: '', prefix: '₹', label: 'Hidden Charges', icon: 'Shield' },
];
