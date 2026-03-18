import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { boardIdParamsSchema } from '../modules/board/board.validation';
import { columnController } from '../controllers/column.controller';
import { addColumnSchema } from '../modules/board/column.validation';

const columnRouter = Router();

columnRouter.post(
  '/',
  validateRequest({ params: boardIdParamsSchema, body: addColumnSchema }),
  columnController.addColumn
);

export default columnRouter;
