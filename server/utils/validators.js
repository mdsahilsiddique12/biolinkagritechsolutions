import { z } from 'zod';

const indianPhoneRegex = /^[+]?[0-9][0-9\s-]{7,19}$/;
const pincodeRegex = /^[0-9]{6}$/;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  password: z.string().min(8).max(100),
  role: z.enum(['buyer', 'plant_partner']),
  phone: z.string().trim().regex(indianPhoneRegex).optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.email().max(180),
  password: z.string().min(8).max(100),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  phone: z.string().trim().regex(indianPhoneRegex).optional().or(z.literal('')),
  enquiryType: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(),
});

export const quoteCalculationSchema = z.object({
  product: z.enum(['solid-fom', 'liquid-slurry']),
  volume: z.coerce.number().min(15).max(1000),
  pincode: z.string().regex(pincodeRegex),
});

export const quoteClaimSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  whatsapp: z.string().trim().regex(indianPhoneRegex),
  company: z.string().trim().min(2).max(120).optional().or(z.literal('')),
  product: z.enum(['solid-fom', 'liquid-slurry']),
  volume: z.coerce.number().min(15).max(1000),
  pincode: z.string().regex(pincodeRegex),
  website: z.string().max(0).optional(),
});

export const retailNotifySchema = z.object({
  email: z.email().max(180),
  productId: z.string().trim().min(2).max(120),
  productName: z.string().trim().min(2).max(160),
  website: z.string().max(0).optional(),
});

export const trackingSchema = z.object({
  trackingId: z.string().trim().min(6).max(40),
});

// ─── Order Schemas (Security-Hardened) ────────────────────────────

/**
 * Order creation — enforces 15-ton minimum order quantity (MOQ).
 * The backend NEVER trusts client-side price data; all costs are
 * calculated server-side from database values.
 */
export const orderSchema = z.object({
  listingId: z.string().trim().min(8).max(50),
  quantityTons: z.coerce.number().min(15, {
    message: 'Order rejected. Minimum transaction threshold is 15 Metric Tons.',
  }).max(10000),
  distanceKm: z.coerce.number().min(1).max(5000),
  deliveryAddress: z.string().trim().min(10).max(280),
});

/**
 * QA settlement — buyer submits the raw token received via email
 * to confirm quality clearance (moisture <30%, batch clean).
 */
export const settleSchema = z.object({
  orderId: z.string().trim().min(8).max(50),
  qaClearanceToken: z.string().trim().min(32).max(128),
});

/**
 * Dispute — buyer rejects quality and provides a reason.
 * Triggers escrow refund workflow.
 */
export const disputeSchema = z.object({
  orderId: z.string().trim().min(8).max(50),
  qaClearanceToken: z.string().trim().min(32).max(128),
  reason: z.string().trim().min(10, {
    message: 'Please provide a detailed reason for the dispute (minimum 10 characters).',
  }).max(2000),
});

/**
 * Status transition — used by plant partners / admin to advance
 * the order through: ESCROW_HELD → DISPATCHED → QA_PENDING.
 */
export const statusTransitionSchema = z.object({
  orderId: z.string().trim().min(8).max(50),
  nextStatus: z.enum(['DISPATCHED', 'QA_PENDING']),
});
