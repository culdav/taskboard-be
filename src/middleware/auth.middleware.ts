import type { RequestHandler } from 'express';
import { jwtUtils } from '../utils/jwt';
import { AppError } from '../utils/errors';

export const requireAuth: RequestHandler = (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authorization.slice('Bearer '.length).trim();

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const payload = jwtUtils.verifyAccessToken(token);

    if (typeof payload.sub !== 'string') {
      return next(new AppError('Unauthorized', 401));
    }

    res.locals.authUser = {
      userId: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : '',
      role: typeof payload.role === 'string' ? payload.role : 'user',
    };

    return next();
  } catch {
    return next(new AppError('Unauthorized', 401));
  }
};
