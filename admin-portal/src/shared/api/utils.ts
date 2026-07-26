import type { PaginatedResponse } from './types';

// Query parameter builders
export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

// Pagination helpers
export function buildPaginationQuery(params: {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  [key: string]: unknown;
}): string {
  return buildQueryParams(params);
}

// Check if there are more pages
export function hasNextPage<T>(response: PaginatedResponse<T>): boolean {
  return response.hasNextPage;
}

// Check if there's a previous page
export function hasPreviousPage<T>(response: PaginatedResponse<T>): boolean {
  return response.hasPreviousPage;
}

// Get total pages
export function getTotalPages<T>(response: PaginatedResponse<T>): number {
  return response.totalPages;
}

// Calculate if we're on the last page
export function isLastPage<T>(response: PaginatedResponse<T>): boolean {
  return response.pageNumber >= response.totalPages;
}

// Calculate if we're on the first page
export function isFirstPage<T>(response: PaginatedResponse<T>): boolean {
  return response.pageNumber <= 1;
}

// Debounce function for API calls
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for API calls
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Validate file type
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(fileExtension);
}

// Validate file size
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

// Convert FormData to object
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        (obj[key] as unknown[]).push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });

  return obj;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Remove null and undefined values from object
export function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      cleaned[key as keyof T] = value;
    }
  });

  return cleaned;
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date to ISO string
export function toISOString(date: Date | string): string {
  return new Date(date).toISOString();
}

// Parse ISO string to Date
export function fromISOString(isoString: string): Date {
  return new Date(isoString);
}

// Check if date is valid
export function isValidDate(date: Date | string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

// Get date range
export function getDateRange(days: number): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

// Retry with delay
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Poll function for checking status
export async function poll<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: {
    interval?: number;
    maxAttempts?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const { interval = 1000, maxAttempts = 10, timeout = 30000 } = options;
  const startTime = Date.now();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Polling timeout exceeded');
    }

    const result = await fn();

    if (condition(result)) {
      return result;
    }

    await delay(interval);
  }

  throw new Error('Max polling attempts reached');
}

// Cache decorator for API responses
export function cache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  ttl: number = 60000
): T {
  const cache = new Map<string, { data: unknown; timestamp: number }>();

  return (async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    const result = await fn(...args);
    cache.set(key, { data: result, timestamp: Date.now() });
    return result;
  }) as T;
}

// Memoize function
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, unknown>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
