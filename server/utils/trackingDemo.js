export function getDemoTrackingRecord(trackingId) {
  if (trackingId !== 'BL-2026-08-0847') {
    return null;
  }

  return {
    trackingId: 'BL-2026-08-0847',
    product: 'Solid FOM (Granulated)',
    volume: '25 Metric Tons',
    origin: 'CBG Plant, Sangrur, Punjab',
    destination: 'Green Valley Estate, Nashik, Maharashtra',
    status: 'in-transit',
    steps: [
      { label: 'Order Confirmed', detail: 'Purchase order verified and payment received', time: '05 Aug 2026, 09:15 AM', done: true },
      { label: 'Quality Check Passed', detail: 'NPK lab verification completed - Batch #FOM-2608', time: '05 Aug 2026, 02:30 PM', done: true },
      { label: 'Dispatched from Factory', detail: 'Truck loaded and dispatched - Vehicle: PB10AB1234', time: '06 Aug 2026, 06:00 AM', done: true },
      { label: 'In Transit', detail: 'Currently en route via NH-44 to NH-48 corridor', time: '07 Aug 2026, 11:45 AM', done: false, active: true },
      { label: 'Out for Delivery', detail: 'Estimated arrival at destination site', time: 'ETA: 09 Aug 2026', done: false },
      { label: 'Delivered', detail: 'Consignment delivered and signed off', time: '-', done: false },
    ],
  };
}
