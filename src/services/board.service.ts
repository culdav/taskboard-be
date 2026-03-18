import { CreateBoardInput } from '../controllers/board.controller';
import { BoardDocument, type Board } from '../models/board.model';
import { boardRepository } from '../repositories/board.repository';

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
};
