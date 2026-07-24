export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
};

export type PaginatedResponse<TItem> = {
  items: TItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type IdNameDto = {
  id: string;
  name: string;
};

