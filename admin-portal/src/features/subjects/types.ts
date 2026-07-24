export type SubjectListItem = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubjectDetail = SubjectListItem;

export type SubjectListQuery = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type SubjectFormValues = {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
};

export type SubjectUpsertPayload = {
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
};

