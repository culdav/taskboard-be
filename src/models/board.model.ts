import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';
import { userSchema } from './user.model';

const cardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    order: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
    },
  },
  { strict: true, timestamps: true }
);

const columnSchema = new Schema({
  title: { type: String, required: true },
  position: { type: Number, required: true },
  cards: [cardSchema],
});

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [userSchema],
    columns: [columnSchema],
  },
  { strict: true, timestamps: true }
);

boardSchema.index({ title: 1, _id: 1 }, { unique: true });

export type Card = InferSchemaType<typeof cardSchema>;
export type Column = InferSchemaType<typeof columnSchema>;
export type Board = InferSchemaType<typeof boardSchema>;
export type BoardDocument = HydratedDocument<Board>;

export const BoardModel = model('Board', boardSchema);
