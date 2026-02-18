/**
 * Centralized Test Data
 * Adapted from learn-pw pattern
 */

export const TEST_USERS = {
  VALID: {
    email: process.env.USER_EMAIL || 'admin@dot.co.id',
    password: process.env.USER_PASSWORD || 'password123',
  },
  INVALID_EMAIL: {
    email: 'invalid@test.com',
    password: 'anypassword',
  },
  INVALID_PASSWORD: {
    email: 'admin@dot.co.id',
    password: 'wrongpassword',
  },
  EMPTY_EMAIL: {
    email: '',
    password: 'password123',
  },
  EMPTY_PASSWORD: {
    email: 'admin@dot.co.id',
    password: '',
  },
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: /invalid|wrong|incorrect|does not match/i,
  EMPTY_EMAIL: /email is required|username is required|please enter your email/i,
  EMPTY_PASSWORD: /password is required|please enter your password/i,
};

export const LOGIN_PAGE_URL = '/auth/login';
export const DASHBOARD_URL = '/dashboard';
