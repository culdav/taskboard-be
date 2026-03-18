import z from 'zod';
import { objectIdSchema } from '../validation.util';

export const createBoardSchema = z.object({
  title: z.string().trim().min(2).max(100),
});

export const boardIdParamsSchema = z.object({
  boardId: objectIdSchema,
});

export const boardAndColumnIdParamsSchema = z.object({
  boardId: objectIdSchema,
  columnId: objectIdSchema,
});

export const updateBoardMetadataSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(5000).optional(),
});
