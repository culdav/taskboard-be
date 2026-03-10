export type FindByEmailOptions = {
  includePasswordHash?: boolean;
};

export type RefreshTokenInsert = {
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ip?: string | null;
};
