import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from './types';

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

