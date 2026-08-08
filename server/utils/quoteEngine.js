const PRODUCT_BASE_RATES = {
  'solid-fom': 3500,
  'liquid-slurry': 2900,
  prom: 4200,
  co2: 5100,
};

export function calculateQuote({ product, volume, pincode }) {
  const tons = Number(volume);
  const baseRate = PRODUCT_BASE_RATES[product] || PRODUCT_BASE_RATES['solid-fom'];
  const pincodeFactor = Number(String(pincode).slice(-2)) || 25;
  const freightRatePerTon = 180 + pincodeFactor * 3.5;
  const manureCost = tons * baseRate;
  const freightCost = Math.round(tons * freightRatePerTon);
  const handlingFee = Math.round(manureCost * 0.03);
  const total = manureCost + freightCost + handlingFee;

  return {
    manureCost,
    freightCost,
    handlingFee,
    total,
    pricePerTon: Math.round(total / tons),
  };
}
