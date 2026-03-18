import { Router } from 'express';
import { cardController } from '../controllers/card.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { boardAndColumnIdParamsSchema } from '../modules/board/board.validation';
import { addCardSchema } from '../modules/board/card.validation';

const cardRouter = Router();

cardRouter.post(
  '/',
  validateRequest({
    params: boardAndColumnIdParamsSchema,
    body: addCardSchema,
  }),
  cardController.addCard
);

export default cardRouter;
