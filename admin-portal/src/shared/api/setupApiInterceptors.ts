import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './axiosClient';
import { appEnv } from '../../app/config/env';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import type { AuthSession } from '../auth/types';
import { saveAuthSession } from '../auth/tokenStorage';

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const authPaths = ['/auth/login', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password'];

let refreshPromise: Promise<AuthSession> | null = null;

function isAuthPath(url?: string) {
  return Boolean(url && authPaths.some((path) => url.includes(path)));
}

async function refreshSession() {
  const session = useAuthStore.getState().session;

  if (!session?.refreshToken) {
    throw new Error('Missing refresh token');
  }

  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<AuthSession>('/auth/refresh', { refreshToken: session.refreshToken })
      .then((response) => {
        useAuthStore.getState().setSession(response.data);
        saveAuthSession(response.data);
        return response.data;
      })
      .catch((error) => {
        useAuthStore.getState().clearSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export function setupApiInterceptors() {
  const requestInterceptorId = apiClient.interceptors.request.use((config) => {
    const session = useAuthStore.getState().session;

    if (session?.accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    config.baseURL = config.baseURL ?? appEnv.apiBaseUrl;
    return config;
  });

  const responseInterceptorId = apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalConfig = error.config as RetryableConfig | undefined;

      if (
        !originalConfig ||
        originalConfig._retry ||
        error.response?.status !== 401 ||
        isAuthPath(originalConfig.url)
      ) {
        return Promise.reject(error);
      }

      originalConfig._retry = true;

      try {
        const nextSession = await refreshSession();
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${nextSession.accessToken}`;
        return apiClient.request(originalConfig);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );

  return () => {
    apiClient.interceptors.request.eject(requestInterceptorId);
    apiClient.interceptors.response.eject(responseInterceptorId);
  };
}

