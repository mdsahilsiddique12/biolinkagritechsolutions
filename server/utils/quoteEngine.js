const PRODUCT_BASE_RATES = {
  'solid-fom': 6000,
  'liquid-slurry': 6500,
};

export function calculateQuote({ product, volume, pincode }) {
  const tons = Number(volume);
  const basePricePerTon = PRODUCT_BASE_RATES[product] || PRODUCT_BASE_RATES['solid-fom'];
  
  // Delivery charge per ton based on pincode factor
  const pincodeFactor = Number(String(pincode).slice(-2)) || 25;
  const freightRatePerTon = Math.round(200 + (pincodeFactor % 15) * 10);
  
  let finalPricePerTon = basePricePerTon + freightRatePerTon;
  
  const manureCost = Math.round(tons * basePricePerTon);
  const freightCost = Math.round(tons * (finalPricePerTon - basePricePerTon));
  const total = manureCost + freightCost;

  return {
    manureCost,
    freightCost,
    total,
    pricePerTon: finalPricePerTon,
    isEstimated: true,
  };
}
