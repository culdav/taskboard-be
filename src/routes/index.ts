import { Router } from 'express';
import authRouter from './auth.routes.js';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ message: 'API ready' });
});

apiRouter.use('/auth', authRouter);

export default apiRouter;
