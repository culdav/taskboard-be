import type { RequestHandler } from 'express';

export const validateRequest: RequestHandler = (_req, _res, next) => {
  next();
};
