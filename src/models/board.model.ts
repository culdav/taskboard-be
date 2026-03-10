import { Schema, model } from 'mongoose';

const boardSchema = new Schema({}, { strict: false, timestamps: true });

export const BoardModel = model('Board', boardSchema);
