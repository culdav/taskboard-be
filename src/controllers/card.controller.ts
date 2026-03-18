import type { Request, RequestHandler, Response } from 'express';
import { cardService } from '../services/card.service';
import { Card } from '../models/board.model';
import { AuthLocals } from './auth.controller';
import { AppError } from '../utils/errors';

export type AddCardInput = {
  title: string;
  description?: string;
  assignees?: string[];
  order: number;
  status?: Card['status'];
};

const addCard: RequestHandler<
  { boardId: string; columnId: string },
  any,
  AddCardInput
> = async (
  req: Request<{ boardId: string; columnId: string }, {}, AddCardInput>,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId;
    const { boardId, columnId } = req.params;
    const { title, description, assignees, order, status } = req.body;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const payload = await cardService.addCard(boardId, userId, columnId, {
      title,
      description,
      assignees,
      order,
      status,
    });
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  addCard,
};
