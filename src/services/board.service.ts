import { isValidObjectId } from 'mongoose';
import {
  CreateBoardInput,
  UpdateBoardMetadataInput,
} from '../controllers/board.controller';
import { BoardDocument, type Board } from '../models/board.model';
import { boardRepository } from '../repositories/board.repository';
import { AppError } from '../utils/errors';

export const boardService = {
  async create(input: CreateBoardInput): Promise<BoardDocument> {
    const createdBoard = await boardRepository.create(input);

    return createdBoard;
  },

  async findAll(): Promise<Board[]> {
    return boardRepository.findAll();
  },

  async findBoardByMemberId(memberId: number): Promise<Board[]> {
    return boardRepository.findBoardsByMemberId(memberId);
  },

  async updateBoard(
    boardId: string,
    ownerId: string,
    updateData: UpdateBoardMetadataInput
  ): Promise<Board> {
    if (!isValidObjectId(boardId) || !isValidObjectId(ownerId)) {
      throw new AppError('Board not found', 404);
    }

    const updatedBoard = await boardRepository.updateBoard(boardId, ownerId, {
      title: updateData.title.trim(),
    });

    if (!updatedBoard) {
      throw new AppError('Board not found', 404);
    }

    return updatedBoard;
  },

  async deleteBoard(boardId: string, ownerId: string): Promise<void> {
    if (!isValidObjectId(boardId) || !isValidObjectId(ownerId)) {
      throw new AppError('Board not found', 404);
    }

    const deleted = await boardRepository.deleteBoard(boardId, ownerId);

    if (!deleted) {
      throw new AppError('Board not found', 404);
    }
  },
};
