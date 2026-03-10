export type AuthSessionMetadata = {
  userAgent?: string | null;
  ip?: string | null;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
} & AuthSessionMetadata;

export type LoginInput = {
  email: string;
  password: string;
} & AuthSessionMetadata;

export type RefreshInput = {
  refreshToken: string;
} & AuthSessionMetadata;

export type LogoutInput = {
  userId: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
  };
  accessToken: string;
  refreshToken: string;
};
