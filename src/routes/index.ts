import { Router } from 'express';
import authRouter from './auth.routes';
import boardRouter from './board.routes';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ message: 'API ready' });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/board', boardRouter);

export default apiRouter;
