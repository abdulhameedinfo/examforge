import type { AxiosError } from 'axios';
import type { ApiErrorResponse, ApiError, ApiErrorType } from './types';

export function normalizeApiError(error: unknown): ApiErrorResponse {
  const axiosError = error as AxiosError<ApiErrorResponse> | undefined;

  if (axiosError?.response?.data?.message) {
    return axiosError.response.data;
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred.' };
}

export function classifyError(error: AxiosError): ApiErrorType {
  if (!error.response) {
    return 'network';
  }

  const status = error.response.status;

  if (status === 401 || status === 403) {
    return 'auth';
  }

  if (status >= 400 && status < 500) {
    if (status === 422) {
      return 'validation';
    }
    return 'client';
  }

  if (status >= 500) {
    return 'server';
  }

  return 'unknown';
}

export function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<ApiErrorResponse> | undefined;

  if (axiosError) {
    return {
      type: classifyError(axiosError),
      message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
      statusCode: axiosError.response?.status,
      details: axiosError.response?.data?.details,
      originalError: error,
    };
  }

  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message,
      originalError: error,
    };
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred',
    originalError: error,
  };
}

export function getErrorMessage(error: ApiError | unknown): string {
  const apiError = error as ApiError | undefined;
  return apiError?.message || 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  const apiError = toApiError(error);
  return apiError.type === 'network';
}

export function isAuthError(error: unknown): boolean {
  const apiError = toApiError(error);
  return apiError.type === 'auth';
}

export function isValidationError(error: unknown): boolean {
  const apiError = toApiError(error);
  return apiError.type === 'validation';
}

export function isServerError(error: unknown): boolean {
  const apiError = toApiError(error);
  return apiError.type === 'server';
}

