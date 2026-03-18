import { Router } from 'express';
import { boardController } from '../controllers/board.controller';
import { validateRequest } from '../middleware/validate.middleware';
import {
  boardIdParamsSchema,
  createBoardSchema,
  updateBoardMetadataSchema,
} from '../modules/board/board.validation';

const boardsRouter = Router();

boardsRouter.get('/all', boardController.findAll);

boardsRouter.post(
  '/',
  validateRequest({ body: createBoardSchema }),
  boardController.create
);

boardsRouter.patch(
  '/:boardId',
  validateRequest({
    params: boardIdParamsSchema,
    body: updateBoardMetadataSchema,
  }),
  boardController.updateBoard
);

boardsRouter.delete(
  '/:boardId',
  validateRequest({ params: boardIdParamsSchema }),
  boardController.deleteBoard
);

export default boardsRouter;
