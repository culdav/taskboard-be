import z from 'zod';

export const createBoardSchema = z.object({
  title: z.string().trim().min(2).max(100),
});
