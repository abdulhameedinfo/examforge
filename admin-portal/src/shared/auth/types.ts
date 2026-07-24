export type AuthRole = 'Administrator' | 'Teacher';

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: AuthRole;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

