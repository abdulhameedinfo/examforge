import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './axiosClient';
import { appEnv } from '../../app/config/env';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import type { AuthSession } from '../auth/types';
import { saveAuthSession } from '../auth/tokenStorage';
import { toApiError, isAuthError } from './apiError';
import { retryRequest, type RetryConfig } from './retry';
import { requestCancellationManager } from './requestCancellation';

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
  _retryConfig?: RetryConfig;
  _skipGlobalErrorHandling?: boolean;
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

    // Add auth header if not skipped
    if (session?.accessToken && !config.headers?.skipAuth) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    config.baseURL = config.baseURL ?? appEnv.apiBaseUrl;

    // Add request cancellation signal
    const requestKey = requestCancellationManager.generateKey({
      method: config.method,
      url: config.url,
      params: config.params,
    });
    config.signal = requestCancellationManager.createAbortSignal(requestKey);

    return config;
  });

  const responseInterceptorId = apiClient.interceptors.response.use(
    (response) => {
      // Remove request from cancellation manager on success
      const requestKey = requestCancellationManager.generateKey({
        method: response.config.method,
        url: response.config.url,
        params: response.config.params,
      });
      requestCancellationManager.removeRequest(requestKey);

      return response;
    },
    async (error: AxiosError) => {
      const originalConfig = error.config as RetryableConfig | undefined;

      // Remove request from cancellation manager on error
      if (originalConfig) {
        const requestKey = requestCancellationManager.generateKey({
          method: originalConfig.method,
          url: originalConfig.url,
          params: originalConfig.params,
        });
        requestCancellationManager.removeRequest(requestKey);
      }

      // Handle 401 unauthorized with token refresh
      if (
        originalConfig &&
        !originalConfig._retry &&
        error.response?.status === 401 &&
        !isAuthPath(originalConfig.url)
      ) {
        originalConfig._retry = true;

        try {
          const nextSession = await refreshSession();
          originalConfig.headers = originalConfig.headers ?? {};
          originalConfig.headers.Authorization = `Bearer ${nextSession.accessToken}`;
          return apiClient.request(originalConfig);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      // Handle retry logic for server errors
      if (
        originalConfig &&
        originalConfig._retryConfig &&
        !originalConfig._retry
      ) {
        const apiError = toApiError(error);
        
        if (apiError.type === 'server' || apiError.type === 'network') {
          originalConfig._retry = true;
          originalConfig._retryCount = (originalConfig._retryCount || 0) + 1;

          try {
            return await retryRequest(
              () => apiClient.request(originalConfig),
              originalConfig._retryConfig
            );
          } catch (retryError) {
            return Promise.reject(retryError);
          }
        }
      }

      // Global error handling
      if (!originalConfig?._skipGlobalErrorHandling) {
        const apiError = toApiError(error);
        
        // Log errors in development
        if (import.meta.env.DEV) {
          console.error('API Error:', apiError);
        }

        // Handle auth errors globally
        if (isAuthError(error)) {
          // Auth errors are handled above, but if refresh fails
          if (typeof window !== 'undefined') {
            useAuthStore.getState().clearSession();
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return () => {
    apiClient.interceptors.request.eject(requestInterceptorId);
    apiClient.interceptors.response.eject(responseInterceptorId);
  };
}

