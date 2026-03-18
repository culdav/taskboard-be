import { CreateBoardInput } from '../controllers/board.controller';
import { Board, BoardModel, type BoardDocument } from '../models/board.model';

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

  async updateBoard(
    boardId: string,
    ownerId: string,
    updateData: Partial<Pick<Board, 'title' | 'description'>>
  ): Promise<Board | null> {
    return BoardModel.findOneAndUpdate(
      { _id: boardId, owner: ownerId },
      { $set: updateData },
      { new: true }
    ).lean();
  },

  async deleteBoard(boardId: string, ownerId: string): Promise<boolean> {
    const result = await BoardModel.deleteOne({ _id: boardId, owner: ownerId });
    return result.deletedCount > 0;
  },
};
