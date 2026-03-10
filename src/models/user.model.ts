import { Schema, model } from 'mongoose';

const userSchema = new Schema({}, { strict: false, timestamps: true });

export const UserModel = model('User', userSchema);
