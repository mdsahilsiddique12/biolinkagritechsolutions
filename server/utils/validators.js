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
  product: z.enum(['solid-fom', 'liquid-slurry', 'prom', 'co2']),
  volume: z.coerce.number().min(15).max(1000),
  pincode: z.string().regex(pincodeRegex),
});

export const quoteClaimSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  whatsapp: z.string().trim().regex(indianPhoneRegex),
  company: z.string().trim().min(2).max(120).optional().or(z.literal('')),
  product: z.enum(['solid-fom', 'liquid-slurry', 'prom', 'co2']),
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

export const orderSchema = z.object({
  listingId: z.string().trim().min(8).max(50),
  quantityTons: z.coerce.number().min(0.1).max(10000),
  distanceKm: z.coerce.number().min(1).max(5000),
  deliveryAddress: z.string().trim().min(10).max(280),
});
