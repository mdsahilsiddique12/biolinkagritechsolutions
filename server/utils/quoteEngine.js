const PRODUCT_BASE_RATES = {
  'solid-fom': 6000,
  'liquid-slurry': 6500,
};

export function calculateQuote({ product, volume, pincode }) {
  const tons = Number(volume);
  
  // Base price per ton with bulk discounts to keep totals within requested ranges
  let basePricePerTon = PRODUCT_BASE_RATES[product] || PRODUCT_BASE_RATES['solid-fom'];
  if (tons >= 15 && tons < 18) {
    basePricePerTon = product === 'liquid-slurry' ? 5100 : 4900;
  } else if (tons >= 18 && tons < 20) {
    basePricePerTon = product === 'liquid-slurry' ? 4900 : 4700;
  } else if (tons >= 20) {
    basePricePerTon = product === 'liquid-slurry' ? 4700 : 4500;
  }
  
  // Stable pseudo-random seed based on pincode factor and volume
  const pincodeFactor = Number(String(pincode).slice(-2)) || 25;
  const seed = (pincodeFactor * 7 + Math.round(tons * 13)) % 100;
  
  let freightCost = 0;
  if (tons >= 15 && tons <= 19) {
    // 12k-16k randomly
    freightCost = Math.round(12000 + (seed / 99) * 4000);
  } else if (tons >= 20 && tons <= 23) {
    // 16k-19k randomly
    freightCost = Math.round(16000 + (seed / 99) * 3000);
  } else {
    // Standard proportional calculation for other volumes
    const baseFreightPerTon = 600 + (pincodeFactor % 15) * 20;
    freightCost = Math.round(tons * baseFreightPerTon);
  }
  
  let manureCost = Math.round(tons * basePricePerTon);
  let total = manureCost + freightCost;

  // Strict caps according to client limits:
  // - 15 tonnes: total price < 95k
  // - 18 tonnes: total price < 108k
  if (Math.round(tons) === 15 && total >= 95000) {
    total = 94800;
    manureCost = total - freightCost;
  } else if (Math.round(tons) === 18 && total >= 108000) {
    total = 107800;
    manureCost = total - freightCost;
  }
  
  const pricePerTon = Math.round(total / tons);

  return {
    manureCost,
    freightCost,
    total,
    pricePerTon,
    isEstimated: true,
  };
}
