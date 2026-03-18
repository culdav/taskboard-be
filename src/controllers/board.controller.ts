import type { Request, RequestHandler, Response } from 'express';
import { boardService } from '../services/board.service';
import type { Board, Card } from '../models/board.model';
import { AuthLocals } from './auth.controller';
import { Types } from 'mongoose';
import { AppError } from '../utils/errors';

export type CreateBoardInput = Pick<Board, 'title' | 'owner'>;
export type UpdateBoardMetadataInput = Pick<Board, 'title' | 'description'>;

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

    if (!userId) {
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
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const payload = await boardService.findAll();
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

const updateBoard: RequestHandler<{ boardId: string }, any, Board> = async (
  req: Request<{ boardId: string }, {}, Board>,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId;
    const { boardId } = req.params;
    const { title, description } = req.body;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const payload = await boardService.updateBoard(boardId, userId, {
      title,
      description,
    });
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

const deleteBoard: RequestHandler<{ boardId: string }> = async (
  req: Request<{ boardId: string }>,
  res: Response<any, AuthLocals>,
  next
) => {
  try {
    const userId = res.locals.authUser?.userId;
    const { boardId } = req.params;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    await boardService.deleteBoard(boardId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  create,
  findAll,
  updateBoard,
  deleteBoard,
};
