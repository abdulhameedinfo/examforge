import { z } from 'zod';
import type { TeacherDetail, TeacherFormValues, TeacherUpsertPayload } from '../types';

export const teacherFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Teacher name is required')
    .max(200, 'Teacher name cannot exceed 200 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(254, 'Email cannot exceed 254 characters'),
  phoneNumber: z.string().trim().max(20, 'Phone number cannot exceed 20 characters'),
  employeeCode: z.string().trim().max(50, 'Employee code cannot exceed 50 characters'),
  subjectIds: z.array(z.string().min(1)).default([]),
  classIds: z.array(z.string().min(1)).default([]),
  isActive: z.boolean(),
});

export type TeacherFormInput = z.input<typeof teacherFormSchema>;
export type TeacherFormOutput = z.output<typeof teacherFormSchema>;

export function getTeacherFormDefaultValues(): TeacherFormValues {
  return {
    fullName: '',
    email: '',
    phoneNumber: '',
    employeeCode: '',
    subjectIds: [],
    classIds: [],
    isActive: true,
  };
}

export function mapTeacherFormValuesToPayload(values: TeacherFormValues): TeacherUpsertPayload {
  return {
    role: 'Teacher',
    fullName: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    phoneNumber: values.phoneNumber.trim() || null,
    employeeCode: values.employeeCode.trim() || null,
    subjectIds: values.subjectIds,
    classIds: values.classIds,
    isActive: values.isActive,
  };
}

export function mapTeacherDetailToFormValues(teacher?: TeacherDetail): TeacherFormValues {
  const defaults = getTeacherFormDefaultValues();

  if (!teacher) {
    return defaults;
  }

  return {
    ...defaults,
    fullName: teacher.fullName,
    email: teacher.email,
    phoneNumber: teacher.phoneNumber ?? '',
    employeeCode: teacher.employeeCode ?? '',
    subjectIds: teacher.subjects.map((subject) => subject.id),
    classIds: teacher.classes.map((item) => item.id),
    isActive: teacher.isActive,
  };
}
