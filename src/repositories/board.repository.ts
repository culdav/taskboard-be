import { DeleteResult, UpdateResult } from 'mongoose';
import { CreateBoardInput } from '../controllers/board.controller';
import {
  Board,
  BoardModel,
  Card,
  Column,
  type BoardDocument,
} from '../models/board.model';

export const boardRepository = {
  async create(input: CreateBoardInput): Promise<BoardDocument> {
    return BoardModel.create(input);
  },

  async findAll(): Promise<Board[]> {
    return BoardModel.find({}).populate('-refreshTokens').lean();
  },

  async findBoardsByMemberId(memberId: number): Promise<Board[]> {
    return BoardModel.find({ members: memberId })
      .populate('columns members')
      .lean();
  },

  async updateBoard(ownerId: number, updateData: Board): Promise<Board | null> {
    return BoardModel.findOneAndUpdate({ owner: ownerId }, updateData).lean();
  },

  async deleteBoard(boardId: number, ownerId: number): Promise<boolean> {
    const result = await BoardModel.deleteOne({ _id: boardId, owner: ownerId });
    return result.deletedCount > 0;
  },

  async addColumn(boardId: number, columnData: Column): Promise<Board | null> {
    return BoardModel.findOneAndUpdate(
      { _id: boardId },
      { $push: { columns: { columnData } } }
    ).lean();
  },

  async addCard(
    boardId: number,
    columnId: number,
    cardData: Card
  ): Promise<Board | null> {
    return BoardModel.findOneAndUpdate(
      { _id: boardId, 'columns._id': columnId },
      { $push: { 'columns.$.cards': { cardData } } }
    ).lean();
  },
};
