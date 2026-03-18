import { Router } from 'express';
import { boardController } from '../controllers/board.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  boardIdParamsSchema,
  createBoardSchema,
  updateBoardMetadataSchema,
} from '../modules/board/board.validation';

const boardsRouter = Router();

boardsRouter.get('/all', requireAuth, boardController.findAll);

boardsRouter.post(
  '/',
  requireAuth,
  validateRequest({ body: createBoardSchema }),
  boardController.create
);

boardsRouter.patch(
  '/:boardId',
  requireAuth,
  validateRequest({
    params: boardIdParamsSchema,
    body: updateBoardMetadataSchema,
  }),
  boardController.updateBoard
);

boardsRouter.delete(
  '/:boardId',
  requireAuth,
  validateRequest({ params: boardIdParamsSchema }),
  boardController.deleteBoard
);

export default boardsRouter;
