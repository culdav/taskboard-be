import type { Request, RequestHandler, Response } from 'express';
import { columnService } from '../services/column.service';
import { AppError } from '../utils/errors';
import { AuthLocals } from './auth.controller';

export type AddColumnInput = {
  title: string;
  position: number;
};

const addColumn: RequestHandler<
  { boardId: string },
  any,
  AddColumnInput
> = async (
  req: Request<{ boardId: string }, {}, AddColumnInput>,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId!;
    const { boardId } = req.params;
    const { title, position } = req.body;

    const payload = await columnService.addColumn(boardId, userId, {
      title,
      position,
    });
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  addColumn,
};
