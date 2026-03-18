import { Router } from 'express';
import authRouter from './auth.routes';
import boardRouter from './board.routes';
import columnRouter from './column.routes';
import cardRouter from './card.routes';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ message: 'API ready' });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/boards', boardRouter);
apiRouter.use('/boards/:boardId/columns', columnRouter);
apiRouter.use('/boards/:boardId/columns/:columnId/cards', cardRouter);

export default apiRouter;
