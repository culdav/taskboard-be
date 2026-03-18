import { Router } from 'express';
import { validateRequest } from '../middleware/validate.middleware';
import { createBoardSchema } from '../modules/board/board.validation';
import { boardController } from '../controllers/board.controller';
import { requireAuth } from '../middleware/auth.middleware';

const boardRouter = Router();

boardRouter.get('/all', requireAuth, boardController.findAll);

boardRouter.post(
  '/',
  requireAuth,
  validateRequest({ body: createBoardSchema }),
  boardController.create
);

export default boardRouter;
