import { isValidObjectId } from 'mongoose';
import { AddColumnInput } from '../controllers/column.controller';
import { Board } from '../models/board.model';
import { columnRepository } from '../repositories/column.repository';
import { AppError } from '../utils/errors';

export const columnService = {
  async addColumn(
    boardId: string,
    ownerId: string,
    columnData: AddColumnInput
  ): Promise<Board> {
    if (!isValidObjectId(boardId) || !isValidObjectId(ownerId)) {
      throw new AppError('Board not found', 404);
    }

    const updatedBoard = await columnRepository.addColumn(boardId, ownerId, {
      title: columnData.title.trim(),
      position: columnData.position,
    });

    if (!updatedBoard) {
      throw new AppError('Board not found', 404);
    }

    return updatedBoard;
  },
};
