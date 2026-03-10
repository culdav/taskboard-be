import type { RequestHandler } from 'express';

export const columnController: RequestHandler = (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};
