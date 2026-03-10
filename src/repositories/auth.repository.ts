import { Types } from 'mongoose';
import { UserModel, type UserDocument } from '../models/user.model.js';
import { FindByEmailOptions, RefreshTokenInsert } from './auth.types.js';

export const authRepository = {
  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<UserDocument> {
    return UserModel.create(input);
  },

  async findUserByEmail(
    email: string,
    options: FindByEmailOptions = {}
  ): Promise<UserDocument | null> {
    const query = UserModel.findOne({
      email: email.toLowerCase(),
      deletedAt: null,
    });

    if (options.includePasswordHash) {
      query.select('+passwordHash');
    }

    return query.exec();
  },

  async findUserById(userId: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return UserModel.findOne({ _id: userId, deletedAt: null }).exec();
  },

  async addRefreshToken(
    userId: string,
    token: RefreshTokenInsert
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId, deletedAt: null },
      {
        $push: {
          refreshTokens: {
            tokenHash: token.tokenHash,
            expiresAt: token.expiresAt,
            userAgent: token.userAgent ?? null,
            ip: token.ip ?? null,
          },
        },
      }
    ).exec();
  },

  async revokeRefreshToken(userId: string, tokenHash: string): Promise<void> {
    await UserModel.updateOne(
      {
        _id: userId,
        deletedAt: null,
        refreshTokens: { $elemMatch: { tokenHash, revokedAt: null } },
      },
      {
        $set: {
          'refreshTokens.$.revokedAt': new Date(),
        },
      }
    ).exec();
  },

  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId, deletedAt: null },
      {
        $set: {
          'refreshTokens.$[].revokedAt': new Date(),
        },
      }
    ).exec();
  },

  async findUserByRefreshTokenHash(
    tokenHash: string
  ): Promise<UserDocument | null> {
    const now = new Date();

    return UserModel.findOne({
      deletedAt: null,
      refreshTokens: {
        $elemMatch: {
          tokenHash,
          revokedAt: null,
          expiresAt: { $gt: now },
        },
      },
    }).exec();
  },

  async touchLastLogin(userId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId, deletedAt: null },
      {
        $set: {
          lastLoginAt: new Date(),
        },
      }
    ).exec();
  },
};
