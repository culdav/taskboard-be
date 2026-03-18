import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// init constant before mocking to avoid before init error
const { authServiceMock } = vi.hoisted(() => ({
  authServiceMock: {
    register: vi.fn(),
    login: vi.fn(),
    refreshSession: vi.fn(),
    logout: vi.fn(),
    logoutAll: vi.fn(),
    getMe: vi.fn(),
  },
}));

vi.mock('../../src/services/auth.service.js', () => ({
  authService: authServiceMock,
}));

import app from '../../src/app';

const sampleAuthResponse = {
  user: {
    id: '507f1f77bcf86cd799439011',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user',
    isEmailVerified: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    lastLoginAt: new Date('2026-01-01T00:00:00.000Z'),
  },
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

function makeAccessToken(userId = '507f1f77bcf86cd799439011'): string {
  return jwt.sign(
    {
      sub: userId,
      email: 'jane@example.com',
      role: 'user',
    },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '15m' }
  );
}

describe('Auth routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/auth/register returns 201 with payload when valid', async () => {
    authServiceMock.register.mockResolvedValue(sampleAuthResponse);

    const response = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(authServiceMock.register).toHaveBeenCalledOnce();
    console.log(response.body);
    expect(response.body).toMatchObject({
      user: {
        id: sampleAuthResponse.user.id,
        email: sampleAuthResponse.user.email,
      },
      accessToken: sampleAuthResponse.accessToken,
      refreshToken: sampleAuthResponse.refreshToken,
    });
  });

  it('POST /api/auth/register returns 400 for invalid body', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('POST /api/auth/login returns 200 with payload when valid', async () => {
    authServiceMock.login.mockResolvedValue(sampleAuthResponse);

    const response = await request(app).post('/api/auth/login').send({
      email: 'jane@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(authServiceMock.login).toHaveBeenCalledOnce();
    expect(response.body.accessToken).toBe(sampleAuthResponse.accessToken);
  });

  it('POST /api/auth/refresh returns 200 with payload when valid', async () => {
    authServiceMock.refreshSession.mockResolvedValue(sampleAuthResponse);

    const response = await request(app).post('/api/auth/refresh').send({
      refreshToken: 'refresh-token',
    });

    expect(response.status).toBe(200);
    expect(authServiceMock.refreshSession).toHaveBeenCalledOnce();
  });

  it('GET /api/auth/me returns 401 without bearer token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(authServiceMock.getMe).not.toHaveBeenCalled();
  });

  it('GET /api/auth/me returns 200 with bearer token', async () => {
    authServiceMock.getMe.mockResolvedValue(sampleAuthResponse.user);

    const token = makeAccessToken();

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(authServiceMock.getMe).toHaveBeenCalledOnce();
    expect(response.body).toMatchObject({
      id: sampleAuthResponse.user.id,
      email: sampleAuthResponse.user.email,
    });
  });

  it('POST /api/auth/logout returns 204 when authenticated', async () => {
    authServiceMock.logout.mockResolvedValue(undefined);

    const token = makeAccessToken();

    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken: 'refresh-token' });

    expect(response.status).toBe(204);
    expect(authServiceMock.logout).toHaveBeenCalledOnce();
  });

  it('POST /api/auth/logout returns 400 for invalid body', async () => {
    const token = makeAccessToken();

    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken: '' });

    expect(response.status).toBe(400);
    expect(authServiceMock.logout).not.toHaveBeenCalled();
  });
});
