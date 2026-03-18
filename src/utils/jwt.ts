import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

type RefreshTokenPayload = {
  sub: string;
};

type VerifiedToken<TPayload extends JwtPayload> = TPayload & {
  iat: number;
  exp: number;
};

function ensureSecret(secret: string, name: string): string {
  if (!secret) {
    throw new Error(`${name} is missing`);
  }

  return secret;
}

function asExpiresIn(value: string): SignOptions['expiresIn'] {
  return value as SignOptions['expiresIn'];
}

export const jwtUtils = {
  signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(
      payload,
      ensureSecret(env.jwtAccessSecret, 'JWT_ACCESS_SECRET'),
      {
        expiresIn: asExpiresIn(env.accessTokenTtl),
      }
    );
  },

  signRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(
      payload,
      ensureSecret(env.jwtRefreshSecret, 'JWT_REFRESH_SECRET'),
      {
        expiresIn: asExpiresIn(env.refreshTokenTtl),
      }
    );
  },

  verifyAccessToken(token: string): VerifiedToken<JwtPayload> {
    return jwt.verify(
      token,
      ensureSecret(env.jwtAccessSecret, 'JWT_ACCESS_SECRET')
    ) as VerifiedToken<JwtPayload>;
  },

  verifyRefreshToken(token: string): VerifiedToken<JwtPayload> {
    return jwt.verify(
      token,
      ensureSecret(env.jwtRefreshSecret, 'JWT_REFRESH_SECRET')
    ) as VerifiedToken<JwtPayload>;
  },

  decode(token: string): JwtPayload | null {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded === 'string') {
      return null;
    }

    return decoded;
  },
};
