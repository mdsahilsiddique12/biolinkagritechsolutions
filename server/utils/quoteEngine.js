const PRODUCT_BASE_RATES = {
  'solid-fom': 2550,
  'liquid-slurry': 2450,
  prom: 2650,
  co2: 2750,
};

export function calculateQuote({ product, volume, pincode }) {
  const tons = Number(volume);
  const basePricePerTon = PRODUCT_BASE_RATES[product] || PRODUCT_BASE_RATES['solid-fom'];
  
  // Delivery charge per ton based on pincode factor
  const pincodeFactor = Number(String(pincode).slice(-2)) || 25;
  const freightRatePerTon = Math.round(200 + (pincodeFactor % 15) * 10);
  
  // Delivered price per ton (clamped between 2700 and 2990 to keep 20 MT under 60k)
  let finalPricePerTon = basePricePerTon + freightRatePerTon;
  if (finalPricePerTon < 2700) finalPricePerTon = 2700;
  if (finalPricePerTon > 2990) finalPricePerTon = 2990;
  
  const manureCost = Math.round(tons * basePricePerTon);
  const freightCost = Math.round(tons * (finalPricePerTon - basePricePerTon));
  const total = manureCost + freightCost;

  return {
    manureCost,
    freightCost,
    total,
    pricePerTon: finalPricePerTon,
  };
}
