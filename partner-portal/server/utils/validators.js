import { z } from 'zod';

export const partnerLoginSchema = z.object({
  email: z.email().max(180),
  password: z.string().min(8).max(100),
});

export const partnerPasswordChangeSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
});
