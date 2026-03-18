import type { Request, RequestHandler, Response } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/errors';

export type AuthLocals = {
  authUser?: {
    userId: string;
    email: string;
    role: string;
  };
};

function getClientMetadata(req: Request): { userAgent?: string; ip?: string } {
  return {
    userAgent: req.get('user-agent') ?? undefined,
    ip: req.ip || undefined,
  };
}

const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const payload = await authService.register({
      name,
      email,
      password,
      ...getClientMetadata(req),
    });

    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const payload = await authService.login({
      email,
      password,
      ...getClientMetadata(req),
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

const refresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body as {
      refreshToken: string;
    };

    const payload = await authService.refreshSession({
      refreshToken,
      ...getClientMetadata(req),
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

const logout: RequestHandler = async (
  req: Request,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const { refreshToken } = req.body as {
      refreshToken: string;
    };

    const userId = res.locals.authUser?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    await authService.logout({ userId, refreshToken });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const logoutAll: RequestHandler = async (
  req: Request,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    await authService.logoutAll(userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const me: RequestHandler = async (
  _req: Request,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const payload = await authService.getMe(userId);

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  me,
};
