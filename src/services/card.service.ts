import { isValidObjectId, Types } from 'mongoose';
import { AddCardInput } from '../controllers/card.controller';
import { Board } from '../models/board.model';
import { cardRepository } from '../repositories/card.repository';
import { AppError } from '../utils/errors';

export const cardService = {
  async addCard(
    boardId: string,
    ownerId: string,
    columnId: string,
    cardData: AddCardInput
  ): Promise<Board> {
    if (
      !isValidObjectId(boardId) ||
      !isValidObjectId(ownerId) ||
      !isValidObjectId(columnId)
    ) {
      throw new AppError('Board or column not found', 404);
    }

    const assignees = (cardData.assignees ?? []).filter((id) =>
      isValidObjectId(id)
    );

    const updatedBoard = await cardRepository.addCard(
      boardId,
      ownerId,
      columnId,
      {
        title: cardData.title.trim(),
        description: cardData.description?.trim(),
        assignees: assignees.map((id) => new Types.ObjectId(id)),
        order: cardData.order,
        status: cardData.status ?? 'active',
      }
    );

    if (!updatedBoard) {
      throw new AppError('Board or column not found', 404);
    }

    return updatedBoard;
  },
};
