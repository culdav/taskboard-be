import type { RequestHandler } from 'express';

export const inviteController: RequestHandler = (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};
