import { z } from 'zod';
import type { SubjectDetail, SubjectFormValues, SubjectUpsertPayload } from '../types';

export const subjectFormSchema = z.object({
  name: z.string().trim().min(1, 'Subject name is required').max(200, 'Subject name cannot exceed 200 characters'),
  code: z.string().trim().min(1, 'Subject code is required').max(20, 'Subject code cannot exceed 20 characters'),
  description: z.string().trim().max(1000, 'Subject description cannot exceed 1000 characters'),
  isActive: z.boolean(),
});

export function getSubjectFormDefaultValues(): SubjectFormValues {
  return {
    name: '',
    code: '',
    description: '',
    isActive: true,
  };
}

export function mapSubjectFormValuesToPayload(values: SubjectFormValues): SubjectUpsertPayload {
  return {
    name: values.name.trim(),
    code: values.code.trim().toUpperCase(),
    description: values.description.trim() || null,
    isActive: values.isActive,
  };
}

export function mapSubjectDetailToFormValues(subject?: SubjectDetail): SubjectFormValues {
  const defaults = getSubjectFormDefaultValues();

  if (!subject) {
    return defaults;
  }

  return {
    ...defaults,
    name: subject.name,
    code: subject.code,
    description: subject.description ?? '',
    isActive: subject.isActive,
  };
}
