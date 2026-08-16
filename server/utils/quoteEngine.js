const PRODUCT_BASE_RATES = {
  'solid-fom': 2850,
  'liquid-slurry': 2750,
  prom: 2950,
  co2: 3050,
};

export function calculateQuote({ product, volume, pincode }) {
  const tons = Number(volume);
  const basePricePerTon = PRODUCT_BASE_RATES[product] || PRODUCT_BASE_RATES['solid-fom'];
  
  // Delivery charge per ton based on pincode factor
  const pincodeFactor = Number(String(pincode).slice(-2)) || 25;
  const freightRatePerTon = Math.round(200 + (pincodeFactor % 15) * 10);
  
  // Delivered price per ton (clamped between 3000 and 3500)
  let finalPricePerTon = basePricePerTon + freightRatePerTon;
  if (finalPricePerTon < 3000) finalPricePerTon = 3000;
  if (finalPricePerTon > 3500) finalPricePerTon = 3500;
  
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
