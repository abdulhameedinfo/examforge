import { apiClient } from '../../../shared/api/axiosClient';
import type {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '../../../shared/auth/types';

export async function login(request: LoginRequest) {
  const response = await apiClient.post<AuthSession>('/auth/login', request);
  return response.data;
}

export async function refreshToken(request: RefreshTokenRequest) {
  const response = await apiClient.post<AuthSession>('/auth/refresh', request);
  return response.data;
}

export async function requestPasswordReset(request: ForgotPasswordRequest) {
  await apiClient.post('/auth/forgot-password', request);
}

export async function resetPassword(request: ResetPasswordRequest) {
  await apiClient.post('/auth/reset-password', request);
}

