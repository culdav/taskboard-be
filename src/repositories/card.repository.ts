import { Board, BoardModel, Card } from '../models/board.model';

type NewCardData = Pick<
  Card,
  'title' | 'description' | 'assignees' | 'order' | 'status'
>;

export const cardRepository = {
  async addCard(
    boardId: string,
    ownerId: string,
    columnId: string,
    cardData: NewCardData
  ): Promise<Board | null> {
    return BoardModel.findOneAndUpdate(
      { _id: boardId, owner: ownerId, 'columns._id': columnId },
      { $push: { 'columns.$.cards': cardData } },
      { new: true }
    ).lean();
  },
};
