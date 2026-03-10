import { Schema, model } from 'mongoose';

const cardSchema = new Schema({}, { strict: false, timestamps: true });

export const CardModel = model('Card', cardSchema);
