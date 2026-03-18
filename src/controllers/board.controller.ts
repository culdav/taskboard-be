import type { Request, RequestHandler, Response } from 'express';
import { boardService } from '../services/board.service';
import type { Board } from '../models/board.model';
import { AuthLocals } from './auth.controller';
import { Types } from 'mongoose';
import { AppError } from '../utils/errors';

export type CreateBoardInput = Pick<Board, 'title' | 'owner'>;

const create: RequestHandler = async (
  req: Request<{}, {}, CreateBoardInput>,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId;
    const { title } = req.body as {
      title: string;
    } as CreateBoardInput;

    if (userId && !Types.ObjectId.isValid(userId)) {
      throw new AppError('Unauthorized', 401);
    }

    const payload = await boardService.create({
      title,
      owner: new Types.ObjectId(userId),
    });

    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

const findAll: RequestHandler = async (
  _req,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId;
    if (userId && !Types.ObjectId.isValid(userId)) {
      throw new AppError('Unauthorized', 401);
    }

    const payload = await boardService.findAll();
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  create,
  findAll,
};
