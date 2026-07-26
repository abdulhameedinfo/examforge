import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './axiosClient';
import type { ApiRequestConfig, ApiResponse, PaginatedResponse } from './types';
import type { RetryConfig } from './retry';
import { requestCancellationManager } from './requestCancellation';

export abstract class BaseApiService {
  protected baseUrl: string = '';

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  protected getFullUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  protected buildConfig(config?: ApiRequestConfig): AxiosRequestConfig {
    const axiosConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        skipAuth: config?.skipAuth,
        skipGlobalErrorHandling: config?.skipGlobalErrorHandling,
      },
    };

    // Add retry config if provided
    if (config?.retryCount !== undefined) {
      (axiosConfig as any)._retryConfig = {
        maxRetries: config.retryCount,
      } as RetryConfig;
    }

    // Add signal if provided
    if (config?.signal) {
      axiosConfig.signal = config.signal;
    }

    return axiosConfig;
  }

  protected async get<T>(
    endpoint: string,
    params?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> {
    const response = await apiClient.get<T>(
      this.getFullUrl(endpoint),
      this.buildConfig({ ...config, params }),
    );
    return response.data;
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> {
    const response = await apiClient.post<T>(
      this.getFullUrl(endpoint),
      data,
      this.buildConfig(config),
    );
    return response.data;
  }

  protected async put<T>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> {
    const response = await apiClient.put<T>(
      this.getFullUrl(endpoint),
      data,
      this.buildConfig(config),
    );
    return response.data;
  }

  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> {
    const response = await apiClient.patch<T>(
      this.getFullUrl(endpoint),
      data,
      this.buildConfig(config),
    );
    return response.data;
  }

  protected async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig,
  ): Promise<T> {
    const response = await apiClient.delete<T>(
      this.getFullUrl(endpoint),
      this.buildConfig(config),
    );
    return response.data;
  }

  protected async getPaginated<T>(
    endpoint: string,
    params?: {
      pageNumber?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
      [key: string]: unknown;
    },
    config?: ApiRequestConfig,
  ): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<PaginatedResponse<T>>(
      this.getFullUrl(endpoint),
      this.buildConfig({ ...config, params }),
    );
    return response.data;
  }

  protected async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>,
    config?: ApiRequestConfig,
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    const response = await apiClient.post<T>(
      this.getFullUrl(endpoint),
      formData,
      this.buildConfig({
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      }),
    );
    return response.data;
  }

  protected async downloadFile(
    endpoint: string,
    filename: string,
    params?: unknown,
    config?: ApiRequestConfig,
  ): Promise<void> {
    const response = await apiClient.get<Blob>(
      this.getFullUrl(endpoint),
      this.buildConfig({
        ...config,
        params,
        responseType: 'blob',
      }),
    );

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Cancel request by key
  protected cancelRequest(method: string, endpoint: string, params?: unknown): void {
    const key = requestCancellationManager.generateKey({
      method,
      url: this.getFullUrl(endpoint),
      params,
    });
    requestCancellationManager.cancelRequest(key);
  }

  // Cancel all requests for this service
  protected cancelAllRequests(): void {
    requestCancellationManager.cancelAllRequests();
  }
}
