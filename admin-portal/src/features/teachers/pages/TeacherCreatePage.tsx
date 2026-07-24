import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { TeacherForm } from '../components/TeacherForm';
import { useCreateTeacherMutation, useTeacherFormOptions } from '../hooks/useTeacherQueries';
import type { TeacherUpsertPayload } from '../types';

export function TeacherCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateTeacherMutation();
  const { subjectsQuery, classesQuery } = useTeacherFormOptions();

  const handleSubmit = async (payload: TeacherUpsertPayload) => {
    const created = await createMutation.mutateAsync(payload);
    navigate(routePaths.teacherEdit.replace(':teacherId', created.id));
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Create Teacher"
        description="Register a teacher account and assign subjects and classes."
      />

      {createMutation.isError ? <Alert severity="error">Unable to create the teacher.</Alert> : null}

      <TeacherForm
        submitLabel="Create Teacher"
        subjects={subjectsQuery.data ?? []}
        classes={classesQuery.data ?? []}
        onSubmit={handleSubmit}
        saving={createMutation.isPending}
      />
    </PageContainer>
  );
}
