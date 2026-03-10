import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ message: 'API ready' });
});

export default apiRouter;
