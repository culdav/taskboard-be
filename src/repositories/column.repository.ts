import { Board, BoardModel, Column } from '../models/board.model';

export const columnRepository = {
  async addColumn(
    boardId: string,
    ownerId: string,
    columnData: Pick<Column, 'title' | 'position'>
  ): Promise<Board | null> {
    return BoardModel.findOneAndUpdate(
      { _id: boardId, owner: ownerId },
      { $push: { columns: columnData } },
      { new: true }
    ).lean();
  },
};
