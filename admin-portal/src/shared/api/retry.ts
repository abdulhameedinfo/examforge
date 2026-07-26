import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
  onRetry?: (error: AxiosError, retryCount: number) => void;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors and 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  },
  onRetry: () => {},
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateRetryDelay(retryCount: number, baseDelay: number): number {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
  return exponentialDelay + jitter;
}

export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  config: RetryConfig = {},
): Promise<T> {
  const { maxRetries, retryDelay, retryCondition, onRetry } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: AxiosError | Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      const axiosError = error as AxiosError;

      // Check if we should retry
      if (attempt === maxRetries || !retryCondition(axiosError)) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateRetryDelay(attempt, retryDelay);
      onRetry(axiosError, attempt + 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

// Augment axios config to include retry metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
    _retryConfig?: RetryConfig;
  }
}
