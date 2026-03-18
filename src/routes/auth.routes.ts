import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  loginBodySchema,
  logoutBodySchema,
  refreshBodySchema,
  registerBodySchema,
} from '../modules/auth/auth.validation';

const authRouter = Router();

authRouter.post(
  '/register',
  validateRequest({ body: registerBodySchema }),
  authController.register
);
authRouter.post(
  '/login',
  validateRequest({ body: loginBodySchema }),
  authController.login
);
authRouter.post(
  '/refresh',
  validateRequest({ body: refreshBodySchema }),
  authController.refresh
);
authRouter.post(
  '/logout',
  requireAuth,
  validateRequest({ body: logoutBodySchema }),
  authController.logout
);

authRouter.post('/logout-all', requireAuth, authController.logoutAll);
authRouter.get('/me', requireAuth, authController.me);

export default authRouter;
