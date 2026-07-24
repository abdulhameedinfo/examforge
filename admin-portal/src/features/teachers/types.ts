import type { IdNameDto } from '../../../shared/api/types';

export type TeacherStatusValue = 'all' | 'active' | 'inactive';

export type TeacherListItem = {
  id: string;
  fullName: string;
  email: string;
  employeeCode?: string | null;
  phoneNumber?: string | null;
  subjects: IdNameDto[];
  classes: IdNameDto[];
  subjectCount: number;
  classCount: number;
  isActive: boolean;
  updatedAt: string;
};

export type TeacherDetail = TeacherListItem & {
  createdAt: string;
};

export type TeacherStatistics = {
  totalTeachers: number;
  activeTeachers: number;
  inactiveTeachers: number;
  totalSubjectsAssigned: number;
  totalClassesAssigned: number;
};

export type TeacherListQuery = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  subjectId?: string;
  classId?: string;
  status?: TeacherStatusValue;
};

export type TeacherFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  employeeCode: string;
  subjectIds: string[];
  classIds: string[];
  isActive: boolean;
};

export type TeacherUpsertPayload = {
  role: 'Teacher';
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  employeeCode?: string | null;
  subjectIds: string[];
  classIds: string[];
  isActive: boolean;
};
