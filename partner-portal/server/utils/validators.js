import { z } from 'zod';

export const partnerLoginSchema = z.object({
  email: z.email().max(180),
  password: z.string().min(8).max(100),
});

export const partnerRegisterSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  password: z.string().min(8).max(100),
  phone: z.string().trim().optional().or(z.literal('')),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  requestedCode: z.string().trim().max(30).optional().or(z.literal('')),
});

export const partnerPasswordChangeSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
});
