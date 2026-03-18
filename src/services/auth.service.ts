import { createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { authRepository } from '../repositories/auth.repository';
import { AppError } from '../utils/errors';
import { jwtUtils } from '../utils/jwt';
import {
  AuthResponse,
  AuthSessionMetadata,
  LoginInput,
  LogoutInput,
  RefreshInput,
  RegisterInput,
} from './auth.types';

function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function parseDurationMs(value: string): number {
  const duration = value.trim();
  const match = duration.match(/^(\d+)(ms|s|m|h|d)$/);

  if (!match) {
    throw new Error(`Invalid duration format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  const factorByUnit: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return amount * factorByUnit[unit];
}

function mapUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date | null;
}): AuthResponse['user'] {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt ?? new Date(0),
    updatedAt: user.updatedAt ?? new Date(0),
    lastLoginAt: user.lastLoginAt ?? null,
  };
}

async function createSession(
  user: {
    _id: { toString(): string };
    email: string;
    role: string;
  },
  metadata: AuthSessionMetadata
): Promise<{ accessToken: string; refreshToken: string }> {
  const userId = user._id.toString();
  const accessToken = jwtUtils.signAccessToken({
    sub: userId,
    email: user.email,
    role: user.role,
  });
  const refreshToken = jwtUtils.signRefreshToken({ sub: userId });
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const refreshTokenExpiry = new Date(
    Date.now() + parseDurationMs(env.refreshTokenTtl)
  );

  await authRepository.addRefreshToken(userId, {
    tokenHash: refreshTokenHash,
    expiresAt: refreshTokenExpiry,
    userAgent: metadata.userAgent,
    ip: metadata.ip,
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const createdUser = await authRepository.createUser({
      name: input.name.trim(),
      email,
      passwordHash,
    });

    await authRepository.touchLastLogin(createdUser._id.toString());

    const session = await createSession(createdUser, {
      userAgent: input.userAgent,
      ip: input.ip,
    });

    const me = await authRepository.findUserById(createdUser._id.toString());

    if (!me) {
      throw new AppError('User not found after registration', 500);
    }

    return {
      user: mapUser(me),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email, {
      includePasswordHash: true,
    });

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    await authRepository.touchLastLogin(user._id.toString());

    const session = await createSession(user, {
      userAgent: input.userAgent,
      ip: input.ip,
    });

    const me = await authRepository.findUserById(user._id.toString());

    if (!me) {
      throw new AppError('User not found', 404);
    }

    return {
      user: mapUser(me),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  },

  async refreshSession(input: RefreshInput): Promise<AuthResponse> {
    let payload;

    try {
      payload = jwtUtils.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const refreshTokenHash = hashRefreshToken(input.refreshToken);
    const user =
      await authRepository.findUserByRefreshTokenHash(refreshTokenHash);

    if (
      !user ||
      typeof payload.sub !== 'string' ||
      user._id.toString() !== payload.sub
    ) {
      throw new AppError('Refresh token is not valid anymore', 401);
    }

    await authRepository.revokeRefreshToken(
      user._id.toString(),
      refreshTokenHash
    );

    const session = await createSession(user, {
      userAgent: input.userAgent,
      ip: input.ip,
    });

    const me = await authRepository.findUserById(user._id.toString());

    if (!me) {
      throw new AppError('User not found', 404);
    }

    return {
      user: mapUser(me),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  },

  async logout(input: LogoutInput): Promise<void> {
    const refreshTokenHash = hashRefreshToken(input.refreshToken);
    await authRepository.revokeRefreshToken(input.userId, refreshTokenHash);
  },

  async logoutAll(userId: string): Promise<void> {
    await authRepository.revokeAllRefreshTokens(userId);
  },

  async getMe(userId: string): Promise<AuthResponse['user']> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return mapUser(user);
  },
};
