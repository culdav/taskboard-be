import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { boardAndColumnIdParamsSchema } from '../modules/board/board.validation';
import { addCardSchema } from '../modules/board/card.validation';
import { cardController } from '../controllers/card.controller';

const cardRouter = Router();

cardRouter.post(
  '/',
  requireAuth,
  validateRequest({
    params: boardAndColumnIdParamsSchema,
    body: addCardSchema,
  }),
  cardController.addCard
);

export default cardRouter;
