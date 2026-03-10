import { z } from 'zod';

export const registerBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  password: z.string().min(8).max(72),
});

export const loginBodySchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(72),
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(1),
});
