import { Schema, model } from 'mongoose';

const columnSchema = new Schema({}, { strict: false, timestamps: true });

export const ColumnModel = model('Column', columnSchema);
