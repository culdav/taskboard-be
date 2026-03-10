import { Schema, model } from 'mongoose';

const inviteSchema = new Schema({}, { strict: false, timestamps: true });

export const InviteModel = model('Invite', inviteSchema);
