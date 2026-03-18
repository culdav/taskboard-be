import z from 'zod';
import { objectIdSchema } from '../validation.util';

export const addCardSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(5000).optional(),
  assignees: z.array(objectIdSchema).optional(),
  order: z.number().int().min(0),
  status: z.enum(['active', 'archived', 'deleted']).optional(),
});
