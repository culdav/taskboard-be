import z from 'zod';

export const addColumnSchema = z.object({
  title: z.string().trim().min(1).max(100),
  position: z.number().int().min(0),
});
